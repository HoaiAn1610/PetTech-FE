import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowRight, CheckCircle2, User, Mail, Phone, 
  Building2, Calendar, Zap, ChevronLeft, ChevronRight 
} from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { DEMO_TIMES, CLINIC_SIZES, CURRENT_SYSTEMS } from "@/data/landingData";
import { cn } from "@/components/ui/utils";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    name: "", email: "", phone: "", 
    clinic: "", size: "", system: "" 
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    if (d.getDay() === 0 || d.getDay() === 6) return null;
    return {
      short: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      label: d.toLocaleDateString("vi-VN", { weekday: "long", month: "long", day: "numeric" }),
    };
  }).filter(Boolean) as { short: string; day: number; month: string; label: string }[];

  const canNext1 = form.name && form.email && form.clinic;

  const handleFinish = () => {
    setDone(true);
  };

  if (done) return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Đã đặt lịch Demo! 🎉"
      subtitle="Chuyên gia của chúng tôi sẽ gặp bạn sớm"
      maxWidth="md"
    >
      <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner relative">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
            Đã xác nhận demo 30 phút của bạn vào <br />
            <span className="text-gray-900 font-black">{date}</span> lúc <span className="text-gray-900 font-black">{time}</span>.
          </p>
          <p className="text-sm text-gray-400 font-medium">
            Thư mời lịch đã được gửi đến <span className="text-blue-600 font-bold">{form.email}</span>.
          </p>
        </div>

        <div className="w-full p-6 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-[0.8rem] font-black text-blue-900 leading-snug">
            QUÀ TẶNG: 3 tháng miễn phí gói Nâng cao dành riêng cho người tham dự demo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="flex-1 h-12 rounded-2xl font-black text-gray-500 border-gray-200"
          >
            Đóng
          </Button>
          <Button 
            onClick={() => { navigate("/dashboard"); onClose(); }}
            className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20"
          >
            Xem trước Dashboard →
          </Button>
        </div>
      </div>
    </BaseModal>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "Đặt lịch Demo miễn phí" : "Chọn thời gian phù hợp"}
      subtitle={step === 1 ? "Xem PetTech trực tiếp 30 phút — không ràng buộc" : "Chọn khung giờ mà bạn rảnh nhất"}
      maxWidth="lg"
    >
      {/* Progress */}
      <div className="px-8 pt-6 pb-2">
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 flex flex-col gap-2">
              <div 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  s <= step ? "bg-blue-600" : "bg-gray-100"
                )} 
              />
              <span className={cn(
                "text-[0.6rem] font-black uppercase tracking-widest",
                s === step ? "text-blue-600" : "text-gray-400"
              )}>
                {s === 1 ? "Thông tin" : "Thời gian"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 ? (
        <div className="px-8 py-8 space-y-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="space-y-2">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">HỌ VÀ TÊN *</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
                <Input 
                  value={form.name} 
                  onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                  placeholder="Nguyễn Văn A" 
                  className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">EMAIL CÔNG VIỆC *</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
                <Input 
                  type="email"
                  value={form.email} 
                  onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                  placeholder="bacsi@phongkham.com" 
                  className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">SỐ ĐIỆN THOẠI</label>
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
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">TÊN PHÒNG KHÁM / SPA *</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
                <Input 
                  value={form.clinic} 
                  onChange={e => setForm(v => ({ ...v, clinic: e.target.value }))}
                  placeholder="Phòng khám Pet Happy" 
                  className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-blue-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">QUY MÔ</label>
              <Select value={form.size} onValueChange={v => setForm(prev => ({ ...prev, size: v }))}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:ring-blue-600">
                  <SelectValue placeholder="Chọn quy mô..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  {CLINIC_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-black text-gray-900 tracking-wider">HỆ THỐNG ĐANG DÙNG</label>
              <Select value={form.system} onValueChange={v => setForm(prev => ({ ...prev, system: v }))}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:ring-blue-600">
                  <SelectValue placeholder="Chọn hệ thống..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  {CURRENT_SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            disabled={!canNext1}
            onClick={() => setStep(2)}
            className="w-full h-14 rounded-2xl text-lg font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            Tiếp theo: Chọn thời gian <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      ) : (
        <div className="px-8 py-8 space-y-8 bg-white">
          <div className="space-y-4">
            <p className="text-[0.7rem] font-black text-gray-400 tracking-[0.15em] uppercase">
              CHỌN NGÀY LÀM VIỆC
            </p>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {dates.map((d) => (
                <button
                  key={d.label}
                  onClick={() => setDate(d.label)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-4 rounded-2xl transition-all border-2 flex-shrink-0 min-w-[70px]",
                    date === d.label 
                      ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100" 
                      : "border-gray-50 bg-gray-50/50 hover:border-blue-200"
                  )}
                >
                  <span className={cn("text-[0.6rem] font-black uppercase", date === d.label ? "text-blue-600" : "text-gray-400")}>
                    {d.short}
                  </span>
                  <span className={cn("text-2xl font-black", date === d.label ? "text-blue-900" : "text-gray-900")}>
                    {d.day}
                  </span>
                  <span className={cn("text-[0.6rem] font-bold", date === d.label ? "text-blue-600" : "text-gray-400")}>
                    {d.month}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[0.7rem] font-black text-gray-400 tracking-[0.15em] uppercase">
              KHUNG GIỜ TRỐNG
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {DEMO_TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={cn(
                    "py-3 rounded-xl text-[0.8rem] font-black transition-all border-2",
                    time === t 
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "border-gray-50 bg-gray-50 hover:border-blue-200 text-gray-700"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {date && time && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold text-blue-900 leading-snug">
                Demo 30 phút vào {date} lúc {time}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setStep(1)}
              className="h-14 px-6 rounded-2xl border-gray-200 font-black text-gray-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              disabled={!date || !time}
              onClick={handleFinish}
              className="flex-1 h-14 rounded-2xl text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all"
            >
              Xác nhận Demo <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
