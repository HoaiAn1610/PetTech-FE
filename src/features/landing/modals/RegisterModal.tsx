import React, { useState } from "react";
import { 
  ArrowRight, CheckCircle2, User, Mail, Phone, 
  Building2, Lock, Globe, AlertCircle, XCircle 
} from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import axiosInstance from "@/api/axiosInstance";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [form, setForm] = useState({ 
    code: "", shopName: "", ownerName: "", email: "", phone: "", password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [shopUrl, setShopUrl] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [codeMessage, setCodeMessage] = useState("");
  const [error, setError] = useState("");

  const checkCode = async (code: string) => {
    if (!code || code.length < 3) {
      setCodeStatus("idle");
      setCodeMessage("");
      return;
    }
    
    setCodeStatus("checking");
    try {
      const response: any = await axiosInstance.get(`/api/onboarding/check-code/${code}`);
      if (response.available) {
        setCodeStatus("available");
        setCodeMessage("Tên miền khả dụng!");
      } else {
        setCodeStatus("unavailable");
        setCodeMessage(response.reason || "Tên miền đã được sử dụng.");
      }
    } catch (err) {
      setCodeStatus("idle");
    }
  };

  const handleBlurCode = () => {
    checkCode(form.code);
  };

  const handleSubmit = async () => {
    if (codeStatus === "unavailable") return;
    setLoading(true);
    setError("");
    try {
      const response: any = await axiosInstance.post("/api/onboarding/register", form);
      // Giả sử API trả về jwtToken và shop.Code
      setShopUrl(`https://${response.shop?.code || form.code}.pettechvn.site`);
      setDone(true);
    } catch (err: any) {
      let errMsg = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        if (firstKey && Array.isArray(errors[firstKey]) && errors[firstKey][0]) {
          const fieldMap: Record<string, string> = {
            Password: "Mật khẩu",
            Email: "Email",
            Code: "Tên miền",
            ShopName: "Tên cửa hàng",
            OwnerName: "Chủ sở hữu",
            Phone: "Số điện thoại"
          };
          const friendlyField = fieldMap[firstKey] ?? firstKey;
          errMsg = `${friendlyField}: ${errors[firstKey][0]}`;
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = form.email.includes("@") && form.email.includes(".");
  const isPasswordValid = form.password.length >= 8;
  const isCodeValid = form.code.length >= 3;

  const canSubmit = 
    form.code && isCodeValid &&
    form.shopName && form.shopName.length >= 2 &&
    form.ownerName && 
    form.email && isEmailValid &&
    form.phone && 
    form.password && isPasswordValid &&
    codeStatus !== "unavailable";

  if (done) return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký thành công! 🎉"
      subtitle="Chào mừng bạn đến với hệ sinh thái PetTech"
      maxWidth="md"
    >
      <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner relative">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
            Tài khoản dùng thử 30 ngày của bạn đã được khởi tạo thành công.
          </p>
          <p className="text-sm text-gray-700 font-medium mt-2">
            Địa chỉ truy cập hệ thống của bạn là:
          </p>
          <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="block text-lg text-blue-600 font-black hover:underline mt-1">
            {shopUrl}
          </a>
        </div>

        <div className="w-full mt-4">
          <Button 
            onClick={() => { window.location.href = shopUrl; }}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20"
          >
            Truy cập Hệ thống ngay →
          </Button>
        </div>
      </div>
    </BaseModal>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo tài khoản Dùng thử"
      subtitle="Trải nghiệm PetTech miễn phí 30 ngày. Không cần thẻ tín dụng."
      maxWidth="lg"
    >
      <div className="px-8 py-8 space-y-6 bg-white">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex gap-2 items-center">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">TÊN MIỀN HỆ THỐNG (SUBDOMAIN) *</label>
            <div className="relative group flex flex-col">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
                <Input 
                  value={form.code} 
                  onChange={e => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    setForm(v => ({ ...v, code: val }));
                    setCodeStatus("idle");
                  }}
                  onBlur={handleBlurCode}
                  placeholder="petshop-saigon" 
                  className={cn(
                    "pl-11 pr-32 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600",
                    codeStatus === "unavailable" && "border-red-300 focus-visible:ring-red-600",
                    codeStatus === "available" && "border-emerald-300 focus-visible:ring-emerald-600"
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                  .pettechvn.site
                </div>
              </div>
              {codeStatus === "checking" && <span className="text-xs text-blue-600 mt-1 font-semibold">Đang kiểm tra...</span>}
              {codeStatus === "available" && <span className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {codeMessage}</span>}
              {codeStatus === "unavailable" && <span className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1"><XCircle className="w-3 h-3"/> {codeMessage}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">TÊN PHÒNG KHÁM / SPA *</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
              <Input 
                value={form.shopName} 
                onChange={e => setForm(v => ({ ...v, shopName: e.target.value }))}
                placeholder="PetShop Sài Gòn" 
                className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">CHỦ SỞ HỮU *</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
              <Input 
                value={form.ownerName} 
                onChange={e => setForm(v => ({ ...v, ownerName: e.target.value }))}
                placeholder="Nguyễn Văn A" 
                className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">SỐ ĐIỆN THOẠI *</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
              <Input 
                type="tel"
                value={form.phone} 
                onChange={e => setForm(v => ({ ...v, phone: e.target.value }))}
                placeholder="09xx xxx xxx" 
                className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">EMAIL *</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
              <Input 
                type="email"
                value={form.email} 
                onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                placeholder="admin@petshop.com" 
                className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">MẬT KHẨU *</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
              <Input 
                type="password"
                value={form.password} 
                onChange={e => setForm(v => ({ ...v, password: e.target.value }))}
                placeholder="••••••••" 
                className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <Button 
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
          className="w-full h-14 rounded-2xl text-lg font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
          {loading ? "Đang xử lý..." : "Khởi tạo Hệ thống"} <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </BaseModal>
  );
}
