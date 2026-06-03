import { Banknote, CreditCard, Minus, Percent, Plus, Receipt, ShoppingCart, Smartphone, User, X, AlertTriangle, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { posService } from "@/api/services";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Pet {
  id: string;
  name: string;
  species?: string;
  breed?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  icon: string;
  hasAllergenWarning?: boolean;
}

interface CartSidebarProps {
  selectedPatient: Customer | null;
  setSelectedPatient: (p: Customer | null) => void;
  patientSearch: string;
  setPatientSearch: (s: string) => void;
  filteredPatients: Customer[];
  selectedPet: Pet | null;
  setSelectedPet: (p: Pet | null) => void;
  pets: Pet[];
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  activeInvoiceId: string | null;
  setActiveInvoiceId: (id: string | null) => void;
  autoLoadParam: string | null;
  updateQty: (id: string, delta: number) => void;
  discount: number;
  setDiscount: (d: number) => void;
  subtotal: number;
  discountAmt: number;
  tax: number;
  total: number;
  payMethod: string;
  setPayMethod: (m: "card" | "cash" | "mobile" | "payos") => void;
  handleCharge: () => void;
  processing: boolean;
  clearSale: () => void;
}

export function CartSidebar({
  selectedPatient, setSelectedPatient, patientSearch, setPatientSearch, filteredPatients,
  selectedPet, setSelectedPet, pets,
  cart, setCart, activeInvoiceId, setActiveInvoiceId, autoLoadParam,
  updateQty, discount, setDiscount, subtotal, discountAmt, tax, total,
  payMethod, setPayMethod, handleCharge, processing, clearSale
}: CartSidebarProps) {
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [showDiscountMenu, setShowDiscountMenu] = useState(false);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const formatVND = (amount: number) => amount.toLocaleString('en-US') + ' VND';

  // Fetch pending invoices when patient changes
  useEffect(() => {
    const fetchPending = async () => {
      if (!selectedPatient) {
        setPendingInvoices([]);
        return;
      }
      setLoadingPending(true);
      try {
        const res = await posService.getPendingInvoices({ status: "Pending", pageSize: 50 });
        const items = res?.items || res?.data?.items || res?.data || res?.value || [];
        // Filter on client-side by matching customerId
        const filtered = items.filter((inv: any) => inv.customerId === selectedPatient.id);
        setPendingInvoices(filtered);
      } catch (err) {
        console.error("Lỗi lấy hóa đơn chờ:", err);
      } finally {
        setLoadingPending(false);
      }
    };
    fetchPending();
  }, [selectedPatient]);

  const handleLoadInvoice = (invoice: any) => {
    if (!invoice || !invoice.items) return;
    const mappedItems = invoice.items.map((it: any) => ({
      id: it.productId || it.id,
      name: it.productName || it.name || "Sản phẩm",
      price: it.price || 0,
      qty: it.quantity || it.qty || 1,
      icon: it.icon || it.emoji || "📦",
      hasAllergenWarning: it.hasAllergenWarning || false
    }));
    setCart(mappedItems);
    setActiveInvoiceId(invoice.id);
    toast.success("Đã nạp đơn thuốc chờ từ phòng khám vào giỏ hàng!");
  };

  // Auto load pending invoice if autoLoadInvoice URL parameter is true
  useEffect(() => {
    if (autoLoadParam === "true" && pendingInvoices.length > 0 && cart.length === 0) {
      handleLoadInvoice(pendingInvoices[0]);
    }
  }, [pendingInvoices, autoLoadParam]);

  return (
    <div className="w-[420px] xl:w-[450px] flex-shrink-0 h-full flex flex-col bg-white overflow-hidden border-l border-gray-100 shadow-sm">
      
      {/* 2. KHU VỰC KHÁCH HÀNG (Top - Extremely Compact) */}
      <div className="px-3 py-2 border-b border-gray-50 flex-shrink-0">
        {selectedPatient ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-xs font-black text-primary truncate">{selectedPatient.name}</span>
              </div>
              <button onClick={() => { setSelectedPatient(null); setIsSearchingCustomer(false); }} className="p-0.5 hover:bg-primary/20 rounded text-primary/70 hover:text-primary flex-shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <select
              value={selectedPet?.id || ""}
              onChange={(e) => setSelectedPet(pets.find(p => p.id === e.target.value) || null)}
              className="w-[140px] px-2.5 py-1.5 text-xs font-extrabold rounded-xl outline-none border border-gray-200 bg-gray-50 focus:border-primary text-gray-700 transition-colors cursor-pointer flex-shrink-0"
            >
              <option value="">Chọn pet...</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.species ? `(${p.species})` : ""}</option>
              ))}
            </select>
          </div>
        ) : (
          isSearchingCustomer ? (
            <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input 
                autoFocus
                value={patientSearch} 
                onChange={e => setPatientSearch(e.target.value)} 
                placeholder="Tìm tên, SĐT khách hàng..."
                className="w-full pl-8 pr-8 py-1.5 text-xs font-bold rounded-xl outline-none border border-gray-200 focus:border-primary transition-colors bg-white"
              />
              <button 
                onClick={() => { setIsSearchingCustomer(false); setPatientSearch(""); }} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-3 h-3" />
              </button>
              
              {patientSearch && (
                <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white max-h-48 overflow-y-auto">
                  {filteredPatients.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(""); setIsSearchingCustomer(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-primary/5 transition-colors text-left border-b last:border-0 border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate">{p.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 truncate">{p.phone} {p.email && `· ${p.email}`}</p>
                      </div>
                    </button>
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="px-3 py-3 text-center text-xs text-gray-500">
                      Không tìm thấy khách hàng
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchingCustomer(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs font-black text-gray-500 hover:bg-primary/5 hover:text-primary hover:border-primary/35 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm khách hàng / Thú cưng
            </button>
          )
        )}
      </div>

      {/* 3. KHU VỰC GIỎ HÀNG (Middle - Priority Max Flex-Grow & Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50/20 scrollbar-thin">
        {/* Banner: Pending Invoices Found */}
        {pendingInvoices.length > 0 && !activeInvoiceId && (
          <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between gap-3 shadow-sm animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">🩺</span>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-primary truncate">Có đơn thuốc chờ thanh toán</p>
                <p className="text-[9px] font-bold text-primary/85 mt-0.5">Tự động sinh từ phòng khám</p>
              </div>
            </div>
            <button 
              onClick={() => handleLoadInvoice(pendingInvoices[0])}
              className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover transition-colors text-[10px] font-black text-white uppercase tracking-wider flex-shrink-0 shadow-sm shadow-primary/20"
            >
              Nạp đơn thuốc
            </button>
          </div>
        )}

        {/* Banner: Active Invoice Matched */}
        {activeInvoiceId && (
          <div className="mb-3 p-3 bg-green-50/90 border border-green-100 rounded-xl flex items-center justify-between gap-3 shadow-sm animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">💳</span>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-green-950 truncate">Khớp đơn thuốc phòng khám</p>
                <p className="text-[9px] font-bold text-green-700/85 mt-0.5">Đơn nháp: #{activeInvoiceId.substring(0, 8)}...</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setActiveInvoiceId(null);
                setCart([]);
                toast.info("Đã hủy khớp đơn thuốc. Bạn có thể thanh toán đơn mới.");
              }}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-[10px] font-black text-red-650 uppercase tracking-wider flex-shrink-0"
            >
              Hủy khớp
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] gap-2.5 opacity-60">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-gray-500">Giỏ hàng đang trống</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">Vui lòng bấm chọn sản phẩm để thanh toán</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2 px-3 rounded-xl bg-white border border-gray-100 shadow-sm animate-in slide-in-from-bottom-1 duration-200"
                style={{ 
                  background: item.hasAllergenWarning ? "#fff5f5" : "white", 
                  borderColor: item.hasAllergenWarning ? "#feb2b2" : "#f1f5f9" 
                }}>
                <span className="text-xl bg-gray-50 p-1.5 rounded-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <p className="text-xs font-black text-gray-800 truncate" style={{ color: item.hasAllergenWarning ? "#9b2c2c" : "#1e293b" }}>
                      {item.name}
                    </p>
                    {item.hasAllergenWarning && <span title="Cảnh báo dị ứng" className="flex-shrink-0 flex items-center"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /></span>}
                  </div>
                  <p className="text-[10px] font-black mt-0.5" style={{ color: item.hasAllergenWarning ? "#c53030" : "#64748b" }}>{formatVND(item.price)}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-0.5 border border-gray-100/80">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 hover:text-red-600 transition-all">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black text-gray-850 w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. KHU VỰC THANH TOÁN (Bottom - Extremely Compact) */}
      <div className="px-3 py-3 bg-white border-t border-gray-50 shadow-[0_-4px_20px_rgba(0,0,0,0.01)] flex-shrink-0">
        
        {/* Discount Toggle */}
        <div className="mb-2">
          {!showDiscountMenu ? (
             <button onClick={() => setShowDiscountMenu(true)} className="w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[11px] font-black text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
               <Percent className="w-3 h-3" /> {discount > 0 ? `Đã áp dụng giảm ${discount}%` : "Thêm ưu đãi (Giảm giá)"}
             </button>
          ) : (
            <div className="flex gap-1 justify-between animate-in zoom-in-95 duration-200">
              {[0, 5, 10, 15].map(d => (
                <button key={d} onClick={() => { setDiscount(d); setShowDiscountMenu(false); }}
                  className="flex-1 py-1 rounded-lg transition-all text-xs font-black border"
                  style={{
                    background: discount === d ? "var(--primary-theme-color, #2563EB)" : "white",
                    color: discount === d ? "white" : "#64748b",
                    borderColor: discount === d ? "var(--primary-theme-color, #2563EB)" : "#e2e8f0"
                  }}>
                  {d === 0 ? "0%" : `${d}%`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Totals - Highly Compressed */}
        <div className="flex flex-col gap-1.5 mb-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100/80">
          <div className="flex justify-between items-center text-[11px] font-medium text-gray-500">
            <span>Tạm tính</span>
            <span className="font-bold text-gray-700">{formatVND(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-[11px] font-bold text-green-600">
              <span>Giảm giá ({discount}%)</span>
              <span>-{formatVND(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[11px] font-medium text-gray-500">
            <span>Thuế (8%)</span>
            <span className="font-bold text-gray-700">{formatVND(tax)}</span>
          </div>
          <div className="flex justify-between items-center pt-1.5 mt-0.5 border-t border-dashed border-gray-200">
            <span className="text-xs font-black text-gray-900 uppercase tracking-tight">Tổng cộng</span>
            <span className="text-base font-black text-primary">{formatVND(total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { id: "card", icon: CreditCard, label: "Thẻ" },
            { id: "cash", icon: Banknote, label: "Tiền mặt" },
            { id: "mobile", icon: Smartphone, label: "Ví" },
            { id: "payos", icon: QrCode, label: "PayOS" },
          ].map(m => {
            const Icon = m.icon;
            const active = payMethod === m.id;
            return (
              <button key={m.id} onClick={() => setPayMethod(m.id as any)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all border text-center shadow-sm"
                style={{
                  borderColor: active ? "var(--primary-theme-color, #2563EB)" : "#f1f5f9",
                  background: active ? "color-mix(in srgb, var(--primary-theme-color, #2563EB) 10%, transparent)" : "#f8fafc",
                }}>
                <Icon className={`w-3.5 h-3.5 ${active ? "text-primary" : "text-gray-400"}`} />
                <span className={`text-[10px] font-black ${active ? "text-primary" : "text-gray-500"}`}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button disabled={cart.length === 0 || processing} onClick={handleCharge}
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-sm"
            style={{
              background: cart.length > 0 ? "var(--primary-theme-color, #2563EB)" : "#e2e8f0",
              color: cart.length > 0 ? "white" : "#94a3b8",
              boxShadow: cart.length > 0 ? "0 4px 14px -2px color-mix(in srgb, var(--primary-theme-color, #2563EB) 30%, transparent)" : "none",
            }}>
            {processing ? (
              <><div className="w-4 h-4 rounded-full border-2 animate-spin border-white/30 border-t-white" /> Đang xử lý…</>
            ) : (
              <><Receipt className="w-4 h-4" /> <span className="font-extrabold text-xs uppercase tracking-wider">Thanh toán ngay</span></>
            )}
          </button>
          
          {cart.length > 0 && (
            <div className="flex gap-2">
              <button onClick={() => toast.success("Đã lưu tạm giỏ hàng!")} className="flex-1 py-1.5 rounded-lg text-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-[10px] font-black uppercase tracking-wider">
                Lưu tạm
              </button>
              <button onClick={clearSale} className="flex-1 py-1.5 rounded-lg text-center text-red-600 bg-red-50 hover:bg-red-100 transition-colors text-[10px] font-black uppercase tracking-wider">
                Huỷ giao dịch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
