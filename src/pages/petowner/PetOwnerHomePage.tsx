import { Link, useNavigate } from "react-router";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import { useTenant, useServices } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { usePortalDashboard, useCurrentUser } from "@/hooks/petowner/usePortal";
import { useMyPets } from "@/hooks/petowner/useMyPets";
import { useMyLoyaltyAccount } from "@/hooks/petowner/useLoyalty";
import { useShopProducts } from "@/hooks/petowner/useShopProducts";
import {
  CalendarDays, ShoppingBag, PawPrint, ClipboardList,
  Stethoscope, Scissors, Syringe, Star,
  AlertCircle, ChevronRight,
  ArrowRight, Wallet
} from "lucide-react";
import {
  HomeStatsCard, UpcomingApptCard, HomeActivityList
} from "@/features/petowner/home/HomeComponents";

interface VaccineAlert {
  petName: string;
  vaccineName: string;
  dueDateStr: string;
  reason: string;
}

// Smart client-side helper to compute vaccine alerts based on age & conditions
function computeVaccineAlert(pets: any[]): VaccineAlert | null {
  if (!pets || pets.length === 0) return null;

  for (const pet of pets) {
    if (!pet.dob) continue;

    const dobDate = new Date(pet.dob);
    const ageInMonths = (new Date().getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

    const speciesLower = pet.species?.toLowerCase() || "";
    const isDog = speciesLower.includes("dog") || speciesLower.includes("chó");
    const isCat = speciesLower.includes("cat") || speciesLower.includes("mèo");

    // Skip if already fully vaccinated
    const isVaccinated = pet.conditions?.some((c: string) => 
      c.toLowerCase().includes("vaccine") || 
      c.toLowerCase().includes("tiêm phòng") || 
      c.toLowerCase().includes("đầy đủ")
    );

    if (isVaccinated) continue;

    // Puppy/Kitten Core Vaccine Alert
    if (ageInMonths < 4) {
      const vaccineName = isDog ? "DHPP (Mũi 1/2)" : isCat ? "FVRCP (Mũi 1/2)" : "Core Vaccine";
      const dueDate = new Date(dobDate.getTime() + 1000 * 60 * 60 * 24 * 7 * 8); // 8 weeks
      const dueDateStr = dueDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
      
      return {
        petName: pet.name,
        vaccineName,
        dueDateStr,
        reason: `${pet.name} đang ở độ tuổi nhỏ (${Math.round(ageInMonths * 4.3)} tuần tuổi), cần tiêm phòng mũi đầu tiên để xây dựng hệ miễn dịch.`
      };
    }

    // Adult boosters: if age > 12 months (1 year) and no recorded complete vaccination
    if (ageInMonths >= 12) {
      const vaccineName = isDog ? "Dại & DHPP Nhắc Lại" : isCat ? "Dại & FVRCP Nhắc Lại" : "Vaccine Nhắc Lại";
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now
      const dueDateStr = dueDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });

      return {
        petName: pet.name,
        vaccineName,
        dueDateStr,
        reason: `${pet.name} đã được ${Math.floor(ageInMonths / 12)} tuổi và đến hạn tiêm nhắc lại vaccine định kỳ hàng năm.`
      };
    }
  }

  return null;
}

