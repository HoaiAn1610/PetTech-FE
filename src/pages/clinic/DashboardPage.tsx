import { useState, useMemo } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { Check, X, Star, Zap, Crown, Shield, ArrowRight } from "lucide-react";
import { SubscriptionPlan } from "@/types/admin";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";
import { useMyPlan, useShopSettings, useBillingPlans, usePaySubscription } from "@/hooks/clinic/useShopQueries";
import "@/styles/fonts.css";

function getPlanPriceInfo(basePrice: number, duration: number) {
  if (basePrice === 0) return { total: 0, monthly: 0, discountPercent: 0 };
  
  let discountPercent = 0;
  let monthly = basePrice;
  
  if (duration === 6) {
    discountPercent = 10;
    // Round monthly price to nearest 5,000 VND for clean look
    monthly = Math.round((basePrice * 0.9) / 5000) * 5000;
  } else if (duration === 12) {
    discountPercent = 20;
    // Round monthly price to nearest 10,000 VND for clean look
    monthly = Math.round((basePrice * 0.8) / 10000) * 10000;
  }
  
  const total = monthly * duration;
  
  return { total, monthly, discountPercent };
}

export default function DashboardPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [durationInMonths, setDurationInMonths] = useState<number>(1);
  const { user } = useAuth();

  const allowedRoles = [Role.ShopManager, Role.Vet, Role.Groomer, Role.Receptionist];
  const isAllowed = !!user && allowedRoles.includes(user.role as Role);

  // Custom Popup Confirm Dialog State
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Xác nhận",
    onConfirm: () => {},
    destructive: false
  });

  // Queries
  const { data: myPlan, isLoading: planLoading } = useMyPlan({ enabled: isAllowed });
  const { data: rawSettings, isLoading: settingsLoading } = useShopSettings();
  const { data: rawPlans, isLoading: plansLoading } = useBillingPlans();

  // Mutation
  const paySubscriptionMutation = usePaySubscription();

  const currentPlan = useMemo(() => {
    if (myPlan && myPlan.id) return myPlan;
    return null;
  }, [myPlan]);

  const subscriptionEndsAt = useMemo(() => {
    return myPlan?.subscriptionEndsAt || rawSettings?.subscriptionEndsAt || null;
  }, [myPlan, rawSettings]);

  const pendingPlanId = useMemo(() => {
    return rawSettings?.pendingPlanId || null;
  }, [rawSettings]);

  const plans = useMemo(() => {
    const items = rawPlans || [];
    return [...items].sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.priceMonthly - b.priceMonthly);
  }, [rawPlans]);

  const loading = planLoading || settingsLoading || plansLoading;

  const handleChangePlan = (targetPlan: SubscriptionPlan) => {
    const isCurrent = currentPlan?.id === targetPlan.id;
    const isUpgrade = currentPlan ? targetPlan.priceMonthly > currentPlan.priceMonthly : false;
    
    let title = "";
    let confirmMsg = "";
    let confirmLabel = "Xác nhận";
    let destructive = false;

    if (isCurrent) {
      title = "Gia hạn gói dịch vụ";
      confirmMsg = `Bạn có chắc chắn muốn gia hạn gói "${targetPlan.name}" thêm ${durationInMonths} tháng không?`;
      confirmLabel = "Gia hạn ngay";
    } else if (isUpgrade) {
      title = "Nâng cấp gói dịch vụ";
      confirmMsg = `Bạn có chắc chắn muốn nâng cấp lên gói "${targetPlan.name}" (${durationInMonths} tháng) không?`;
      confirmLabel = "Nâng cấp ngay";
    } else {
      title = "Hạ gói dịch vụ";
      confirmMsg = `Bạn có chắc chắn muốn hạ xuống gói "${targetPlan.name}" không? Gói mới sẽ tự động được áp dụng sau khi chu kỳ hiện tại kết thúc.`;
      confirmLabel = "Đồng ý hạ gói";
      destructive = true;
    }
    
    setConfirmState({
      open: true,
      title,
      message: confirmMsg,
      confirmLabel,
      destructive,
      onConfirm: async () => {
        setConfirmState(p => ({ ...p, open: false }));
        setIsProcessing(true);
        try {
          const data = await paySubscriptionMutation.mutateAsync({
            planId: targetPlan.id,
            durationInMonths,
            returnUrl: window.location.href
          });
          if (data?.isSuccess !== false) {
            if (data?.paymentUrl && data.paymentUrl.startsWith("http")) {
              window.location.href = data.paymentUrl;
            } else if (data?.paymentUrl === "SCHEDULED_DOWNGRADE") {
              toast.success("Yêu cầu hạ gói đã được ghi nhận và sẽ áp dụng vào chu kỳ kế tiếp.");
            } else {
              toast.success("Thao tác thành công!");
            }
          } else {
            toast.error("Không thể xử lý yêu cầu thay đổi gói!");
          }
        } catch (err) {
          console.error("Lỗi thay đổi gói", err);
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const formatVND = (amount: number) => amount.toLocaleString('en-US') + ' VND';

  if (loading) {
    return (
      <ClinicPageShell title="Gói dịch vụ" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Gói dịch vụ" }]} maxWidth="max-w-6xl">
        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>
      </ClinicPageShell>
    );
  }

  return (
    <ClinicPageShell
      title="Thanh toán & Gói dịch vụ"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Gói dịch vụ" },
      ]}
      maxWidth="max-w-6xl"
    >
      <div className="flex flex-col gap-10 pb-10">
        {/* Banner cảnh báo đang chờ hạ gói */}
        {pendingPlanId && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-xl flex items-start gap-3 shadow-sm">
            <span className="text-xl leading-none">⚠️</span>
            <div>
              <p className="font-bold">Thay đổi gói đang chờ xử lý</p>
              <p className="text-sm mt-1">
                Bạn đã đăng ký chuyển sang một gói khác. Gói mới sẽ tự động được áp dụng sau khi kỳ thanh toán hiện tại kết thúc 
                {subscriptionEndsAt ? ` vào ngày ${new Date(subscriptionEndsAt).toLocaleDateString('vi-VN')}.` : "."}
              </p>
            </div>
          </div>
        )}

        {/* Phần 1: Gói hiện tại */}
        {currentPlan && (
          <div className="rounded-3xl overflow-hidden relative shadow-2xl" style={{ background: "linear-gradient(135deg, #0f172a, color-mix(in srgb, var(--primary-theme-color, #2563EB) 30%, black))", color: "white" }}>
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Crown className="w-40 h-40" />
            </div>
            <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 font-bold text-xs uppercase tracking-wider w-max border border-primary/30" style={{ color: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, white)" }}>
                  <Star className="w-3.5 h-3.5" /> Gói đang sử dụng
                </div>
                <h2 className="text-4xl font-black text-white">{currentPlan.name}</h2>
                <p className="text-lg" style={{ color: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 70%, white)" }}>{formatVND(currentPlan.priceMonthly)} <span className="text-sm opacity-70">/tháng</span></p>
              </div>
              <div className="flex flex-wrap md:max-w-md gap-4">
                {currentPlan.features?.aiAllergy && <FeatureBadge icon={Zap} label="AI Dị ứng" />}
                {currentPlan.features?.crmAutomation && <FeatureBadge icon={Shield} label="CRM Automation" />}
                {currentPlan.features?.liveTracking && <FeatureBadge icon={ArrowRight} label="Live Tracking" />}
                {currentPlan.features?.customDomain && <FeatureBadge icon={Crown} label="Tên miền riêng" />}
                {currentPlan.features?.apiAccess && <FeatureBadge icon={Star} label="Truy cập API" />}
              </div>
            </div>
          </div>
        )}

        {/* Phần 2: Bảng giá */}
        <div>
          <div className="text-center mb-8 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Chọn gói dịch vụ phù hợp</h3>
            <p className="text-gray-500 text-sm max-w-lg mb-6">Nâng cấp để mở khóa thêm các tính năng cao cấp như AI phân tích dị ứng, quản lý khách hàng tự động, v.v.</p>
            
            {/* Duration Selector */}
            <div className="inline-flex bg-gray-100/80 p-1 rounded-xl shadow-inner border border-gray-200/50">
              {[
                { label: "1 Tháng", value: 1 },
                { label: "6 Tháng", value: 6 },
                { label: "12 Tháng", value: 12 },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDurationInMonths(opt.value)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    durationInMonths === opt.value 
                      ? "bg-white text-primary-hover shadow-sm ring-1 ring-black/5" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.id === plan.id;
              const isUpgrade = currentPlan ? plan.priceMonthly > currentPlan.priceMonthly : false;
              const { total, monthly, discountPercent } = getPlanPriceInfo(plan.priceMonthly, durationInMonths);
              
              return (
                <div key={plan.id} className={`rounded-3xl flex flex-col bg-white overflow-hidden transition-all duration-300 ${isCurrent ? "ring-2 ring-primary scale-[1.02] shadow-xl" : "border border-gray-200 shadow-sm hover:shadow-md"}`}>
                  {isCurrent && <div className="bg-primary text-white text-center py-1.5 text-xs font-bold uppercase tracking-widest">Đang kích hoạt</div>}
                  <div className="p-7 flex flex-col gap-5 border-b border-gray-100">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                      <div className="mt-2 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-primary">{formatVND(total)}</span>
                          <span className="text-gray-500 font-medium text-sm">/{durationInMonths} tháng</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-semibold text-gray-500">
                              ({formatVND(monthly)}/tháng)
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                              Giảm {discountPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <MetricItem label="Nhân sự" value={plan.maxStaff} />
                      <MetricItem label="Sản phẩm" value={plan.maxProducts} />
                      <MetricItem label="Lượt đặt lịch/tháng" value={plan.maxBookingsMo} />
                    </div>
                  </div>
                  
                  <div className="p-7 flex-1 flex flex-col gap-4 bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tính năng</p>
                    <div className="flex flex-col gap-3 flex-1">
                      <FeatureCheckItem label="Bảng công việc (Task Board)" active={plan.features?.liveTracking || false} />
                      <FeatureCheckItem label="Chăm sóc khách hàng (CRM)" active={plan.features?.crmAutomation || false} />
                      <FeatureCheckItem label="Tên miền riêng (Custom Domain)" active={plan.features?.customDomain || false} />
                      <FeatureCheckItem label="AI Nhận diện dị ứng" active={plan.features?.aiAllergy || false} />
                      <FeatureCheckItem label="Truy cập API mở" active={plan.features?.apiAccess || false} />
                    </div>
                    
                    {(() => {
                      const isTrial = plan.priceMonthly === 0;
                      return (
                        <button 
                          onClick={() => handleChangePlan(plan)}
                          disabled={isProcessing || plan.id === pendingPlanId || (isCurrent && isTrial)}
                          title={plan.id === pendingPlanId ? "Đang có thay đổi chờ xử lý." : ""}
                          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mt-4 flex items-center justify-center gap-2 ${
                            plan.id === pendingPlanId ? "bg-yellow-50 text-yellow-600 border-2 border-yellow-200 cursor-not-allowed" :
                            isCurrent ? (
                              isTrial 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-white border-2 border-primary text-primary hover:bg-primary/5 active:scale-95 cursor-pointer"
                            ) :
                            isUpgrade ? "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 cursor-pointer" : 
                            "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-95 cursor-pointer"
                          }`}
                        >
                          {isProcessing ? (
                            <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Xử lý...</>
                          ) : isCurrent ? (isTrial ? "Đang sử dụng" : "Gia hạn") : plan.id === pendingPlanId ? "Chờ xử lý" : isUpgrade ? "Nâng cấp" : "Hạ gói"}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm Dialog Popup */}
      {confirmState.open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in scale-in duration-200 flex flex-col gap-4">
            <h3 className="text-lg font-black text-gray-900">{confirmState.title}</h3>
            <p className="text-sm font-medium text-gray-500">{confirmState.message}</p>
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={() => setConfirmState(p => ({ ...p, open: false }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer">
                Hủy
              </button>
              <button onClick={confirmState.onConfirm}
                className={`px-4 py-2 font-bold rounded-xl text-sm transition-colors text-white cursor-pointer ${confirmState.destructive ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-hover"}`}>
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicPageShell>
  );
}

function FeatureBadge({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
      <Icon className="w-4 h-4" style={{ color: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 70%, white)" }} />
      <span className="text-xs font-semibold text-white">{label}</span>
    </div>
  );
}

function MetricItem({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value > 1000 ? "Không giới hạn" : value}</span>
    </div>
  );
}

function FeatureCheckItem({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {active ? (
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 10%, transparent)" }}>
          <Check className="w-3 h-3 text-primary stroke-[3]" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <X className="w-3 h-3 text-gray-400 stroke-[3]" />
        </div>
      )}
      <span className={`text-sm font-medium ${active ? "text-gray-700" : "text-gray-400 line-through decoration-gray-300"}`}>{label}</span>
    </div>
  );
}
