import React, { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    generalError,
    isLoading,
    cooldown,
    validateEmail,
    validatePassword,
    handleLoginSubmit,
  } = useLogin(false); // standard login flow (false = non-admin)

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden px-4 py-12">
      {/* ── Background Aesthetic Glow Blobs ────────────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-200/40 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-gradient-to-tr from-blue-200/40 to-indigo-100/40 blur-[80px] pointer-events-none" />
      
      {/* Dynamic diagonal mesh line decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a05_1px,transparent_1px),linear-gradient(to_bottom,#0f172a05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ── Floating Login Card ────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-lg z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Upper Brand Badge */}
        <div className="flex justify-center mb-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-100/80 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-black text-sm">
              🐾
            </div>
            <span className="text-sm font-black tracking-tight text-slate-800">
              PetTech <span className="text-orange-500">Platform</span>
            </span>
          </Link>
        </div>

        {/* Card Body */}
        <div className="w-full bg-white/90 backdrop-blur-lg rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden">
          
          {/* Header Banner */}
          <div className="px-8 pt-10 pb-6 text-center bg-gradient-to-b from-orange-50/60 to-transparent">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Chào mừng trở lại!
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Đăng nhập để quản lý cửa hàng và chăm sóc thú cưng của bạn
            </p>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleLoginSubmit} className="px-8 pb-10 flex flex-col gap-6">
            
            {/* Global Errors / Alert Alerts */}
            {generalError && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-700 animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-extrabold text-red-800">Đăng nhập thất bại</p>
                  <p className="font-semibold opacity-90">{generalError}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="email" className="text-xs font-black text-slate-700 tracking-wider uppercase">
                  Địa chỉ Email
                </label>
                {emailError && (
                  <span className="text-xs font-bold text-red-500 animate-pulse">{emailError}</span>
                )}
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled={isLoading || cooldown > 0}
                  onBlur={() => validateEmail(email)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@store.com"
                  className={`pl-12 h-13 rounded-2xl bg-slate-50 border-slate-100/80 text-[0.95rem] font-semibold transition-all duration-300 focus-visible:ring-2 ${
                    emailError 
                      ? "border-red-200 focus-visible:ring-red-200 focus-visible:bg-white" 
                      : "focus-visible:ring-orange-500/20 focus-visible:border-orange-500 focus-visible:bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-xs font-black text-slate-700 tracking-wider uppercase">
                  Mật khẩu bảo mật
                </label>
                {passwordError && (
                  <span className="text-xs font-bold text-red-500 animate-pulse">{passwordError}</span>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading || cooldown > 0}
                  onBlur={() => validatePassword(password)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-12 pr-12 h-13 rounded-2xl bg-slate-50 border-slate-100/80 text-[0.95rem] font-semibold transition-all duration-300 focus-visible:ring-2 ${
                    passwordError 
                      ? "border-red-200 focus-visible:ring-red-200 focus-visible:bg-white" 
                      : "focus-visible:ring-orange-500/20 focus-visible:border-orange-500 focus-visible:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot options */}
            <div className="flex justify-between items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-lg border-slate-200 text-orange-500 focus:ring-orange-500/30"
                />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className={`h-14 rounded-2xl text-[1rem] font-black tracking-wide text-white shadow-lg transition-all active:scale-[0.98] duration-300 ${
                cooldown > 0
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Đang xác minh thông tin...</span>
                </div>
              ) : cooldown > 0 ? (
                <span>Vui lòng thử lại sau {cooldown}s</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[0.65rem] font-black tracking-widest text-slate-400 uppercase">
                HOẶC ADMIN
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Admin Redirection */}
            <Link 
              to="/admin/login" 
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-2xl border-2 border-dashed border-slate-200 text-xs font-black text-slate-600 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800 transition-all duration-300"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Cổng đăng nhập Quản trị viên Platform (SuperAdmin)
            </Link>

            {/* Footer helper */}
            <div className="text-center pt-2">
              <p className="text-xs font-semibold text-slate-400">
                Gặp sự cố truy cập?{" "}
                <Link to="/support" className="text-slate-600 font-extrabold hover:underline">
                  Liên hệ hỗ trợ 24/7
                </Link>
              </p>
            </div>

          </form>
        </div>

        {/* Feature widgets (Adds a premium and interactive layout) */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-orange-500/25" />
            </div>
            <div>
              <p className="text-[0.7rem] font-black text-slate-800">TIỆN ÍCH TỐT NHẤT</p>
              <p className="text-[0.6rem] font-bold text-slate-400">Chăm sóc chuẩn quốc tế</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[0.7rem] font-black text-slate-800">CÔNG NGHỆ SAAS B2B</p>
              <p className="text-[0.6rem] font-bold text-slate-400">Quản lý chuyên sâu, bền vững</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
