import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { ShieldCheck, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";

export default function TotpVerify() {
  const { verifyOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve context from route state
  const { email = "", isAdminFlow = false } = (location.state as { email?: string; isAdminFlow?: boolean }) || {};

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Safety Redirect: if no email context is found, kick them back to login
  useEffect(() => {
    if (!email) {
      navigate(isAdminFlow ? "/admin/login" : "/login", { replace: true });
    }
  }, [email, isAdminFlow, navigate]);

  // Timers
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Manage Input changes & Auto-focus next input
  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return; // numeric only

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); // keep last char
    setOtp(newOtp);

    // Auto focus next box if typed a value
    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Manage Keypress (specifically Backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      
      // If current cell is empty, clear previous cell and focus it
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current cell
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste events (allowing users to paste a 6 digit code directly)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length !== 6 || isNaN(Number(pasteData))) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    
    // Focus last input
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  // Submitting the 6-digit Code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cooldown > 0) {
      setError(`Bạn đang bị khóa tạm thời. Vui lòng đợi ${cooldown} giây.`);
      return;
    }

    const codeString = otp.join("");
    if (codeString.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp({ Email: email, Code: codeString }, isAdminFlow);
      
      // Verification success! Redirect based on user role
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const role = user.role;
        if (role === "SuperAdmin" || role === "PlatformStaff") {
          navigate("/admin");
        } else if (role === "PetOwner") {
          navigate("/owner");
        } else {
          navigate("/clinic");
        }
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("2FA Verification failed:", err);
      const axiosError = err as AxiosError<{ message?: string }>;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;

        if (status === 429) {
          setCooldown(60);
          setError("Tần suất xác minh quá nhanh. Vui lòng chờ 1 phút trước khi thử lại.");
        } else if (status === 400 || status === 401) {
          setError(data?.message || "Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        } else {
          setError(data?.message || `Lỗi hệ thống (${status}). Không thể xác thực.`);
        }
      } else {
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate resending a code
  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setError("");
    // Trigger mock resend notification (or API call if available)
    console.log("Resending OTP code for email: ", email);
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-12 ${
      isAdminFlow ? "bg-[#090d16]" : "bg-slate-50"
    }`}>
      {/* Dynamic Backgrounds matching the login context */}
      {isAdminFlow ? (
        <>
          <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-gradient-to-br from-violet-600/10 to-fuchsia-600/5 blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-gradient-to-br from-orange-200/25 to-amber-200/25 blur-[80px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        </>
      )}

      {/* Verification Card */}
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(isAdminFlow ? "/admin/login" : "/login")}
          className={`flex items-center gap-2 mb-6 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            isAdminFlow 
              ? "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05]" 
              : "border-slate-200/60 bg-white/80 text-slate-500 hover:text-slate-900 hover:bg-white"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại trang Đăng nhập
        </button>

        <div className={`w-full backdrop-blur-2xl rounded-[2.5rem] border overflow-hidden shadow-2xl ${
          isAdminFlow 
            ? "bg-[#0d1424]/80 border-white/[0.06] text-white shadow-black/50" 
            : "bg-white/90 border-white text-slate-900 shadow-slate-900/5"
        }`}>
          
          <div className="px-8 pt-10 pb-6 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isAdminFlow ? "bg-violet-600/10 text-violet-400" : "bg-orange-100 text-orange-600"
            }`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Xác thực Hai Yếu Tố (2FA)</h1>
            <p className={`text-xs font-semibold px-4 leading-relaxed ${
              isAdminFlow ? "text-slate-400" : "text-slate-500"
            }`}>
              Hệ thống đã gửi một mã bảo mật OTP 6 chữ số đến địa chỉ email:
              <span className={`block font-extrabold mt-1 ${isAdminFlow ? "text-violet-300" : "text-slate-800"}`}>
                {email}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 flex flex-col gap-6">
            
            {/* Global Error Banner */}
            {error && (
              <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm animate-in fade-in duration-200 ${
                isAdminFlow 
                  ? "bg-red-950/40 border-red-800/40 text-red-200" 
                  : "bg-red-50/80 border-red-100 text-red-700"
              }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* OTP Grid Inputs */}
            <div className="space-y-4">
              <label className={`text-[0.65rem] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 ${
                isAdminFlow ? "text-violet-300" : "text-slate-500"
              }`}>
                <KeyRound className="w-3.5 h-3.5" />
                NHẬP MÃ XÁC THỰC OTP
              </label>

              <div className="flex justify-between gap-2 max-w-[320px] mx-auto" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={isLoading || cooldown > 0}
                    className={`w-11 h-13 text-center text-xl font-extrabold rounded-xl transition-all duration-200 outline-none border focus:ring-2 ${
                      isAdminFlow 
                        ? "bg-white/[0.02] border-white/[0.08] text-white focus:border-violet-500 focus:ring-violet-500/20" 
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verification Button */}
            <Button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className={`h-14 rounded-2xl text-[1rem] font-black tracking-wide text-white shadow-xl transition-all active:scale-[0.98] duration-300 ${
                cooldown > 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/30"
                  : isAdminFlow
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/25"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 animate-spin ${
                    isAdminFlow ? "border-white/20 border-t-violet-400" : "border-white/30 border-t-white"
                  }`} />
                  <span>Đang kiểm tra mã OTP...</span>
                </div>
              ) : cooldown > 0 ? (
                <span>Đợi {cooldown}s</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Xác nhận & Đăng nhập</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Resend Code Widget */}
            <div className="text-center pt-2">
              {resendTimer > 0 ? (
                <p className={`text-xs font-semibold ${isAdminFlow ? "text-slate-500" : "text-slate-400"}`}>
                  Gửi lại mã mới sau <span className="font-extrabold">{resendTimer}</span> giây
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className={`text-xs font-extrabold flex items-center justify-center gap-1.5 mx-auto transition-colors ${
                    isAdminFlow ? "text-violet-400 hover:text-violet-300" : "text-orange-600 hover:text-orange-700"
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
                  Gửi lại mã OTP qua Email
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
