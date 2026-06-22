import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { motion } from "motion/react";

interface PricingSectionProps {
  onRegister?: () => void;
}

export function PricingSection({ onRegister }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Dùng thử",
      price: "0đ",
      sub: "/tháng",
      desc: "Trải nghiệm đầy đủ các tính năng quản lý cốt lõi của hệ thống.",
      features: [
        "Quản lý lịch hẹn trực tuyến",
        "Hồ sơ khách hàng & thú cưng",
        "Hồ sơ y tế điện tử (EMR)",
        "POS bán hàng & Thanh toán",
        "Quản lý kho hàng cơ bản",
      ],
      color: "#2563EB",
      bg: "rgba(37,99,235,0.03)",
      button: "Dùng thử miễn phí",
    },
    {
      name: "Cơ bản",
      price: isAnnual ? "249.000 ₫" : "310.000 ₫",
      sub: "/tháng",
      desc: "Tối ưu hóa vận hành hàng ngày cho phòng khám vừa và nhỏ.",
      features: [
        "Đầy đủ tính năng gói Dùng thử",
        "Quản lý Kanban Task Board",
        "Quản lý kho thuốc & hàng hóa",
        "Hỗ trợ kỹ thuật 24/7",
      ],
      color: "#0D9488",
      bg: "rgba(13,148,136,0.03)",
      button: "Dùng thử miễn phí",
      popular: false,
    },
    {
      name: "Chuyên nghiệp",
      price: isAnnual ? "399.000 ₫" : "499.000 ₫",
      sub: "/tháng",
      desc: "Giải pháp toàn diện tăng trưởng doanh thu & gắn kết khách hàng.",
      features: [
        "Đầy đủ tính năng gói Cơ bản",
        "CRM & Marketing tự động",
        "Tên miền riêng (Custom Domain)",
        "Báo cáo doanh thu đa chi nhánh",
        "Hỗ trợ ưu tiên hotline khẩn cấp",
      ],
      color: "#2563EB",
      bg: "rgba(37,99,235,0.03)",
      button: "Dùng thử miễn phí",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-slate-50/30 relative overflow-hidden">
      {/* Pastel background glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-[0.72rem] font-bold text-blue-600 tracking-wider uppercase">BẢNG GIÁ MINH BẠCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Đầu tư hợp lý cho sự{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              tăng trưởng dài hạn
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm">
            Chọn gói dịch vụ phù hợp nhất với quy mô kinh doanh của bạn. Không có chi phí phát sinh ẩn hay cam kết hợp đồng phức tạp.
          </p>

          {/* Toggle Button */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 pt-6 flex-wrap">
            <span className={cn("text-xs font-bold transition-colors duration-200", !isAnnual ? "text-slate-800" : "text-slate-400")}>
              Thanh toán tháng
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-7 rounded-full bg-slate-200/80 p-0.5 relative transition-colors duration-300 cursor-pointer"
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300",
                  isAnnual ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold transition-colors duration-200", isAnnual ? "text-slate-800" : "text-slate-400")}>
                Thanh toán năm
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[0.62rem] font-bold uppercase tracking-wider">
                Tiết kiệm 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={cn(
                "relative flex flex-col p-6 sm:p-8 rounded-2xl bg-white border shadow-sm transition-all duration-500",
                plan.popular 
                  ? "border-blue-500 shadow-xl shadow-blue-500/5" 
                  : "border-slate-100 hover:border-slate-200 shadow-sm"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[0.65rem] font-bold uppercase tracking-widest shadow-md">
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed min-h-[36px]">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">{plan.price}</span>
                  <span className="text-slate-400 text-xs font-semibold">{plan.sub}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3.5} />
                    </div>
                    <span className="text-[0.82rem] font-semibold text-slate-500">{f}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={onRegister}
                className={cn(
                  "h-12 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 cursor-pointer w-full border",
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                )}
              >
                {plan.button}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
