import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/data/landingData";
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
  const [role, setRole] = useState<typeof ROLES[number]["value"]>("petowner");
  const navigate = useNavigate();

  const selectedRole = ROLES.find((r) => r.value === role)!;
  const isAdmin = role === "admin" || role === "support";
  const isPetOwner = role === "petowner";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setError("");
    setLoading(true);

    // Map landing page roles to system roles
    let systemRole: Role;
    switch (role) {
      case "admin": systemRole = Role.SuperAdmin; break;
      case "support": systemRole = Role.PlatformStaff; break;
      case "owner": systemRole = Role.ShopManager; break;
      case "staff": systemRole = Role.Vet; break; // Default to Vet for staff
      case "petowner": systemRole = Role.PetOwner; break;
      default: systemRole = Role.PetOwner;
    }

    setTimeout(() => {
      setLoading(false);
      login(systemRole);
      
      // Navigate to the correct destination based on role mapping
      // Note: ROLES.dest might still use legacy paths like /dashboard or /petowner
      // Our ProtectedRoute and getFallbackPath will handle redirects if needed.
      // But let's use the intended destinations from ROLES for consistency.
      navigate(selectedRole.dest);
      onClose();
    }, 1200);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chào mừng trở lại"
      subtitle={selectedRole.sub}
      maxWidth="md"
    >
      <div className={cn(
        "px-8 py-6 text-center -mt-px",
        isAdmin ? "bg-slate-900 text-white" : isPetOwner ? "bg-orange-50" : "bg-blue-50"
      )}>
        <div className={cn(
          "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-xl",
          isAdmin ? "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/30" :
          isPetOwner ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30" :
          "bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-500/30"
        )}>
          {selectedRole.icon}
        </div>
        <p className={cn("text-xs font-black tracking-[0.2em] uppercase", isAdmin ? "text-slate-400" : "text-gray-400")}>
          Đăng nhập với tư cách {selectedRole.label}
        </p>
      </div>

      <form onSubmit={handleLogin} className="px-8 py-8 flex flex-col gap-6 bg-white">
        {/* Role picker */}
        <div className="space-y-3">
          <label className="text-[0.65rem] font-black text-gray-400 tracking-widest uppercase">
            CHỌN VAI TRÒ
          </label>
          <div className="grid gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all border-2 group",
                  role === r.value 
                    ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100" 
                    : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                )}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.85rem] font-black text-gray-900">{r.label}</p>
                  <p className="text-[0.65rem] font-bold text-gray-400 truncate">{r.sub}</p>
                </div>
                {role === r.value && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdmin ? "admin@pettech.io" : "bacsi@phongkham.com"}
                className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600 focus-visible:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">MẬT KHẨU</label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-[0.7rem] font-bold text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-12 pr-12 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600 focus-visible:bg-white"
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
          className={cn(
            "h-14 rounded-2xl text-lg font-black shadow-xl transition-all active:scale-95",
            isAdmin ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/20" :
            isPetOwner ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/20" :
            "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/20"
          )}
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

        {!isAdmin && (
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
                className="text-blue-600 font-black hover:underline"
              >
                Đặt lịch demo miễn phí →
              </button>
            </p>
          </div>
        )}
      </form>
    </BaseModal>
  );
}
