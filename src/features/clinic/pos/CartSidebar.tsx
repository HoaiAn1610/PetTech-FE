import { Banknote, CreditCard, Minus, Percent, Plus, Receipt, ShoppingCart, Smartphone, User, X, AlertTriangle, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  cart, updateQty, discount, setDiscount, subtotal, discountAmt, tax, total,
  payMethod, setPayMethod, handleCharge, processing, clearSale
}: CartSidebarProps) {
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [showDiscountMenu, setShowDiscountMenu] = useState(false);

  const formatVND = (amount: number) => amount.toLocaleString('en-US') + ' VND';

  return (
    <div className="w-80 flex-shrink-0 h-full flex flex-col bg-white overflow-hidden border-l border-gray-100">
      
      {/* 2. KHU VỰC KHÁCH HÀNG (Top - Fixed Height) */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        {selectedPatient ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-bold text-blue-900 truncate">{selectedPatient.name}</span>
              </div>
              <button onClick={() => { setSelectedPatient(null); setIsSearchingCustomer(false); }} className="p-1 hover:bg-blue-100 rounded-md transition-colors text-blue-400 hover:text-blue-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <select
              value={selectedPet?.id || ""}
              onChange={(e) => setSelectedPet(pets.find(p => p.id === e.target.value) || null)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg outline-none border border-gray-200 bg-gray-50 focus:border-blue-500 text-gray-700 transition-colors cursor-pointer"
            >
              <option value="">Chọn thú cưng mua đồ cho...</option>
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
                placeholder="Tìm theo tên, SĐT..."
                className="w-full pl-8 pr-8 py-2 text-sm font-medium rounded-xl outline-none border border-gray-200 focus:border-blue-500 transition-colors bg-white"
              />
              <button 
                onClick={() => { setIsSearchingCustomer(false); setPatientSearch(""); }} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              {patientSearch && (
                <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white max-h-48 overflow-y-auto">
                  {filteredPatients.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(""); setIsSearchingCustomer(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left border-b last:border-0 border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[0.65rem] text-gray-500 truncate">{p.phone} {p.email && `· ${p.email}`}</p>
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
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm khách hàng / Thú cưng
            </button>
          )
        )}
      </div>

      {/* 3. KHU VỰC GIỎ HÀNG (Middle - Flex-Grow & Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50/30">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500">Giỏ hàng trống</p>
              <p className="text-[0.7rem] text-gray-400 mt-0.5">Chọn sản phẩm để bắt đầu</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-gray-100 shadow-sm animate-in slide-in-from-bottom-1 duration-200"
                style={{ 
                  background: item.hasAllergenWarning ? "#fef2f2" : "white", 
                  borderColor: item.hasAllergenWarning ? "#fca5a5" : "#f1f5f9" 
                }}>
                <span className="text-xl bg-gray-50 p-1.5 rounded-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-gray-800 truncate" style={{ color: item.hasAllergenWarning ? "#991b1b" : "#1e293b" }}>
                      {item.name}
                    </p>
                    {item.hasAllergenWarning && <span title="Cảnh báo dị ứng" className="flex-shrink-0 flex items-center"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /></span>}
                  </div>
                  <p className="text-[0.7rem] font-medium" style={{ color: item.hasAllergenWarning ? "#b91c1c" : "#64748b" }}>{formatVND(item.price)}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-800 transition-all">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 hover:text-blue-600 transition-all">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. KHU VỰC THANH TOÁN (Bottom - Fixed Height) */}
      <div className="px-4 py-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        
        {/* Discount Toggle */}
        <div className="mb-3">
          {!showDiscountMenu ? (
             <button onClick={() => setShowDiscountMenu(true)} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50/50 border border-blue-100 hover:bg-blue-100 transition-colors">
               <Percent className="w-3.5 h-3.5" /> {discount > 0 ? `Đã áp dụng giảm ${discount}%` : "Thêm ưu đãi"}
             </button>
          ) : (
            <div className="flex gap-1.5 justify-between animate-in zoom-in-95 duration-200">
              {[0, 5, 10, 15].map(d => (
                <button key={d} onClick={() => { setDiscount(d); setShowDiscountMenu(false); }}
                  className="flex-1 py-1.5 rounded-lg transition-all text-xs font-bold border"
                  style={{
                    background: discount === d ? "#2563EB" : "white",
                    color: discount === d ? "white" : "#64748b",
                    borderColor: discount === d ? "#2563EB" : "#e2e8f0"
                  }}>
                  {d === 0 ? "0%" : `${d}%`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Totals - Squeezed line heights */}
        <div className="flex flex-col gap-1 mb-4 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-[0.7rem] font-medium text-gray-500">Tạm tính</span>
            <span className="text-[0.75rem] font-bold text-gray-700">{formatVND(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[0.7rem] font-bold text-green-600">Giảm giá ({discount}%)</span>
              <span className="text-[0.75rem] font-bold text-green-600">-{formatVND(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[0.7rem] font-medium text-gray-500">Thuế (8%)</span>
            <span className="text-[0.75rem] font-bold text-gray-700">{formatVND(tax)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 mt-1 border-t border-dashed border-gray-200">
            <span className="text-sm font-black text-gray-900">Tổng</span>
            <span className="text-lg font-black text-blue-600">{formatVND(total)}</span>
          </div>
        </div>

        {/* Payment method - 4 column grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
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
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all border"
                style={{
                  borderColor: active ? "#2563EB" : "#f1f5f9",
                  background: active ? "#eff6ff" : "#f8fafc",
                }}>
                <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`text-[0.65rem] font-bold ${active ? "text-blue-700" : "text-gray-500"}`}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button disabled={cart.length === 0 || processing} onClick={handleCharge}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            style={{
              background: cart.length > 0 ? "#2563EB" : "#e2e8f0",
              color: cart.length > 0 ? "white" : "#94a3b8",
              boxShadow: cart.length > 0 ? "0 4px 14px -2px rgba(37,99,235,0.4)" : "none",
            }}>
            {processing ? (
              <><div className="w-4 h-4 rounded-full border-2 animate-spin border-white/30 border-t-white" /> Đang xử lý…</>
            ) : (
              <><Receipt className="w-4 h-4" /> <span className="font-bold text-sm">Thanh toán</span></>
            )}
          </button>
          
          {cart.length > 0 && (
            <div className="flex gap-2">
              <button onClick={() => toast.success("Đã lưu tạm giỏ hàng!")} className="flex-1 py-2 rounded-xl text-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-bold">
                Lưu tạm / Chờ
              </button>
              <button onClick={clearSale} className="flex-1 py-2 rounded-xl text-center text-red-600 bg-red-50 hover:bg-red-100 transition-colors text-xs font-bold">
                Huỷ giao dịch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
