import { useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import { shopSettingsService, fileService } from "@/api/services";
import { toast } from "sonner";
import { 
  Palette, 
  ImageIcon, 
  Type, 
  Globe, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Facebook, 
  Instagram, 
  MessageSquare, 
  Eye, 
  Sparkles,
  Users,
  Star,
  Upload
} from "lucide-react";

// Curated high-quality professional Unsplash images for quick banner select
const BANNER_PRESETS = [
  {
    id: "clinic-interior",
    name: "Phòng khám Hiện đại",
    url: "https://images.unsplash.com/photo-1758631279366-8e8aeaf94082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBjbGluaWMlMjB2ZXRlcmluYXJ5JTIwc2hvcCUyMG1vZGVybiUyMGludGVyaW9yfGVufDF8fHx8MTc3MjgxMTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "vet-dog",
    name: "Bác sĩ & Thú cưng",
    url: "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1080"
  },
  {
    id: "pet-grooming",
    name: "Spa Tắm gội",
    url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1080"
  },
  {
    id: "minimalist-lobby",
    name: "Sảnh đón tiếp",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1080"
  }
];

const COLOR_PRESETS = [
  { name: "Royal Blue (Mặc định)", hex: "#2563EB", shadow: "rgba(37,99,235,0.4)" },
  { name: "Elegant Indigo", hex: "#4F46E5", shadow: "rgba(79,70,229,0.4)" },
  { name: "Emerald Mint", hex: "#059669", shadow: "rgba(5,150,105,0.4)" },
  { name: "Warm Amber", hex: "#D97706", shadow: "rgba(217,119,6,0.4)" },
  { name: "Sunset Rose", hex: "#DB2777", shadow: "rgba(219,39,119,0.4)" },
  { name: "Deep Violet", hex: "#7C3AED", shadow: "rgba(124,58,237,0.4)" }
];

export function ThemeSettings() {
  const { tenant, settings, refreshSettings } = useTenant();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "logo" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    if (target === "logo") setUploadingLogo(true);
    else setUploadingBanner(true);

    try {
      const res: any = await fileService.uploadFile(file);
      const url = res?.url || res?.data?.url || res?.data;
      if (url) {
        setForm(p => ({
          ...p,
          [target === "logo" ? "customLogoUrl" : "bannerUrl"]: url
        }));
        toast.success(`Tải ảnh ${target === "logo" ? "Logo" : "Ảnh bìa"} thành công!`);
      } else {
        throw new Error("Không nhận được URL ảnh từ máy chủ");
      }
    } catch (err: any) {
      console.error("Lỗi tải ảnh:", err);
      toast.error("Không thể tải ảnh từ máy lên. Vui lòng dán liên kết URL thủ công.");
    } finally {
      if (target === "logo") setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  // Form State
  const [form, setForm] = useState({
    customShopName: "",
    customLogoUrl: "",
    primaryColor: "#2563EB",
    heroTitle: "",
    heroSubtitle: "",
    bannerUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    zaloPhone: "",
    showTeamSection: true,
    showReviewsSection: true
  });

  // Prepopulate form on mount or settings load
  useEffect(() => {
    if (settings) {
      setForm({
        customShopName: settings.customShopName || tenant?.name || "",
        customLogoUrl: settings.customLogoUrl || tenant?.logoUrl || "",
        primaryColor: settings.primaryColor || "#2563EB",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        bannerUrl: settings.bannerUrl || "",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
        zaloPhone: settings.zaloPhone || "",
        showTeamSection: settings.showTeamSection !== false,
        showReviewsSection: settings.showReviewsSection !== false
      });
    }
  }, [settings, tenant]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        // Make sure to clean URLs
        customLogoUrl: form.customLogoUrl.trim(),
        bannerUrl: form.bannerUrl.trim(),
        facebookUrl: form.facebookUrl.trim(),
        instagramUrl: form.instagramUrl.trim()
      };

      // 1. Call upgraded Backend API
      await shopSettingsService.updateLandingSettings(payload);

      // 2. Parallelly save to local storage as fallback for this specific tenant
      if (tenant?.id) {
        localStorage.setItem(`pettech_theme_settings_${tenant.id}`, JSON.stringify(payload));
      }

      // 3. Trigger Context Refresh to update variables globally
      await refreshSettings();

      setSaved(true);
      toast.success("Đã lưu thiết lập giao diện thành công!");
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Lỗi lưu thiết lập giao diện:", error);
      toast.error(error.response?.data?.message || "Không thể lưu thiết lập. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-[Inter]">
      {/* Edit Controls (Left side) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Brand Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Nhận diện thương hiệu (Branding)</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>TÊN SHOP HIỂN THỊ TRÊN TRANG CHỦ</label>
              <input 
                type="text" 
                value={form.customShopName}
                onChange={e => setForm(p => ({ ...p, customShopName: e.target.value }))}
                placeholder="VD: Cửa hàng Thú y Paws & Claws"
                className="w-full px-4 py-2.5 rounded-xl outline-none mt-1.5 transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb" }}
              />
              <p className="text-[10px] text-gray-400 mt-1">Thay đổi tên hiển thị của shop ở Navbar và Footer của Trang chủ.</p>
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>LOGO CỬA HÀNG</label>
              <div className="flex gap-3 mt-1.5">
                <input 
                  type="text" 
                  value={form.customLogoUrl}
                  onChange={e => setForm(p => ({ ...p, customLogoUrl: e.target.value }))}
                  placeholder="Nhập liên kết ảnh hoặc tải ảnh lên..."
                  className="flex-1 px-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb" }}
                />
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold text-gray-700">
                  <Upload className="w-4 h-4 text-gray-500 animate-pulse" />
                  {uploadingLogo ? "Đang tải..." : "Tải ảnh"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => handleFileUpload(e, "logo")}
                    disabled={uploadingLogo}
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Tải ảnh lên từ thiết bị hoặc dán URL liên kết logo (PNG, JPG, SVG · Tối đa 2MB).</p>
            </div>
          </div>
        </div>

        {/* Primary Color Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <Palette className="w-4 h-4 text-blue-600" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Màu sắc thương hiệu chủ đạo</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {COLOR_PRESETS.map(preset => {
              const active = form.primaryColor.toUpperCase() === preset.hex.toUpperCase();
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, primaryColor: preset.hex }))}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all"
                  style={{ 
                    borderColor: active ? preset.hex : "#e5e7eb",
                    background: active ? `${preset.hex}08` : "transparent"
                  }}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
                    style={{ background: preset.hex, boxShadow: `0 2px 6px ${preset.hex}40` }}
                  />
                  <span style={{ fontSize: "0.72rem", fontWeight: active ? 700 : 500, color: active ? "#111827" : "#4b5563" }}>
                    {preset.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>HOẶC CHỌN MÀU TÙY CHỈNH:</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={form.primaryColor}
                onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 outline-none p-0 overflow-hidden"
              />
              <span className="font-mono text-xs text-gray-500 font-bold">{form.primaryColor.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Hero Section Slogans & Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <Palette className="w-4 h-4 text-blue-600" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Nội dung biểu ngữ (Hero Section)</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>SLOGAN CHÍNH (HERO TITLE)</label>
              <input 
                type="text" 
                value={form.heroTitle}
                onChange={e => setForm(p => ({ ...p, heroTitle: e.target.value }))}
                placeholder="VD: Chăm sóc tận tâm - Trọn vẹn yêu thương"
                className="w-full px-4 py-2.5 rounded-xl outline-none mt-1.5 transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>ĐOẠN MÔ TẢ NGẮN (HERO SUBTITLE)</label>
              <textarea 
                rows={2}
                value={form.heroSubtitle}
                onChange={e => setForm(p => ({ ...p, heroSubtitle: e.target.value }))}
                placeholder="VD: Khám bệnh thú y, tiêm phòng, dịch vụ spa, lưu trữ chất lượng cao..."
                className="w-full px-4 py-2.5 rounded-xl outline-none mt-1.5 transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ border: "1.5px solid #e5e7eb" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: "8px", display: "block" }}>ẢNH BÌA TRANG CHỦ (HERO BANNER)</label>
              
              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {BANNER_PRESETS.map(preset => {
                  const active = form.bannerUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, bannerUrl: preset.url }))}
                      className="group relative rounded-lg overflow-hidden border-2 h-14 transition-all"
                      style={{ borderColor: active ? form.primaryColor : "transparent" }}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform" />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white text-center px-1 bg-black/35">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-3">
                <input 
                  type="text" 
                  value={form.bannerUrl}
                  onChange={e => setForm(p => ({ ...p, bannerUrl: e.target.value }))}
                  placeholder="Hoặc nhập liên kết ảnh bìa tùy chỉnh (https://...)"
                  className="flex-1 px-4 py-2.5 rounded-xl outline-none transition-all text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb" }}
                />
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold text-gray-700">
                  <Upload className="w-4 h-4 text-gray-500 animate-pulse" />
                  {uploadingBanner ? "Đang tải..." : "Tải ảnh"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => handleFileUpload(e, "banner")}
                    disabled={uploadingBanner}
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Tải ảnh lên từ thiết bị hoặc chọn nhanh các ảnh gợi ý ở trên.</p>
            </div>
          </div>
        </div>

        {/* Social Links & Toggles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Liên kết & Thiết lập hiển thị</h3>
          </div>
          
          <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-gray-100">
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>ĐƯỜNG DẪN TRANG FACEBOOK</label>
              <div className="relative mt-1.5">
                <Facebook className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1877F2]" />
                <input 
                  type="text" 
                  value={form.facebookUrl}
                  onChange={e => setForm(p => ({ ...p, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/ten-shop-cua-ban"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>ĐƯỜNG DẪN INSTAGRAM</label>
              <div className="relative mt-1.5">
                <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E1306C]" />
                <input 
                  type="text" 
                  value={form.instagramUrl}
                  onChange={e => setForm(p => ({ ...p, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/ten-shop-cua-ban"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>SỐ ĐIỆN THOẠI LIÊN HỆ ZALO</label>
              <div className="relative mt-1.5">
                <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0068FF]" />
                <input 
                  type="text" 
                  value={form.zaloPhone}
                  onChange={e => setForm(p => ({ ...p, zaloPhone: e.target.value }))}
                  placeholder="Nhập số điện thoại liên kết Zalo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb" }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>Hiển thị đội ngũ nhân sự</p>
                <p className="text-[10px] text-gray-400">Hiển thị hoặc ẩn phần giới thiệu các bác sĩ và nhân viên của cửa hàng.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.showTeamSection}
                  onChange={e => setForm(p => ({ ...p, showTeamSection: e.target.checked }))}
                  className="sr-only peer" 
                />
                <div 
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  style={{ background: form.showTeamSection ? form.primaryColor : "#e5e7eb" }}
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>Hiển thị đánh giá khách hàng</p>
                <p className="text-[10px] text-gray-400">Hiển thị hoặc ẩn những phản hồi từ các gia đình nuôi thú cưng.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.showReviewsSection}
                  onChange={e => setForm(p => ({ ...p, showReviewsSection: e.target.checked }))}
                  className="sr-only peer" 
                />
                <div 
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  style={{ background: form.showReviewsSection ? form.primaryColor : "#e5e7eb" }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl transition-all hover:-translate-y-px active:scale-95 text-white"
            style={{ 
              background: saved ? "linear-gradient(135deg,#16a34a,#15803d)" : `linear-gradient(135deg, ${form.primaryColor}, ${form.primaryColor}E0)`,
              fontWeight: 700, 
              fontSize: "0.88rem",
              boxShadow: saved ? "0 4px 14px rgba(22,163,74,0.25)" : `0 6px 18px ${form.primaryColor}40`
            }}
          >
            {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Đang lưu thiết lập…</>
              : saved ? <><CheckCircle2 className="w-4 h-4" /> Đã lưu thành công!</>
                : <><Save className="w-4 h-4" /> Lưu cấu hình giao diện</>}
          </button>
        </div>
      </div>

      {/* Mockup Live Preview (Right side) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-gray-500" />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#6b7280", letterSpacing: "0.05em" }}>BẢN XEM TRƯỚC TRANG CHỦ (LIVE PREVIEW)</span>
          </div>

          <div 
            className="bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative border"
            style={{ borderColor: "rgba(0,0,0,0.06)", height: "580px" }}
          >
            {/* Header / Navbar Mockup */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-sm z-10 relative">
              <div className="flex items-center gap-1.5">
                {form.customLogoUrl ? (
                  <img src={form.customLogoUrl} alt="Logo" className="w-6 h-6 object-contain rounded-md" />
                ) : (
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white animate-pulse" style={{ background: form.primaryColor }}>
                    <span className="text-[10px]">🐾</span>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: "0.68rem", fontWeight: 950, color: "#111827", lineHeight: 1.1 }}>
                    {form.customShopName || tenant?.name || "Paws & Claws"}
                  </p>
                  <p style={{ fontSize: "0.45rem", color: "#9ca3af" }}>Phòng khám & Cửa hàng</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3.5 h-1.5 rounded-full bg-gray-200" />
                <div className="w-3.5 h-1.5 rounded-full bg-gray-200" />
                <div className="w-7 h-3 rounded bg-blue-50" style={{ border: `0.5px solid ${form.primaryColor}20` }} />
              </div>
            </div>

            {/* Hero Banner Mockup */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-900">
              <img 
                src={form.bannerUrl || tenant?.logoUrl || BANNER_PRESETS[0].url} 
                alt="Banner preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute inset-x-4 bottom-4 text-white flex flex-col gap-2">
                {/* Badge mockup */}
                <div className="self-start px-2 py-0.5 rounded-full bg-orange-500 text-[8px] font-bold">
                  🌟 ĐƯỢC TIN TƯỞNG
                </div>
                
                <h4 className="font-extrabold tracking-tight leading-tight text-white" style={{ fontSize: "0.95rem" }}>
                  {form.heroTitle || "Chăm sóc thú cưng toàn diện, Tất cả dưới một mái nhà."}
                </h4>
                
                <p className="text-[9px] text-white/70 leading-normal line-clamp-2">
                  {form.heroSubtitle || "Khám thú y, tắm gội chuyên nghiệp, tiêm phòng, gửi thú cưng và cửa hàng thú cưng đầy đủ — cho chó, mèo và nhiều hơn nữa."}
                </p>

                <div className="flex gap-2 mt-1">
                  <div 
                    className="px-3 py-1.5 rounded-lg text-[8px] font-bold text-center text-white" 
                    style={{ background: form.primaryColor, boxShadow: `0 4px 10px ${form.primaryColor}40` }}
                  >
                    Đặt lịch ngay
                  </div>
                  <div className="px-3 py-1.5 rounded-lg text-[8px] font-bold text-center bg-white/20 border border-white/25">
                    Cửa hàng
                  </div>
                </div>
              </div>
            </div>

            {/* Services strip preview */}
            <div className="bg-slate-950 text-[8px] text-white/50 px-4 py-2 flex items-center justify-between">
              <span>📍 {tenant?.address || "142 Maple Street, SF"}</span>
              <span>📞 {form.zaloPhone || tenant?.phone || "090 123 4567"}</span>
            </div>

            {/* Body contents summary */}
            <div className="p-4 overflow-y-auto" style={{ height: "260px" }}>
              
              {/* Fake Services Section */}
              <div className="mb-4">
                <p className="text-[7px] font-bold text-orange-600 uppercase tracking-widest text-center">DỊCH VỤ CỦA CHÚNG TÔI</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { icon: "🩺", title: "Khám Thú Y" },
                    { icon: "✂️", title: "Tắm Gội & Tạo Kiểu" }
                  ].map(s => (
                    <div key={s.title} className="p-2 border border-gray-100 rounded-lg flex items-center gap-2">
                      <span className="text-sm p-1 rounded-md bg-blue-50/50" style={{ background: `${form.primaryColor}10`, color: form.primaryColor }}>{s.icon}</span>
                      <span className="text-[8px] font-bold text-gray-800">{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Toggle Sections Indicators */}
              <div className="space-y-2 mt-4 pt-3 border-t border-gray-100">
                
                {/* Team Indicator */}
                <div 
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    form.showTeamSection ? "bg-blue-50/30 border-blue-100" : "bg-gray-50 border-gray-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-500" style={{ color: form.showTeamSection ? form.primaryColor : "#9ca3af" }} />
                    <span className="text-[9px] font-bold text-gray-700">Phần Đội ngũ chuyên gia</span>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    form.showTeamSection ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"
                  }`}>
                    {form.showTeamSection ? "HIỂN THỊ" : "ẨN"}
                  </span>
                </div>

                {/* Reviews Indicator */}
                <div 
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    form.showReviewsSection ? "bg-blue-50/30 border-blue-100" : "bg-gray-50 border-gray-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-gray-500" style={{ color: form.showReviewsSection ? form.primaryColor : "#9ca3af" }} />
                    <span className="text-[9px] font-bold text-gray-700">Phần Đánh giá khách hàng</span>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    form.showReviewsSection ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"
                  }`}>
                    {form.showReviewsSection ? "HIỂN THỊ" : "ẨN"}
                  </span>
                </div>
              </div>

              {/* Social Media Link Icons in footer mockup */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[7px] text-gray-400">© {new Date().getFullYear()} {form.customShopName || tenant?.name}</span>
                <div className="flex gap-2">
                  <Facebook className={`w-3.5 h-3.5 ${form.facebookUrl ? "text-blue-600" : "text-gray-300"}`} />
                  <Instagram className={`w-3.5 h-3.5 ${form.instagramUrl ? "text-pink-600" : "text-gray-300"}`} />
                  <MessageSquare className={`w-3.5 h-3.5 ${form.zaloPhone ? "text-blue-500" : "text-gray-300"}`} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
