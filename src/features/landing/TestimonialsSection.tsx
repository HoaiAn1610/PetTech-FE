import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEntranceReveal } from "@/hooks/useScrollHooks";

const TESTIMONIALS = [
  {
    quote: "Từ ngày dùng PetTech, doanh thu của Clinic chúng tôi tăng 35% nhờ hệ thống đặt lịch tự động và eWallet. Khách hàng cực kỳ thích tính năng xem tiến trình tắm chải thời gian thực cho thú cưng của họ!",
    name: "BS. Nguyễn Minh Tuấn",
    role: "Chủ hệ thống Paws Clinic & Spa",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&q=80",
    rating: 5
  },
  {
    quote: "Cơ chế Multi-Tenant rất an toàn. Tôi quản lý 3 chi nhánh spa hoàn toàn độc lập mà không sợ lẫn lộn dữ liệu doanh thu hay thông tin khách hàng. Hệ thống chạy cực kỳ mượt mà trên cả máy tính và điện thoại.",
    name: "Chị Trần Thanh Hương",
    role: "CEO chuỗi Pet House Spa",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    rating: 5
  },
  {
    quote: "Bộ công cụ di chuyển dữ liệu quá tốt. Chúng tôi chuyển toàn bộ 2.000 hồ sơ thú cưng từ file Excel cũ sang PetTech chỉ mất chưa đầy 1 tiếng đồng hồ. Đội ngũ hỗ trợ kỹ thuật cực kỳ nhiệt tình!",
    name: "Anh Hoàng Quốc Khánh",
    role: "Quản lý phòng khám Happy Paws",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&q=80",
    rating: 5
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, isRevealed } = useEntranceReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000); // Auto-play every 6s

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const active = TESTIMONIALS[activeIndex];

  return (
    <section
      ref={ref as any}
      id="testimonials"
      className="py-24 bg-white relative overflow-hidden transition-all duration-1000 ease-out"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50/40 rounded-full blur-3xl -mr-48 -mb-48" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-4">
            <Quote className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-[0.7rem] font-black uppercase tracking-widest text-orange-600">Đánh giá thực tế</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
            Tin dùng bởi các chuyên gia
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Hàng trăm chủ spa, phòng khám thú cưng đã nâng cao doanh số nhờ PetTech.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-[3rem] border border-gray-150 p-8 sm:p-14 relative flex flex-col md:flex-row items-center gap-10 shadow-sm transition-all duration-500">
          {/* Avatar Area */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] overflow-hidden flex-shrink-0 relative border-4 border-white shadow-xl bg-white">
            <img
              src={active.avatar}
              alt={active.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Testimonial Quote */}
          <div className="flex-1 text-center md:text-left flex flex-col gap-6">
            <div className="flex justify-center md:justify-start gap-1">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            
            <p className="text-lg sm:text-xl font-bold text-gray-800 leading-relaxed italic">
              "{active.quote}"
            </p>

            <div>
              <h4 className="text-base font-black text-gray-900 tracking-tight">{active.name}</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{active.role}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white px-5 py-3 rounded-full border shadow-lg border-gray-150 z-20">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === activeIndex ? "bg-orange-500 w-5" : "bg-gray-200"}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
