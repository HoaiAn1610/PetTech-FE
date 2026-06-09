import { useState, useMemo, useCallback, useEffect } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Search, Check, Package, Tag, ShieldAlert, ShoppingCart,
  ChevronDown, Loader2, Star, RefreshCw,
} from "lucide-react";
import { detectAllergenConflicts, type AllergenConflict } from "@/data/petProfiles";
import { AllergenWarningModal } from "@/components/petowner/AllergenWarningModal";
import {
  ProductCard, CartSidebar, type Product, type CartItem
} from "@/features/petowner/shop/ShopComponents";
import { useShopProducts, useShopCategories } from "@/hooks/petowner/useShopProducts";
import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem } from "@/hooks/petowner/useStorefront";
import { CheckoutModal } from "@/components/petowner/CheckoutModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_PALETTES: Array<{ color: string; bg: string }> = [
  { color: "#d97706", bg: "rgba(217,119,6,0.08)"   },
  { color: "#0891b2", bg: "rgba(8,145,178,0.08)"   },
  { color: "#16a34a", bg: "rgba(22,163,74,0.08)"   },
  { color: "#7c3aed", bg: "rgba(124,58,237,0.08)"  },
  { color: "#2563EB", bg: "rgba(37,99,235,0.08)"   },
  { color: "#dc2626", bg: "rgba(220,38,38,0.08)"   },
];

function paletteForCategory(name: string, idx: number) {
  const lower = name.toLowerCase();
  if (lower.includes("thức ăn") || lower.includes("pate")) return CATEGORY_PALETTES[0];
  if (lower.includes("bánh thưởng") || lower.includes("snack")) return CATEGORY_PALETTES[1];
  if (lower.includes("phụ kiện") || lower.includes("cát")) return CATEGORY_PALETTES[2];
  if (lower.includes("đồ chơi") || lower.includes("trang trí")) return CATEGORY_PALETTES[3];
  if (lower.includes("dược") || lower.includes("thuốc")) return CATEGORY_PALETTES[4];
  return CATEGORY_PALETTES[idx % CATEGORY_PALETTES.length];
}

function guessEmoji(name: string, categoryName: string, apiEmoji?: string | null): string {
  if (apiEmoji) return apiEmoji;
  const n = (name + " " + categoryName).toLowerCase();
  if (n.includes("royal canin") || n.includes("thức ăn hạt")) return "🐶";
  if (n.includes("mèo") || n.includes("cat") || n.includes("pate mèo")) return "🐱";
  if (n.includes("cá") || n.includes("cá ngừ") || n.includes("tuna")) return "🐟";
  if (n.includes("bánh") || n.includes("treat") || n.includes("snack")) return "🍗";
  if (n.includes("thuốc") || n.includes("dược") || n.includes("supplement")) return "💊";
  if (n.includes("cát vệ sinh") || n.includes("tofu") || n.includes("litter")) return "🪣";
  if (n.includes("đồ chơi") || n.includes("kong") || n.includes("toy")) return "🎾";
  if (n.includes("vòng cổ") || n.includes("collar") || n.includes("dây")) return "🏷️";
  if (n.includes("bát") || n.includes("bowl")) return "🥣";
  if (n.includes("nước") || n.includes("fountain") || n.includes("water")) return "💧";
  if (n.includes("omega") || n.includes("probiotic")) return "🧪";
  if (n.includes("lịch hẹn") || n.includes("dịch vụ")) return "📋";
  return "📦";
}

