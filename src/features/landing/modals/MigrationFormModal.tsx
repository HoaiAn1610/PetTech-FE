import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Shield, Database, Send } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENT_SYSTEMS } from "@/data/landingData";
import { cn } from "@/components/ui/utils";

interface MigrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MigrationFormModal({ isOpen, onClose }: MigrationFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", clinic: "", system: "" });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  if (done) return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Yêu cầu đã được nhận! 🛡️"
      subtitle="Chuyên gia di chuyển dữ liệu sẽ liên hệ với bạn"
      maxWidth="md"
    >
      <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-3">
          <p className="text-gray-600 font-medium leading-relaxed">
            Cảm ơn <span className="text-gray-900 font-black">{form.name}</span>. Chúng tôi đã nhận được thông tin về hệ thống <span className="text-orange-600 font-bold">{form.system}</span> của bạn.
          </p>
          <p className="text-sm text-gray-400 font-medium">
            Kỹ sư giải pháp sẽ gọi cho bạn tại <span className="text-gray-900 font-bold">{form.email}</span> trong vòng 24 giờ tới.
          </p>
        </div>
        <Button 
          onClick={onClose}
          className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black"
        >
          Tuyệt vời
        </Button>
      </div>
    </BaseModal>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký gói di chuyển 0đ"
      subtitle="Áp dụng cho khách hàng đăng ký gói năm"
      maxWidth="lg"
    >
      <div className="flex flex-col lg:flex-row bg-white">
        {/* Left: Form */}
        <form onSubmit={handleApply} className="flex-1 p-8 lg:p-10 space-y-6">
          <div className="grid gap-5">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-gray-400 tracking-widest uppercase">HỌ TÊN NGƯỜI QUẢN LÝ</label>
              <Input 
                required 
                value={form.name} 
                onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                placeholder="Nguyễn Văn A" 
                className="h-12 rounded-xl bg-gray-50 border-gray-100" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-gray-400 tracking-widest uppercase">EMAIL LIÊN HỆ</label>
              <Input 
                required 
                type="email" 
                value={form.email} 
                onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                placeholder="bacsi@phongkham.com" 
                className="h-12 rounded-xl bg-gray-50 border-gray-100" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-gray-400 tracking-widest uppercase">TÊN PHÒNG KHÁM</label>
              <Input 
                required 
                value={form.clinic} 
                onChange={e => setForm(v => ({ ...v, clinic: e.target.value }))}
                placeholder="Phòng khám PetCare" 
                className="h-12 rounded-xl bg-gray-50 border-gray-100" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-gray-400 tracking-widest uppercase">HỆ THỐNG HIỆN TẠI</label>
              <Select required onValueChange={v => setForm(prev => ({ ...prev, system: v }))}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-100">
                  <SelectValue placeholder="Chọn hệ thống..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  {CURRENT_SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <p className="text-[0.7rem] font-bold text-orange-900 leading-snug">
              BẢO MẬT: Mọi dữ liệu của bạn được cam kết bảo mật bằng văn bản pháp lý.
            </p>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-xl shadow-orange-500/20 transition-all"
          >
            {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu ngay"}
          </Button>
        </form>

        {/* Right: Benefits */}
        <div className="w-full lg:w-[320px] bg-slate-900 p-8 lg:p-10 flex flex-col gap-8 text-white">
          <div className="space-y-2">
            <p className="text-[0.65rem] font-black text-orange-400 tracking-[0.2em] uppercase">QUY TRÌNH</p>
            <h3 className="text-xl font-black tracking-tight">An toàn & Nhanh chóng</h3>
          </div>

          <div className="space-y-6">
            {[
              { title: "Khảo sát dữ liệu", sub: "Đánh giá cấu trúc DB hiện tại", icon: Database },
              { title: "Ánh xạ hồ sơ", sub: "Đảm bảo 100% trường dữ liệu khớp", icon: Shield },
              { title: "Di chuyển thử", sub: "Kiểm tra lỗi trên bản sandbox", icon: Send },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[0.85rem] font-black">{b.title}</p>
                    <p className="text-[0.7rem] font-medium text-slate-400">{b.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-[0.65rem] font-bold text-slate-400 leading-relaxed italic">
              "Chúng tôi đã chuyển hơn 50,000 hồ sơ bệnh án từ ezyVet sang PetTech chỉ trong 3 ngày mà không làm gián đoạn việc khám chữa bệnh."
            </p>
            <p className="text-[0.7rem] font-black mt-2 text-white">— Dr. Trần, Happy Pet Clinic</p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
