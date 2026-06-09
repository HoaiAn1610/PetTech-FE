import React, { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield, Command, Activity } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
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
  } = useLogin(true); // admin login flow (true = admin)

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-12"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.06) 0%, transparent 40%), #f8fafc",
      }}
    >
      {/* Light Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      {/* Glassmorphic Admin Console Card */}
      <div className="relative w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Upper Brand Badge */}
        <div className="flex justify-center mb-6">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all duration-300"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-600/25 text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[0.72rem] font-bold tracking-wider text-indigo-700 uppercase">
              PETTECH PLATFORM <span className="text-slate-800">CONSOLE</span>
            </span>
          </Link>
        </div>

        {/* Card Body */}
        <div className="w-full bg-white/80 backdrop-blur-2xl rounded-2xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-50 bg-gradient-to-b from-indigo-50/30 to-transparent">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight mb-1.5 flex items-center justify-center gap-2">
              <Command className="w-5 h-5 text-indigo-600" />
              CỔNG QUẢN TRỊ VIÊN
            </h1>
            <p className="text-xs font-semibold text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Dành riêng cho Platform Staff và SuperAdmin quản trị hệ thống
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="px-8 py-8 flex flex-col gap-6">
            
            {/* Global Errors */}
            {generalError && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                <div className="text-xs font-medium">
                  <p className="font-bold">Cảnh báo bảo mật</p>
                  <p className="opacity-90">{generalError}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="email" className="text-[0.7rem] font-black text-slate-900 tracking-wider uppercase">
                  EMAIL ADMIN *
                </label>
                {emailError && (
                  <span className="text-xs font-bold text-red-500 animate-pulse">{emailError}</span>
                )}
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled={isLoading || cooldown > 0}
                  onBlur={() => validateEmail(email)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pettech.io"
                  className={`pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-semibold text-slate-800 transition-all focus-visible:ring-indigo-600 ${
                    emailError ? "border-red-300" : ""
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-[0.7rem] font-black text-slate-900 tracking-wider uppercase">
                  MẬT KHẨU BẢO MẬT *
                </label>
                {passwordError && (
                  <span className="text-xs font-bold text-red-500 animate-pulse">{passwordError}</span>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading || cooldown > 0}
                  onBlur={() => validatePassword(password)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-11 pr-11 h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-semibold text-slate-800 transition-all focus-visible:ring-indigo-600/20 ${
                    passwordError ? "border-red-300" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Checkbox & Help */}
            <div className="flex justify-between items-center px-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500/20"
                />
                <span className="font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
                  Duy trì phiên đăng nhập
                </span>
              </label>
              <Link 
                to="/admin/reset-request" 
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                Khôi phục khóa?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className={`h-12 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] duration-300 cursor-pointer ${
                cooldown > 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-100"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/10 hover:shadow-indigo-600/20 border-transparent"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Xác thực danh tính...</span>
                </div>
              ) : cooldown > 0 ? (
                <span>Đợi {cooldown}s để thử lại</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Mở khóa Bảng Quản trị</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </div>
              )}
            </Button>

            {/* Back to Client portal */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[0.62rem] font-bold tracking-widest text-slate-350 uppercase">
                Hoặc
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-dashed border-slate-200 text-[0.78rem] font-bold text-slate-450 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all duration-300"
            >
              Quay lại cổng đăng nhập Cửa hàng & Nhân viên
            </Link>

          </form>
        </div>

        {/* Console Vitals Widgets */}
        <div className="flex justify-between items-center px-4 mt-6 text-slate-400 text-[0.65rem] font-bold">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Console API Status: Operational</span>
          </div>
          <div>
            <span>SSL 256-bit Encrypted</span>
          </div>
        </div>

      </div>
    </div>
  );
}