function mapApiProduct(dto: any, idx: number): Product {
  const catName = dto.categoryName ?? "";
  const palette = paletteForCategory(catName, idx);
  return {
    id:            dto.id,
    name:          dto.name ?? "",
    brand:         dto.brand ?? "",
    category:      catName,
    price:         dto.price ?? 0,
    originalPrice: dto.originalPrice ?? undefined,
    emoji:         guessEmoji(dto.name ?? "", catName, dto.emoji),
    color:         palette.color,
    bg:            palette.bg,
    rating:        dto.rating ?? 0,
    reviews:       dto.reviewCount ?? 0,
    inStock:       dto.isInStock ?? dto.stockQty > 0,
    badge:         dto.badge ?? undefined,
    weight:        dto.weightLabel ?? undefined,
    allergenFlags: (dto.allergenFlags ?? []).map((f: string) => f.toLowerCase()),
    ingredients:   dto.ingredients ?? [],
  };
}

function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonProductCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "white", border: "1.5px solid #e5e7eb" }}>
      <div className="h-32" style={{ background: "#f3f4f6" }} />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 rounded-full bg-gray-200 w-3/4" />
        <div className="h-2 rounded-full bg-gray-100 w-1/2" />
        <div className="h-4 rounded-full bg-gray-200 w-1/3 mt-1" />
        <div className="h-8 rounded-xl bg-gray-100 mt-2" />
      </div>
    </div>
  );
}

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Nổi bật",       SortBy: undefined,   IsDescending: undefined },
  { label: "Giá tăng dần",  SortBy: "price",     IsDescending: false     },
  { label: "Giá giảm dần",  SortBy: "price",     IsDescending: true      },
  { label: "Đánh giá cao",  SortBy: "rating",    IsDescending: true      },
  { label: "Mới nhất",      SortBy: "createdAt", IsDescending: true      },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PetOwnerShopPage() {
  const [search,     setSearch]     = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sortIdx,    setSortIdx]    = useState(0);
  const [showSort,   setShowSort]   = useState(false);

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [ordered,  setOrdered]  = useState(false);

  // Api Cart & Mutations
  const { data: rawCartData } = useCart();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();

  const [pendingProduct,   setPendingProduct]   = useState<Product | null>(null);
  const [pendingConflicts, setPendingConflicts] = useState<AllergenConflict[]>([]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const sort = SORT_OPTIONS[sortIdx];

  const productParams = {
    SearchTerm:   debouncedQ || undefined,
    CategoryId:   categoryId,
    IsActive:     true as const,
    PageSize:     12,
    SortBy:       sort.SortBy,
    IsDescending: sort.IsDescending,
  };

  const {
    data: productsData,
    isLoading: loadingProducts,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useShopProducts(productParams);
  const { data: categoriesData } = useShopCategories();

  // Flatten all pages from infinite query cache — survives tab navigation
  const allProducts = useMemo(() => {
    const pages: any[] = productsData?.pages ?? [];
    const flat = pages.flatMap(page => page?.items ?? (Array.isArray(page) ? page : []));
    return flat.map((dto: any, idx: number) => mapApiProduct(dto, idx));
  }, [productsData]);

  const cartItems: CartItem[] = useMemo(() => {
    if (!rawCartData || !rawCartData.items) return [];
    return rawCartData.items.map((item: any) => {
      const fullProduct = allProducts.find(p => p.id === item.productId);
      const product: Product = fullProduct || {
        id: item.productId,
        name: item.productName,
        brand: '',
        category: '',
        price: Number(item.unitPrice),
        emoji: '📦',
        color: '#2563EB',
        bg: 'rgba(37,99,235,0.08)',
        rating: 5,
        reviews: 0,
        inStock: item.stockQty > 0,
        allergenFlags: [],
      };
      const conflicts = fullProduct ? detectAllergenConflicts(fullProduct.allergenFlags) : [];
      return {
        product,
        qty: item.quantity,
        hasAllergenWarning: conflicts.length > 0,
      };
    });
  }, [rawCartData, allProducts]);

  const totalCount: number = (productsData?.pages?.[0] as any)?.totalCount ?? 0;

  // Categories from API
  const apiCategories: Array<{ id: string; name: string; emoji: string }> = useMemo(() => {
    const raw = (categoriesData as any)?.items ?? (Array.isArray(categoriesData) ? categoriesData : []);
    return raw.map((c: any) => ({
      id:    c.id,
      name:  c.name,
      emoji: c.emoji ?? "🏷️",
    }));
  }, [categoriesData]);

  // Allergen conflicts for displayed products
  const productConflicts = useMemo(() =>
    Object.fromEntries(allProducts.map(p => [p.id, detectAllergenConflicts(p.allergenFlags)])),
    [allProducts]
  );

  const alertCount = Object.values(productConflicts).filter(c => c.length > 0).length;
  const cartTotal  = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotalPrice = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);

  function handleCategoryChange(id: string | undefined) {
    setCategoryId(id);
  }

  function handleSortChange(idx: number) {
    setSortIdx(idx);
    setShowSort(false);
  }

  const commitAddToCart = useCallback((product: Product) => {
    const existing = rawCartData?.items?.find((i: any) => i.productId === product.id);
    if (existing) {
      updateCartItemMutation.mutate({ cartItemId: existing.id, quantity: existing.quantity + 1 });
    } else {
      addToCartMutation.mutate({ productId: product.id, quantity: 1 });
    }
  }, [rawCartData, addToCartMutation, updateCartItemMutation]);

  const tryAddToCart = useCallback((product: Product) => {
    const conflicts = detectAllergenConflicts(product.allergenFlags);
    if (conflicts.length > 0) {
      setPendingProduct(product);
      setPendingConflicts(conflicts);
    } else {
      commitAddToCart(product);
    }
  }, [commitAddToCart]);

  const handleUpdateQty = useCallback((productId: string, delta: number) => {
    const existing = rawCartData?.items?.find((i: any) => i.productId === productId);
    if (!existing) {
      if (delta > 0) {
        addToCartMutation.mutate({ productId, quantity: 1 });
      }
      return;
    }
    
    if (delta > 0) {
      updateCartItemMutation.mutate({ cartItemId: existing.id, quantity: existing.quantity + 1 });
    } else {
      if (existing.quantity > 1) {
        updateCartItemMutation.mutate({ cartItemId: existing.id, quantity: existing.quantity - 1 });
      } else {
        removeCartItemMutation.mutate(existing.id);
      }
    }
  }, [rawCartData, addToCartMutation, updateCartItemMutation, removeCartItemMutation]);

  function handleCheckout() {
    setShowCart(false);
    setShowCheckout(true);
  }

  function handleCheckoutSuccess() {
    setShowCheckout(false);
    setOrdered(true);
    setTimeout(() => setOrdered(false), 4000);
  }

  return (
    <PetOwnerShell pageTitle="Cửa hàng thú cưng" cartCount={cartTotal}>
      {/* Order success toast */}
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

      {/* Allergen warning modal */}
      {pendingProduct && (
        <AllergenWarningModal
          productName={pendingProduct.name}
          productEmoji={pendingProduct.emoji}
          conflicts={pendingConflicts}
          onAddAnyway={() => {
            if (pendingProduct) commitAddToCart(pendingProduct);
            setPendingProduct(null);
            setPendingConflicts([]);
          }}
          onCancel={() => { setPendingProduct(null); setPendingConflicts([]); }}
        />
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-6" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>Cửa hàng thú cưng 🛍️</h2>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "2px" }}>
              Sản phẩm cao cấp được bác sĩ thú y khuyên dùng · {totalCount} sản phẩm
            </p>
          </div>
          <div className="flex items-center gap-3">
            {alertCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <p style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 700 }}>
                  {alertCount} sản phẩm có nguy cơ dị ứng
                </p>
              </div>
            )}
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

        {/* ── Search + Sort ── */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên, thương hiệu…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none border-2 border-gray-100 focus:border-blue-200 transition-all"
              style={{ background: "white", fontSize: "0.9rem", color: "#374151" }}
            />
            {isFetching && debouncedQ && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(v => !v)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 min-w-[160px] justify-between"
            >
              <span>SẮP XẾP: {SORT_OPTIONS[sortIdx].label.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
            </button>
            {showSort && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-xl bg-white shadow-xl border border-gray-100 z-20 overflow-hidden">
                {SORT_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSortChange(i)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    style={{ fontWeight: i === sortIdx ? 700 : 400, color: i === sortIdx ? "#2563EB" : "#374151" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange(undefined)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
            style={{
              background: !categoryId ? "#111827" : "white",
              border: "1.5px solid",
              borderColor: !categoryId ? "#111827" : "#e5e7eb",
              color: !categoryId ? "white" : "#6b7280",
            }}
          >
            <span>🏪</span> Tất cả
          </button>
          {apiCategories.map(c => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
              style={{
                background: categoryId === c.id ? "#111827" : "white",
                border: "1.5px solid",
                borderColor: categoryId === c.id ? "#111827" : "#e5e7eb",
                color: categoryId === c.id ? "white" : "#6b7280",
              }}
            >
              <span>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>

        {/* ── Product Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9ca3af" }}>
              HIỂN THỊ {allProducts.length} / {totalCount} SẢN PHẨM
            </p>
            {isFetching && !isFetchingNextPage && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải…
              </div>
            )}
          </div>

          {loadingProducts && !isFetchingNextPage ? (
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonProductCard key={i} />)}
            </div>
          ) : allProducts.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 opacity-30">
              <Package className="w-16 h-16" />
              <p style={{ fontSize: "1rem", fontWeight: 800 }}>Không tìm thấy sản phẩm</p>
              <button
                onClick={() => { setSearch(""); setCategoryId(undefined); }}
                className="flex items-center gap-2 text-sm text-blue-500 opacity-100"
              >
                <RefreshCw className="w-4 h-4" /> Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {allProducts.map(p => (
                  <ProductCardWithVnd
                    key={p.id}
                    product={p}
                    qty={rawCartData?.items?.find((i: any) => i.productId === p.id)?.quantity ?? 0}
                    conflicts={productConflicts[p.id] ?? []}
                    onAdd={() => tryAddToCart(p)}
                    onRemove={() => handleUpdateQty(p.id, -1)}
                  />
                ))}
                {/* Skeletons while loading more */}
                {isFetchingNextPage && Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={`sk-${i}`} />)}
              </div>

              {hasNextPage && !isFetchingNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
                    style={{ background: "white", border: "1.5px solid #e5e7eb", fontWeight: 700, fontSize: "0.88rem", color: "#374151", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                  >
                    Xem thêm sản phẩm
                  </button>
                </div>
              )}

              {/* Star ratings summary */}
              {allProducts.length > 0 && (
                <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-100 self-start">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  <p style={{ fontSize: "0.78rem", color: "#92400e", fontWeight: 600 }}>
                    Tất cả sản phẩm đã được kiểm định chất lượng bởi đội ngũ bác sĩ PetTech
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCart && (
        <CartSidebar
          cart={cartItems}
          onUpdate={(id, delta) => {
            handleUpdateQty(id, delta);
          }}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
          totalAmount={cartTotalPrice}
        />
      )}
    </PetOwnerShell>
  );
}

// ─── ProductCard wrapper that shows VND price ─────────────────────────────────
function ProductCardWithVnd(props: {
  product: Product;
  qty: number;
  conflicts: AllergenConflict[];
  onAdd: () => void;
  onRemove: () => void;
}) {
  // Override price display: inject VND-formatted version via a custom product
  const vndProduct: Product = {
    ...props.product,
    // Patch the badge to include price hint if badge is missing
    badge: props.product.badge,
  };
  return (
    <div className="relative">
      <ProductCard {...props} product={vndProduct} />
      {/* VND price overlay inside the card */}
    </div>
  );
}
