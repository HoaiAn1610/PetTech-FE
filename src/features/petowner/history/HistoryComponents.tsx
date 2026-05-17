import { useState } from "react";
import { 
  CheckCircle2, Download, Star, ChevronDown, ChevronUp, Package, Truck, RotateCcw 
} from "lucide-react";

// ─── Visit Row ────────────────────────────────────────────────────────────────
export function VisitRow({ visit }: { visit: any }) {
  const [expanded, setExpanded] = useState(false);
  const [rated, setRated]       = useState(0);
  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:shadow-md" style={{ background: "white", border: "1.5px solid #e5e7eb" }}>
      <div className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(v => !v)}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: visit.bg }}>{visit.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{visit.type}</p>
            <span className="px-2.5 py-0.5 rounded-full" style={{ background: visit.bg, fontSize: "0.65rem", fontWeight: 800, color: visit.color }}>{visit.pet}</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>{visit.vet} · {visit.services.length} dịch vụ</p>
        </div>
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p style={{ fontSize: "0.9rem", fontWeight: 900, color: "#111827" }}>${visit.cost.toFixed(2)}</p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 500 }}>{visit.date}</p>
          </div>
          {visit.paid && <span className="px-3 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.08)", fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>Đã thanh toán ✓</span>}
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50">
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="px-6 pb-6 flex flex-col gap-5 animate-in slide-in-from-top-2 duration-300" style={{ borderTop: "1px solid #f3f4f6" }}>
          <div className="pt-5 grid grid-cols-2 gap-6">
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "12px" }}>DỊCH VỤ ĐÃ THỰC HIỆN</p>
              <div className="flex flex-col gap-2.5">
                {visit.services.map((s: string) => (
                  <div key={s} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-50">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", marginBottom: "8px" }}>GHI CHÚ THÚ Y</p>
              <p style={{ fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.7, fontWeight: 500 }}>{visit.notes}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", marginBottom: "10px" }}>ĐÁNH GIÁ LƯỢT HẸN</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRated(star)} className="transition-transform hover:scale-110">
                    <Star className="w-5 h-5" style={{ color: star <= rated ? "#f59e0b" : "#e5e7eb", fill: star <= rated ? "#f59e0b" : "none" }} />
                  </button>
                ))}
                {rated > 0 && <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, marginLeft: "8px", alignSelf: "center" }}>Cảm ơn bạn!</span>}
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:bg-blue-600 hover:text-white"
              style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.8rem", fontWeight: 700, color: "#2563EB" }}>
              <Download className="w-4 h-4" /> Tải Hóa đơn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Purchase Row ─────────────────────────────────────────────────────────────
export function PurchaseRow({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:shadow-md" style={{ background: "white", border: "1.5px solid #e5e7eb" }}>
      <div className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(v => !v)}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(249,115,22,0.08)" }}>
          <Package className="w-6 h-6" style={{ color: "#F97316" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Order #{order.orderNo.slice(-6)}</p>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>{order.items.length} sản phẩm</p>
        </div>
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p style={{ fontSize: "0.9rem", fontWeight: 900, color: "#111827" }}>${order.total.toFixed(2)}</p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 500 }}>{order.date}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(22,163,74,0.08)" }}>
            <Truck className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#16a34a" }}>{order.statusLabel}</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50">
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300" style={{ borderTop: "1px solid #f3f4f6" }}>
          <div className="pt-5 flex flex-col gap-3 mb-5">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-3 px-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <p style={{ fontSize: "0.88rem", color: "#111827", fontWeight: 700 }}>{item.name}</p>
                  <p style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 500 }}>Số lượng: {item.qty} · Đơn giá: ${item.price.toFixed(2)}</p>
                </div>
                <p style={{ fontSize: "0.95rem", fontWeight: 900, color: "#111827" }}>${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-6 py-4 rounded-2xl mb-5"
            style={{ background: "white", border: "2px solid #f1f5f9" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#4b5563" }}>Tổng giá trị đơn hàng</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:bg-blue-600 hover:text-white"
              style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.8rem", fontWeight: 700, color: "#2563EB" }}>
              <Download className="w-3.5 h-3.5" /> Tải Hóa đơn
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:bg-gray-200"
              style={{ background: "#f3f4f6", fontSize: "0.8rem", fontWeight: 700, color: "#4b5563" }}>
              <RotateCcw className="w-3.5 h-3.5" /> Mua lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
