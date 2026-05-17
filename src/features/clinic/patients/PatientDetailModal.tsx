import React, { useState } from "react";
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
} from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";
import { ClinicStatusBadge } from "@/components/clinic/ClinicStatusBadge";

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  color: string;
  owner: string;
  ownerPhone: string;
  ownerEmail: string;
  lastVisit: string;
  nextVisit: string;
  status: string;
  alerts: string[];
  vaccineDue: boolean;
  healthScore: number;
  vet: string;
}

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
}

export function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  const [tab, setTab] = useState<"overview" | "history" | "vaccinations">("overview");
  const scoreColor =
    patient.healthScore >= 85
      ? "#16a34a"
      : patient.healthScore >= 70
      ? "#f97316"
      : "#dc2626";

  const history = [
    {
      date: patient.lastVisit,
      type: "Kiểm tra sức khoẻ",
      vet: patient.vet,
      notes: "Các chỉ số sinh tồn bình thường. Cân nặng ổn định.",
      cost: "$85",
    },
    {
      date: "10/1/2026",
      type: "Tiêm vaccine",
      vet: patient.vet,
      notes: "Tiêm phòng Dại + Distemper kết hợp.",
      cost: "$65",
    },
    {
      date: "3/11/2025",
      type: "Làm sạch răng",
      vet: patient.vet,
      notes: "Loại bỏ vôi nhẹ. Nướu khoẻ mạnh.",
      cost: "$180",
    },
  ];
  
  const vaccines = [
    {
      name: "Dại (Rabies)",
      lastDone: "10/1/2026",
      nextDue: "10/1/2027",
      status: "Còn hiệu lực",
    },
    {
      name: "Distemper (DHPP)",
      lastDone: "10/1/2026",
      nextDue: "10/1/2027",
      status: "Còn hiệu lực",
    },
    {
      name: "Bordetella",
      lastDone: "7/3/2025",
      nextDue: patient.vaccineDue ? "7/3/2026" : "7/3/2027",
      status: patient.vaccineDue ? "Quá hạn" : "Còn hiệu lực",
    },
    {
      name: "Leptospirosis",
      lastDone: "2/6/2025",
      nextDue: "2/6/2026",
      status: "Còn hiệu lực",
    },
  ];

  const ModalFooter = (
    <>
      <button
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        style={{
          border: "1.5px solid #e5e7eb",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#374151",
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
      {/* Header Info (Override standard modal header body) */}
      <div
        className="flex items-start gap-4 px-7 pt-6 pb-5"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
          style={{
            background: `${patient.color}18`,
            border: `2px solid ${patient.color}30`,
          }}
        >
          {patient.species === "Dog"
            ? "🐕"
            : patient.species === "Cat"
            ? "🐈"
            : patient.species === "Bird"
            ? "🦜"
            : "🐰"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827" }}>
              {patient.name}
            </h2>
            <ClinicStatusBadge status={patient.status} />
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "2px" }}>
            {patient.breed} · {patient.species} · {patient.gender} · {patient.age}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="text-center">
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {patient.healthScore}
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

      <div className="px-7 py-5">
        {tab === "overview" && (
          <div className="flex flex-col gap-5">
            {/* Vitals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Weight,
                  label: "Cân nặng",
                  value: patient.weight,
                  color: "#2563EB",
                },
                {
                  icon: Heart,
                  label: "Nhịp tim",
                  value: "74 bpm",
                  color: "#ef4444",
                },
                {
                  icon: Thermometer,
                  label: "Nhiệt độ",
                  value: "38.5°C",
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
            {/* Alerts */}
            {patient.alerts.length > 0 && (
              <div className="flex flex-col gap-2">
                {patient.alerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
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
                      style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 500 }}
                    >
                      {a}
                    </span>
                  </div>
                ))}
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
                    {patient.owner}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                    Chủ thú cưng từ năm 2023
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: Phone, val: patient.ownerPhone },
                  { icon: Mail, val: patient.ownerEmail },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.val} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                      <span style={{ fontSize: "0.78rem", color: "#374151" }}>
                        {r.val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Visit info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Lần khám trước",
                  value: patient.lastVisit,
                  icon: Clock,
                  color: "#6b7280",
                },
                {
                  label: "Lịch hẹn tiếp",
                  value: patient.nextVisit,
                  icon: Calendar,
                  color: patient.nextVisit === "Overdue" ? "#dc2626" : "#2563EB",
                },
              ].map((i) => {
                const Icon = i.icon;
                return (
                  <div
                    key={i.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: "white",
                      border: "1.5px solid rgba(0,0,0,0.07)",
                    }}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: i.color }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#9ca3af",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {i.label.toUpperCase()}
                      </p>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: i.color === "#dc2626" ? "#dc2626" : "#111827",
                        }}
                      >
                        {i.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="flex flex-col gap-3">
            {history.map((h, i) => (
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
            ))}
          </div>
        )}

        {tab === "vaccinations" && (
          <div className="flex flex-col gap-2.5">
            {vaccines.map((v, i) => {
              const done = v.status === "Còn hiệu lực";
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{
                    background: done ? "rgba(22,163,74,0.04)" : "rgba(220,38,38,0.04)",
                    border: `1.5px solid ${
                      done ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)"
                    }`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center`}
                      style={{
                        background: done ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                      }}
                    >
                      <Syringe
                        className="w-4 h-4"
                        style={{ color: done ? "#16a34a" : "#dc2626" }}
                      />
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
                        background: done ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: done ? "#16a34a" : "#dc2626",
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
            })}
          </div>
        )}
      </div>
    </ClinicModal>
  );
}
