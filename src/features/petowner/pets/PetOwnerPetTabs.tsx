import { useState } from "react";
import {
  FileText, Shield, ShieldAlert, X, Utensils, Info,
  Edit2, Clock, Stethoscope, TrendingUp, Activity,
  Plus, Trash2, Weight, Loader2,
} from "lucide-react";
import {
  useAddWeightRecord, useUpdateWeightRecord, useDeleteWeightRecord,
  useAddAllergen, useUpdateAllergen, useDeleteAllergen,
} from "@/hooks/petowner/useMyPets";
import { PetProfile } from "@/data/petProfiles";
import { SectionBox, SeverityBadge } from "./PetOwnerPetBadges";

// ─── Overview Tab ─────────────────────────────────────────────────────────────
export function OverviewTab({ pet }: { pet: PetProfile }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionBox title="Thông tin sinh học" icon={FileText}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Ngày sinh",          value: pet.dob              },
            { label: "Loài / Giống",       value: `${pet.species} · ${pet.breed}` },
            { label: "Giới tính",          value: pet.gender           },
            { label: "Cân nặng hiện tại",  value: `${pet.weight} kg`   },
            { label: "Nhóm máu",           value: pet.bloodType || "N/A" },
            { label: "Mã bảo hiểm",        value: pet.insuranceId || "Chưa có" },
          ].map(i => (
            <div key={i.label} className="p-3 rounded-xl" style={{ background: "#f8fafc" }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{i.label}</p>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", marginTop: "2px" }}>{i.value}</p>
            </div>
          ))}
        </div>
      </SectionBox>

      <SectionBox title="Dị ứng & Cảnh báo" icon={ShieldAlert} iconColor="#dc2626">
        <div className="flex flex-col gap-3">
          {pet.allergens.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", textAlign: "center", padding: "10px 0" }}>Không có dữ liệu dị ứng</p>
          ) : pet.allergens.map(a => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: a.severity === "severe" ? "rgba(220,38,38,0.05)" : "#f8fafc" }}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: a.severity === "severe" ? "#dc2626" : "#ea580c" }} />
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{a.label}</p>
                <p style={{ fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.4 }}>{a.reaction}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionBox>
    </div>
  );
}

