import { Search } from "lucide-react";

interface CatalogItem {
  id: string;
  sku?: string;
  cat: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  bg: string;
  stock: number | null;
}

interface Category {
  id: string;
  name: string;
}

interface CatalogGridProps {
  search: string;
  setSearch: (s: string) => void;
  activeCat: string; // This is now categoryId
  setActiveCat: (c: string) => void;
  categories: Category[];
  filteredCatalog: CatalogItem[];
  cart: { id: string; qty: number }[];
  addToCart: (item: CatalogItem) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function CatalogGrid({
  search, setSearch, activeCat, setActiveCat, categories, filteredCatalog, cart, addToCart, onSearchKeyDown
}: CatalogGridProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-r" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
      {/* Search + category bar */}
      <div className="px-6 pt-5 pb-4 flex flex-col gap-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            onKeyDown={onSearchKeyDown}
            placeholder="Tìm theo tên sản phẩm hoặc Quét mã SKU..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white outline-none transition-all shadow-sm"
            style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.95rem", fontFamily: "Inter, sans-serif" }}
            onFocus={e => (e.target.style.borderColor = "#2563EB")} 
            onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.08)")} 
            autoFocus
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              className="px-4 py-2 rounded-full flex-shrink-0 transition-all active:scale-95 whitespace-nowrap"
              style={{
                fontSize: "0.75rem", fontWeight: 700,
                background: activeCat === cat.id ? "#2563EB" : "white",
                color: activeCat === cat.id ? "white" : "#64748b",
                border: activeCat === cat.id ? "none" : "1.5px solid rgba(0,0,0,0.08)",
                boxShadow: activeCat === cat.id ? "0 4px 12px rgba(37,99,235,0.2)" : "none"
              }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCatalog.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <button key={item.id} onClick={() => addToCart(item)}
                className="group relative flex flex-col gap-2.5 p-4 rounded-2xl text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white"
                style={{
                  border: inCart ? `2px solid ${item.color}` : "1.5px solid rgba(0,0,0,0.07)",
                  boxShadow: inCart ? `0 8px 20px ${item.color}15` : "0 2px 8px rgba(0,0,0,0.03)"
                }}>
                {inCart && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in"
                    style={{ background: item.color, fontSize: "0.75rem", fontWeight: 800 }}>
                    {inCart.qty}
                  </span>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                  style={{ background: item.bg }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{item.name}</p>
                  <p style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "3px" }}>
                    {item.stock !== null && item.stock !== undefined ? `Tồn kho: ${item.stock}` : item.cat}
                  </p>
                </div>
                <div className="flex items-end justify-between mt-1 w-full">
                  <p style={{ fontSize: "1.1rem", fontWeight: 900, color: item.color }}>
                    ${item.price}
                  </p>
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span style={{ fontSize: "1rem", color: item.color }}>+</span>
                  </div>
                </div>
              </button>
            );
          })}
          
          {filteredCatalog.length === 0 && (
             <div className="col-span-full py-10 text-center text-gray-500">
               Không tìm thấy sản phẩm nào.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
