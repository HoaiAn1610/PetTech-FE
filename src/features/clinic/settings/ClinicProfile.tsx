import { useState, useEffect } from "react";
import { Building2, Camera, CheckCircle2, Clock, Globe, Mail, MapPin, Phone, RefreshCw, Save, User, Upload } from "lucide-react";
import { shopSettingsService, fileService } from "@/api/services";
import { useTenant } from "@/context/TenantContext";
import { toast } from "sonner";

const POPULAR_TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "(UTC+07:00) Hà Nội, Băng Cốc, Jakarta" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore, Kuala Lumpur" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo, Seoul" },
  { value: "Asia/Shanghai", label: "(UTC+08:00) Bắc Kinh, Hồng Kông" },
  { value: "Europe/London", label: "(UTC+00:00) Luân Đôn, Dublin" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Berlin, Rome" },
  { value: "America/New_York", label: "(UTC-05:00) Giờ miền Đông (Mỹ & Canada)" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Giờ miền Tây (Mỹ & Canada)" },
];

export function ClinicProfile() {
  const { refreshSettings } = useTenant();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
    timezone: "Asia/Ho_Chi_Minh",
    acceptOnlineBookings: true,
    receiptFooter: "",
    businessHoursStart: "08:00",
    businessHoursEnd: "20:00",
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await shopSettingsService.getShopProfile();
      const profile = res?.data || res;
      if (profile) {
        setForm({
          name: profile.name || "",
          ownerName: profile.ownerName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          logoUrl: profile.logoUrl || "",
          timezone: profile.timezone || "Asia/Ho_Chi_Minh",
          acceptOnlineBookings: profile.acceptOnlineBookings ?? true,
          receiptFooter: profile.receiptFooter || "",
          businessHoursStart: profile.businessHoursStart ? profile.businessHoursStart.substring(0, 5) : "08:00",
          businessHoursEnd: profile.businessHoursEnd ? profile.businessHoursEnd.substring(0, 5) : "20:00",
        });
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin hồ sơ phòng khám:", err);
      toast.error("Không thể tải thông tin hồ sơ phòng khám");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchLogoPreview = async () => {
      if (!form.logoUrl) {
         setLogoPreview("");
         return;
      }
      if (form.logoUrl.startsWith("http") || form.logoUrl.startsWith("data:")) {
         setLogoPreview(form.logoUrl);
         return;
      }
      try {
         const res = await fileService.getPresignedUrl(form.logoUrl);
         let url = res?.presignedUrl || res?.data?.presignedUrl || form.logoUrl;
         if (url && typeof url === 'string') {
             url = url.replace('http://minio:9000', 'http://localhost:9000');
         }
         setLogoPreview(url);
      } catch (e) {
         setLogoPreview(form.logoUrl);
      }
    };
    fetchLogoPreview();
  }, [form.logoUrl]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên phòng khám");
      return;
    }

    // Client-side time validation
    const timeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    if (form.businessHoursStart && form.businessHoursEnd) {
      if (timeToMinutes(form.businessHoursEnd) <= timeToMinutes(form.businessHoursStart)) {
        toast.error("Giờ đóng cửa (kết thúc) phải sau giờ mở cửa (bắt đầu).");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        ownerName: form.ownerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        logoUrl: form.logoUrl.trim(),
        timezone: form.timezone,
        acceptOnlineBookings: form.acceptOnlineBookings,
        receiptFooter: form.receiptFooter.trim(),
        businessHoursStart: form.businessHoursStart,
        businessHoursEnd: form.businessHoursEnd,
      };

      await shopSettingsService.updateProfileSettings(payload);
      
      // Đồng bộ thông tin context toàn cục ngay lập tức
      await refreshSettings();
      
      setSaved(true);
      toast.success("Cập nhật hồ sơ phòng khám thành công!");
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Lỗi lưu hồ sơ phòng khám:", error);
      const backendError = error.response?.data?.message || error.response?.data?.error || "Không thể lưu thiết lập hồ sơ.";
      toast.error(backendError);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    setUploadingLogo(true);
    try {
      const res: any = await fileService.uploadFile(file);
      const url = res?.url || res?.data?.url || res?.data;
      if (url) {
        setForm(p => ({ ...p, logoUrl: url }));
        toast.success("Tải logo chính thức thành công!");
      } else {
        throw new Error("Không nhận được URL ảnh từ máy chủ");
      }
    } catch (err: any) {
      console.error("Lỗi tải ảnh logo:", err);
      toast.error("Không thể tải ảnh từ thiết bị lên. Vui lòng dán liên kết URL thủ công.");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Bảo đảm nếu múi giờ từ DB lạ vẫn có option để hiển thị
  const timezoneOptions = [...POPULAR_TIMEZONES];
  if (form.timezone && !POPULAR_TIMEZONES.some(o => o.value === form.timezone)) {
    timezoneOptions.push({ value: form.timezone, label: `Múi giờ hiện tại (${form.timezone})` });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ minHeight: "350px" }}>
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500 mt-4">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-[Inter]">


      {/* Logo Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>Logo phòng khám chính thức</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {logoPreview ? (
            <div className="w-24 h-24 rounded-2xl overflow-hidden border bg-gray-50 flex items-center justify-center p-1.5" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#2563EB,#7c3aed)" }}>
              <span style={{ fontSize: "2rem" }}>🐾</span>
            </div>
          )}
          <div className="flex-1 flex flex-col gap-3 w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={form.logoUrl}
                onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))}
                placeholder="Dán liên kết ảnh URL logo..."
                className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb" }}
              />
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold text-gray-700 flex-shrink-0">
                <Upload className="w-4 h-4 text-gray-500" />
                {uploadingLogo ? "Đang tải lên..." : "Tải ảnh từ máy"}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden" 
                />
              </label>
            </div>
            <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>PNG, JPG hoặc SVG · Tối đa 2MB · Khuyến nghị hình vuông 512×512px</p>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "18px" }}>Thông tin chi tiết</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Tên phòng khám */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>TÊN PHÒNG KHÁM CHÍNH THỨC</label>
            <div className="relative mt-2">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>

          {/* Chủ sở hữu */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>CHỦ SỞ HỮU / QUẢN LÝ</label>
            <div className="relative mt-2">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input type="text" value={form.ownerName}
                onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))}
                placeholder="Nhập tên người quản lý"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>

          {/* Email liên hệ */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>ĐỊA CHỈ EMAIL VẬN HÀNH</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>SỐ ĐIỆN THOẠI HỖ TRỢ</label>
            <div className="relative mt-2">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input type="tel" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>

          {/* Múi giờ (Dropdown tuyển chọn) */}
          <div className="md:col-span-2">
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>MÚI GIỜ HOẠT ĐỘNG</label>
            <div className="relative mt-2">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <select 
                value={form.timezone}
                onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl outline-none transition-all text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
              >
                {timezoneOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5 text-gray-500 flex items-center justify-center">
                ▼
              </div>
            </div>
          </div>

          {/* Địa chỉ cơ sở */}
          <div className="md:col-span-2">
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>ĐỊA CHỈ PHÒNG KHÁM CHÍNH THỨC</label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} />
            </div>
          </div>

          {/* Section Divider for Operations */}
          <div className="md:col-span-2 my-2 border-t border-gray-100/70 pt-4">
            <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1f2937", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cài đặt vận hành & Hóa đơn</h4>
          </div>

          {/* Giờ làm việc - Bắt đầu */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>GIỜ MỞ CỬA (HOẠT ĐỘNG)</label>
            <div className="relative mt-2">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input 
                type="time" 
                value={form.businessHoursStart}
                onChange={e => setForm(p => ({ ...p, businessHoursStart: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
              />
            </div>
          </div>

          {/* Giờ làm việc - Kết thúc */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>GIỜ ĐÓNG CỬA (HOẠT ĐỘNG)</label>
            <div className="relative mt-2">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input 
                type="time" 
                value={form.businessHoursEnd}
                onChange={e => setForm(p => ({ ...p, businessHoursEnd: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
              />
            </div>
          </div>

          {/* Trạng thái đặt lịch trực tuyến */}
          <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-100/90 mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-gray-800">Nhận đặt lịch hẹn trực tuyến</span>
              <span className="text-xs text-gray-500 leading-normal">Cho phép khách hàng tự đặt lịch khám trực tiếp trên Landing Page công khai.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={form.acceptOnlineBookings}
                onChange={e => setForm(p => ({ ...p, acceptOnlineBookings: e.target.checked }))}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Lời chào chân hóa đơn */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center">
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>NỘI DUNG CHÂN BIÊN LAI / HÓA ĐƠN (RECEIPT FOOTER)</label>
              <span className="text-[11px] text-gray-450 font-bold">{form.receiptFooter.length}/500 ký tự</span>
            </div>
            <div className="relative mt-2">
              <textarea 
                value={form.receiptFooter}
                onChange={e => setForm(p => ({ ...p, receiptFooter: e.target.value.substring(0, 500) }))}
                placeholder="Ví dụ: Cảm ơn quý khách đã tin tưởng dịch vụ chăm sóc thú cưng của PetTech! Hẹn gặp lại quý khách và bé yêu."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-6 pt-5" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:-translate-y-px active:scale-95 text-white"
            style={{ 
              background: saved ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#2563EB,#1d4ed8)", 
              fontWeight: 700, 
              fontSize: "0.85rem", 
              boxShadow: saved ? "0 4px 14px rgba(22,163,74,0.22)" : "0 4px 14px rgba(37,99,235,0.25)" 
            }}
          >
            {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang lưu hồ sơ…</>
              : saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu thành công!</>
                : <><Save className="w-3.5 h-3.5" /> Lưu hồ sơ phòng khám</>}
          </button>
        </div>
      </div>
    </div>
  );
}