// ─── Vitals Tab ──────────────────────────────────────────────────────────────
import { BCSGauge, WeightChart } from "./PetOwnerPetVitals";
export function VitalsTab({ pet, petId }: { pet: PetProfile; petId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [newDate,         setNewDate]         = useState(today);
  const [newWeight,       setNewWeight]       = useState("");
  const [editId,          setEditId]          = useState<string | null>(null);
  const [editDate,        setEditDate]        = useState("");
  const [editWt,          setEditWt]          = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const addWeight    = useAddWeightRecord();
  const updateWeight = useUpdateWeightRecord();
  const deleteWeight = useDeleteWeightRecord();

  function handleAdd() {
    if (!newWeight || !petId) return;
    addWeight.mutate(
      { petId, data: { measuredDate: new Date(newDate).toISOString(), weight: parseFloat(newWeight) } },
      { onSuccess: () => { setNewWeight(""); setNewDate(today); } }
    );
  }

  function startEdit(record: PetProfile["weightHistory"][0]) {
    if (!record.id) return;
    setEditId(record.id);
    setEditWt(String(record.weight));
    setEditDate(record.date);
  }

  function handleUpdate(recordId: string) {
    updateWeight.mutate(
      { petId, recordId, data: { weight: parseFloat(editWt), measuredDate: editDate ? new Date(editDate).toISOString() : undefined } },
      { onSuccess: () => setEditId(null) }
    );
  }

  function handleDelete(recordId: string) {
    deleteWeight.mutate({ petId, recordId }, { onSuccess: () => setDeleteConfirmId(null) });
  }

  const canAdd = !!newWeight && parseFloat(newWeight) > 0 && !addWeight.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <SectionBox title="Biểu đồ cân nặng" icon={TrendingUp}>
          <WeightChart history={pet.weightHistory} species={pet.species} />
        </SectionBox>
        <SectionBox title="Chỉ số thể trạng (BCS)" icon={Activity} iconColor="#16a34a">
          <BCSGauge score={pet.bodyConditionScore} species={pet.species} />
        </SectionBox>
      </div>

      {/* Inline Add Weight */}
      <SectionBox title="Ghi nhận cân nặng mới" icon={Weight} iconColor="#2563EB">
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1.5 flex-1">
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af" }}>NGÀY CÂN</span>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter" }} />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af" }}>CÂN NẶNG (KG)</span>
            <input type="number" step="0.1" min="0" value={newWeight} onChange={e => setNewWeight(e.target.value)}
              placeholder="vd. 3.8"
              className="px-3 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter" }} />
          </div>
          <button onClick={handleAdd} disabled={!canAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
            style={{ background: canAdd ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: canAdd ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            {addWeight.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Lưu
          </button>
        </div>
      </SectionBox>

      {/* Weight History Table */}
      {pet.weightHistory.length > 0 && (
        <SectionBox title="Lịch sử cân nặng" icon={Clock} iconColor="#6b7280">
          <div className="flex flex-col divide-y" style={{ borderColor: "#f3f4f6" }}>
            {[...pet.weightHistory].reverse().map((record, idx) => {
              const rid = record.id ?? `idx-${idx}`;
              const isEditing       = editId === rid;
              const isConfirmDelete = deleteConfirmId === rid;
              return (
                <div key={rid} className="flex items-center gap-4 py-3">
                  {isEditing ? (
                    <>
                      <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg outline-none flex-1"
                        style={{ border: "1.5px solid #2563EB", fontSize: "0.85rem" }} />
                      <input type="number" step="0.1" value={editWt} onChange={e => setEditWt(e.target.value)}
                        className="px-3 py-1.5 rounded-lg outline-none w-24"
                        style={{ border: "1.5px solid #2563EB", fontSize: "0.85rem" }} />
                      <button onClick={() => handleUpdate(rid)}
                        className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                        style={{ background: "#16a34a" }}>Lưu</button>
                      <button onClick={() => setEditId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                    </>
                  ) : isConfirmDelete ? (
                    <>
                      <p style={{ fontSize: "0.82rem", color: "#dc2626", flex: 1 }}>Xóa bản ghi này?</p>
                      <button onClick={() => handleDelete(rid)}
                        className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                        style={{ background: "#dc2626" }}>Xóa</button>
                      <button onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: "0.82rem", color: "#6b7280", flex: 1 }}>{record.date || record.label}</span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{record.weight} kg</span>
                      {record.id && (
                        <>
                          <button onClick={() => startEdit(record)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                            style={{ border: "1px solid #e5e7eb" }}>
                            <Edit2 className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(rid)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                            style={{ border: "1px solid #e5e7eb" }}>
                            <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </SectionBox>
      )}

      <SectionBox title="Chỉ số sinh tồn" icon={Stethoscope} iconColor="#0891b2">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Nhiệt độ",  value: `${pet.vitals.temperature} °C`, icon: "🌡️", color: "#F97316" },
            { label: "Nhịp tim",  value: `${pet.vitals.heartRate} bpm`,  icon: "💓", color: "#dc2626" },
            { label: "Nhịp thở", value: `${pet.vitals.respRate} /ph`,   icon: "💨", color: "#0891b2" },
          ].map(v => (
            <div key={v.label} className="p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-1">
              <span className="text-xl mb-1">{v.icon}</span>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>{v.value}</p>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{v.label}</p>
            </div>
          ))}
        </div>
      </SectionBox>
    </div>
  );
}

// ─── Allergens Tab ────────────────────────────────────────────────────────────
const SEVERITY_CFG = {
  Mild:     { label: "Nhẹ",          color: "#ea580c", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)" },
  Moderate: { label: "Trung bình",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.2)"   },
  Severe:   { label: "NGHIÊM TRỌNG", color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.25)" },
} as const;

type SevKey = keyof typeof SEVERITY_CFG;

function normSev(s: string): SevKey {
  const cap = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return (cap in SEVERITY_CFG ? cap : "Mild") as SevKey;
}

export function AllergensTab({ pet, petId }: { pet: PetProfile; petId: string }) {
  const [showAddForm,     setShowAddForm]     = useState(false);
  const [newLabel,        setNewLabel]        = useState("");
  const [newSeverity,     setNewSeverity]     = useState<SevKey>("Mild");
  const [newReaction,     setNewReaction]     = useState("");
  const [editId,          setEditId]          = useState<string | null>(null);
  const [editSeverity,    setEditSeverity]    = useState<SevKey>("Mild");
  const [editReaction,    setEditReaction]    = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const addAllergen    = useAddAllergen();
  const updateAllergen = useUpdateAllergen();
  const deleteAllergen = useDeleteAllergen();

  function handleAdd() {
    if (!newLabel || !petId) return;
    const ingredientKey = newLabel.toLowerCase().replace(/\s+/g, "_");
    addAllergen.mutate(
      { petId, data: { ingredientKey, label: newLabel, severity: newSeverity, reaction: newReaction || undefined, diagnosedDate: new Date().toISOString() } },
      { onSuccess: () => { setNewLabel(""); setNewReaction(""); setNewSeverity("Mild"); setShowAddForm(false); } }
    );
  }

  function startEdit(a: PetProfile["allergens"][0]) {
    if (!a.id) return;
    setEditId(a.id);
    setEditSeverity(normSev(a.severity));
    setEditReaction(a.reaction ?? "");
  }

  function handleUpdate(allergenId: string) {
    updateAllergen.mutate(
      { allergenId, petId, data: { severity: editSeverity, reaction: editReaction || undefined } },
      { onSuccess: () => setEditId(null) }
    );
  }

  function handleDelete(allergenId: string) {
    deleteAllergen.mutate({ petId, allergenId }, { onSuccess: () => setDeleteConfirmId(null) });
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Danh sách dị nguyên</h3>
          <button onClick={() => setShowAddForm(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
            style={{ background: showAddForm ? "rgba(37,99,235,0.08)" : "#f8fafc", border: "1.5px solid rgba(37,99,235,0.2)", fontSize: "0.72rem", fontWeight: 700, color: "#2563EB" }}>
            <Plus className="w-3 h-3" /> Thêm dị nguyên
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "rgba(37,99,235,0.03)", border: "1.5px dashed rgba(37,99,235,0.25)" }}>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", marginBottom: "6px" }}>TÊN DỊ NGUYÊN</p>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="vd. Tôm, Đậu nành, Lúa mì…"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", marginBottom: "6px" }}>MỨC ĐỘ</p>
              <div className="flex gap-2">
                {(["Mild", "Moderate", "Severe"] as const).map(s => (
                  <button key={s} onClick={() => setNewSeverity(s)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: newSeverity === s ? SEVERITY_CFG[s].bg : "#f8fafc",
                      border: newSeverity === s ? `2px solid ${SEVERITY_CFG[s].color}` : "1.5px solid #e5e7eb",
                      color: newSeverity === s ? SEVERITY_CFG[s].color : "#6b7280",
                    }}>
                    {SEVERITY_CFG[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", marginBottom: "6px" }}>PHẢN ỨNG (tùy chọn)</p>
              <textarea value={newReaction} onChange={e => setNewReaction(e.target.value)}
                placeholder="Mô tả phản ứng dị ứng…" rows={2}
                className="w-full px-3 py-2.5 rounded-xl outline-none resize-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter" }} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={!newLabel || addAllergen.isPending}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold"
                style={{ background: newLabel ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: newLabel ? "white" : "#9ca3af" }}>
                {addAllergen.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Lưu
              </button>
              <button onClick={() => { setShowAddForm(false); setNewLabel(""); setNewReaction(""); }}
                className="px-4 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#f3f4f6", color: "#374151" }}>
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Allergen List */}
        <div className="flex flex-col gap-3">
          {pet.allergens.length === 0 ? (
            <div className="py-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-2" style={{ color: "#d1d5db" }} />
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Chưa có dị nguyên — thú cưng có vẻ không bị dị ứng!</p>
            </div>
          ) : pet.allergens.map(a => {
            const sev = normSev(a.severity);
            const cfg = SEVERITY_CFG[sev];
            const isEdit    = editId === a.id;
            const isConfirm = deleteConfirmId === a.id;
            return (
              <div key={a.id} className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${cfg.border}` }}>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ background: cfg.bg, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" style={{ color: cfg.color }} />
                    <div>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{a.label}</span>
                      {a.diagnosedDate && <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>Chẩn đoán: {a.diagnosedDate}</p>}
                    </div>
                  </div>
                  {!isEdit && !isConfirm && (
                    <div className="flex items-center gap-1.5">
                      <SeverityBadge severity={a.severity as any} />
                      {a.id && (
                        <>
                          <button onClick={() => startEdit(a)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-3 h-3" style={{ color: "#2563EB" }} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(a.id!)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3 h-3" style={{ color: "#dc2626" }} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isConfirm ? (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <p style={{ fontSize: "0.82rem", color: "#dc2626", flex: 1 }}>Xóa dị nguyên này?</p>
                    <button onClick={() => handleDelete(a.id!)}
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                      style={{ background: "#dc2626" }}>Xóa</button>
                    <button onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                  </div>
                ) : isEdit ? (
                  <div className="px-4 py-3 flex flex-col gap-3">
                    <div className="flex gap-2">
                      {(["Mild", "Moderate", "Severe"] as const).map(s => (
                        <button key={s} onClick={() => setEditSeverity(s)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={{
                            background: editSeverity === s ? SEVERITY_CFG[s].bg : "#f8fafc",
                            border: editSeverity === s ? `2px solid ${SEVERITY_CFG[s].color}` : "1.5px solid #e5e7eb",
                            color: editSeverity === s ? SEVERITY_CFG[s].color : "#6b7280",
                          }}>
                          {SEVERITY_CFG[s].label}
                        </button>
                      ))}
                    </div>
                    <textarea value={editReaction} onChange={e => setEditReaction(e.target.value)}
                      placeholder="Mô tả phản ứng…" rows={2}
                      className="w-full px-3 py-2 rounded-lg outline-none resize-none"
                      style={{ border: "1.5px solid #e5e7eb", fontSize: "0.82rem", fontFamily: "Inter" }} />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(a.id!)} disabled={updateAllergen.isPending}
                        className="flex-1 py-2 rounded-lg text-white text-xs font-bold"
                        style={{ background: "#16a34a" }}>
                        {updateAllergen.isPending ? "Đang lưu…" : "Lưu"}
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5">
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", marginBottom: "3px" }}>PHẢN ỨNG ĐÃ BIẾT</p>
                    <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.55 }}>{a.reaction || "—"}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SectionBox title="Chế độ ăn hiện tại" icon={Utensils} iconColor="#16a34a">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.18)" }}>
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af" }}>THỨC ĂN HIỆN TẠI</p>
              <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{pet.diet.food || "—"}</p>
              {pet.diet.brand && <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>by {pet.diet.brand}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Calo mỗi ngày",   value: pet.diet.dailyCalories ? `${pet.diet.dailyCalories} kcal` : "—" },
              { label: "Bữa ăn / ngày",   value: pet.diet.mealsPerDay   ? `${pet.diet.mealsPerDay}x / ngày`  : "—" },
              { label: "Hạn chế ăn uống", value: `${pet.diet.restrictions.length} loại` },
            ].map(r => (
              <div key={r.label} className="px-3 py-3 rounded-xl text-center" style={{ background: "#f8fafc" }}>
                <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{r.label}</p>
                <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#111827", marginTop: "2px" }}>{r.value}</p>
              </div>
            ))}
          </div>
          {pet.diet.restrictions.length > 0 && (
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", marginBottom: "8px" }}>HẠN CHẾ ĂN UỐNG</p>
              <div className="flex flex-wrap gap-2">
                {pet.diet.restrictions.map(r => (
                  <span key={r} className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", fontSize: "0.72rem", fontWeight: 600, color: "#dc2626" }}>
                    <X className="w-2.5 h-2.5" /> {r}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pet.diet.notes && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: "#f8fafc" }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#9ca3af" }} />
              <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.6 }}>{pet.diet.notes}</p>
            </div>
          )}
        </div>
      </SectionBox>
    </div>
  );
}
