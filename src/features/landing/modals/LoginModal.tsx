import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToDemo: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToDemo }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Attempt real authentication against B2B API (non-admin flow -> calls /api/Auth/login)
      const result = await login({ Email: email, Password: password }, false);
      
      setLoading(false);
      
      if (result && result.RequiresTwoFactor) {
        onClose();
        navigate('/totp-verify', { state: { email, isAdminFlow: false } });
      } else {
        // Success: Redirect to the corresponding portal based on actual user role
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const userRole = user.role;
          if (userRole === Role.SuperAdmin || userRole === Role.PlatformStaff) {
            navigate('/admin');
          } else if (userRole === Role.PetOwner) {
            navigate('/owner');
          } else {
            navigate('/clinic');
          }
        } else {
          navigate('/owner');
        }
        onClose();
      }
    } catch (err: any) {
      console.error("API Authentication failed:", err);
      setLoading(false);
      
      // Determine error message (prioritize custom backend message if present)
      let errorMsg = "";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      
      // Default to user-friendly Vietnamese warning for status 400 (Bad Request) or missing message
      if (!errorMsg || errorMsg.includes("status code") || err.response?.status === 400) {
        errorMsg = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại!";
      }
      
      setError(errorMsg);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục vào không gian làm việc của bạn"
      maxWidth="md"
    >
      <div className="px-8 py-6 text-center -mt-px bg-gradient-to-b from-orange-50/60 to-white">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
          🐶
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-orange-600 uppercase">
          PETTECH PLATFORM
        </p>
      </div>

      <form onSubmit={handleLogin} className="px-8 pb-8 pt-4 flex flex-col gap-6 bg-white">
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        {forgotSent && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm font-bold text-emerald-600">
              Đã gửi link đặt lại mật khẩu đến {email}!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">EMAIL</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chucuahang@pettech.vn"
                className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-orange-500 focus-visible:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">MẬT KHẨU</label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-[0.7rem] font-bold text-orange-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-12 pr-12 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-orange-500 focus-visible:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-14 rounded-2xl text-lg font-black bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95 hover:opacity-95"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Đang đăng nhập...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Đăng nhập ngay <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>

        <div className="text-center space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">HOẶC</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => { onClose(); onSwitchToDemo(); }}
              className="text-orange-600 font-black hover:underline"
            >
              Đặt lịch demo miễn phí →
            </button>
          </p>
        </div>
      </form>
    </BaseModal>
  );
}
