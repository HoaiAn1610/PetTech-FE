import { useState, useMemo } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Search, Check, Package, Tag, Filter, ChevronDown,
  ShieldAlert, ShoppingCart
} from "lucide-react";
import { detectAllergenConflicts, type AllergenConflict } from "@/data/petProfiles";
import { AllergenWarningModal } from "@/components/petowner/AllergenWarningModal";
import { 
  ProductCard, CartSidebar, type Product, type CartItem 
} from "@/features/petowner/shop/ShopComponents";

type ProductCat = "Tất cả" | "Thức ăn thú cưng" | "Bánh thưởng" | "Phụ kiện" | "Trang trí" | "Dược phẩm";

const PRODUCTS: Product[] = [
  {
    id: "f1", name: "Adult Dog Dry Food", brand: "Royal Canin", category: "Thức ăn thú cưng",
    price: 48.00, originalPrice: 56.00, emoji: "🐶", color: "#d97706", bg: "rgba(217,119,6,0.08)",
    rating: 4.8, reviews: 124, inStock: true, badge: "Bán chạy nhất", weight: "15kg",
    allergenFlags: ["chicken", "wheat", "soy", "corn"],
    ingredients: ["Chicken meal", "Wheat", "Brown rice", "Soy protein", "Corn gluten", "Fish oil"],
  },
  {
    id: "f2", name: "Science Diet Cat Food", brand: "Hill's", category: "Thức ăn thú cưng",
    price: 42.50, emoji: "🐱", color: "#d97706", bg: "rgba(217,119,6,0.08)",
    rating: 4.7, reviews: 89, inStock: true, weight: "7kg",
    allergenFlags: ["wheat", "corn", "chicken", "soy"],
    ingredients: ["Chicken", "Whole grain wheat", "Corn gluten meal", "Soy fiber", "Animal fat"],
  },
  {
    id: "f3", name: "Pro Plan Puppy Chicken", brand: "Purina", category: "Thức ăn thú cưng",
    price: 38.00, emoji: "🐕", color: "#d97706", bg: "rgba(217,119,6,0.08)",
    rating: 4.9, reviews: 203, inStock: true, badge: "Mới", weight: "12kg",
    allergenFlags: ["chicken", "beef", "soy"],
    ingredients: ["Chicken", "Beef meal", "Brewers rice", "Soy protein isolate", "Egg product"],
  },
  {
    id: "f4", name: "Kitten Dry Formula", brand: "Royal Canin", category: "Thức ăn thú cưng",
    price: 29.90, emoji: "😺", color: "#d97706", bg: "rgba(217,119,6,0.08)",
    rating: 4.6, reviews: 67, inStock: true, weight: "4kg",
    allergenFlags: ["wheat", "corn", "chicken"],
    ingredients: ["Chicken meal", "Corn", "Wheat gluten", "Chicken fat", "Rice"],
  },
  {
    id: "f5", name: "Adult Dog Wet Food", brand: "Pedigree", category: "Thức ăn thú cưng",
    price: 24.00, emoji: "🥣", color: "#d97706", bg: "rgba(217,119,6,0.08)",
    rating: 4.4, reviews: 45, inStock: true, weight: "12×400g",
    allergenFlags: ["beef", "soy", "wheat"],
    ingredients: ["Beef", "Soy flour", "Wheat starch", "Minerals", "Vitamins"],
  },
  {
    id: "t1", name: "Tuna & Shrimp Pate", brand: "Whiskas", category: "Bánh thưởng",
    price: 12.90, emoji: "🐟", color: "#0891b2", bg: "rgba(8,145,178,0.08)",
    rating: 4.7, reviews: 156, inStock: true, badge: "🐱 Mèo yêu thích", weight: "12×85g",
    allergenFlags: ["fish", "shrimp"],
    ingredients: ["Tuna", "Shrimp", "Fish broth", "Minerals", "Vitamins"],
  },
  {
    id: "t2", name: "Temptations Original", brand: "Temptations", category: "Bánh thưởng",
    price: 8.50, emoji: "🍗", color: "#0891b2", bg: "rgba(8,145,178,0.08)",
    rating: 4.9, reviews: 342, inStock: true, badge: "Đánh giá cao nhất", weight: "200g",
    allergenFlags: ["wheat", "corn", "chicken"],
    ingredients: ["Chicken", "Ground corn", "Wheat flour", "Chicken fat", "Digest of liver"],
  },
  {
    id: "t3", name: "Dentastix Daily Dental", brand: "Pedigree", category: "Bánh thưởng",
    price: 14.00, emoji: "🦷", color: "#0891b2", bg: "rgba(8,145,178,0.08)",
    rating: 4.5, reviews: 88, inStock: true, weight: "28 thanh",
    allergenFlags: ["wheat"],
    ingredients: ["Wheat starch", "Rice flour", "Glycerin", "Gelatin", "Sodium tripolyphosphate"],
  },
  {
    id: "t4", name: "Blue Dog Biscuits", brand: "Blue Buffalo", category: "Bánh thưởng",
    price: 11.25, emoji: "🍪", color: "#0891b2", bg: "rgba(8,145,178,0.08)",
    rating: 4.6, reviews: 72, inStock: true, weight: "340g",
    allergenFlags: ["wheat", "chicken"],
    ingredients: ["Chicken", "Whole wheat flour", "Oat flour", "Peas", "Flaxseed"],
  },
  {
    id: "t5", name: "Chicken Pate Premium", brand: "Sheba", category: "Bánh thưởng",
    price: 16.80, originalPrice: 19.90, emoji: "🥩", color: "#0891b2", bg: "rgba(8,145,178,0.08)",
    rating: 4.8, reviews: 94, inStock: true, weight: "6×85g",
    allergenFlags: ["chicken"],
    ingredients: ["Chicken", "Chicken broth", "Chicken liver", "Minerals", "Vitamins"],
  },
  {
    id: "s1", name: "Stainless Steel Bowl", brand: "PetPro", category: "Phụ kiện",
    price: 18.90, emoji: "🥣", color: "#16a34a", bg: "rgba(22,163,74,0.08)",
    rating: 4.5, reviews: 38, inStock: true,
    allergenFlags: [],
  },
  {
    id: "s2", name: "Self-Cleaning Litter", brand: "LitterMaid", category: "Phụ kiện",
    price: 129.00, originalPrice: 149.00, emoji: "📦", color: "#16a34a", bg: "rgba(22,163,74,0.08)",
    rating: 4.3, reviews: 52, inStock: true, badge: "Giảm giá",
    allergenFlags: [],
  },
  {
    id: "s3", name: "Portable Pet Carrier", brand: "PetAir", category: "Phụ kiện",
    price: 45.00, emoji: "🧳", color: "#16a34a", bg: "rgba(22,163,74,0.08)",
    rating: 4.7, reviews: 63, inStock: true,
    allergenFlags: [],
  },
  {
    id: "s4", name: "Premium Cat Litter 10L", brand: "ClumpMax", category: "Phụ kiện",
    price: 15.50, emoji: "🪣", color: "#16a34a", bg: "rgba(22,163,74,0.08)",
    rating: 4.4, reviews: 101, inStock: true,
    allergenFlags: [],
  },
  {
    id: "s5", name: "Pet Water Fountain", brand: "PetCo", category: "Phụ kiện",
    price: 36.00, emoji: "💧", color: "#16a34a", bg: "rgba(22,163,74,0.08)",
    rating: 4.6, reviews: 47, inStock: false,
    allergenFlags: [],
  },
  {
    id: "a1", name: "Leather Dog Collar (M)", brand: "PawStyle", category: "Trang trí",
    price: 22.00, emoji: "🏷️", color: "#7c3aed", bg: "rgba(124,58,237,0.08)",
    rating: 4.5, reviews: 29, inStock: true,
    allergenFlags: [],
  },
  {
    id: "a2", name: "Retractable Leash 5m", brand: "FlexyPet", category: "Trang trí",
    price: 28.50, emoji: "🔗", color: "#7c3aed", bg: "rgba(124,58,237,0.08)",
    rating: 4.4, reviews: 44, inStock: true,
    allergenFlags: [],
  },
  {
    id: "a3", name: "Cat Harness + Leash", brand: "CatWalk", category: "Trang trí",
    price: 19.90, emoji: "🐈", color: "#7c3aed", bg: "rgba(124,58,237,0.08)",
    rating: 4.3, reviews: 33, inStock: true, badge: "Mới",
    allergenFlags: [],
  },
  {
    id: "a4", name: "Interactive Feather Wand", brand: "PlayPet", category: "Trang trí",
    price: 9.90, emoji: "🪶", color: "#7c3aed", bg: "rgba(124,58,237,0.08)",
    rating: 4.8, reviews: 127, inStock: true,
    allergenFlags: [],
  },
  {
    id: "a5", name: "Kong Classic Chew Toy", brand: "Kong", category: "Trang trí",
    price: 15.00, emoji: "🎾", color: "#7c3aed", bg: "rgba(124,58,237,0.08)",
    rating: 4.9, reviews: 286, inStock: true, badge: "Bán chạy nhất",
    allergenFlags: [],
  },
  {
    id: "p1", name: "Omega-3 Supplement", brand: "VetHealth", category: "Dược phẩm",
    price: 24.00, emoji: "💊", color: "#2563EB", bg: "rgba(37,99,235,0.08)",
    rating: 4.6, reviews: 57, inStock: true,
    allergenFlags: ["fish"],
    ingredients: ["Salmon oil", "Fish gelatin capsule", "Vitamin E"],
  },
  {
    id: "p2", name: "Probiotic Chews", brand: "NutriPet", category: "Dược phẩm",
    price: 18.50, emoji: "🧪", color: "#2563EB", bg: "rgba(37,99,235,0.08)",
    rating: 4.5, reviews: 39, inStock: true,
    allergenFlags: ["beef", "wheat"],
    ingredients: ["Beef liver", "Wheat bran", "Lactobacillus acidophilus", "Bifidobacterium"],
  },
  {
    id: "p3", name: "Flea & Tick Spray", brand: "PestAway", category: "Dược phẩm",
    price: 19.00, emoji: "🛡️", color: "#2563EB", bg: "rgba(37,99,235,0.08)",
    rating: 4.4, reviews: 66, inStock: true,
    allergenFlags: [],
    ingredients: ["Fipronil 0.25%", "Isopropyl alcohol", "Water"],
  },
];

