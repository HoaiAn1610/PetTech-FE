import { useState, useMemo } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Filter, Search, Receipt, TrendingUp
} from "lucide-react";
import { VisitRow, PurchaseRow } from "@/features/petowner/history/HistoryComponents";
import { usePortalMedicalHistory, usePortalInvoices } from "@/hooks/petowner/usePortal";

const SERVICE_COLORS: Record<string, { color: string; bg: string; emoji: string }> = {
  "Thú y": { color: "#2563EB", bg: "rgba(37,99,235,0.06)", emoji: "🩺" },
  "Grooming": { color: "#7c3aed", bg: "rgba(124,58,237,0.06)", emoji: "✂️" },
  "Cắt tỉa lông": { color: "#7c3aed", bg: "rgba(124,58,237,0.06)", emoji: "✂️" },
  "Tiêm phòng": { color: "#16a34a", bg: "rgba(22,163,74,0.06)", emoji: "💉" },
};

function mapVisit(v: any) {
  const scheme = SERVICE_COLORS[v.serviceType] ?? SERVICE_COLORS["Thú y"];
  return {
    id: v.id,
    date: v.date ? new Date(v.date).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" }) : "",
    type: v.serviceType ?? v.type ?? "Dịch vụ",
    emoji: scheme.emoji,
    pet: v.petName ?? v.pet ?? "",
    vet: v.staffName ?? v.vet ?? "",
    services: v.services ?? (v.serviceName ? [v.serviceName] : []),
    notes: v.notes ?? "",
    cost: v.totalAmount ?? v.cost ?? 0,
    paid: v.isPaid ?? v.paid ?? true,
    color: scheme.color,
    bg: scheme.bg,
  };
}

function mapInvoice(inv: any) {
  return {
    id: inv.id,
    date: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" }) : "",
    orderNo: inv.invoiceNumber ?? `INV-${inv.id?.slice(0, 8)}`,
    items: inv.items?.map((it: any) => ({
      name: it.productName ?? it.name ?? it.description ?? "",
      qty: it.quantity ?? 1,
      price: it.unitPrice ?? it.price ?? 0,
    })) ?? [],
    total: inv.totalAmount ?? inv.total ?? 0,
    status: inv.status?.toLowerCase() ?? "paid",
    statusLabel: inv.status === "Paid" || inv.status === "paid" ? "Đã thanh toán" : inv.status ?? "Đã thanh toán",
  };
}

export default function PetOwnerHistoryPage() {
  const [tab,    setTab]    = useState<"visits" | "purchases">("visits");
  const [search, setSearch] = useState("");

  const { data: medicalData, isLoading: loadingVisits }     = usePortalMedicalHistory();
  const { data: invoiceData, isLoading: loadingPurchases }  = usePortalInvoices();

  const VISITS = useMemo(() => {
    const raw = (medicalData as any)?.items ?? (Array.isArray(medicalData) ? medicalData : []);
    return raw.map(mapVisit);
  }, [medicalData]);

  const PURCHASES = useMemo(() => {
    const raw = (invoiceData as any)?.items ?? (Array.isArray(invoiceData) ? invoiceData : []);
    return raw.map(mapInvoice);
  }, [invoiceData]);

  const totalVisits    = VISITS.reduce((s: number, v: any) => s + (v.cost ?? 0), 0);
  const totalPurchases = PURCHASES.reduce((s: number, p: any) => s + (p.total ?? 0), 0);

  const filteredVisits = VISITS.filter((v: any) =>
    !search || v.type.toLowerCase().includes(search.toLowerCase()) || v.pet.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPurchases = PURCHASES.filter((o: any) =>
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
            { label: "Tổng lượt khám",  value: loadingVisits ? "…" : VISITS.length,    sub: `${totalVisits.toLocaleString("vi-VN")} ₫ chi phí`,   color: "#2563EB", bg: "rgba(37,99,235,0.06)",  icon: "🩺" },
            { label: "Đơn hàng đã đặt", value: loadingPurchases ? "…" : PURCHASES.length, sub: `${totalPurchases.toLocaleString("vi-VN")} ₫ tổng`, color: "#F97316", bg: "rgba(249,115,22,0.06)", icon: "📦" },
            { label: "Điểm tích lũy",   value: "—",                                    sub: "Xem trong mục Ưu đãi",                               color: "#16a34a", bg: "rgba(22,163,74,0.06)",  icon: "✨" },
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
              { id: "visits",    label: "🩺 Lịch khám", count: loadingVisits ? "…" : VISITS.length    },
              { id: "purchases", label: "📦 Đơn hàng",   count: loadingPurchases ? "…" : PURCHASES.length },
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
            loadingVisits ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              </div>
            ) : filteredVisits.length === 0 ? (
              <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4">
                <Receipt className="w-16 h-16" />
                <p style={{ fontSize: "1rem", fontWeight: 800 }}>Không tìm thấy lịch sử khám</p>
              </div>
            ) : (
              filteredVisits.map((v: any) => <VisitRow key={v.id} visit={v} />)
            )
          ) : (
            <>
              {loadingPurchases ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                </div>
              ) : filteredPurchases.map((o: any) => <PurchaseRow key={o.id} order={o} />)}
              {!loadingPurchases && PURCHASES.length > 0 && (
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
                  <span style={{ fontSize: "1.4rem", fontWeight: 900 }}>{totalPurchases.toLocaleString("vi-VN")} ₫</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PetOwnerShell>
  );
}
