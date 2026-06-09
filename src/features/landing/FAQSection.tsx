import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FAQ_DATA = [
  {
    q: "Hệ thống PetTech có hỗ trợ tên miền riêng không?",
    a: "Có! Hệ thống hỗ trợ kết nối tên miền thương hiệu riêng của bạn và tự động cung cấp chứng chỉ bảo mật SSL miễn phí để bảo vệ uy tín cơ sở kinh doanh."
  },
  {
    q: "Dữ liệu khách hàng của tôi có được bảo mật không?",
    a: "Hoàn toàn bảo mật! PetTech áp dụng công nghệ mã hóa và phân tách cơ sở dữ liệu độc lập cho từng cửa hàng, cam kết an toàn thông tin tuyệt đối."
  },
  {
    q: "Lịch hẹn khám có được đồng bộ thời gian thực không?",
    a: "Có! Nhờ kết nối đồng bộ tức thì, mọi thay đổi lịch hẹn từ khách hàng hay lễ tân đều tự động cập nhật ngay trên màn hình quản lý mà không cần tải lại trang."
  },
  {
    q: "Tôi có thể tự chuyển dữ liệu từ phần mềm cũ sang không?",
    a: "Có! Bạn có thể tự tải danh sách khách hàng và thú cưng từ file Excel. Đội ngũ kỹ thuật hỗ trợ 24/7 của chúng tôi cũng luôn sẵn sàng hỗ trợ di chuyển miễn phí."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 lg:py-32 bg-white border-y border-slate-100"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="text-[0.72rem] font-bold text-blue-600 tracking-wider uppercase">Hỏi đáp</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-1.15">
              Giải đáp thắc mắc
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                của cửa hàng
              </span>
            </h2>
            <p className="text-slate-400 font-medium text-sm max-w-sm leading-relaxed">
              Những câu hỏi thường gặp nhất từ các chủ spa, phòng khám và pet shop trong quá trình áp dụng chuyển đổi số vận hành.
            </p>
          </div>

          {/* Right Column: Accordions */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border bg-white transition-all duration-300 overflow-hidden shadow-sm"
                  style={{ borderColor: isOpen ? "#3b82f6" : "#f1f5f9" }}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-[0.95rem] font-bold text-slate-850 tracking-tight leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 transition-colors"
                      style={{ color: isOpen ? "#3b82f6" : "#94a3b8" }}
                    >
                      <ChevronDown
                        className="w-4 h-4 transition-transform duration-300"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                      />
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed font-medium border-t border-slate-50 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
