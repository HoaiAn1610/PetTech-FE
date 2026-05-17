import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";

interface AddPatientModalProps {
  onClose: () => void;
  onAdd: (name: string) => void;
}

export function AddPatientModal({ onClose, onAdd }: AddPatientModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    petName: "",
    species: "Chó",
    breed: "",
    age: "",
    gender: "Cái",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
  });

  const canNext = form.petName && form.breed && form.age;
  const canSave = canNext && form.ownerName && form.ownerEmail;

  const ModalFooter = (
    <div className="flex w-full gap-2.5">
      {step === 1 ? (
        <button
          disabled={!canNext}
          onClick={() => setStep(2)}
          className="w-full py-3 rounded-xl"
          style={{
            background: canNext
              ? "linear-gradient(135deg,#2563EB,#1d4ed8)"
              : "#e5e7eb",
            color: canNext ? "white" : "#9ca3af",
            fontWeight: 700,
            fontSize: "0.88rem",
          }}
        >
          Tiếp theo: Thông tin chủ sở hữu →
        </button>
      ) : (
        <>
          <button
            onClick={() => setStep(1)}
            className="px-5 py-3 rounded-xl"
            style={{
              background: "#f4f6fb",
              color: "#374151",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            ← Quay lại
          </button>
          <button
            disabled={!canSave}
            onClick={() => {
              onAdd(form.petName);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl"
            style={{
              background: canSave
                ? "linear-gradient(135deg,#16a34a,#15803d)"
                : "#e5e7eb",
              color: canSave ? "white" : "#9ca3af",
              fontWeight: 700,
              fontSize: "0.88rem",
              boxShadow: canSave ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
            }}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
            Thêm bệnh nhân
          </button>
        </>
      )}
    </div>
  );

  return (
    <ClinicModal
      title="Thêm bệnh nhân mới"
      subtitle={`Bước ${step}/2 — ${
        step === 1 ? "Thông tin thú cưng" : "Thông tin chủ sở hữu"
      }`}
      onClose={onClose}
      footer={ModalFooter}
      maxWidth="max-w-md"
    >
      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Progress */}
        <div className="flex gap-1.5">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full"
              style={{ background: s <= step ? "#2563EB" : "#e5e7eb" }}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  letterSpacing: "0.05em",
                }}
              >
                TÊN THÚ CƯNG *
              </label>
              <input
                value={form.petName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, petName: e.target.value }))
                }
                placeholder="vd. Bella"
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
                style={{
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.85rem",
                  color: "#111827",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  letterSpacing: "0.05em",
                }}
              >
                LOÀI
              </label>
              <select
                value={form.species}
                onChange={(e) =>
                  setForm((p) => ({ ...p, species: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5 appearance-none"
                style={{
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.85rem",
                  color: "#111827",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {["Chó", "Mèo", "Chim", "Thỏ", "Khác"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  letterSpacing: "0.05em",
                }}
              >
                GIỚI TÍNH
              </label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gender: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5 appearance-none"
                style={{
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.85rem",
                  color: "#111827",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {["Cái", "Đực"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  letterSpacing: "0.05em",
                }}
              >
                GIỐNG *
              </label>
              <input
                value={form.breed}
                onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))}
                placeholder="vd. Golden Retriever"
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
                style={{
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.85rem",
                  color: "#111827",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#374151",
                  letterSpacing: "0.05em",
                }}
              >
                TUỔI *
              </label>
              <input
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                placeholder="vd. 2 tuổi 4 tháng"
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
                style={{
                  border: "1.5px solid #e5e7eb",
                  fontSize: "0.85rem",
                  color: "#111827",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {[
              {
                label: "TÊN CHỦ SỞ HỮU *",
                key: "ownerName",
                ph: "Maria Santos",
                type: "text",
              },
              {
                label: "SỐ ĐIỆN THOẠI",
                key: "ownerPhone",
                ph: "+84 9xx xxx xxx",
                type: "tel",
              },
              {
                label: "ĐỊA CHỈ EMAIL *",
                key: "ownerEmail",
                ph: "chu@email.com",
                type: "email",
              },
            ].map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#374151",
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  placeholder={f.ph}
                  className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
                  style={{
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.85rem",
                    color: "#111827",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </ClinicModal>
  );
}
