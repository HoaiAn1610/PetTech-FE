import { useState } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Filter, Search, Receipt, TrendingUp
} from "lucide-react";
import { VisitRow, PurchaseRow } from "@/features/petowner/history/HistoryComponents";

const VISITS = [
  { id: "v1", date: "25 tháng 2, 2026", type: "Thú y",       emoji: "🩺", pet: "Buddy",    vet: "Bs. Sarah Lee",   services: ["Kiểm tra sức khỏe định kỳ", "Tiêm nhắc vaccine DHPP", "Vaccine Leptospira"],    notes: "Tất cả chỉ số bình thường. Cân nặng 28,4kg. Đã thảo luận về quản lý dị ứng theo mùa.", cost: 142.00, paid: true, color: "#2563EB", bg: "rgba(37,99,235,0.06)" },
  { id: "v2", date: "12 tháng 2, 2026", type: "Cắt tỉa lông", emoji: "✂️", pet: "Whiskers", vet: "Cô Lan Ngô",     services: ["Cắt lông toàn bộ", "Vệ sinh tai", "Cắt móng"],                                    notes: "Lông trong tình trạng xuất sắc. Đã điều trị tích tụ ráy tai.",                         cost: 78.00,  paid: true, color: "#7c3aed", bg: "rgba(124,58,237,0.06)" },
  { id: "v3", date: "10 tháng 1, 2026", type: "Tiêm phòng",  emoji: "💉", pet: "Whiskers", vet: "Bs. Sarah Lee",   services: ["Feline FVRCP", "Dại (Mèo)"],                                                       notes: "Không có phản ứng bất lợi. Lần tiêm FVRCP tiếp theo vào tháng 1/2027.",               cost: 89.00,  paid: true, color: "#16a34a", bg: "rgba(22,163,74,0.06)"  },
  { id: "v4", date: "5 tháng 12, 2025", type: "Thú y",       emoji: "🩺", pet: "Buddy",    vet: "Bs. James Park", services: ["Tư vấn dị ứng da", "Xét nghiệm máu CBC", "Đơn thuốc Apoquel"], notes: "Chẩn đoán viêm da nhẹ. Apoquel được kê đơn trong 30 ngày.", cost: 196.00, paid: true, color: "#2563EB", bg: "rgba(37,99,235,0.06)" },
  { id: "v5", date: "20 tháng 10, 2025",type: "Cắt tỉa lông", emoji: "✂️", pet: "Buddy",   vet: "Cô Lan Ngô",     services: ["Cắt lông toàn bộ (Lớn)", "Đánh răng"],                                             notes: "Lông hơi bị rối. Khuyến nghị chải lông thường xuyên tại nhà.",                        cost: 110.00, paid: true, color: "#7c3aed", bg: "rgba(124,58,237,0.06)" },
];

const PURCHASES = [
  { id: "o1", date: "1 tháng 3, 2026",   orderNo: "ORD-20260301-001", items: [{ name: "Royal Canin Adult 15kg", qty: 1, price: 48.00 }, { name: "Dentastix Daily Dental (28 thanh)", qty: 2, price: 14.00 }], total: 76.00,  status: "delivered", statusLabel: "Đã giao" },
  { id: "o2", date: "8 tháng 2, 2026",   orderNo: "ORD-20260208-002", items: [{ name: "Bánh thưởng Temptations",  qty: 3, price: 8.50  }, { name: "Omega-3 Supplement",                qty: 1, price: 24.00 }], total: 49.50,  status: "delivered", statusLabel: "Đã giao" },
  { id: "o3", date: "18 tháng 1, 2026",  orderNo: "ORD-20260118-003", items: [{ name: "Hill's Science Diet Mèo 7kg", qty: 1, price: 42.50 }, { name: "Whiskas Cá Ngừ Pate (12×85g)", qty: 1, price: 12.90 }, { name: "Cát vệ sinh cao cấp 10L", qty: 2, price: 15.50 }], total: 86.40, status: "delivered", statusLabel: "Đã giao" },
  { id: "o4", date: "20 tháng 12, 2025", orderNo: "ORD-20251220-004", items: [{ name: "Đồ chơi Kong Classic",   qty: 2, price: 15.00 }, { name: "Vòng cổ da (M)",            qty: 1, price: 22.00 }, { name: "Probiotic Chews", qty: 1, price: 18.50 }], total: 70.50,  status: "delivered", statusLabel: "Đã giao" },
];

