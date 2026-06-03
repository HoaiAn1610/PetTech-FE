import { CheckCircle2, Printer, Send } from "lucide-react";

type CartItem = { id: string; name: string; price: number; qty: number; icon: string };

interface ReceiptModalProps {
  items: CartItem[];
  total: number;
  discount: number;
  patient: { name: string; phone: string; email: string } | null;
  method: string;
  onClose: () => void;
}

export function ReceiptModal({ items, total, discount, patient, method, onClose }: ReceiptModalProps) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * (discount / 100);
  const tax = (subtotal - discountAmt) * 0.08;
  const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
  
  const formatVND = (amount: number) => amount.toLocaleString('en-US') + ' VND';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}
        onClick={e => e.stopPropagation()}>
        {/* Success header */}
        <div className="flex flex-col items-center gap-3 px-7 py-7"
          style={{ background: "linear-gradient(135deg,#dcfce7,#f0fdf4)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", boxShadow: "0 8px 24px rgba(22,163,74,0.35)" }}>
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Thanh toán thành công!</h2>
            <p style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "2px" }}>Hoá đơn {invoiceNum} · qua {method}</p>
          </div>
        </div>
        {/* Receipt body */}
        <div className="px-6 py-4 flex flex-col gap-2.5">
          {patient && (
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px dashed rgba(0,0,0,0.1)" }}>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{patient.name}</p>
                <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{patient.phone || patient.email}</p>
              </div>
            </div>
          )}
          {items.map(i => (
            <div key={i.id} className="flex justify-between items-center">
              <span style={{ fontSize: "0.78rem", color: "#374151" }}>{i.icon} {i.name} {i.qty > 1 ? `×${i.qty}` : ""}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#111827" }}>{formatVND(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="pt-2 flex flex-col gap-1.5" style={{ borderTop: "1px dashed rgba(0,0,0,0.1)" }}>
            <div className="flex justify-between">
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Tạm tính</span>
              <span style={{ fontSize: "0.72rem", color: "#374151" }}>{formatVND(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span style={{ fontSize: "0.72rem", color: "#16a34a" }}>Giảm giá ({discount}%)</span>
                <span style={{ fontSize: "0.72rem", color: "#16a34a" }}>-{formatVND(discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Thuế (8%)</span>
              <span style={{ fontSize: "0.72rem", color: "#374151" }}>{formatVND(tax)}</span>
            </div>
            <div className="flex justify-between pt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
              <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#111827" }}>Tổng cộng</span>
              <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "var(--primary-theme-color, #2563EB)" }}>{formatVND(total)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 px-6 pb-6">
          <button className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ border: "1.5px solid #e5e7eb", fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>
            <Printer className="w-3.5 h-3.5" /> In
          </button>
          <button className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ border: "1.5px solid #e5e7eb", fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>
            <Send className="w-3.5 h-3.5" /> Email
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black))", color: "white", fontSize: "0.78rem", fontWeight: 700 }}>
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}
