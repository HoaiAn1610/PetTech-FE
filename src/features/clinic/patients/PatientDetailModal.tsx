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
import { AddBookingModal } from "@/components/booking/AddBookingModal";
import { PetAllergenManager } from "./PetAllergenManager";

interface PatientDetailModalProps {
  patient: PetDto;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (patient: PetDto) => void;
}

export function PatientDetailModal({ patient: initialPatient, onClose, onDelete, onEdit }: PatientDetailModalProps) {
  const [patient, setPatient] = useState<PetDto>(initialPatient);
  const [tab, setTab] = useState<"overview" | "history" | "vaccinations">("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Quick booking states
  const [showBookingForm, setShowBookingForm] = useState(false);

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

            <PetAllergenManager pet={patient} onUpdate={setPatient} />
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
        <AddBookingModal
          preSelectedPet={patient}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => setShowBookingForm(false)}
        />
      )}
    </ClinicModal>
  );
}
