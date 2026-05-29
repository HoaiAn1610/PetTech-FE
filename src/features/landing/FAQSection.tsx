import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useEntranceReveal } from "@/hooks/useScrollHooks";

const FAQ_DATA = [
  {
    q: "Hệ thống PetTech có hỗ trợ tên miền riêng không?",
    a: "Có! Với gói Platinum nâng cao, cửa hàng của bạn sẽ được kích hoạt tính năng Custom Domain. Hệ thống sẽ tự động cấp chứng chỉ bảo mật SSL miễn phí và kết nối trực tiếp với tên miền thương hiệu riêng của bạn (ví dụ: spa.phongkhamcuaban.com)."
  },
  {
    q: "Dữ liệu khách hàng giữa các cửa hàng có được bảo mật hoàn toàn không?",
    a: "Tuyệt đối bảo mật! PetTech áp dụng kiến trúc Multi-Tenant phân tách dữ liệu hoàn toàn ở mức cơ sở dữ liệu. Mọi yêu cầu API đều đi kèm khóa Tenant định danh trong header, đảm bảo nhân viên và khách hàng của cửa hàng khác không bao giờ có thể truy cập được thông tin của spa bạn."
  },
  {
    q: "Lịch hẹn khám có được đồng bộ thời gian thực không?",
    a: "Hoàn toàn có! Chúng tôi sử dụng công nghệ SignalR kết nối trực tiếp với máy chủ. Khi lễ tân đặt lịch hoặc thay đổi trạng thái ca tắm sấy của thú cưng, màn hình Dashboard của chủ shop và bảng theo dõi của nhân viên sẽ tự động làm mới tức thì mà không cần bấm F5."
  },
  {
    q: "Tôi có thể tự di chuyển dữ liệu từ phần mềm cũ sang PetTech không?",
    a: "Có! PetTech cung cấp bộ công cụ di trú (Data Migration Toolkit) cho phép bạn tải danh sách khách hàng, thông tin thú cưng và danh mục dịch vụ từ file Excel. Đội ngũ kỹ sư hỗ trợ 24/7 của chúng tôi luôn sẵn sàng hỗ trợ bạn hoàn thành việc di chuyển dữ liệu miễn phí trong vòng 2 tiếng."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isRevealed } = useEntranceReveal();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={ref as any}
      id="faq"
      className="py-24 bg-gray-50/50 border-y border-gray-100 transition-all duration-1000 ease-out"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-[0.7rem] font-black uppercase tracking-widest text-blue-600">Câu hỏi thường gặp</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
            Giải đáp thắc mắc của bạn
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Mọi thắc mắc của các chủ spa, phòng khám thú cưng trong việc số hóa quy trình vận hành.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl border bg-white transition-all duration-300 overflow-hidden shadow-sm"
                style={{ borderColor: isOpen ? "#2563EB" : "#f1f5f9" }}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="text-base font-black text-gray-900 tracking-tight leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", color: isOpen ? "#2563EB" : "#9ca3af" }}
                  />
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-8 pb-6 text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
