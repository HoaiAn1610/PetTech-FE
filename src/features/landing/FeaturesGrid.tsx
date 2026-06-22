import { Calendar, ShoppingCart, Activity, Users, ArrowRight, ShieldCheck, QrCode, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface FeaturesGridProps {
  onLearnMore?: (id: string) => void;
}

export function FeaturesGrid({ onLearnMore }: FeaturesGridProps) {
  return (
    <section
      id="features"
      className="py-24 lg:py-32 bg-slate-50/50 relative overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-[0.72rem] font-bold text-blue-600 tracking-wider uppercase">
              Hệ Sinh Thái Toàn Diện
            </span>
          </div>
          <h2
            className="text-slate-900 tracking-tight"
            style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.15 }}
          >
            Tất cả những gì bạn cần
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              trên một nền tảng duy nhất
            </span>
          </h2>
          <p
            className="text-slate-500 max-w-xl mx-auto"
            style={{ fontSize: "1rem", fontWeight: 500, lineHeight: 1.6 }}
          >
            Bốn phân hệ tích hợp sâu thay thế hoàn toàn các công cụ rời rạc, tối ưu hóa quy trình vận hành dịch vụ thú cưng của bạn.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ô 1: Đặt lịch thông minh (Cột đôi - Rộng) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative md:col-span-2 rounded-2xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="grid sm:grid-cols-2 gap-8 items-center h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Calendar className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <span className="text-[0.68rem] font-bold text-blue-600 uppercase tracking-widest">ĐẶT LỊCH HẸN</span>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">Đặt lịch thông minh 24/7</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Hệ thống đặt lịch trực tuyến tự động phân chia ca theo nhân viên, stylist. Gửi tin nhắn nhắc lịch tự động qua Zalo, giảm tỷ lệ bỏ lỡ lịch hẹn tới 40%.
                  </p>
                </div>
                <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-[0.72rem] font-bold text-blue-600">
                  Giảm 40% lịch hẹn ảo
                </div>
              </div>

              {/* Mockup Calendar UI */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 hidden sm:block">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-600">Lịch trình hôm nay</span>
                  <span className="text-[0.62rem] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 Slot trống</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white border border-slate-100 p-2.5 rounded-lg flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐕</span>
                      <div>
                        <div className="text-[0.7rem] font-bold text-slate-800">Cún Lu - Grooming</div>
                        <div className="text-[0.62rem] text-slate-400">Stylist: Huy Hoàng</div>
                      </div>
                    </div>
                    <span className="text-[0.62rem] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Đã đến</span>
                  </div>
                  <div className="bg-white border border-slate-100 p-2.5 rounded-lg flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐈</span>
                      <div>
                        <div className="text-[0.7rem] font-bold text-slate-800">Miu - Tiêm chủng</div>
                        <div className="text-[0.62rem] text-slate-400">BSTY: Minh Tuấn</div>
                      </div>
                    </div>
                    <span className="text-[0.62rem] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">14:30</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ô 2: POS bán hàng (Đơn) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative md:col-span-1 rounded-2xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <span className="text-[0.68rem] font-bold text-violet-600 uppercase tracking-widest">BÁN HÀNG & THANH TOÁN</span>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">POS đa năng thông minh</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Tính tiền dịch vụ và bán lẻ sản phẩm tại quầy. Tích hợp quét mã QR thanh toán nhanh chóng.
                </p>
              </div>
            </div>

            {/* Mockup POS Interface */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">TỔNG CỘNG</span>
                <span className="font-black text-slate-800 text-sm">350.000 ₫</span>
              </div>
              <div className="bg-white border border-slate-100 py-2 px-3 rounded-lg flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <span className="text-[0.68rem] font-bold text-slate-600">Quét VietQR tự động</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </motion.div>

          {/* Ô 3: Hồ sơ thú cưng (Đơn) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative md:col-span-1 rounded-2xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <Activity className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <span className="text-[0.68rem] font-bold text-cyan-600 uppercase tracking-widest">HỒ SƠ Y TẾ</span>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Hồ sơ thông minh</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Hồ sơ y tế điện tử lưu lịch sử tiêm vaccine, ảnh trước/sau khi spa và sở thích của thú cưng trọn đời.
                </p>
              </div>
            </div>

            {/* Mockup Pet Badge */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 overflow-hidden border border-white shadow-sm flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop&q=80" alt="Pet Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[0.72rem] font-bold text-slate-800 flex items-center gap-1.5">
                    Lu Lu <span className="text-[0.62rem] text-slate-400">(Golden)</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <span className="text-[0.55rem] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Grooming</span>
                    <span className="text-[0.55rem] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Vaccine</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ô 4: CRM (Cột đôi - Rộng) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative md:col-span-2 rounded-2xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="grid sm:grid-cols-2 gap-8 items-center h-full">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Users className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <span className="text-[0.68rem] font-bold text-purple-600 uppercase tracking-widest">CRM & MARKETING</span>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">CRM & Chăm sóc tự động</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Tự động gửi lời chúc sinh nhật, nhắc lịch tiêm vaccine phòng dại định kỳ hay tặng điểm thưởng Loyalty để khách hàng luôn gắn bó với thương hiệu của bạn.
                  </p>
                </div>
                <div className="inline-flex px-3 py-1 rounded-full bg-purple-50 text-[0.72rem] font-bold text-purple-600">
                  Gia tăng 3x tỷ lệ quay lại
                </div>
              </div>

              {/* Mockup Chat UI */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 hidden sm:block">
                <div className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Luồng gửi tự động</div>
                <div className="space-y-2">
                  <div className="bg-white border border-slate-100 p-2.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-1">
                    <div className="flex justify-between items-center text-[0.6rem]">
                      <span className="font-bold text-purple-600">💬 Zalo ZNS</span>
                      <span className="text-slate-400">Đã gửi</span>
                    </div>
                    <p className="text-[0.68rem] text-slate-600 leading-relaxed">
                      "Chào bạn, ngày mai bé Lu Lu có lịch hẹn tắm vệ sinh lúc 15:00 nhé..."
                    </p>
                  </div>
                  <div className="bg-white border border-slate-100 p-2.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-1">
                    <div className="flex justify-between items-center text-[0.6rem]">
                      <span className="font-bold text-blue-600">✉️ Email Remind</span>
                      <span className="text-slate-400">Đã gửi</span>
                    </div>
                    <p className="text-[0.68rem] text-slate-600 leading-relaxed">
                      "Bé Lu Lu đã đến hạn tiêm nhắc lại vaccine 7 bệnh thú y..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
