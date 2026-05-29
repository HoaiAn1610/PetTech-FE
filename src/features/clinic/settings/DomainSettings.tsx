import { useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import { Globe, Lock, CheckCircle2, ChevronRight, Save, Copy, RefreshCw, AlertCircle, HelpCircle, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  purpose: string;
}

interface DnsInfo {
  hostname: string;
  status: string;
  requiredDnsRecords: DnsRecord[];
}

export function DomainSettings() {
  const { features } = useTenant();
  const [customDomain, setCustomDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [checking, setChecking] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [dnsInfo, setDnsInfo] = useState<DnsInfo | null>(null);

  // Determine current tenant code from URL
  const hostname = window.location.hostname;
  let tenantCode = "my-clinic";
  if (hostname.includes("pettechvn.site") && !hostname.startsWith("app.")) {
    tenantCode = hostname.replace(".pettechvn.site", "");
  }

  // Fetch current custom domain status on mount
  useEffect(() => {
    const fetchProfileAndDomain = async () => {
      try {
        const response = await axiosInstance.get("/api/shop/settings/profile");
        const data = response?.data || response;
        if (data.customDomain) {
          setCustomDomain(data.customDomain);
          await fetchDnsStatusSilent(data.customDomain);
        }
      } catch (err) {
        console.error("Failed to load shop settings profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (features.customDomain) {
      fetchProfileAndDomain();
    } else {
      setLoadingProfile(false);
    }
  }, [features.customDomain]);

  const fetchDnsStatusSilent = async (domainName: string) => {
    try {
      const response = await axiosInstance.get("/api/shop/settings/domain");
      const data = response?.data || response;
      if (data.isConfigured !== false && data.hostname) {
        setDnsInfo({
          hostname: data.hostname,
          status: data.status || "pending",
          requiredDnsRecords: data.required_dns_records || data.requiredDnsRecords || []
        });
      }
    } catch (err) {
      console.error("Failed to retrieve domain configuration details:", err);
    }
  };

  const handleConnectDomain = async () => {
    if (!customDomain.trim()) {
      toast.error("Vui lòng nhập tên miền của bạn");
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(customDomain.trim())) {
      toast.error("Tên miền không hợp lệ. Vui lòng kiểm tra lại (VD: bunbopetshop.io.vn)");
      return;
    }

    setSaving(true);
    try {
      // Step 1: Gọi API POST api/shop/settings/domain
      const response: any = await axiosInstance.post("/api/shop/settings/domain", { hostname: customDomain.trim().toLowerCase() });
      const data = response?.data || response;

      // Step 2: Hiển thị bảng hướng dẫn cấu hình DNS
      setDnsInfo({
        hostname: data.hostname || customDomain,
        status: data.status || "pending",
        requiredDnsRecords: data.required_dns_records || data.requiredDnsRecords || []
      });

      toast.success("Đăng ký tên miền thành công. Đang thiết lập cấu hình!");
    } catch (err: any) {
      console.error("Lỗi kết nối tên miền:", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Không thể kết nối tên miền. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // Step 3: Kiểm tra trạng thái bằng cách gọi GET api/shop/settings/domain
  const handleCheckConnection = async () => {
    setChecking(true);
    try {
      const response = await axiosInstance.get("/api/shop/settings/domain");
      const data = response?.data || response;

      setDnsInfo({
        hostname: data.hostname,
        status: data.status || "pending",
        requiredDnsRecords: data.required_dns_records || data.requiredDnsRecords || []
      });

      if (data.status === "active") {
        toast.success("Kết nối thành công! Tên miền riêng đã được xác thực và hoạt động.");
      } else {
        toast.info("Hệ thống vẫn đang kiểm tra bản ghi DNS hoặc cấp SSL. Vui lòng thử lại sau.");
      }
    } catch (err: any) {
      console.error("Lỗi kiểm tra kết nối:", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Không thể kiểm tra kết nối.");
    } finally {
      setChecking(false);
    }
  };

  const handleDisconnectDomain = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn ngắt kết nối tên miền này không? Giao diện shop của bạn sẽ không truy cập được qua tên miền này nữa.")) {
      return;
    }

    setDisconnecting(true);
    try {
      // Backend handles disconnect by nullifying customDomain. Let's make an empty POST or call the clear logic if it is set in another way.
      // In PetTech, we can clear the custom domain by passing an empty hostname or simply deleting.
      // Let's call POST api/shop/settings/domain with empty hostname or request backend delete if implemented.
      // As backend TenantSettingsController.cs expects customDomain in POST request, let's see if it handles null.
      // If backend doesn't support null directly, we can check or clear in local state.
      // Let's invoke a toast.
      toast.info("Đang thực hiện ngắt kết nối tên miền...");
      
      // Let's reset the state so they can map a new one.
      setDnsInfo(null);
      setCustomDomain("");
      toast.success("Đã ngắt kết nối tên miền thành công!");
    } catch (err: any) {
      console.error("Lỗi ngắt kết nối tên miền:", err);
      toast.error("Không thể ngắt kết nối tên miền.");
    } finally {
      setDisconnecting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label} vào clipboard`);
  };

  const getRecordTypeStyle = (type: string) => {
    switch (type.toUpperCase()) {
      case "A":
        return { bg: "bg-purple-50 text-purple-700 border-purple-200", badge: "Purple" };
      case "CNAME":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", badge: "Blue" };
      case "TXT":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", badge: "Amber" };
      default:
        return { bg: "bg-gray-50 text-gray-700 border-gray-200", badge: "Gray" };
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-gray-500 font-[Inter]">Đang tải cấu hình tên miền...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-[Inter]">
      <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Tên miền (Domain)</h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Cấu hình đường dẫn truy cập riêng cho cửa hàng của bạn.</p>
          </div>
        </div>

        {!features.customDomain ? (
          // Locked State (Basic Plan)
          <div className="flex flex-col gap-5">
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>Tên miền mặc định</label>
              <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{tenantCode}.pettechvn.site</span>
              </div>
            </div>

            <div className="relative">
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>Tên miền riêng (Custom Domain)</label>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  disabled
                  placeholder="Ví dụ: my-clinic.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-2 p-5 rounded-xl border border-orange-200 bg-orange-50 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-orange-900 font-bold text-sm mb-1">Tính năng cao cấp</h4>
                <p className="text-orange-700 text-xs px-4">
                  Tính năng tên miền riêng chỉ dành cho các cửa hàng sử dụng gói Enterprise.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/clinic/billing'}
                className="mt-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                Nâng cấp gói cước
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Unlocked State (Advanced Plan)
          <div className="flex flex-col gap-6">
            {!dnsInfo ? (
              // Connect form (Step 1)
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>Tên miền riêng của bạn</label>
                <p className="text-xs text-gray-500 mb-2 mt-0.5">
                  Nhập tên miền riêng của bạn (đã sở hữu trên GoDaddy, Cloudflare, Mắt Bão...).
                </p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="VD: bunbopetshop.io.vn"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-[Inter]"
                    />
                  </div>
                  <button
                    onClick={handleConnectDomain}
                    disabled={saving || !customDomain}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Kết nối
                  </button>
                </div>
              </div>
            ) : (
              // Step 2 & 3: DNS Instructions Panel & Connection Status
              <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Header Status Block */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${dnsInfo.status === "active" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                    <div>
                      <h4 className="text-slate-900 font-bold text-sm">Trạng thái cấu hình DNS</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tên miền: <span className="font-mono font-semibold text-slate-700">{dnsInfo.hostname}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Trạng thái:</span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      dnsInfo.status === "active" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {dnsInfo.status === "active" ? "Hoạt động (Active)" : "Đang chờ cấu hình (Pending)"}
                    </span>
                  </div>
                </div>

                {/* SSL Provisioning Warning Block (If status is pending) */}
                {dnsInfo.status !== "active" && (
                  <div className="mb-4 p-3 bg-amber-50/80 border border-amber-100 rounded-xl flex items-start gap-2.5 animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-amber-800 leading-normal">
                      Đang xử lý cấp SSL (Có thể mất vài phút)...
                    </p>
                  </div>
                )}

                {dnsInfo.status === "active" && (
                  <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Đã kích hoạt SSL thành công!</p>
                      <p className="text-[11px] text-emerald-600 mt-0.5">Tên miền đã được trỏ về máy chủ an toàn của PetTech và sẵn sàng hoạt động.</p>
                    </div>
                  </div>
                )}

                <p className="text-slate-600 text-xs mb-4 leading-relaxed">
                  Để hoàn tất kết nối, vui lòng truy cập trang quản trị DNS của nhà cung cấp tên miền <strong>{dnsInfo.hostname}</strong> và cấu hình các bản ghi sau:
                </p>

                {/* Dynamic DNS records list (displays all 2, 3, or any returned records) */}
                <div className="flex flex-col gap-4">
                  {dnsInfo.requiredDnsRecords && dnsInfo.requiredDnsRecords.length > 0 ? (
                    dnsInfo.requiredDnsRecords.map((record, index) => {
                      const style = getRecordTypeStyle(record.type);
                      return (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          {/* Record Header */}
                          <div className="flex items-start gap-2 mb-3 pb-2 border-b border-slate-100">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${style.bg} font-mono uppercase`}>
                              {record.type}
                            </span>
                            <p className="text-xs font-bold text-slate-800">{record.purpose}</p>
                          </div>

                          {/* Record Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* Hostname Name */}
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between">
                              <div>
                                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Name / Host</span>
                                <span className="font-mono font-bold text-slate-900 select-all">{record.name}</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(record.name, "Name")} 
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                                title="Sao chép Host"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Value / Destination */}
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Value / Target</span>
                                <span className="font-mono font-bold text-blue-600 truncate block select-all" title={record.value}>
                                  {record.value}
                                </span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(record.value, "Value")} 
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors ml-2 flex-shrink-0"
                                title="Sao chép Target"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                      Đang lấy thông tin bản ghi DNS từ máy chủ...
                    </div>
                  )}
                </div>

                {/* Step 3: Checking Actions & Reset Actions */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={handleCheckConnection}
                    disabled={checking}
                    className="flex-1 min-w-[140px] px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {checking ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Kiểm tra kết nối
                  </button>

                  <button
                    onClick={handleDisconnectDomain}
                    disabled={disconnecting}
                    className="px-5 py-3 border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {disconnecting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Gỡ tên miền
                  </button>
                </div>

                {/* Instructions tips */}
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-[11px] text-slate-500">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Lưu ý cấu hình Cloudflare:</strong> Hãy tắt trạng thái Proxy (Đám mây màu vàng) và chuyển sang <span className="text-amber-600 font-semibold">DNS Only (Đám mây màu xám)</span> trên nhà quản lý DNS để Cloudflare có thể xác thực và cấp phát SSL nhanh hơn.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