// WalletStatsCard component matching premium aesthetic
export function WalletStatsCard({ balance }: { balance: number }) {
  return (
    <Link to="/petowner/loyalty" className="block group">
      <div
        className="rounded-[2rem] px-8 py-8 flex flex-col gap-6 h-full transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", boxShadow: "0 15px 35px rgba(13,148,136,0.3)" }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
        <div className="flex items-center justify-between relative z-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
            <span style={{ fontSize: "0.7rem", fontWeight: 900, color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ví của tôi</span>
          </div>
        </div>
        <div className="relative z-10">
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 800, letterSpacing: "0.05em" }}>SỐ DƯ VÍ</p>
          <div className="flex items-baseline gap-2">
            <p style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>
              {balance.toLocaleString("vi-VN")}
            </p>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>₫</p>
          </div>
        </div>
        <div className="relative z-10 mt-auto flex items-center justify-between">
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
            Nạp thêm tiền vào ví 💳
          </p>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

const QUICK_ACTIONS = [
  { icon: CalendarDays, label: "Đặt lịch hẹn",      sub: "Đặt lịch khám thú y",      href: "/petowner/booking", color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
  { icon: ShoppingBag,  label: "Mua sắm",          sub: "Cửa hàng sản phẩm cao cấp", href: "/petowner/shop",    color: "#F97316", bg: "rgba(249,115,22,0.08)" },
  { icon: PawPrint,     label: "Thú cưng của tôi",   sub: "Quản lý hồ sơ & sức khỏe", href: "/petowner/pets",    color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  { icon: ClipboardList,label: "Lịch sử khám",       sub: "Lần khám & đơn hàng trước", href: "/petowner/history", color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
];

export default function PetOwnerHomePage() {
  const navigate = useNavigate();
  const { user }     = useAuth();
  const { settings } = useTenant();

  const { data: me }             = useCurrentUser();
  const { data: dashboard, isLoading: dashboardLoading }      = usePortalDashboard();
  const { data: apiPets, isLoading: petsLoading }        = useMyPets();
  const { data: loyaltyAccount } = useMyLoyaltyAccount();
  const { data: featuredPages }  = useShopProducts({ SortBy: "rating", IsDescending: true, PageSize: 4 });
  const { services, loading: servicesLoading } = useServices();

  // Extract Stats & Wallet
  const walletBalance = (dashboard as any)?.walletBalance ?? 0;
  const loyaltyPoints = (dashboard as any)?.loyaltyPoints ?? (loyaltyAccount as any)?.points ?? 0;
  const petCount = apiPets?.length ?? (dashboard as any)?.totalPets ?? 0;
  const visitCount = (dashboard as any)?.totalVisits ?? (dashboard as any)?.visitCount ?? 0;
  const savedAmount = (dashboard as any)?.totalSaved ?? "";

  // Dynamic Service Listing from backend
  const displayedServices = (services || []).slice(0, 4).map((s: any) => {
    const isGrooming = s.name?.toLowerCase().includes("groom") || s.name?.toLowerCase().includes("tỉa");
    const isVaccine = s.name?.toLowerCase().includes("tiêm") || s.name?.toLowerCase().includes("vaccine");
    const isShop = s.name?.toLowerCase().includes("shop") || s.name?.toLowerCase().includes("hàng");
    
    return {
      icon: isGrooming ? Scissors : isVaccine ? Syringe : isShop ? ShoppingBag : Stethoscope,
      label: s.name || "Dịch vụ",
      sub: s.price ? `Từ ${s.price.toLocaleString("vi-VN")} ₫` : "Duyệt ngay",
      color: isGrooming ? "#7c3aed" : isVaccine ? "#16a34a" : isShop ? "#F97316" : "#2563EB",
      bg: isGrooming ? "rgba(124,58,237,0.08)" : isVaccine ? "rgba(22,163,74,0.08)" : isShop ? "rgba(249,115,22,0.08)" : "rgba(37,99,235,0.08)",
    };
  });

  // Featured products from API
  const featuredProducts = (() => {
    const pages = featuredPages?.pages ?? [];
    const items = pages.flatMap((p: any) => p?.items ?? []);
    return items.slice(0, 4).map((p: any) => ({
      name:   p.name ?? "",
      price:  p.price ?? 0,
      rating: p.rating ?? 0,
      badge:  p.badge ?? null,
      emoji:  p.emoji ?? "📦"
    }));
  })();

  // Map upcoming bookings
  const upcomingBookings: any[] = (dashboard as any)?.upcomingBookings ?? (dashboard as any)?.upcomingAppointments ?? [];
  const mappedBookings = upcomingBookings.map((b: any) => {
    const bDate = b.bookingDate || b.date || b.startTime;
    return {
      id: b.id || b.bookingId || Math.random().toString(),
      date: bDate ? new Date(bDate).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" }) : "N/A",
      time: b.startTime?.slice(0, 5) || b.time || "N/A",
      service: b.serviceName || b.service || "Khám bệnh",
      pet: b.petName || b.pet || "Thú cưng",
      vet: b.staffName || b.vet || "Bác sĩ thú y",
      type: b.serviceType ?? "Dịch vụ",
    };
  });

  const recentActivities: any[] = (dashboard as any)?.recentActivities ?? (dashboard as any)?.activities ?? [
    { id: "a1", icon: "🩺", title: "Khám định kỳ", sub: "Mọi chỉ số đều tuyệt vời", date: "Gần đây", type: "visit" },
    { id: "a2", icon: "📦", title: "Đơn hàng tại shop", sub: "Giao dịch thành công", date: "Vừa qua", type: "purchase" }
  ];

  const vaccineAlert = computeVaccineAlert(apiPets || []);

  const filteredQuickActions = QUICK_ACTIONS.filter(a => {
    if (a.href === "/petowner/booking" && settings.acceptOnlineBookings === false) {
      return false;
    }
    return true;
  });

  // Premium UI Skeleton Loader
  if (dashboardLoading || petsLoading || servicesLoading) {
    return (
      <PetOwnerShell pageTitle="Bảng điều khiển" cartCount={2}>
        <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-pulse" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* Welcome + Stats Row Skeleton */}
          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="col-span-2 rounded-[2.5rem] bg-gray-200/60 h-[220px]" />
            <div className="rounded-[2rem] bg-gray-200/60 h-[220px]" />
          </div>

          {/* Quick Actions Skeleton */}
          <div>
            <div className="h-4 bg-gray-200/60 w-32 rounded mb-4" />
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-[2rem] bg-gray-200/60 h-[160px]" />
              ))}
            </div>
          </div>
        </div>
      </PetOwnerShell>
    );
  }

  return (
    <PetOwnerShell pageTitle="Bảng điều khiển" cartCount={2}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* ── Welcome + Stats Row ── */}
        <div className="grid gap-6 animate-in fade-in duration-500" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          {/* Welcome card */}
          <div
            className="col-span-2 rounded-[2.5rem] px-10 py-10 flex flex-col justify-between relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)", minHeight: "220px", boxShadow: "0 20px 50px rgba(37,99,235,0.2)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                {me?.avatarUrl ? (
                  <img src={me.avatarUrl} alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/40" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-black text-white">
                    {(me?.displayName ?? user?.name ?? "?")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", fontWeight: 800, letterSpacing: "0.1em" }}>XIN CHÀO 👋</p>
                  {me?.memberSince && (
                    <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                      Thành viên từ {new Date(me.memberSince).toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>
                {me?.displayName ?? user?.name ?? "Chào bạn"}
              </h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", marginTop: "6px", fontWeight: 500 }}>
                {me?.email ?? user?.email ?? ""}
                {me?.phone ? ` · ${me.phone}` : ""}
              </p>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", marginTop: "4px" }}>
                Bạn có {petCount} thú cưng đang được chăm sóc tuyệt vời tại PetTech.
              </p>
            </div>
            <div className="flex items-center gap-10 relative z-10">
              {[
                { label: "Lượt khám",    value: String(visitCount) },
                { label: "Thú cưng",     value: String(petCount)   },
                { label: "Đã tiết kiệm", value: savedAmount || "0 ₫"  },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>{s.value}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Loyalty Card only */}
          <HomeStatsCard points={loyaltyPoints} tierName={(loyaltyAccount as any)?.currentTier?.name} />
        </div>

        {/* ── Upcoming Bookings Section ── */}
        {mappedBookings.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <p style={{ fontSize: "0.75rem", fontWeight: 900, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
              Lịch hẹn sắp tới
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mappedBookings.map((appt) => (
                <UpcomingApptCard key={appt.id} appt={appt} />
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: 900, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Lối tắt nhanh</p>
          <div className="grid grid-cols-4 gap-6">
            {filteredQuickActions.map(a => {
              const Icon = a.icon;
              return (
                <Link key={a.label} to={a.href} style={{ textDecoration: "none" }}>
                  <div className="rounded-[2rem] p-6 flex flex-col gap-4 cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-white border border-gray-100 group shadow-sm">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-inner" style={{ background: a.bg }}>
                      <Icon className="w-7 h-7" style={{ color: a.color }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>{a.label}</h4>
                      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px", fontWeight: 500, lineHeight: 1.4 }}>{a.sub}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-auto text-blue-600 font-black text-[0.7rem] uppercase tracking-widest group-hover:translate-x-2 transition-transform" style={{ color: a.color }}>
                      <span>Mở ngay</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={3} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Row: Activity + Services + Products ── */}
        <div className="grid gap-8" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>

          <HomeActivityList activities={recentActivities} />

          {/* Our Services (Loaded dynamically from tenant context) */}
          <div className="rounded-[2rem] bg-white overflow-hidden border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 flex-shrink-0">
              <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Dịch vụ chuyên sâu</h4>
              <button onClick={() => navigate("/petowner/booking")} className="text-[0.75rem] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Khám phá →</button>
            </div>
            <div className="px-8 py-6 flex flex-col gap-4 flex-1 justify-start">
              {displayedServices.length > 0 ? (
                displayedServices.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="flex items-center gap-5 px-5 py-4 rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all border border-transparent hover:border-gray-100"
                      style={{ background: s.bg }}>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                        <Icon className="w-5.5 h-5.5" style={{ color: s.color }} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b" }}>{s.label}</p>
                        <p style={{ fontSize: "0.75rem", color: s.color, fontWeight: 700 }}>{s.sub}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: s.color }} />
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs font-semibold">
                  Chưa có dịch vụ nào
                </div>
              )}
            </div>
          </div>

          {/* Featured Products */}
          <div className="rounded-[2rem] bg-white overflow-hidden border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 flex-shrink-0">
              <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Sản phẩm nổi bật</h4>
              <button onClick={() => navigate("/petowner/shop")} className="text-[0.75rem] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Cửa hàng →</button>
            </div>
            <div className="px-8 py-6 flex flex-col gap-5 flex-1 justify-between">
              <div className="flex flex-col gap-5">
                {featuredProducts.slice(0, 4).map((p, idx) => (
                  <div key={idx} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50 group-hover:scale-110 transition-transform shadow-inner">
                      {p.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b" }}>{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569" }}>{p.rating}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize: "1rem", fontWeight: 900, color: "#1e293b" }}>
                        {p.price.toLocaleString("vi-VN")} ₫
                      </p>
                      {p.badge && (
                        <span className="text-[0.6rem] font-black text-orange-500 uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/petowner/shop")}
                className="w-full py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100 mt-4"
                style={{ background: "linear-gradient(135deg,#F97316,#ea580c)", color: "white", fontSize: "0.9rem", fontWeight: 900 }}>
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>

      </div>
    </PetOwnerShell>
  );
}
