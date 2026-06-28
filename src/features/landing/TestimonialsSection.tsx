import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const TESTIMONIALS = [
  {
    quote: "Doanh thu phòng khám tăng 35% từ khi áp dụng hệ thống đặt lịch tự động của PetTech. Khách hàng cũng rất thích theo dõi trạng thái dịch vụ thời gian thực.",
    name: "BS. Nguyễn Minh Tuấn",
    role: "Chủ hệ thống Paws Clinic & Spa",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&q=80",
    rating: 5
  },
  {
    quote: "Quản lý 3 chi nhánh spa hoàn toàn độc lập, bảo mật dữ liệu doanh thu tuyệt đối. Hệ thống vận hành mượt mà trên cả điện thoại và máy tính.",
    name: "Chị Trần Thanh Hương",
    role: "CEO chuỗi Pet House Spa",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    rating: 5
  },
  {
    quote: "Chuyển toàn bộ hơn 2.000 hồ sơ thú cưng từ file Excel cũ sang hệ thống mới chỉ mất chưa đầy một tiếng. Đội ngũ hỗ trợ kỹ thuật nhiệt tình, nhanh chóng!",
    name: "Anh Hoàng Quốc Khánh",
    role: "Quản lý phòng khám Happy Paws",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&q=80",
    rating: 5
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000); // Autoplay every 8s

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
      id="testimonials"
      className="py-16 sm:py-24 lg:py-32 bg-slate-50/20 relative overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50">
            <Quote className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[0.72rem] font-bold text-indigo-600 tracking-wider uppercase">Đánh giá</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Tin tưởng bởi{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              các chuyên gia
            </span>
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Hàng trăm chủ spa và phòng khám thú y đã gặt hái kết quả thực tế cùng PetTech.
          </p>
        </div>

        {/* Carousel Container Wrapper */}
        <div className="max-w-4xl mx-auto relative">
          {/* Card with overflow-hidden */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-12 shadow-sm min-h-[360px] sm:min-h-[300px] flex items-center transition-all overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12"
              >
                {/* Avatar Area */}
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 relative border-4 border-slate-50 shadow-md bg-white">
                  <img
                    src={active.avatar}
                    alt={active.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Testimonial Quote */}
                <div className="flex-1 text-center md:text-left flex flex-col justify-between h-full gap-4">
                  <div className="flex justify-center md:justify-start gap-1">
                    {Array.from({ length: active.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-sm sm:text-base md:text-lg font-bold text-slate-700 leading-relaxed italic">
                    "{active.quote}"
                  </p>

                  <div className="pt-2">
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">{active.name}</h4>
                    <p className="text-[0.68rem] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{active.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls (placed outside the overflow-hidden div, but inside the relative wrapper) */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-lg z-20">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${idx === activeIndex ? "bg-indigo-600 w-4.5" : "bg-slate-200"}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
