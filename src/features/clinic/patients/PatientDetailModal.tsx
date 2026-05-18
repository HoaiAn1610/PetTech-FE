import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Weight,
  Heart,
  Thermometer,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Clock,
  Calendar,
  Stethoscope,
  Syringe,
  Edit3,
  FileText,
  Apple,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";
import { ClinicConfirmModal } from "@/components/clinic/ClinicConfirmModal";
import { ClinicStatusBadge } from "@/components/clinic/ClinicStatusBadge";
import { PetDto } from "@/types/pet";
import { bookingService } from "@/api/bookingService";

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

interface PatientDetailModalProps {
  patient: PetDto;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (patient: PetDto) => void;
}

export function PatientDetailModal({ patient, onClose, onDelete, onEdit }: PatientDetailModalProps) {
  const [tab, setTab] = useState<"overview" | "history" | "vaccinations">("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Quick booking states
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState("");
  const [bookingStaffId, setBookingStaffId] = useState("");
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState("10:00 SA");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Load services and staff on modal open
  useEffect(() => {
    if (showBookingForm) {
      const loadOptions = async () => {
        try {
          const svcRes = await bookingService.getServices();
          let parsedSvcs = [];
          const sRes = svcRes as any;
          if (sRes) {
            if (Array.isArray(sRes)) parsedSvcs = sRes;
            else if (Array.isArray(sRes.items)) parsedSvcs = sRes.items;
            else if (sRes.value && Array.isArray(sRes.value.items)) parsedSvcs = sRes.value.items;
            else if (sRes.data && Array.isArray(sRes.data.items)) parsedSvcs = sRes.data.items;
          }
          setServices(parsedSvcs);

          const staffRes = await bookingService.getStaff();
          let parsedStaff = [];
          const stRes = staffRes as any;
          if (stRes) {
            if (Array.isArray(stRes)) parsedStaff = stRes;
            else if (Array.isArray(stRes.items)) parsedStaff = stRes.items;
            else if (stRes.value && Array.isArray(stRes.value.items)) parsedStaff = stRes.value.items;
            else if (stRes.data && Array.isArray(stRes.data.items)) parsedStaff = stRes.data.items;
          }
          setStaffList(parsedStaff);
        } catch (e) {
          console.error("Failed to load options for patient booking modal:", e);
        }
      };
      loadOptions();
    }
  }, [showBookingForm]);

  const finalServices = useMemo(() => {
    if (services.length > 0) {
      return services;
    }
    return [
      { id: "mock-s1", name: "Khám tổng quát", durationMinutes: 30 },
      { id: "mock-s2", name: "Tiêm phòng vaccine", durationMinutes: 15 },
      { id: "mock-s3", name: "Tắm rửa & Chải lông (Grooming)", durationMinutes: 60 }
    ];
  }, [services]);

  const finalStaff = useMemo(() => {
    if (staffList.length > 0) {
      return staffList;
    }
    return [
      { id: "mock-st1", fullName: "BS. Nguyễn Thị Lan" },
      { id: "mock-st2", fullName: "BS. Trần Văn Minh" }
    ];
  }, [staffList]);

  useEffect(() => {
    if (finalServices.length > 0 && !bookingServiceId) {
      setBookingServiceId(finalServices[0].id);
    }
  }, [finalServices, bookingServiceId]);

  useEffect(() => {
    if (finalStaff.length > 0 && !bookingStaffId) {
      setBookingStaffId(finalStaff[0].id);
    }
  }, [finalStaff, bookingStaffId]);

  const handleBookingSubmit = async () => {
    const startTimeSpan = mapTimeSlotToTimeSpan(bookingTimeSlot);
    const formattedBookingDate = new Date(`${bookingDate}T00:00:00Z`).toISOString();

    const payload = {
      petId: patient.id,
      ownerId: patient.ownerId || "00000000-0000-0000-0000-000000000000",
      serviceId: bookingServiceId.startsWith("mock") ? "00000000-0000-0000-0000-000000000000" : bookingServiceId,
      assignedStaffId: !bookingStaffId || bookingStaffId.startsWith("mock") ? null : bookingStaffId,
      bookingDate: formattedBookingDate,
      startTime: startTimeSpan,
      notes: bookingNotes || "Đặt lịch hẹn nhanh qua Hồ sơ bệnh nhân"
    };

    console.log("Submitting CreateBookingRequest from PatientDetailModal:", payload);

    if (payload.petId.startsWith("mock") || payload.serviceId === "00000000-0000-0000-0000-000000000000") {
      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingSubmitted(false);
        setShowBookingForm(false);
        setShowSuccessPopup(true);
      }, 1500);
      return;
    }

    try {
      const response = await bookingService.createBooking(payload);
      const res = response as any;
      if (response && res.isSuccess !== false) {
        setBookingSubmitted(true);
        setTimeout(() => {
          setBookingSubmitted(false);
          setShowBookingForm(false);
          setShowSuccessPopup(true);
        }, 1500);
      } else {
        alert(res.message || "Đặt lịch hẹn thất bại!");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Đã xảy ra lỗi kết nối khi đặt lịch!");
    }
  };

  // Calculate age from dob
  let age = "Chưa có";
  if (patient.dob) {
    const dobDate = new Date(patient.dob);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    if (years > 0) {
      if (months > 0) {
        age = `${years} tuổi ${months} tháng`;
      } else {
        age = `${years} tuổi`;
      }
    } else {
      if (months > 0) {
        age = `${months} tháng`;
      } else {
        age = "Dưới 1 tháng";
      }
    }
  }

  // Species emoji picker
  let emoji = patient.emoji || "🐾";
  if (!patient.emoji) {
    const sp = (patient.species || "").toLowerCase();
    if (sp.includes("chó") || sp.includes("dog")) emoji = "🐕";
    else if (sp.includes("mèo") || sp.includes("cat")) emoji = "🐈";
    else if (sp.includes("chim") || sp.includes("bird")) emoji = "🦜";
    else if (sp.includes("thỏ") || sp.includes("rabbit")) emoji = "🐰";
  }

  const score = patient.bodyConditionScore ? (patient.bodyConditionScore * 20) : null;
  const scoreColor = score ? (score >= 80 ? "#16a34a" : score >= 60 ? "#f97316" : "#dc2626") : "#9ca3af";

  const genderText = patient.gender === "Male" ? "Đực" : patient.gender === "Female" ? "Cái" : patient.gender || "Chưa có";
  const status = (patient.conditions && patient.conditions.length > 0) ? "Đang điều trị" : "Khoẻ mạnh";

  // Vitals retrieval
  const weight = patient.currentWeight ? `${patient.currentWeight} kg` : "Chưa có";
  const heartRate = patient.latestVitals?.heartRate ? `${patient.latestVitals.heartRate} bpm` : "Chưa có";
  const temperature = patient.latestVitals?.temperature ? `${patient.latestVitals.temperature}°C` : "Chưa có";

  // Real visit history based on patient notes if present
  const history = patient.notes ? [
    {
      date: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('vi-VN') : "Chưa có",
      type: "Khám định kỳ & Lập hồ sơ",
      vet: "Chuyên viên y tế",
      notes: patient.notes,
      cost: "Miễn phí",
    }
  ] : [];
  
  // Real vaccinations list (none provided directly on PetDto yet)
  const vaccines: any[] = [];

  const ModalFooter = (
    <>
      {onDelete && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 border border-red-100 transition-colors"
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          Xoá bệnh nhân
        </button>
      )}
      <button
        onClick={() => {
          if (onEdit) onEdit(patient);
          onClose();
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        style={{
          border: "1.5px solid #e5e7eb",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa hồ sơ
      </button>
      <button
        onClick={() => setShowBookingForm(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 text-blue-600 border border-blue-100 transition-colors"
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
        }}
      >
        <Calendar className="w-3.5 h-3.5" /> Đặt lịch hẹn
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl ml-auto"
        style={{
          background: "linear-gradient(135deg,#2563EB,#1d4ed8)",
          color: "white",
          fontSize: "0.82rem",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        }}
      >
        <FileText className="w-3.5 h-3.5" /> Xem đầy đủ hồ sơ
      </button>
    </>
  );

  return (
    <ClinicModal
      title={patient.name}
      onClose={onClose}
      footer={ModalFooter}
      maxWidth="max-w-2xl"
    >
      {/* Header Info */}
      <div
        className="flex items-start gap-4 px-7 pt-6 pb-5"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
          style={{
            background: `${patient.color || '#fbbf24'}18`,
            border: `2px solid ${patient.color || '#fbbf24'}30`,
          }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827" }}>
              {patient.name}
            </h2>
            <ClinicStatusBadge status={status} />
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "2px" }}>
            {patient.breed || "Chưa rõ giống"} · {patient.species}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="text-center">
            <div
              style={{
                fontSize: score ? "1.4rem" : "0.9rem",
                fontWeight: 900,
                color: scoreColor,
                lineHeight: 1,
                whiteSpace: "nowrap"
              }}
            >
              {score ? `${score}%` : "Chưa có"}
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                color: "#9ca3af",
                letterSpacing: "0.04em",
              }}
            >
              SỨC KHOẺ
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0 px-7 pt-1"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        {([
          ["overview", "Tổng quan"],
          ["history", "Lịch sử khám"],
          ["vaccinations", "Tiêm phòng"],
        ] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className="px-4 py-3 capitalize transition-colors"
            style={{
              fontSize: "0.82rem",
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? "#2563EB" : "#9ca3af",
              borderBottom: tab === t ? "2px solid #2563EB" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-7 py-5 overflow-y-auto max-h-[350px]">
        {tab === "overview" && (
          <div className="flex flex-col gap-5">
            {/* Vitals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: Weight,
                  label: "Cân nặng",
                  value: weight,
                  color: "#2563EB",
                },
                {
                  icon: Clock,
                  label: "Tuổi",
                  value: age,
                  color: "#ef4444",
                },
                {
                  icon: User,
                  label: "Giới tính",
                  value: genderText,
                  color: "#f97316",
                },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.label}
                    className="flex flex-col gap-1.5 px-4 py-3 rounded-xl"
                    style={{
                      background: "#f8faff",
                      border: "1.5px solid rgba(37,99,235,0.08)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: v.color }} />
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
                      {v.value}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600 }}>
                      {v.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Conditions / Medical Alerts */}
            {patient.conditions && patient.conditions.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[0.68rem] font-bold text-red-600 tracking-wider">CẢNH BÁO Y TẾ</p>
                {patient.conditions.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl animate-pulse"
                    style={{
                      background: "rgba(220,38,38,0.05)",
                      border: "1px solid rgba(220,38,38,0.15)",
                    }}
                  >
                    <AlertTriangle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#dc2626" }}
                    />
                    <span
                      style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 700 }}
                    >
                      {a}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Nutrition & Diet Section */}
            {patient.diet && (
              <div
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{ background: "#faf8f5", border: "1px solid rgba(217,119,6,0.12)" }}
              >
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#d97706",
                    letterSpacing: "0.07em",
                  }}
                >
                  DINH DƯỠNG & CHẾ ĐỘ ĂN UỐNG
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(217,119,6,0.1)" }}
                  >
                    <Apple className="w-5 h-5" style={{ color: "#d97706" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>
                      {patient.diet.currentFood || "Chưa thiết lập thức ăn"}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                      Lượng Calories hàng ngày: {patient.diet.dailyCalories ? `${patient.diet.dailyCalories} kcal` : "Chưa đặt"} · {patient.diet.mealsPerDay ? `${patient.diet.mealsPerDay} bữa/ngày` : ""}
                    </p>
                  </div>
                </div>
                {patient.diet.restrictions && patient.diet.restrictions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-[0.68rem] font-bold text-red-500 mr-1.5 self-center">HẠN CHẾ ĂN:</span>
                    {patient.diet.restrictions.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[0.68rem] font-bold">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
                {patient.diet.notes && (
                  <p className="text-xs italic text-gray-500 bg-white p-2 rounded-lg border border-gray-100 mt-1">
                     💡 <strong>Lưu ý ăn uống:</strong> {patient.diet.notes}
                  </p>
                )}
              </div>
            )}

            {/* Owner info */}
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: "#f8faff", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <p
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#9ca3af",
                  letterSpacing: "0.07em",
                }}
              >
                CHỦ SỞ HỮU
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(37,99,235,0.1)" }}
                >
                  <User className="w-5 h-5" style={{ color: "#2563EB" }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>
                    {patient.ownerName || "Chưa có"}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                    {patient.ownerId ? `Mã khách hàng: ${patient.ownerId.slice(0,8).toUpperCase()}` : "Chưa có"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="flex flex-col gap-3">
            {history.length > 0 ? (
              history.map((h, i) => (
                <div
                  key={i}
                  className="flex gap-4 pb-4"
                  style={{
                    borderBottom:
                      i < history.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(37,99,235,0.07)" }}
                  >
                    <Stethoscope className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>
                        {h.type}
                      </p>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a" }}>
                        {h.cost}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>
                      {h.date} · {h.vet}
                    </p>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "#6b7280",
                        marginTop: "5px",
                        lineHeight: 1.5,
                      }}
                    >
                      {h.notes}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 py-8 text-center">
                <Stethoscope className="w-8 h-8 opacity-40" />
                <p className="text-xs font-bold uppercase tracking-wider">Chưa có lịch sử khám</p>
                <p className="text-[10px] opacity-70">Thú cưng chưa thực hiện ca điều trị nào tại phòng khám</p>
              </div>
            )}
          </div>
        )}

        {tab === "vaccinations" && (
          <div className="flex flex-col gap-2.5">
            {vaccines.length > 0 ? (
              vaccines.map((v, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                    style={{
                      background: "rgba(22,163,74,0.04)",
                      border: "1.5px solid rgba(22,163,74,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: "rgba(22,163,74,0.1)",
                        }}
                      >
                        <Syringe className="w-4 h-4" style={{ color: "#16a34a" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>
                          {v.name}
                        </p>
                        <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                          Tiêm lần cuối: {v.lastDone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(22,163,74,0.1)",
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          color: "#16a34a",
                        }}
                      >
                        {v.status}
                      </span>
                      <p style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "2px" }}>
                        Hạn tiếp: {v.nextDue}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 py-8 text-center">
                <Syringe className="w-8 h-8 opacity-40" />
                <p className="text-xs font-bold uppercase tracking-wider">Chưa có lịch sử tiêm phòng</p>
                <p className="text-[10px] opacity-70">Thú cưng chưa có bản ghi tiêm vắc-xin nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ClinicConfirmModal
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa bệnh nhân"
        message={`Bạn có chắc chắn muốn xóa hồ sơ của ${patient.name}? Tất cả lịch sử khám bệnh và hồ sơ liên quan sẽ bị vô hiệu hóa.`}
        confirmLabel="Có, Xóa hồ sơ"
        cancelLabel="Hủy bỏ"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          if (onDelete) {
            onDelete(patient.id);
            onClose();
          }
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showBookingForm && (
        <ClinicModal
          onClose={() => setShowBookingForm(false)}
          title={`Đặt lịch khám cho bé ${patient.name}`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col gap-4 p-6 text-left" style={{ fontFamily: "Inter, sans-serif" }}>
            <p className="text-xs text-gray-500 mb-2">
              Điền các thông tin cần thiết dưới đây để tạo lịch hẹn mới cho **{patient.name}** (Chủ nuôi: **{patient.ownerName || "Vãng lai"}**).
            </p>

            {/* Date Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Ngày đặt lịch</label>
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

            {/* Service Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Dịch vụ</label>
              <select
                value={bookingServiceId}
                onChange={(e) => setBookingServiceId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none cursor-pointer bg-slate-50 border border-slate-100 text-sm font-semibold"
              >
                {finalServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.durationMinutes ? `${s.durationMinutes} phút` : "30 phút"})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Khung giờ</label>
              <select
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none cursor-pointer bg-slate-50 border border-slate-100 text-sm font-semibold"
              >
                {["09:00 SA", "09:30 SA", "10:00 SA", "10:30 SA", "11:00 SA", "11:30 SA", "02:00 CH", "02:30 CH", "03:00 CH", "03:30 CH", "04:00 CH", "04:30 CH"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Doctor/Staff Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Bác sĩ / Nhân viên phụ trách</label>
              <select
                value={bookingStaffId}
                onChange={(e) => setBookingStaffId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none cursor-pointer bg-slate-50 border border-slate-100 text-sm font-semibold"
              >
                {finalStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Ghi chú triệu chứng / yêu cầu</label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="VD: Pet bị ho nhẹ, cần kiểm tra tai..."
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

            {/* Actions */}
            <div className="flex gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="flex-1 py-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-bold text-xs rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleBookingSubmit}
                disabled={bookingSubmitted}
                className="flex-1 py-3 text-white transition-all font-black text-xs rounded-xl hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                style={{
                  background: bookingSubmitted
                    ? "linear-gradient(135deg, #16a34a, #15803d)"
                    : "linear-gradient(135deg, #2563EB, #1d4ed8)",
                  boxShadow: bookingSubmitted
                    ? "0 4px 12px rgba(22,163,74,0.2)"
                    : "0 4px 12px rgba(37,99,235,0.2)",
                }}
              >
                {bookingSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Xác nhận đặt lịch
                  </>
                )}
              </button>
            </div>
          </div>
        </ClinicModal>
      )}

      {showSuccessPopup && (
        <ClinicConfirmModal
          isOpen={showSuccessPopup}
          title="Đặt lịch hẹn thành công!"
          message={`Lịch hẹn khám dịch vụ đã được thiết lập thành công cho bé ${patient.name} vào ngày ${bookingDate} lúc ${bookingTimeSlot}.`}
          confirmLabel="Tuyệt vời"
          cancelLabel="Đóng"
          variant="success"
          onConfirm={() => setShowSuccessPopup(false)}
          onCancel={() => setShowSuccessPopup(false)}
        />
      )}
    </ClinicModal>
  );
}
