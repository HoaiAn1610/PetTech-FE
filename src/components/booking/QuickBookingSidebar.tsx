import { useState, useEffect, useMemo } from "react";
import {
  Phone,
  PawPrint,
  Stethoscope,
  ChevronDown,
  Search,
  Clock,
  CalendarPlus,
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { petService } from "@/api/petService";
import { bookingService } from "@/api/bookingService";

const TIME_SLOTS = [
  "09:00 SA", "09:30 SA", "10:00 SA", "10:30 SA",
  "11:00 SA", "11:30 SA", "02:00 CH", "02:30 CH",
  "03:00 CH", "03:30 CH", "04:00 CH", "04:30 CH",
];

const mapTimeSlotToTimeSpan = (slot: string): string => {
  const parts = slot.split(" ");
  const time = parts[0];
  const period = parts[1];
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  if (period === "CH" && hours < 12) {
    hours += 12;
  } else if (period === "SA" && hours === 12) {
    hours = 0;
  }
  const formattedHours = hours.toString().padStart(2, "0");
  return `${formattedHours}:${minutesStr}:00`;
};

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; emoji: string; duration: string; color: string }[];
  placeholder: string;
}

function ServiceSelect({ value, onChange, options, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  const sel = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        style={{
          background: open ? "white" : "#f8fafc",
          border: `1.5px solid ${open ? "var(--primary-theme-color, #2563EB)" : "rgba(0,0,0,0.1)"}`,
          boxShadow: open ? "0 0 0 3px color-mix(in srgb, var(--primary-theme-color, #2563EB) 12%, transparent)" : "none",
        }}
      >
        {sel ? (
          <>
            <span style={{ fontSize: "1.1rem" }}>{sel.emoji}</span>
            <span className="flex-1 text-left" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
              {sel.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: `${sel.color}15`, fontSize: "0.68rem", fontWeight: 700, color: sel.color }}
            >
              {sel.duration}
            </span>
          </>
        ) : (
          <span className="flex-1 text-left" style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{placeholder}</span>
        )}
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200 flex-shrink-0"
          style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 rounded-xl z-30 overflow-hidden py-1"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.09)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-primary/5 text-left"
              style={{ background: opt.value === value ? "color-mix(in srgb, var(--primary-theme-color, #2563EB) 5%, transparent)" : "transparent" }}
            >
              <span style={{ fontSize: "1rem" }}>{opt.emoji}</span>
              <span className="flex-1 text-left" style={{ fontSize: "0.83rem", fontWeight: opt.value === value ? 600 : 400, color: opt.value === value ? "var(--primary-theme-color, #2563EB)" : "#374151" }}>
                {opt.label}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{opt.duration}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuickBookingSidebar({ onTriggerAlert }: { onTriggerAlert: () => void }) {
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [service, setService] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 SA");
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Load initial data
  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      try {
        // Load pets
        const petRes = await petService.getPets({ PageSize: 1000 });
        let parsedPets: any[] = [];
        const pRes = petRes as any;
        if (pRes) {
          if (Array.isArray(pRes)) parsedPets = pRes;
          else if (Array.isArray(pRes.items)) parsedPets = pRes.items;
          else if (pRes.value && Array.isArray(pRes.value.items)) parsedPets = pRes.value.items;
          else if (pRes.data && Array.isArray(pRes.data.items)) parsedPets = pRes.data.items;
          else if (pRes.value && Array.isArray(pRes.value)) parsedPets = pRes.value;
          else if (pRes.data && Array.isArray(pRes.data)) parsedPets = pRes.data;
        }
        setPets(parsedPets);

        // Load services
        try {
          const svcRes = await bookingService.getServices();
          let parsedSvcs: any[] = [];
          const sRes = svcRes as any;
          if (sRes) {
            if (Array.isArray(sRes)) parsedSvcs = sRes;
            else if (Array.isArray(sRes.items)) parsedSvcs = sRes.items;
            else if (sRes.value && Array.isArray(sRes.value.items)) parsedSvcs = sRes.value.items;
            else if (sRes.data && Array.isArray(sRes.data.items)) parsedSvcs = sRes.data.items;
            else if (sRes.value && Array.isArray(sRes.value)) parsedSvcs = sRes.value;
            else if (sRes.data && Array.isArray(sRes.data)) parsedSvcs = sRes.data;
          }
          setServices(parsedSvcs);
        } catch (e) {
          console.error("Failed to load services, falling back to mock services:", e);
        }

        // Load staff
        try {
          const staffRes = await bookingService.getStaff();
          let parsedStaff: any[] = [];
          const stRes = staffRes as any;
          if (stRes) {
            if (Array.isArray(stRes)) parsedStaff = stRes;
            else if (Array.isArray(stRes.items)) parsedStaff = stRes.items;
            else if (stRes.value && Array.isArray(stRes.value.items)) parsedStaff = stRes.value.items;
            else if (stRes.data && Array.isArray(stRes.data.items)) parsedStaff = stRes.data.items;
            else if (stRes.value && Array.isArray(stRes.value)) parsedStaff = stRes.value;
            else if (stRes.data && Array.isArray(stRes.data)) parsedStaff = stRes.data;
          }
          setStaffList(parsedStaff);
        } catch (e) {
          console.error("Failed to load staff, falling back to mock staff:", e);
        }
      } catch (err) {
        console.error("Failed to load initial data in QuickBookingSidebar:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFormData();
  }, []);

  // Map to structured display arrays (handling fallbacks if DB is fresh/empty)
  const finalServices = useMemo(() => {
    if (services.length > 0) {
      return services.map(s => ({
        value: s.id,
        label: s.name,
        emoji: s.name?.toLowerCase().includes("tắm") || s.name?.toLowerCase().includes("grooming") ? "✂️" :
               s.name?.toLowerCase().includes("khám") || s.name?.toLowerCase().includes("checkup") ? "🩺" :
               s.name?.toLowerCase().includes("tiêm") || s.name?.toLowerCase().includes("vaccine") ? "💉" :
               s.name?.toLowerCase().includes("răng") || s.name?.toLowerCase().includes("dental") ? "🦷" : "🐾",
        duration: s.durationMinutes ? `${s.durationMinutes} phút` : "30 phút",
        color: "var(--primary-theme-color, #2563EB)"
      }));
    }
    return [
      { value: "mock-grooming",    label: "Tắm chải (Mẫu)",            emoji: "✂️",  duration: "60 phút", color: "#7c3aed" },
      { value: "mock-checkup",     label: "Khám tổng quát (Mẫu)",       emoji: "🩺",  duration: "30 phút", color: "var(--primary-theme-color, #2563EB)" },
      { value: "mock-vaccination", label: "Tiêm vaccine (Mẫu)",         emoji: "💉",  duration: "15 phút", color: "#16a34a" },
      { value: "mock-dental",      label: "Vệ sinh răng miệng (Mẫu)",   emoji: "🦷",  duration: "45 phút", color: "#0891b2" },
    ];
  }, [services]);

  const finalStaff = useMemo(() => {
    if (staffList.length > 0) {
      return staffList;
    }
    return [
      { id: "mock-st1", fullName: "BS. Nguyễn Thị Lan (Mẫu)" },
      { id: "mock-st2", fullName: "BS. Trần Văn Minh (Mẫu)" },
      { id: "mock-st3", fullName: "BS. Phạm Thu Linh (Mẫu)" }
    ];
  }, [staffList]);

  // Set default service
  useEffect(() => {
    if (finalServices.length > 0 && !service) {
      setService(finalServices[0].value);
    }
  }, [finalServices, service]);

  // Set default staff
  useEffect(() => {
    if (finalStaff.length > 0 && !assignedStaffId) {
      setAssignedStaffId(finalStaff[0].id);
    }
  }, [finalStaff, assignedStaffId]);

  const finalRecentPets = useMemo(() => {
    if (pets.length > 0) {
      return pets.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        pet: p.breed || p.species || "Chưa rõ giống",
        owner: p.ownerName || "Chủ vãng lai",
        flag: p.conditions && p.conditions.length > 0 ? "allergy" : null
      }));
    }
    return [
      { id: "mock-pet1", name: "Bella", pet: "Golden Retriever", owner: "Nguyễn Anh Tuấn", flag: "allergy" },
      { id: "mock-pet2", name: "Max",   pet: "Chó Berger",       owner: "Trần Đức Minh",   flag: null },
      { id: "mock-pet3", name: "Luna",  pet: "Mèo Xiêm",        owner: "Lê Thị Lan",      flag: null },
    ];
  }, [pets]);

  const selectedService = finalServices.find((s) => s.value === service);
  const selectedStaff = finalStaff.find((s) => s.id === assignedStaffId);
  const hasAllergyFlag = selectedPet ? (selectedPet.conditions && selectedPet.conditions.length > 0) : (selectedPetId === "mock-pet1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPetId) {
      alert("Vui lòng chọn thú cưng trước khi đặt lịch!");
      return;
    }

    if (hasAllergyFlag) {
      onTriggerAlert();
    }

    const chosenService = finalServices.find(s => s.value === service);
    if (!chosenService) {
      alert("Vui lòng chọn dịch vụ!");
      return;
    }

    // Map time slot to TimeSpan format
    const startTimeSpan = mapTimeSlotToTimeSpan(timeSlot);

    // Format bookingDate into DateTime ISO string
    const formattedBookingDate = new Date(`${bookingDate}T00:00:00Z`).toISOString();

    const payload = {
      petId: selectedPetId.startsWith("mock") ? "00000000-0000-0000-0000-000000000000" : selectedPetId,
      ownerId: (selectedPet && selectedPet.ownerId) || "00000000-0000-0000-0000-000000000000",
      serviceId: chosenService.value.startsWith("mock") ? "00000000-0000-0000-0000-000000000000" : chosenService.value,
      assignedStaffId: !assignedStaffId || assignedStaffId.startsWith("mock") ? null : assignedStaffId,
      bookingDate: formattedBookingDate,
      startTime: startTimeSpan,
      notes: notes || "Đặt lịch hẹn khám nhanh qua Dashboard Staff"
    };

    console.log("Submitting CreateBookingRequest to POST /api/shop/bookings:", payload);

    // If using mock values (for empty DB demo safety), trigger success locally
    if (payload.petId === "00000000-0000-0000-0000-000000000000") {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
      return;
    }

    try {
      const response = await bookingService.createBooking(payload);
      const res = response as any;
      if (response && res.isSuccess !== false) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        alert(`Đã đặt lịch hẹn thành công cho bé ${selectedPet?.name}!`);
      } else {
        alert(res.message || "Không thể đặt lịch. Vui lòng liên hệ quản trị viên!");
      }
    } catch (err) {
      console.error("Failed to create booking:", err);
      alert("Đã xảy ra lỗi kết nối với máy chủ khi gửi lịch hẹn!");
    }
  };

  const handleSelectRecent = (item: any) => {
    setSelectedPetId(item.id);
    if (item.id.startsWith("mock")) {
      setSelectedPet({ name: item.name, ownerName: item.owner, ownerId: "mock-owner" });
    } else {
      const found = pets.find(p => p.id === item.id);
      if (found) {
        setSelectedPet(found);
      }
    }
  };

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto flex-shrink-0"
      style={{
        width: "300px",
        background: "white",
        borderRight: "1.5px solid rgba(0,0,0,0.08)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(0,0,0,0.07)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-theme-color, #2563EB) 6%, transparent) 0%, color-mix(in srgb, var(--primary-theme-color, #2563EB) 2%, transparent) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary-theme-color, #2563EB)" }}
          >
            <CalendarPlus className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 800 }}>
            Đặt lịch nhanh
          </h2>
        </div>
        <p style={{ fontSize: "0.73rem", color: "#6b7280" }}>
          Đặt lịch hẹn mới trong vài giây
        </p>
      </div>

      {/* Recent patients */}
      <div className="px-5 pt-4 pb-2">
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "8px" }}>
          BỆNH NHÂN GẦN ĐÂY
        </p>
        <div className="flex flex-col gap-1.5">
          {finalRecentPets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectRecent(p)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors hover:bg-primary/5 text-left group"
              style={{
                border: `1.5px solid ${selectedPetId === p.id ? "var(--primary-theme-color, #2563EB)" : "rgba(0,0,0,0.06)"}`,
                background: selectedPetId === p.id ? "color-mix(in srgb, var(--primary-theme-color, #2563EB) 5%, transparent)" : "#fafafa",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ background: selectedPetId === p.id ? "var(--primary-theme-color, #2563EB)" : "#e5e7eb", fontSize: "0.85rem", fontWeight: 700, color: selectedPetId === p.id ? "white" : "#9ca3af" }}
              >
                {p.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>{p.name}</span>
                  {p.flag === "allergy" && (
                    <span
                      className="px-1.5 py-0.5 rounded-md flex items-center gap-1"
                      style={{ background: "rgba(220,38,38,0.1)", fontSize: "0.6rem", fontWeight: 700, color: "#dc2626" }}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      DỊ ỨNG
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "0.7rem", color: "#9ca3af" }} className="truncate block">{p.pet} · {p.owner}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 my-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 pb-5 flex flex-col gap-4 flex-1">
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em" }}>
          CHI TIẾT ĐẶT LỊCH
        </p>

        {/* Selected Pet */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Chọn bệnh nhân (Thú cưng)
          </label>
          <div className="relative">
            <PawPrint
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
              style={{ color: "#9ca3af" }}
            />
            <select
              value={selectedPetId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedPetId(id);
                if (id.startsWith("mock-")) {
                  const item = finalRecentPets.find(p => p.id === id);
                  if (item) setSelectedPet({ name: item.name, ownerName: item.owner, ownerId: "mock-owner" });
                } else {
                  const found = pets.find(p => p.id === id);
                  if (found) {
                    setSelectedPet(found);
                  }
                }
              }}
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none appearance-none cursor-pointer"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
              }}
            >
              <option value="">-- Chọn bệnh nhân --</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Chủ: {p.ownerName || "Vãng lai"})
                </option>
              ))}
              {pets.length === 0 && finalRecentPets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Chủ: {p.owner})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9ca3af" }} />
          </div>
        </div>

        {/* Display Owner Name */}
        {selectedPet && (
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600 }}>Chủ sở hữu:</span>
            <span style={{ fontSize: "0.8rem", color: "#1f2937", fontWeight: 700 }} className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {selectedPet.ownerName || selectedPet.owner}
            </span>
          </div>
        )}

        {/* Allergy Warning */}
        {hasAllergyFlag && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse"
            style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#dc2626" }} />
            <span style={{ fontSize: "0.71rem", fontWeight: 600, color: "#b91c1c" }}>
              ⚠ Phát hiện cảnh báo dị ứng hoặc tiền sử đặc biệt trong hồ sơ!
            </span>
          </div>
        )}

        {/* Booking Date */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Ngày đặt lịch
          </label>
          <div className="relative">
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* Service */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Dịch vụ
          </label>
          <ServiceSelect
            value={service}
            onChange={setService}
            options={finalServices}
            placeholder="Chọn dịch vụ…"
          />
        </div>

        {/* Time slot */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Khung giờ
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
              style={{ color: "#9ca3af" }}
            />
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none appearance-none cursor-pointer"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
              }}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#9ca3af" }}
            />
          </div>
        </div>

        {/* Assigned vet */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Nhân viên / Bác sĩ phụ trách
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
              style={{ color: "#9ca3af" }}
            />
            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none appearance-none cursor-pointer"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
              }}
            >
              {finalStaff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName || s.name || "Bác sĩ thú y"}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9ca3af" }} />
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Ghi chú triệu chứng <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tùy chọn)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="VD: Triệu chứng mệt mỏi, bỏ ăn hoặc cần đặt lịch cụ thể…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl outline-none resize-none"
            style={{
              background: "#f8fafc",
              border: "1.5px solid rgba(0,0,0,0.09)",
              fontSize: "0.83rem",
              color: "#111827",
            }}
          />
        </div>

        {/* Summary */}
        {selectedService && (
          <div
            className="rounded-xl p-3.5 flex flex-col gap-1"
            style={{ background: selectedService ? `${selectedService.color}0d` : "#f9fafb", border: `1px solid ${selectedService ? selectedService.color + "30" : "rgba(0,0,0,0.06)"}` }}
          >
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em" }}>TÓM TẮT LỊCH HẸN</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
              {selectedService?.emoji} {selectedService?.label} — {timeSlot}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {selectedPet?.name || "Bệnh nhân"} · {selectedService?.duration} · {selectedStaff?.fullName || "Bác sĩ thú y"}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mt-auto"
          style={{
            background: submitted
              ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
              : "linear-gradient(135deg, var(--primary-theme-color, #2563EB) 0%, color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, black) 100%)",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 700,
            boxShadow: submitted
              ? "0 6px 20px rgba(22,163,74,0.4)"
              : "0 6px 20px color-mix(in srgb, var(--primary-theme-color, #2563EB) 35%, transparent)",
            transition: "all 0.3s",
          }}
        >
          {submitted ? (
            <>
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              Đã đặt lịch!
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              Xác nhận đặt lịch
            </>
          )}
        </button>
      </form>
    </aside>
  );
}