import { useState } from "react";
import { CheckCircle2, Edit3, Plus, Trash2, X } from "lucide-react";

const TEAM = [
  { id: "t1", name: "Nguyễn Thị Lan",   email: "lan@pawsclaws.vn",   role: "Admin",       status: "active",  avatar: "NL", color: "#2563EB" },
  { id: "t2", name: "BS. Trần Văn Minh", email: "minh@pawsclaws.vn",  role: "Vet",         status: "active",  avatar: "TM", color: "#7c3aed" },
  { id: "t3", name: "Lê Thu Hoa",        email: "hoa@pawsclaws.vn",   role: "Receptionist",status: "active",  avatar: "LH", color: "#16a34a" },
  { id: "t4", name: "Phạm Thị Yến",      email: "yen@pawsclaws.vn",   role: "Groomer",     status: "active",  avatar: "PY", color: "#f97316" },
  { id: "t5", name: "Đỗ Hữu Long",       email: "long@pawsclaws.vn",  role: "Vet Nurse",   status: "invited", avatar: "ĐL", color: "#0891b2" },
];

const ROLE_BADGES: Record<string, { bg: string; color: string }> = {
  "Admin":       { bg: "rgba(37,99,235,0.1)",   color: "#2563EB" },
  "Vet":         { bg: "rgba(124,58,237,0.1)",  color: "#7c3aed" },
  "Receptionist":{ bg: "rgba(22,163,74,0.1)",   color: "#16a34a" },
  "Groomer":     { bg: "rgba(249,115,22,0.1)",  color: "#f97316" },
  "Vet Nurse":   { bg: "rgba(8,145,178,0.1)",   color: "#0891b2" },
};

export function TeamSettings() {
  const [team, setTeam] = useState(TEAM);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Vet");
  const [toast, setToast] = useState("");

  function invite() {
    if (!inviteEmail) return;
    setTeam(p => [...p, { id: `t${Date.now()}`, name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, status: "invited", avatar: inviteEmail[0].toUpperCase(), color: "#9ca3af" }]);
    setToast(`Đã gửi lời mời tới ${inviteEmail}!`);
    setInviteEmail(""); setShowInvite(false);
    setTimeout(() => setToast(""), 3000);
  }

  function remove(id: string) {
    setTeam(p => p.filter(m => m.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Thành viên nhóm</h3>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>{team.length} thành viên · {team.filter(m => m.status === "invited").length} lời mời đang chờ</p>
          </div>
          <button onClick={() => setShowInvite(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 4px 12px rgba(37,99,235,0.28)" }}>
            <Plus className="w-4 h-4" /> Mời thành viên
          </button>
        </div>

        {showInvite && (
          <div className="flex items-center gap-3 px-6 py-4" style={{ background: "rgba(37,99,235,0.03)", borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@clinic.com"
              className="flex-1 px-3.5 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}
              onFocus={e => (e.target.style.borderColor = "#2563EB")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="px-3.5 py-2.5 rounded-xl outline-none appearance-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
              {Object.keys(ROLE_BADGES).map(r => <option key={r}>{r}</option>)}
            </select>
            <button onClick={invite} className="px-4 py-2.5 rounded-xl"
              style={{ background: "#2563EB", color: "white", fontWeight: 700, fontSize: "0.82rem" }}>Gửi lời mời</button>
            <button onClick={() => setShowInvite(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
              <X className="w-4 h-4" style={{ color: "#9ca3af" }} />
            </button>
          </div>
        )}

        <div className="flex flex-col">
          {team.map((member, i) => {
            const role = ROLE_BADGES[member.role] || { bg: "rgba(0,0,0,0.05)", color: "#6b7280" };
            return (
              <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                style={{ borderBottom: i < team.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${member.color}18` }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: member.color }}>{member.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{member.name}</p>
                  <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{member.email}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full" style={{ background: role.bg, fontSize: "0.68rem", fontWeight: 700, color: role.color }}>{member.role}</span>
                {member.status === "invited" && (
                  <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(249,115,22,0.08)", fontSize: "0.65rem", fontWeight: 700, color: "#f97316" }}>Đang chờ</span>
                )}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                  </button>
                  {member.id !== "t1" && (
                    <button onClick={() => remove(member.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-5 py-3.5 rounded-2xl"
          style={{ background: "#111827", color: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: "#4ade80" }} /> {toast}
        </div>
      )}
    </div>
  );
}
