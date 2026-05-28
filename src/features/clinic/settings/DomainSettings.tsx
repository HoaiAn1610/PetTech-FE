import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { Globe, Lock, CheckCircle2, ChevronRight, Save, Copy } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";

export function DomainSettings() {
  const { features } = useTenant();
  const [customDomain, setCustomDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [dnsInfo, setDnsInfo] = useState<{ cnameTarget: string, txtRecord: string } | null>(null);

  // Determine current tenant code from URL
  const hostname = window.location.hostname;
  let tenantCode = "my-clinic";
  if (hostname.includes("pettechvn.site") && !hostname.startsWith("app.")) {
    tenantCode = hostname.replace(".pettechvn.site", "");
  }

  const handleConnectDomain = async () => {
    if (!customDomain.trim()) {
      toast.error("Vui lòng nhập tên miền của bạn");
      return;
    }

    setSaving(true);
    try {
      // Gọi API POST /api/shop/settings/domain
      const response: any = await axiosInstance.post("/api/shop/settings/domain", { hostname: customDomain });

      // Lấy dữ liệu DNS từ response để hiển thị Modal
      const data = response?.data || response;
      setDnsInfo({
        cnameTarget: data.cnameTarget || "app.pettechvn.site",
        txtRecord: data.txtRecord || "pet-tech-verification=" + Math.random().toString(36).substring(7)
      });

      toast.success("Đăng ký tên miền thành công. Vui lòng cấu hình DNS!");
    } catch (err: any) {
      console.error("Lỗi kết nối tên miền:", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Không thể kết nối tên miền. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard");
  };

  return (
    <div className="flex flex-col gap-6 font-[Inter]">
      <div className="bg-white rounded-2xl p-6" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Tên miền (Domain)</h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Cấu hình đường dẫn truy cập cho cửa hàng của bạn.</p>
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
                  Tính năng tên miền riêng chỉ dành cho các cửa hàng sử dụng gói Growth hoặc Enterprise.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/clinic/billing'}
                className="mt-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                Nâng cấp gói cước
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Unlocked State (Advanced Plan)
          <div className="flex flex-col gap-5">
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>Tên miền riêng của bạn</label>
              <p className="text-xs text-gray-500 mb-2 mt-0.5">
                Nhập tên miền bạn đã mua tại các nhà cung cấp (GoDaddy, Namecheap, Mắt Bão...).
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="VD: vet-clinic.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button
                  onClick={handleConnectDomain}
                  disabled={saving || !customDomain}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Kết nối
                </button>
              </div>
            </div>

            {/* DNS Instructions Modal / Panel */}
            {dnsInfo && (
              <div className="mt-4 border border-green-200 bg-green-50 rounded-xl p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className="text-green-900 font-bold text-sm">Cấu hình DNS bắt buộc</h4>
                </div>
                <p className="text-green-800 text-xs mb-4">
                  Để hoàn tất kết nối, vui lòng vào trang quản lý DNS của tên miền <strong>{customDomain}</strong> và thêm 2 bản ghi sau:
                </p>

                <div className="flex flex-col gap-3">
                  <div className="bg-white border border-green-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700">1. Bản ghi CNAME (Trỏ tên miền về PetTech)</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 text-xs">
                      <div className="col-span-2 text-gray-500">Type</div>
                      <div className="col-span-3 text-gray-500">Name / Host</div>
                      <div className="col-span-7 text-gray-500">Value / Target</div>

                      <div className="col-span-2 font-mono font-medium text-gray-900">CNAME</div>
                      <div className="col-span-3 font-mono font-medium text-gray-900">www <span className="text-gray-400 font-sans">(hoặc @)</span></div>
                      <div className="col-span-7 flex items-center gap-2">
                        <span className="font-mono font-medium text-blue-600 truncate">{dnsInfo.cnameTarget}</span>
                        <button onClick={() => copyToClipboard(dnsInfo.cnameTarget)} className="text-gray-400 hover:text-gray-700"><Copy className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-green-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700">2. Bản ghi TXT (Xác thực sở hữu tên miền)</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 text-xs">
                      <div className="col-span-2 text-gray-500">Type</div>
                      <div className="col-span-3 text-gray-500">Name / Host</div>
                      <div className="col-span-7 text-gray-500">Value / Target</div>

                      <div className="col-span-2 font-mono font-medium text-gray-900">TXT</div>
                      <div className="col-span-3 font-mono font-medium text-gray-900">@</div>
                      <div className="col-span-7 flex items-center gap-2">
                        <span className="font-mono font-medium text-blue-600 truncate">{dnsInfo.txtRecord}</span>
                        <button onClick={() => copyToClipboard(dnsInfo.txtRecord)} className="text-gray-400 hover:text-gray-700"><Copy className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-green-700 mt-4 text-center italic">
                  Lưu ý: Có thể mất từ 15 phút đến 24 giờ để DNS cập nhật hoàn toàn trên toàn cầu.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
