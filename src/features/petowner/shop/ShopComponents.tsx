import { useState } from "react";
import { 
  AlertTriangle, Heart, Star, ShoppingCart, X, Truck, Minus, Plus, ShieldAlert 
} from "lucide-react";
import { AllergenConflict } from "@/data/petProfiles";

export interface Product {
  id: string; name: string; brand: string; category: string;
  price: number; originalPrice?: number; emoji: string;
  color: string; bg: string; rating: number; reviews: number;
  inStock: boolean; badge?: string; weight?: string;
  allergenFlags: string[];
  ingredients?: string[];
}

export interface CartItem {
  product: Product;
  qty: number;
  hasAllergenWarning: boolean;
}

// ─── Allergen Shield Badge ──────────────────────────────────────────────────
export function AllergenShieldBadge({ conflicts }: { conflicts: AllergenConflict[] }) {
  if (conflicts.length === 0) return null;
  const hasSevere = conflicts.some(c => c.severity === "severe");
  const hasModerate = conflicts.some(c => c.severity === "moderate");
  const color = hasSevere ? "#7c3aed" : hasModerate ? "#dc2626" : "#ea580c";
  const bg = hasSevere ? "rgba(124,58,237,0.12)" : hasModerate ? "rgba(220,38,38,0.1)" : "rgba(249,115,22,0.1)";
  const label = hasSevere ? "Dị ứng nghiêm trọng" : hasModerate ? "Cảnh báo dị ứng" : "Dị ứng nhẹ";
  return (
    <div
      className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg"
      style={{ background: bg, border: `1px solid ${color}30` }}
    >
      <AlertTriangle className="w-3 h-3" style={{ color }} />
      <span style={{ fontSize: "0.58rem", fontWeight: 800, color, letterSpacing: "0.03em" }}>{label}</span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
export function ProductCard({ product, qty, onAdd, onRemove, conflicts }: {
  product: Product; qty: number; onAdd: () => void; onRemove: () => void;
  conflicts: AllergenConflict[];
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const hasConflict = conflicts.length > 0;
  const hasSevere   = conflicts.some(c => c.severity === "severe");

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-all"
      style={{
        background: "white",
        border: hasConflict ? `1.5px solid ${hasSevere ? "rgba(124,58,237,0.35)" : "rgba(220,38,38,0.3)"}` : "1.5px solid #e5e7eb",
        boxShadow: hasConflict ? `0 2px 12px ${hasSevere ? "rgba(124,58,237,0.1)" : "rgba(220,38,38,0.08)"}` : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="relative flex items-center justify-center py-8" style={{ background: product.bg }}>
        <span className="text-5xl">{product.emoji}</span>
        {product.badge && (
          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full"
            style={{ background: "#F97316", fontSize: "0.62rem", fontWeight: 800, color: "white" }}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-8 px-2.5 py-1 rounded-full"
            style={{ background: "#dc2626", fontSize: "0.62rem", fontWeight: 800, color: "white" }}>
            -{discount}%
          </span>
        )}
        <button onClick={() => setWishlisted(v => !v)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: wishlisted ? "#fee2e2" : "rgba(255,255,255,0.9)" }}>
          <Heart className="w-3.5 h-3.5" style={{ color: wishlisted ? "#dc2626" : "#9ca3af", fill: wishlisted ? "#dc2626" : "none" }} />
        </button>
        <AllergenShieldBadge conflicts={conflicts} />
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
        <p style={{ fontSize: "0.62rem", color: "#9ca3af", fontWeight: 600 }}>{product.brand}</p>
        <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827", lineHeight: 1.3, marginTop: "2px" }}>{product.name}</p>
        {product.weight && <p style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "2px" }}>{product.weight}</p>}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#374151" }}>{product.rating}</span>
          <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span style={{ fontSize: "0.75rem", color: "#9ca3af", textDecoration: "line-through" }}>${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {hasConflict && (
          <div className="mt-1.5 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 flex-shrink-0" style={{ color: hasSevere ? "#7c3aed" : "#dc2626" }} />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: hasSevere ? "#7c3aed" : "#dc2626" }}>
              Xung đột dị ứng — {conflicts.map(c => c.petName).join(", ")}
            </span>
          </div>
        )}

        <div className="mt-3">
          {!product.inStock ? (
            <div className="w-full py-2 rounded-xl text-center"
              style={{ background: "#f3f4f6", fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af" }}>
              Hết hàng
            </div>
          ) : qty === 0 ? (
            <button
              onClick={onAdd}
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              style={{
                background: hasConflict
                  ? (hasSevere ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "linear-gradient(135deg,#dc2626,#b91c1c)")
                  : "linear-gradient(135deg,#2563EB,#1d4ed8)",
                fontSize: "0.78rem", fontWeight: 700, color: "white",
              }}
            >
              {hasConflict && <AlertTriangle className="w-3.5 h-3.5" />}
              {hasConflict ? "Thêm (Nguy cơ dị ứng)" : <><Plus className="w-3.5 h-3.5" /> Thêm vào giỏ</>}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={onRemove} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-200" style={{ background: "#f3f4f6" }}>
                <Minus className="w-3.5 h-3.5" style={{ color: "#374151" }} />
              </button>
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{qty}</span>
              <button onClick={onAdd} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: "#2563EB" }}>
                <Plus className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────
export function CartSidebar({ cart, onUpdate, onCheckout, onClose }: {
  cart: CartItem[]; onUpdate: (id: string, delta: number) => void;
  onCheckout: () => void; onClose: () => void;
}) {
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const warningItems = cart.filter(i => i.hasAllergenWarning);

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" style={{ fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
      <div className="relative h-full w-96 flex flex-col animate-in slide-in-from-right duration-300"
        style={{ background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
            🛒 Giỏ hàng ({cart.reduce((s, i) => s + i.qty, 0)} sản phẩm)
          </p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ background: "#f3f4f6" }}>
            <X className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
        </div>

        {warningItems.length > 0 && (
          <div className="mx-4 mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(220,38,38,0.05)", border: "1.5px solid rgba(220,38,38,0.2)" }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#dc2626" }}>
                ⚠️ {warningItems.length} sản phẩm có xung đột dị ứng
              </p>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "1px" }}>
                Vui lòng xem lại kỹ trước khi thanh toán.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 opacity-40">
              <ShoppingCart className="w-16 h-16" />
              <p style={{ fontSize: "1rem", fontWeight: 700 }}>Giỏ hàng trống</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: "#f3f4f6" }}>
              {cart.map(({ product: p, qty, hasAllergenWarning }) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <div className="w-full h-full rounded-2xl flex items-center justify-center text-2xl" style={{ background: p.bg }}>
                      {p.emoji}
                    </div>
                    {hasAllergenWarning && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                        style={{ background: "#dc2626", border: "2px solid white" }}>
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>{p.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{p.brand}</p>
                    {hasAllergenWarning && (
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#dc2626" }}>⚠ Nguy cơ dị ứng</p>
                    )}
                    <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#F97316", marginTop: "2px" }}>${(p.price * qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button onClick={() => onUpdate(p.id, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100" style={{ background: "#f3f4f6" }}>
                      <Minus className="w-3.5 h-3.5" style={{ color: "#374151" }} />
                    </button>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", minWidth: "24px", textAlign: "center" }}>{qty}</span>
                    <button onClick={() => onUpdate(p.id, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-blue-50 hover:text-blue-600" style={{ background: "#f3f4f6" }}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6" style={{ borderTop: "1px solid #f3f4f6", background: "#fcfcfd" }}>
          <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <Truck className="w-4 h-4" style={{ color: "#16a34a" }} />
            <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 700 }}>Miễn phí vận chuyển đơn {total >= 30 ? "✓" : "trên $30"}</span>
          </div>
          <div className="flex items-center justify-between mb-5">
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#6b7280" }}>Tổng tiền</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827" }}>${total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} disabled={cart.length === 0}
            className="w-full py-4 rounded-[1.25rem] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-100"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 800, fontSize: "1rem", opacity: cart.length === 0 ? 0.5 : 1 }}>
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
}