export default function PetOwnerHistoryPage() {
  const [tab,    setTab]    = useState<"visits" | "purchases">("visits");
  const [search, setSearch] = useState("");

  const totalVisits    = VISITS.reduce((s, v) => s + v.cost, 0);
  const totalPurchases = PURCHASES.reduce((s, p) => s + p.total, 0);

  const filteredVisits = VISITS.filter(v =>
    !search || v.type.toLowerCase().includes(search.toLowerCase()) || v.pet.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPurchases = PURCHASES.filter(o =>
    !search || o.orderNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PetOwnerShell pageTitle="Lịch sử giao dịch">
      <div className="max-w-7xl mx-auto flex flex-col gap-8" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* Header */}
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>Lịch sử hoạt động</h2>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "2px" }}>Quản lý và xem lại tất cả các dịch vụ & đơn hàng</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Tổng lượt khám",     value: VISITS.length,               sub: `$${totalVisits.toFixed(0)} chi phí y tế`,    color: "#2563EB", bg: "rgba(37,99,235,0.06)",  icon: "🩺" },
            { label: "Đơn hàng đã đặt",    value: PURCHASES.length,            sub: `$${totalPurchases.toFixed(2)} tổng giá trị`,  color: "#F97316", bg: "rgba(249,115,22,0.06)", icon: "📦" },
            { label: "Điểm tích lũy",      value: "450",                       sub: "Tương đương $45.00 giảm giá",            color: "#16a34a", bg: "rgba(22,163,74,0.06)",  icon: "✨" },
          ].map(s => (
            <div key={s.label} className="rounded-3xl p-6 flex items-center gap-5 transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ background: "white", border: "1.5px solid #eef2f6" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: "1.8rem", fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>{s.label}</p>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500, marginTop: "2px" }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab + Search bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 p-1.5 rounded-2xl bg-gray-100/50 border border-gray-200">
            {[
              { id: "visits",    label: "🩺 Lịch khám", count: VISITS.length    },
              { id: "purchases", label: "📦 Đơn hàng",   count: PURCHASES.length },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                className="flex items-center gap-3 px-6 py-3 rounded-[1rem] transition-all font-bold text-sm"
                style={{
                  background: tab === t.id ? "white" : "transparent",
                  boxShadow: tab === t.id ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                  color: tab === t.id ? "#111827" : "#6b7280",
                }}>
                {t.label}
                <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-black"
                  style={{ background: tab === t.id ? "#2563EB" : "#e5e7eb", color: tab === t.id ? "white" : "#6b7280" }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm mã đơn, tên thú cưng..."
                className="pl-12 pr-5 py-3 rounded-2xl outline-none border-2 border-transparent focus:border-blue-200 transition-all shadow-sm"
                style={{ background: "white", fontSize: "0.9rem", width: "300px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 font-bold text-sm text-gray-600 transition-all hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Bộ lọc nâng cao
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {tab === "visits" ? (
            filteredVisits.length === 0 ? (
              <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4">
                <Receipt className="w-16 h-16" />
                <p style={{ fontSize: "1rem", fontWeight: 800 }}>Không tìm thấy lịch sử khám</p>
              </div>
            ) : (
              filteredVisits.map(v => <VisitRow key={v.id} visit={v} />)
            )
          ) : (
            <>
              {filteredPurchases.map(o => <PurchaseRow key={o.id} order={o} />)}
              <div className="flex items-center justify-between px-8 py-5 rounded-3xl mt-4"
                style={{ background: "linear-gradient(135deg,#111827,#1f2937)", color: "white" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.95rem", fontWeight: 800 }}>Tổng giá trị mua sắm</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Bao gồm tất cả các đơn hàng đã hoàn tất</p>
                  </div>
                </div>
                <span style={{ fontSize: "1.4rem", fontWeight: 900 }}>${totalPurchases.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </PetOwnerShell>
  );
}
