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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#090d16] overflow-hidden px-4 py-12">
      
      {/* ── Technical Cyberpunk Glowing Orbs ────────────────────────────────────── */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 to-cyan-500/10 blur-[120px] pointer-events-none" />
      
      {/* Dark Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* ── Glassmorphic Admin Terminal Card ────────────────────────────────────── */}
      <div className="relative w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Upper Brand/Secure Console Badge */}
        <div className="flex justify-center mb-6">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 hover:border-white/[0.15] transition-all duration-300"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/35 text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[0.75rem] font-black tracking-[0.2em] text-violet-200 uppercase">
              PETTECH PLATFORM <span className="text-white">CONSOLE</span>
            </span>
          </Link>
        </div>

        {/* Card Body */}
        <div className="w-full bg-[#0d1424]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/[0.06] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-white/[0.03] bg-gradient-to-b from-violet-950/20 to-transparent">
            <h1 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center justify-center gap-2">
              <Command className="w-6 h-6 text-violet-400" />
              CỔNG QUẢN TRỊ VIÊN
            </h1>
            <p className="text-xs font-semibold text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Dành riêng cho Platform Staff và SuperAdmin quản trị toàn hệ thống SaaS
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="px-8 py-8 flex flex-col gap-6">
            
            {/* Global Errors / Alert Alerts */}
            {generalError && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-black text-red-400">Security Guard Alert</p>
                  <p className="font-semibold opacity-90">{generalError}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="email" className="text-xs font-black text-violet-300/80 tracking-wider uppercase">
                  ADMIN EMAIL
                </label>
                {emailError && (
                  <span className="text-xs font-bold text-red-400 animate-pulse">{emailError}</span>
                )}
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled={isLoading || cooldown > 0}
                  onBlur={() => validateEmail(email)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pettech.io"
                  className={`pl-12 h-13 rounded-2xl bg-white/[0.02] border-white/[0.05] text-[0.95rem] font-semibold text-white transition-all duration-300 focus-visible:ring-2 placeholder:text-slate-600 ${
                    emailError 
                      ? "border-red-500/50 focus-visible:ring-red-500/10 focus-visible:bg-white/[0.04]" 
                      : "focus-visible:ring-violet-500/20 focus-visible:border-violet-500 focus-visible:bg-white/[0.04]"
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-xs font-black text-violet-300/80 tracking-wider uppercase">
                  SECURITY KEY / PASSWORD
                </label>
                {passwordError && (
                  <span className="text-xs font-bold text-red-400 animate-pulse">{passwordError}</span>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading || cooldown > 0}
                  onBlur={() => validatePassword(password)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-12 pr-12 h-13 rounded-2xl bg-white/[0.02] border-white/[0.05] text-[0.95rem] font-semibold text-white transition-all duration-300 focus-visible:ring-2 placeholder:text-slate-600 ${
                    passwordError 
                      ? "border-red-500/50 focus-visible:ring-red-500/10 focus-visible:bg-white/[0.04]" 
                      : "focus-visible:ring-violet-500/20 focus-visible:border-violet-500 focus-visible:bg-white/[0.04]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.05] rounded-xl text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox & Help */}
            <div className="flex justify-between items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-lg border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500/30"
                />
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                  Duy trì phiên an toàn
                </span>
              </label>
              <Link 
                to="/admin/reset-request" 
                className="text-xs font-extrabold text-violet-400 hover:text-violet-300 hover:underline transition-colors"
              >
                Yêu cầu khôi phục khóa?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className={`h-14 rounded-2xl text-[1rem] font-black tracking-wide text-white shadow-xl transition-all active:scale-[0.98] duration-300 ${
                cooldown > 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/30"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5 border border-violet-500/30"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-violet-400 animate-spin" />
                  <span>Đang giải mã thông tin xác thực...</span>
                </div>
              ) : cooldown > 0 ? (
                <span>Cơ chế chống Brute-force: Thử lại sau {cooldown}s</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Mở khóa Bảng Quản trị</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Go back */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[0.65rem] font-black tracking-widest text-slate-500 uppercase">
                HOẶC KHÁCH HÀNG / CỬA HÀNG
              </span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Client Redirection */}
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-2xl border-2 border-dashed border-white/[0.06] text-xs font-black text-slate-400 hover:bg-white/[0.03] hover:border-white/[0.12] hover:text-white transition-all duration-300"
            >
              Quay lại cổng đăng nhập Cửa hàng & Nhân viên (Client Portal)
            </Link>

          </form>
        </div>

        {/* Console Vitals Widgets */}
        <div className="flex justify-between items-center px-4 mt-6 text-slate-500 text-[0.65rem] font-bold">
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