const CATEGORIES: { label: ProductCat; emoji: string }[] = [
  { label: "Tất cả",           emoji: "🏪" },
  { label: "Thức ăn thú cưng",      emoji: "🥗" },
  { label: "Bánh thưởng", emoji: "🍗" },
  { label: "Phụ kiện",  emoji: "🛒" },
  { label: "Trang trí",   emoji: "🏷️" },
  { label: "Dược phẩm",      emoji: "💊" },
];

export default function PetOwnerShopPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<ProductCat>("Tất cả");
  const [cart,     setCart]     = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered,  setOrdered]  = useState(false);

  const [pendingProduct,  setPendingProduct]  = useState<Product | null>(null);
  const [pendingConflicts, setPendingConflicts] = useState<AllergenConflict[]>([]);

  const cartTotal = cart.reduce((s, i) => s + i.qty, 0);

  function tryAddToCart(product: Product) {
    const conflicts = detectAllergenConflicts(product.allergenFlags);
    if (conflicts.length > 0) {
      setPendingProduct(product);
      setPendingConflicts(conflicts);
    } else {
      commitAddToCart(product, false);
    }
  }

  function commitAddToCart(product: Product, hasAllergenWarning: boolean) {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1, hasAllergenWarning }];
    });
  }

  function handleWarningAddAnyway() {
    if (pendingProduct) commitAddToCart(pendingProduct, true);
    setPendingProduct(null);
    setPendingConflicts([]);
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  }

  const productConflicts = useMemo(() =>
    Object.fromEntries(PRODUCTS.map(p => [p.id, detectAllergenConflicts(p.allergenFlags)])),
    []
  );

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const q = search.toLowerCase();
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const matchCat = category === "Tất cả" || p.category === category;
    return matchQ && matchCat;
  }), [search, category]);

  function handleCheckout() {
    setShowCart(false);
    setOrdered(true);
    setCart([]);
    setTimeout(() => setOrdered(false), 4000);
  }

  const alertCount = Object.values(productConflicts).filter(c => c.length > 0).length;

  return (
    <PetOwnerShell pageTitle="Cửa hàng thú cưng" cartCount={cartTotal}>
      {ordered && (
        <div className="fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          style={{ background: "#111827", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <Check className="w-5 h-5 flex-shrink-0" style={{ color: "#22c55e" }} />
          <div>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>Đặt hàng thành công! 🎉</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>Hệ thống sẽ thông báo khi đơn hàng được gửi đi.</p>
          </div>
        </div>
      )}

      {pendingProduct && (
        <AllergenWarningModal
          productName={pendingProduct.name}
          productEmoji={pendingProduct.emoji}
          conflicts={pendingConflicts}
          onAddAnyway={handleWarningAddAnyway}
          onCancel={() => { setPendingProduct(null); setPendingConflicts([]); }}
        />
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-6" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>Cửa hàng thú cưng 🛍️</h2>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "2px" }}>
              Sản phẩm cao cấp được bác sĩ thú y khuyên dùng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <p style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 700 }}>
                {alertCount} sản phẩm có nguy cơ dị ứng
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-100">
              <Tag className="w-4 h-4 text-orange-600" />
              <p style={{ fontSize: "0.78rem", color: "#ea580c", fontWeight: 700 }}>Giảm 10% cho thành viên!</p>
            </div>
            <button onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-100"
              style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white" }}>
              <ShoppingCart className="w-4 h-4" />
              <span style={{ fontSize: "0.88rem", fontWeight: 800 }}>Giỏ hàng ({cartTotal})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên, thương hiệu…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none border-2 border-gray-100 focus:border-blue-200 transition-all"
              style={{ background: "white", fontSize: "0.9rem", color: "#374151" }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.label} onClick={() => setCategory(c.label)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
                style={{
                  background: category === c.label ? "#111827" : "white",
                  border: "1.5px solid",
                  borderColor: category === c.label ? "#111827" : "#e5e7eb",
                  color: category === c.label ? "white" : "#6b7280",
                }}>
                <span>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9ca3af" }}>HIỂN THỊ {filtered.length} SẢN PHẨM</p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 text-xs font-bold text-gray-500">
              <Filter className="w-3.5 h-3.5" /> SẮP XẾP: NỔI BẬT <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 opacity-30">
              <Package className="w-16 h-16" />
              <p style={{ fontSize: "1rem", fontWeight: 800 }}>Không tìm thấy sản phẩm</p>
            </div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {filtered.map(p => (
                <ProductCard
                  key={p.id} product={p}
                  qty={cart.find(i => i.product.id === p.id)?.qty ?? 0}
                  conflicts={productConflicts[p.id]}
                  onAdd={() => tryAddToCart(p)}
                  onRemove={() => removeFromCart(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <CartSidebar
          cart={cart}
          onUpdate={(id, delta) => delta > 0 ? tryAddToCart(PRODUCTS.find(p => p.id === id)!) : removeFromCart(id)}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}
    </PetOwnerShell>
  );
}
