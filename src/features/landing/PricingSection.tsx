import React, { useState } from "react";
import { Check, ArrowRight, Zap, Shield, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { motion } from "motion/react";

interface PricingSectionProps {
  onDemo?: () => void;
  onRegister?: () => void;
}

const plans = [
  {
    name: "Cơ bản",
    price: "990k",
    sub: "/tháng, thanh toán năm",
    desc: "Hoàn hảo cho phòng khám đơn hoặc tiệm grooming mới bắt đầu.",
    features: [
      "Quản lý lịch hẹn cơ bản",
      "Hồ sơ sức khỏe thú cưng",
      "POS & Thanh toán tại quầy",
      "Quản lý kho hàng (100 SKU)",
      "Hỗ trợ qua email",
    ],
    color: "#2563EB",
    bg: "rgba(37,99,235,0.04)",
    button: "Bắt đầu ngay",
  },
  {
    name: "Chuyên nghiệp",
    price: "1.990k",
    sub: "/tháng, thanh toán năm",
    desc: "Dành cho các cơ sở đang phát triển cần tối ưu vận hành & CRM.",
    features: [
      "Mọi thứ trong gói Cơ bản",
      "CRM & Tự động hóa marketing",
      "Theo dõi chỉ số sinh tồn IoT",
      "Quản lý kho hàng không giới hạn",
      "Báo cáo phân tích chuyên sâu",
      "Hỗ trợ ưu tiên 24/7",
    ],
    color: "#F97316",
    bg: "rgba(249,115,22,0.06)",
    button: "Dùng thử miễn phí",
    popular: true,
  },
  {
    name: "Doanh nghiệp",
    price: "Custom",
    sub: "Giải pháp tùy chỉnh",
    desc: "Cho chuỗi phòng khám & bệnh viện thú y quy mô lớn.",
    features: [
      "Mọi thứ trong gói Chuyên nghiệp",
      "Quản lý đa chi nhánh tập trung",
      "API mở & Tích hợp tùy chỉnh",
      "Chuyên viên triển khai riêng",
      "SLA cam kết 99.99%",
      "Đào tạo nhân viên tận nơi",
    ],
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.04)",
    button: "Liên hệ tư vấn",
  },
];

export function PricingSection({ onDemo, onRegister }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-[0.7rem] font-black text-blue-600 uppercase tracking-widest">BẢNG GIÁ MINH BẠCH</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Đầu tư cho sự <span className="text-blue-600">tăng trưởng</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Chọn gói dịch vụ phù hợp với quy mô hiện tại và sẵn sàng mở rộng bất cứ lúc nào.
            Không phí ẩn, không hợp đồng ràng buộc dài hạn.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <span className={cn("text-sm font-bold", !isAnnual ? "text-gray-900" : "text-gray-400")}>Thanh toán tháng</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-gray-200 p-1 relative transition-colors duration-300"
            >
              <div className={cn(
                "w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300",
                isAnnual ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", isAnnual ? "text-gray-900" : "text-gray-400")}>Thanh toán năm</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[0.65rem] font-black uppercase">Tiết kiệm 20%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div 
              key={plan.name}
              whileHover={{ scale: 1.03, y: -10 }}
              className={cn(
                "relative flex flex-col p-8 lg:p-10 rounded-[2.5rem] bg-white transition-all duration-500 hover:-translate-y-2 border-2",
                plan.popular ? "border-orange-500 shadow-2xl shadow-orange-500/10" : "border-transparent shadow-xl shadow-gray-200/50 hover:border-blue-100"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[0.7rem] font-black uppercase tracking-widest shadow-lg">
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">{plan.price}</span>
                  <span className="text-gray-400 font-bold">{plan.sub}</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-[0.9rem] font-bold text-gray-600">{f}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={plan.name === "Doanh nghiệp" ? onDemo : onRegister}
                className={cn(
                  "h-14 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all",
                  plan.popular 
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20" 
                    : "bg-gray-900 hover:bg-black text-white"
                )}
              >
                {plan.button}
              </Button>
              
              <p className="mt-4 text-center text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">
                Dùng thử đầy đủ 14 ngày
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise highlight */}
        <div className="mt-16 p-8 lg:p-12 rounded-[3rem] bg-slate-900 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-[80px]" />
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-1">
            <h4 className="text-xl font-black text-white tracking-tight">Cần một giải pháp tùy chỉnh?</h4>
            <p className="text-slate-400 font-medium">Hỗ trợ triển khai cho bệnh viện thú y, đào tạo nhân sự tận nơi và tích hợp API riêng.</p>
          </div>
          <button 
            onClick={onDemo}
            className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-black hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            Nói chuyện với chuyên gia
          </button>
        </div>
      </div>
    </section>
  );
}
