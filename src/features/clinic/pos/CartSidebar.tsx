import { Banknote, CreditCard, Minus, Percent, Plus, Receipt, ShoppingCart, Smartphone, User, X } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  owner: string;
  species: string;
  breed: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  icon: string;
}

interface CartSidebarProps {
  selectedPatient: Patient | null;
  setSelectedPatient: (p: Patient | null) => void;
  patientSearch: string;
  setPatientSearch: (s: string) => void;
  filteredPatients: Patient[];
  cart: CartItem[];
  updateQty: (id: string, delta: number) => void;
  discount: number;
  setDiscount: (d: number) => void;
  subtotal: number;
  discountAmt: number;
  tax: number;
  total: number;
  payMethod: string;
  setPayMethod: (m: "card" | "cash" | "mobile") => void;
  handleCharge: () => void;
  processing: boolean;
  clearSale: () => void;
}

export function CartSidebar({
  selectedPatient, setSelectedPatient, patientSearch, setPatientSearch, filteredPatients,
  cart, updateQty, discount, setDiscount, subtotal, discountAmt, tax, total,
  payMethod, setPayMethod, handleCharge, processing, clearSale
}: CartSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col bg-white overflow-hidden" style={{ borderLeft: "1px solid rgba(0,0,0,0.07)" }}>
      {/* Patient lookup */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>BỆNH NHÂN</p>
        {selectedPatient ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-right-2 duration-300"
            style={{ background: "rgba(37,99,235,0.06)", border: "1.5px solid rgba(37,99,235,0.2)" }}>
            <span style={{ fontSize: "1.1rem" }}>{selectedPatient.species === "Dog" ? "🐕" : "🐈"}</span>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{selectedPatient.name}</p>
              <p style={{ fontSize: "0.65rem", color: "#64748b" }}>{selectedPatient.owner}</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="p-1 hover:bg-white rounded-md transition-colors">
              <X className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            <input value={patientSearch} onChange={e => setPatientSearch(e.target.value)} placeholder="Tìm bệnh nhân…"
              className="w-full pl-8 pr-3 py-2.5 rounded-xl outline-none transition-all"
              style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}
              onFocus={e => (e.target.style.borderColor = "#2563EB")} onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.1)")} />
            {patientSearch && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)" }}>
                {filteredPatients.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(""); }}
                    className="w-full flex items-center gap-2.5 px-3 py-3 hover:bg-blue-50 transition-colors text-left border-b last:border-0 border-gray-50">
                    <span className="text-lg">{p.species === "Dog" ? "🐕" : "🐈"}</span>
                    <div>
                      <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{p.name}</p>
                      <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{p.owner} · {p.breed}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "12px" }}>
          GIỎ HÀNG {cart.length > 0 && `· ${cart.reduce((s, i) => s + i.qty, 0)} MỤC`}
        </p>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8" style={{ color: "#cbd5e1" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Giỏ hàng đang trống</p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "4px" }}>Chọn sản phẩm để bắt đầu</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-3 rounded-2xl animate-in slide-in-from-bottom-2 duration-300"
                style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.05)" }}>
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                  <p style={{ fontSize: "0.68rem", color: "#64748b" }}>${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                    style={{ border: "1px solid #e2e8f0" }}>
                    <Minus className="w-3 h-3" />
                  </button>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1e293b", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    style={{ border: "1px solid #e2e8f0" }}>
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary + payment */}
      <div className="px-5 pb-6 pt-4 bg-gray-50/50" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        {/* Discount */}
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-3.5 h-3.5" style={{ color: "#64748b" }} />
          <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#64748b" }}>ƯU ĐÃI</p>
          <div className="flex gap-1.5 ml-auto">
            {[0, 5, 10, 15].map(d => (
              <button key={d} onClick={() => setDiscount(d)}
                className="px-2.5 py-1 rounded-lg transition-all text-[0.65rem] font-bold"
                style={{
                  background: discount === d ? "#2563EB" : "white",
                  color: discount === d ? "white" : "#64748b",
                  border: "1px solid " + (discount === d ? "#2563EB" : "#e2e8f0")
                }}>
                {d === 0 ? "0%" : `${d}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-1.5 mb-5 px-4 py-4 rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="flex justify-between">
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Tạm tính</span>
            <span style={{ fontSize: "0.75rem", color: "#1e293b", fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span style={{ fontSize: "0.75rem", color: "#16a34a" }}>Giảm giá ({discount}%)</span>
              <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 600 }}>-${discountAmt.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Thuế (8%)</span>
            <span style={{ fontSize: "0.75rem", color: "#1e293b", fontWeight: 600 }}>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 mt-1 border-t border-dashed border-gray-200">
            <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "#0f172a" }}>Tổng thanh toán</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 950, color: "#2563EB" }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="flex gap-2 mb-5">
          {[
            { id: "card", icon: CreditCard, label: "Thẻ" },
            { id: "cash", icon: Banknote, label: "Tiền mặt" },
            { id: "mobile", icon: Smartphone, label: "Ví" },
          ].map(m => {
            const Icon = m.icon;
            const active = payMethod === m.id;
            return (
              <button key={m.id} onClick={() => setPayMethod(m.id as any)}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
                style={{
                  border: active ? "2px solid #2563EB" : "1px solid #e2e8f0",
                  background: active ? "#eff6ff" : "white",
                }}>
                <Icon className={"w-4 h-4 " + (active ? "text-blue-600" : "text-gray-400")} />
                <span className={"text-[0.65rem] font-bold " + (active ? "text-blue-700" : "text-gray-500")}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Charge button */}
        <div className="flex flex-col gap-2">
          <button disabled={cart.length === 0 || processing} onClick={handleCharge}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
            style={{
              background: cart.length > 0 ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e2e8f0",
              color: cart.length > 0 ? "white" : "#94a3b8",
              fontWeight: 900, fontSize: "0.95rem",
              boxShadow: cart.length > 0 ? "0 10px 20px -5px rgba(37,99,235,0.4)" : "none",
            }}>
            {processing ? (
              <><div className="w-5 h-5 rounded-full border-[3px] animate-spin border-white/30 border-t-white" /> Đang xử lý…</>
            ) : (
              <><Receipt className="w-5 h-5" /> Thanh toán ${total.toFixed(2)}</>
            )}
          </button>
          {cart.length > 0 && (
            <button onClick={clearSale} className="w-full py-2 rounded-xl text-center text-red-500 hover:bg-red-50 transition-colors text-[0.72rem] font-bold">
              Huỷ giao dịch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
