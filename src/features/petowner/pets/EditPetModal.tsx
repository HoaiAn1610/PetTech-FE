import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { useUpdateMyPet } from "@/hooks/petowner/useMyPets";
import { PetProfile } from "@/data/petProfiles";
import { getSpeciesEmoji } from "./AddPetModal";

const SPECIES_PRESETS = [
  { label: "Chó",     value: "Dog",     emoji: "🐕" },
  { label: "Mèo",     value: "Cat",     emoji: "🐱" },
  { label: "Thỏ",     value: "Rabbit",  emoji: "🐰" },
  { label: "Chim",    value: "Bird",    emoji: "🐦" },
  { label: "Hamster", value: "Hamster", emoji: "🐹" },
  { label: "Rùa",     value: "Turtle",  emoji: "🐢" },
  { label: "Cá",      value: "Fish",    emoji: "🐠" },
];

const BCS_COLORS = ["", "#dc2626", "#dc2626", "#ea580c", "#16a34a", "#16a34a", "#ea580c", "#ea580c", "#dc2626", "#dc2626"];

export function EditPetModal({ pet, onClose }: { pet: PetProfile; onClose: () => void }) {
  const updatePet = useUpdateMyPet();

  const [name,    setName]    = useState(pet.name);
  const [species, setSpecies] = useState(pet.species);
  const [gender,  setGender]  = useState<"Male" | "Female">(
    pet.gender?.toLowerCase().startsWith("f") ? "Female" : "Male"
  );
  const [breed,   setBreed]   = useState(pet.breed ?? "");
  const [dob,     setDob]     = useState(() => {
    try { return pet.dob ? new Date(pet.dob).toISOString().slice(0, 10) : ""; }
    catch { return ""; }
  });
  const [weight,  setWeight]  = useState(pet.weight ? String(pet.weight) : "");
  const [color,   setColor]   = useState(pet.color ?? "");
  const [notes,   setNotes]   = useState(pet.notes ?? "");
  const [bcs,     setBcs]     = useState(pet.bodyConditionScore ?? 5);
  const [done,    setDone]    = useState(false);

  if (done) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 flex flex-col items-center gap-5 text-center"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <Check className="w-7 h-7" style={{ color: "#16a34a" }} />
        </div>
        <div>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Đã cập nhật {name}!</p>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "6px" }}>Thông tin thú cưng đã được lưu.</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700 }}>
          Xong
        </button>
      </div>
    </div>
  );

  function handleSubmit() {
    if (!name || !species || !breed) return;
    updatePet.mutate(
      {
        id: pet.id,
        data: {
          name,
          species,
          breed,
          gender,
          dob: dob ? new Date(dob).toISOString() : undefined,
          currentWeight: weight ? parseFloat(weight) : undefined,
          color: color || undefined,
          notes: notes || undefined,
          bodyConditionScore: bcs,
          emoji: getSpeciesEmoji(species),
        },
      },
      { onSuccess: () => setDone(true) }
    );
  }

  const canSubmit = !!name && !!species && !!breed && !updatePet.isPending;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Chỉnh sửa hồ sơ {pet.emoji}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            <X className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">

          {/* Species */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Loài</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPECIES_PRESETS.map(s => (
                <button key={s.value} onClick={() => setSpecies(s.value)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
                  style={{
                    background: species === s.value ? "rgba(37,99,235,0.08)" : "#f8fafc",
                    border: species === s.value ? "2px solid #2563EB" : "1.5px solid #e5e7eb",
                    fontSize: "0.82rem", fontWeight: 700,
                    color: species === s.value ? "#2563EB" : "#374151",
                  }}>
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
            <input value={species} onChange={e => setSpecies(e.target.value)}
              placeholder="Hoặc nhập tên loài khác…"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
          </div>

          {/* Name + Breed + Color */}
          {[
            { label: "Tên thú cưng", placeholder: "vd. Buddy",           value: name,  onChange: setName  },
            { label: "Giống",        placeholder: "vd. Golden Retriever", value: breed, onChange: setBreed },
            { label: "Màu lông",     placeholder: "vd. Vàng, Trắng kem", value: color, onChange: setColor },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>{f.label}</p>
              <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          ))}

          {/* Gender */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Giới tính</p>
            <div className="flex gap-3">
              {([["Male", "Đực", "♂️"], ["Female", "Cái", "♀️"]] as const).map(([val, label, icon]) => (
                <button key={val} onClick={() => setGender(val)}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: gender === val ? "rgba(37,99,235,0.06)" : "#f8fafc", border: gender === val ? "2px solid #2563EB" : "1.5px solid #e5e7eb" }}>
                  <span>{icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: gender === val ? "#2563EB" : "#374151" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DOB + Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ngày sinh</p>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Cân nặng (kg)</p>
              <input type="number" step="0.1" min="0" value={weight} onChange={e => setWeight(e.target.value)} placeholder="vd. 3.5"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          </div>

          {/* BCS Slider */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>
              Thể trạng (BCS): <span style={{ color: BCS_COLORS[bcs] }}>{bcs}/9</span>
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setBcs(n)}
                  className="flex-1 rounded-md transition-all"
                  style={{
                    height: "28px",
                    background: n === bcs ? BCS_COLORS[n] : `${BCS_COLORS[n]}25`,
                    border: n === bcs ? `2px solid ${BCS_COLORS[n]}` : `1px solid ${BCS_COLORS[n]}40`,
                  }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>1 Gầy</span>
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>5 Lý tưởng</span>
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>9 Béo phì</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ghi chú</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Đặc điểm nổi bật, tính cách, lưu ý đặc biệt…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: canSubmit ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: canSubmit ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
            {updatePet.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu…</> : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
