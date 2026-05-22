import React, { useState, useEffect } from "react";
import { CheckCircle2, Search, UserPlus, ShieldAlert, Loader2, Check, User, Phone, Mail, ArrowRight } from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";
import { customerService } from "@/api/services";

interface AddPatientModalProps {
  onClose: () => void;
  onAdd: (form: any) => void;
}

export function AddPatientModal({ onClose, onAdd }: AddPatientModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    petName: "",
    species: "Chó",
    breed: "",
    age: "",
    gender: "Cái",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerId: "" // Live owner foreign key ID
  });

  // Customer Management States
  const [ownerMode, setOwnerMode] = useState<"existing" | "new">("existing");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // New Customer Form State
  const [newCust, setNewCust] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [registering, setRegistering] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Validation
  const canNext = form.petName && form.breed && form.age;
  const canSave = canNext && form.ownerId && form.ownerName && form.ownerEmail;

  // Search API Call with 1-second debounce (Robust unpacking of API response)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Send all common query params to maximize backend search compatibility
        const response = await customerService.getCustomers({ 
          search: searchQuery,
          searchTerm: searchQuery,
          SearchTerm: searchQuery,
          keyword: searchQuery,
          query: searchQuery,
          name: searchQuery
        });
        console.log("Raw GET /api/shop/customers response unpacked by Axios:", response);
        
        let list: any[] = [];
        const res = response as any;
        
        if (res) {
          // Shape 1: Direct Array
          if (Array.isArray(res)) {
            list = res;
          }
          // Shape 2: Object containing direct items array (e.g. { items: [...] })
          else if (Array.isArray(res.items)) {
            list = res.items;
          }
          // Shape 3: C# Result<PagedResult<CustomerDto>> with value containing items
          else if (res.value && Array.isArray(res.value.items)) {
            list = res.value.items;
          }
          // Shape 4: Alternate wrapper with data containing items
          else if (res.data && Array.isArray(res.data.items)) {
            list = res.data.items;
          }
          // Shape 5: Result envelope wrapping a direct array in value
          else if (res.value && Array.isArray(res.value)) {
            list = res.value;
          }
          // Shape 6: Result envelope wrapping a direct array in data
          else if (res.data && Array.isArray(res.data)) {
            list = res.data;
          }
          // Shape 7: Envelope has isSuccess but need to unpack
          else if (res.isSuccess) {
            const payload = res.data || res.value;
            if (payload) {
              if (Array.isArray(payload)) {
                list = payload;
              } else if (Array.isArray(payload.items)) {
                list = payload.items;
              }
            }
          }
        }

        // Robust client-side filter fallback to guarantee only matching records are displayed
        const query = searchQuery.trim().toLowerCase();
        if (query) {
          list = list.filter((c: any) => {
            const fullName = (c.fullName || c.name || "").toLowerCase();
            const email = (c.email || "").toLowerCase();
            const phone = (c.phoneNumber || c.phone || "").toLowerCase();
            return fullName.includes(query) || email.includes(query) || phone.includes(query);
          });
        }
        
        setSearchResults(list);
      } catch (err) {
        console.error("Failed to query customers:", err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 1000); // Wait 1 second (1000ms) after typing before calling API

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Select an existing customer
  const handleSelect = (c: any) => {
    setSelectedCustomer(c);
    setSearchQuery("");
    setSearchResults([]);
    setForm(prev => ({
      ...prev,
      ownerName: c.fullName || c.name || "Khách hàng cũ",
      ownerPhone: c.phoneNumber || c.phone || "",
      ownerEmail: c.email || "",
      ownerId: c.id
    }));
  };

  // Register a new customer
  const handleRegister = async () => {
    if (!newCust.name.trim() || !newCust.email.trim() || !newCust.phone.trim()) {
      alert("Tên, Email và Số điện thoại là ba trường bắt buộc để đăng ký tài khoản khách hàng mới!");
      return;
    }

    // Auto-generate safe default password according to system rules: [phone]@PetTech
    const defaultPassword = `${newCust.phone.trim()}@PetTech`;

    setRegistering(true);
    try {
      const response: any = await customerService.createCustomer({
        fullName: newCust.name.trim(),
        email: newCust.email.trim(),
        phoneNumber: newCust.phone.trim(),
        password: defaultPassword,
        role: "Customer"
      });
      
      if (response) {
        const resultPayload = response.value || response.data || response;
        
        let newId = "";
        if (resultPayload) {
          if (typeof resultPayload === 'string') {
            newId = resultPayload;
          } else if (resultPayload.id) {
            newId = resultPayload.id;
          } else if (resultPayload.userId) {
            newId = resultPayload.userId;
          } else if (resultPayload.accessToken) {
            // Decode JWT token to extract the 'sub' claim (User ID)
            try {
              const token = resultPayload.accessToken;
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const decoded = JSON.parse(jsonPayload);
              newId = decoded.sub || decoded.id || "";
            } catch (e) {
              console.warn("Failed to parse JWT accessToken from register response:", e);
            }
          }
        }

        if (!newId) {
          // Final fallback
          newId = response.id || response.userId || "";
        }
        
        setForm(prev => ({
          ...prev,
          ownerName: newCust.name,
          ownerPhone: newCust.phone,
          ownerEmail: newCust.email,
          ownerId: newId
        }));
        
        setSelectedCustomer({
          id: newId,
          name: newCust.name,
          email: newCust.email,
          phone: newCust.phone
        });
        setRegisteredSuccess(true);
      } else {
        alert("Lỗi khi đăng ký tài khoản! Có thể email hoặc số điện thoại đã tồn tại trong hệ thống.");
      }
    } catch (err) {
      console.error("Failed to register customer:", err);
      alert("Lỗi kết nối khi đăng ký khách hàng!");
    } finally {
      setRegistering(false);
    }
  };

  const ModalFooter = (
    <div className="flex w-full gap-2.5">
      {step === 1 ? (
        <button
          disabled={!canNext}
          onClick={() => setStep(2)}
          className="w-full py-3.5 rounded-xl transition-all font-black text-sm"
          style={{
            background: canNext
              ? "linear-gradient(135deg,#2563EB,#1d4ed8)"
              : "#e5e7eb",
            color: canNext ? "white" : "#9ca3af",
            boxShadow: canNext ? "0 4px 12px rgba(37,99,235,0.2)" : "none"
          }}
        >
          Tiếp theo: Chọn chủ sở hữu <ArrowRight className="w-4 h-4 inline ml-1.5" />
        </button>
      ) : (
        <>
          <button
            onClick={() => setStep(1)}
            className="px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-bold text-sm"
          >
            Quay lại
          </button>
          <button
            disabled={!canSave}
            onClick={() => {
              onAdd(form);
              onClose();
            }}
            className="flex-1 py-3.5 rounded-xl transition-all font-black text-sm flex items-center justify-center gap-2"
            style={{
              background: canSave
                ? "linear-gradient(135deg,#16a34a,#15803d)"
                : "#e5e7eb",
              color: canSave ? "white" : "#9ca3af",
              boxShadow: canSave ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
            }}
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
            Lưu & Thêm bệnh nhân
          </button>
        </>
      )}
    </div>
  );

  return (
    <ClinicModal
      title="Thêm bệnh nhân mới"
      subtitle={`Bước ${step}/2 — ${
        step === 1 ? "Thông tin thú cưng" : "Thông tin chủ sở hữu"
      }`}
      onClose={onClose}
      footer={ModalFooter}
      maxWidth="max-w-md"
    >
      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{ background: s <= step ? "#2563EB" : "#e5e7eb" }}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                TÊN THÚ CƯNG *
              </label>
              <input
                value={form.petName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, petName: e.target.value }))
                }
                placeholder="vd. Milu, Bella..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                LOÀI
              </label>
              <select
                value={form.species}
                onChange={(e) =>
                  setForm((p) => ({ ...p, species: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white"
              >
                {["Chó", "Mèo", "Chim", "Thỏ", "Khác"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                GIỚI TÍNH
              </label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gender: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white"
              >
                {["Cái", "Đực"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                GIỐNG *
              </label>
              <input
                value={form.breed}
                onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))}
                placeholder="vd. Poodle, Corgi..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                TUỔI *
              </label>
              <input
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                placeholder="vd. 2 tuổi"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {/* Mode selection tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setOwnerMode("existing");
                  setSelectedCustomer(null);
                  setRegisteredSuccess(false);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  ownerMode === "existing"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Khách hàng cũ
              </button>
              <button
                type="button"
                onClick={() => {
                  setOwnerMode("new");
                  setSelectedCustomer(null);
                  setRegisteredSuccess(false);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  ownerMode === "new"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Khách hàng mới
              </button>
            </div>

            {/* Owner Selected Success Card */}
            {selectedCustomer && (
              <div className="border-2 border-green-500/30 bg-green-500/5 rounded-2xl p-4 flex flex-col gap-2 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">ĐÃ LIÊN KẾT CHỦ NUÔI</span>
                  <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" /> {selectedCustomer.fullName || selectedCustomer.name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {selectedCustomer.email}
                  </p>
                  {selectedCustomer.phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedCustomer.phone}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setRegisteredSuccess(false);
                    setForm(p => ({ ...p, ownerId: "", ownerName: "", ownerEmail: "", ownerPhone: "" }));
                  }}
                  className="text-left text-xs font-black text-blue-600 uppercase tracking-wider hover:underline mt-2 self-start"
                >
                  Thay đổi chủ nuôi
                </button>
              </div>
            )}

            {/* MODE: EXISTING CUSTOMER SEARCH */}
            {ownerMode === "existing" && !selectedCustomer && (
              <div className="flex flex-col gap-3 relative">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">
                  TÌM KIẾM KHÁCH HÀNG *
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Gõ tên hoặc email khách hàng..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
                  />
                  {searching && (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Dropdown Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-[75px] left-0 right-0 z-[100] max-h-52 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl divide-y divide-gray-50 p-2">
                    {searchResults.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect(c)}
                        className="p-3 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-colors"
                      >
                        <p className="text-sm font-bold text-gray-800">{c.fullName || c.name || "Tên chưa đặt"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.email} · {c.phoneNumber || "Không số ĐT"}</p>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery.trim() && searchResults.length === 0 && !searching && (
                  <div className="p-4 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
                    <p className="text-xs font-bold text-gray-500">Không tìm thấy khách hàng nào</p>
                    <p className="text-[10px] text-gray-400 mt-1">Hãy chuyển sang tab "Khách hàng mới" để tạo tài khoản!</p>
                  </div>
                )}
              </div>
            )}

            {/* MODE: NEW CUSTOMER REGISTRATION */}
            {ownerMode === "new" && !selectedCustomer && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                    HỌ VÀ TÊN KHÁCH HÀNG *
                  </label>
                  <input
                    value={newCust.name}
                    onChange={(e) => setNewCust(p => ({ ...p, name: e.target.value }))}
                    placeholder="vd. Nguyễn Văn A..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                    ĐỊA CHỈ EMAIL *
                  </label>
                  <input
                    value={newCust.email}
                    onChange={(e) => setNewCust(p => ({ ...p, email: e.target.value }))}
                    placeholder="vd. nguyenvana@gmail.com..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                    SỐ ĐIỆN THOẠI *
                  </label>
                  <input
                    value={newCust.phone}
                    onChange={(e) => setNewCust(p => ({ ...p, phone: e.target.value }))}
                    placeholder="vd. 0912345678..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={registering || !newCust.name || !newCust.email || !newCust.phone}
                  className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang tạo tài khoản khách...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Đăng ký chủ nuôi mới
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Constraint warning info */}
            <div className="flex gap-2.5 p-3.5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl mt-1.5">
              <ShieldAlert className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-yellow-800 leading-relaxed">
                <strong>Ràng buộc Hệ thống:</strong> Mỗi thú cưng bắt buộc phải có chủ nuôi hợp lệ tồn tại trên PostgreSQL. Hãy tìm kiếm khách cũ hoặc đăng ký khách mới trước khi bấm Lưu.
              </p>
            </div>
          </div>
        )}
      </div>
    </ClinicModal>
  );
}
