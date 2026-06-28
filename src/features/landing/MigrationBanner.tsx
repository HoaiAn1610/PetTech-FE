import { ShieldCheck, Clock, Database, HeartHandshake, Sparkles } from "lucide-react";

interface MigrationBannerProps {
  onClaim?: () => void;
  onGuide?: () => void;
}

const migrationPerks = [
  {
    icon: Database,
    title: "Chuyển dữ liệu toàn bộ",
    desc: "Mọi hồ sơ bệnh nhân, hóa đơn và lịch sử được chuyển với độ chính xác tuyệt đối.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "Không gián đoạn hoạt động",
    desc: "Chúng tôi di chuyển dữ liệu ngầm. Phòng khám của bạn không bao giờ bị dừng lại.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: ShieldCheck,
    title: "Mã hóa & bảo mật",
    desc: "Mã hóa AES-256 cấp quân sự xuyên suốt toàn bộ quá trình.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: HeartHandshake,
    title: "Chuyên viên hỗ trợ riêng",
    desc: "Một kỹ sư di chuyển được chỉ định riêng cho phòng khám của bạn trong 90 ngày.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export function MigrationBanner({ onClaim, onGuide }: MigrationBannerProps) {
  return (
    <section
      id="migration"
      className="relative overflow-hidden py-24 lg:py-32 bg-slate-50/30"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Decorative ambient glowing blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl -tr-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="text-[0.72rem] font-bold text-blue-600 tracking-wider uppercase">
              MIỄN PHÍ DI CHUYỂN DỮ LIỆU KHI ĐĂNG KÝ GÓI NĂM
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Di chuyển dữ liệu <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              chuyên nghiệp & trọn gói
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
            Đang dùng ezyVet, Cornerstone, Vetspire hay hệ thống khác? Đội ngũ chuyên gia của chúng tôi xử lý
            mọi thứ — từ đầu đến cuối — để nhân viên của bạn không phải lo lắng gì.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {migrationPerks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="rounded-2xl p-8 flex flex-col gap-4 bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform ${perk.bg} ${perk.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[0.95rem] font-black text-slate-900 mb-2 tracking-tight">
                    {perk.title}
                  </h3>
                  <p className="text-slate-500 text-[0.8rem] leading-relaxed font-medium">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
