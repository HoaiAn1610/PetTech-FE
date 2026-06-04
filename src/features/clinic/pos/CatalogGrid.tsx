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
  
  // New props for unpaid medical records feature
  viewMode: "products" | "records";
  setViewMode: (v: "products" | "records") => void;
  pendingInvoices: any[];
  loadingPending: boolean;
  onSelectInvoice: (invoice: any) => void;
  customers: any[];
}

export function CatalogGrid({
  search, setSearch, activeCat, setActiveCat, categories, filteredCatalog, cart, addToCart, onSearchKeyDown,
  viewMode, setViewMode, pendingInvoices, loadingPending, onSelectInvoice, customers
}: CatalogGridProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-r" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
      {/* Search + category bar */}
      <div className="px-6 pt-5 pb-4 flex flex-col gap-3.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        
        {/* Toggle Mode Selector */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode("products")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                viewMode === "products"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-650"
              }`}
            >
              📦 Sản phẩm & Dịch vụ
            </button>
            <button
              onClick={() => setViewMode("records")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "records"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-655"
              }`}
            >
              🩺 Đơn thuốc chờ
              {pendingInvoices.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black leading-none animate-pulse">
                  {pendingInvoices.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {viewMode === "products" && (
          <>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                onKeyDown={onSearchKeyDown}
                placeholder="Tìm theo tên sản phẩm hoặc Quét mã SKU..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white outline-none transition-all shadow-sm"
                style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.95rem", fontFamily: "Inter, sans-serif" }}
                onFocus={e => (e.target.style.borderColor = "var(--primary-theme-color, #2563EB)")} 
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
                    background: activeCat === cat.id ? "var(--primary-theme-color, #2563EB)" : "white",
                    color: activeCat === cat.id ? "white" : "#64748b",
                    border: activeCat === cat.id ? "none" : "1.5px solid rgba(0,0,0,0.08)",
                    boxShadow: activeCat === cat.id ? "0 4px 12px color-mix(in srgb, var(--primary-theme-color, #2563EB) 20%, transparent)" : "none"
                  }}>
                  {cat.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/10">
        {viewMode === "products" ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCatalog.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <button key={item.id} onClick={() => addToCart(item)}
                  className="group relative flex flex-col gap-2.5 p-4 rounded-2xl text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white"
                  style={{
                    border: inCart ? `2px solid ${item.color}` : "1.5px solid rgba(0,0,0,0.07)",
                    boxShadow: inCart ? `0 8px 20px color-mix(in srgb, ${item.color} 15%, transparent)` : "0 2px 8px rgba(0,0,0,0.03)"
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
                      {item.price.toLocaleString('en-US')} VND
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
        ) : (
          <div className="flex flex-col gap-4">
            {loadingPending ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              </div>
            ) : pendingInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <span className="text-3xl mb-2">🎉</span>
                <p className="text-sm font-black text-gray-800">Không có đơn thuốc chờ thanh toán</p>
                <p className="text-xs text-gray-400 mt-1">Tất cả bệnh án từ phòng khám đã được thanh toán xong!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingInvoices.map((inv: any) => {
                  const dateStr = inv.createdAt 
                    ? new Date(inv.createdAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) 
                    : "Vừa xong";
                  
                  const customerName = inv.customerName || customers.find((c: any) => c.id === inv.customerId)?.name || "Khách vãng lai";
                  const petName = inv.petName || "Thú cưng";

                  return (
                    <div 
                      key={inv.id} 
                      className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg flex-shrink-0">
                            🐾
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate">Thú cưng: {petName}</p>
                            <p className="text-[11px] font-bold text-gray-400 mt-0.5 truncate">Chủ nuôi: {customerName}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{dateStr}</span>
                      </div>

                      {/* Prescribed products preview */}
                      <div className="flex-1 bg-gray-50/50 rounded-xl p-2.5 border border-gray-100/50 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-gray-450 uppercase tracking-widest block mb-0.5">Đơn kê gồm ({inv.items?.length || 0}):</span>
                        <div className="max-h-24 overflow-y-auto flex flex-col gap-1 text-[11px] scrollbar-thin pr-1">
                          {inv.items?.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-gray-600">
                              <span className="truncate max-w-[150px]">{it.productName || it.name || "Sản phẩm"}</span>
                              <span className="font-bold flex-shrink-0">x{it.quantity || it.qty || 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Tổng thanh toán</span>
                          <span className="text-sm font-black text-primary">{(inv.total || 0).toLocaleString()} VND</span>
                        </div>
                        
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover transition-all text-xs font-black text-white hover:-translate-y-0.5 shadow-sm shadow-primary/25 active:scale-95"
                        >
                          Thanh toán
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
