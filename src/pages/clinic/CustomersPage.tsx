import { useState, useMemo } from "react";
import {
  Users, Search, Plus, Filter, Mail, Key, FileText, CheckCircle2,
  AlertTriangle, RefreshCw, Eye, Sparkles, TrendingUp, Heart
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { useClinicCustomers, useCreateClinicCustomer, useUpdateCustomerPassword, usePetsByOwner } from "@/hooks/clinic/usePatientQueries";
import { useUpdateCustomerNotes } from "@/hooks/admin/useCrm";
import { toast } from "sonner";
import "@/styles/fonts.css";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ltv: number;
  visits: number;
  score: number;
  lastVisit: string;
  churn: string;
  notes: string;
}

const churnColors: Record<string, string> = {
  "Thập": "bg-green-50 text-green-700 border-green-100",
  "Trung bình": "bg-orange-50 text-orange-700 border-orange-100",
  "Cao": "bg-red-50 text-red-700 border-red-100",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filterChurn, setFilterChurn] = useState("Tất cả");
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<Customer | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<Customer | null>(null);
  const [showPetsModal, setShowPetsModal] = useState<Customer | null>(null);
  
  // Added Customer Success View State
  const [createdCustomerInfo, setCreatedCustomerInfo] = useState<{ name: string; email: string; tempPass: string } | null>(null);

  // Form inputs
  const [addForm, setAddForm] = useState({ fullName: "", email: "", phone: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "" });
  const [notesForm, setNotesForm] = useState({ notes: "" });

  // React Query Hooks
  const { data: rawCustomers, isLoading: loading } = useClinicCustomers({ PageSize: 1000 });
  const createCustomerMutation = useCreateClinicCustomer();
  const updatePasswordMutation = useUpdateCustomerPassword();
  const updateNotesMutation = useUpdateCustomerNotes();

  // Mapped Data
  const customersList = useMemo(() => {
    const items = rawCustomers?.items || [];
    const rawItems = Array.isArray(rawCustomers) ? rawCustomers : items;

    return rawItems.map((c: any) => {
      const name = c.fullName || c.name || "Khách hàng";
      const email = c.email || "";
      const phone = c.phone || c.phoneNumber || "";
      const ltv = c.totalSpent || c.ltv || 0;
      const visits = c.totalVisits || c.visitsCount || c.visits || 0;
      const score = c.healthScore || c.score || 80;
      const notes = c.crmNotes || c.notes || "";
      
      let lastVisit = c.lastVisitDate || c.lastVisit || "Chưa khám";
      if (lastVisit && lastVisit !== "Chưa khám") {
        try {
          const date = new Date(lastVisit);
          if (!isNaN(date.getTime())) {
            lastVisit = `${date.getDate()}/${date.getMonth() + 1}`;
          }
        } catch (e) {
          // Keep original
        }
      }
      
      const churn = c.churnRiskLevel || c.churn || (score > 80 ? "Thấp" : score > 50 ? "Trung bình" : "Cao");

      return {
        id: c.id,
        name,
        email,
        phone,
        ltv,
        visits,
        score,
        lastVisit,
        churn,
        notes
      };
    });
  }, [rawCustomers]);

  // Statistics
  const stats = useMemo(() => {
    const total = customersList.length;
    const vip = customersList.filter((c: any) => c.ltv > 700).length;
    const churnHigh = customersList.filter((c: any) => c.churn === "Cao").length;
    // New customers is mocked dynamically based on total size
    const newThisMonth = Math.ceil(total * 0.15) || 2;
    return { total, vip, churnHigh, newThisMonth };
  }, [customersList]);

  // Filtered List
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c: any) => {
      const matchSearch = !search || 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.phone.includes(search) || 
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchChurn = filterChurn === "Tất cả" || c.churn === filterChurn;

      return matchSearch && matchChurn;
    });
  }, [customersList, search, filterChurn]);

  // Handlers
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên chủ nuôi");
      return;
    }
    if (!addForm.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      const payload = {
        fullName: addForm.fullName.trim(),
        email: addForm.email.trim(),
        phoneNumber: addForm.phone.trim(),
        address: addForm.address.trim()
      };

      const res: any = await createCustomerMutation.mutateAsync(payload);
      const created = res?.data || res?.value || res;

      // Reset form & close input modal
      setAddForm({ fullName: "", email: "", phone: "", address: "" });
      setShowAddModal(false);

      // Show temporary password popup
      if (created?.temporaryPassword) {
        setCreatedCustomerInfo({
          name: created.fullName,
          email: created.email || "Không có",
          tempPass: created.temporaryPassword
        });
      } else {
        toast.success("Đã thêm khách hàng thành công!");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordModal) return;
    if (!passwordForm.newPassword.trim() || passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        customerId: showPasswordModal.id,
        payload: { newPassword: passwordForm.newPassword.trim() }
      });
      setPasswordForm({ newPassword: "" });
      setShowPasswordModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showNotesModal) return;

    try {
      await updateNotesMutation.mutateAsync({
        id: showNotesModal.id,
        data: { notes: notesForm.notes.trim() }
      });
      setNotesForm({ notes: "" });
      setShowNotesModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ClinicPageShell
      title="Hồ sơ khách hàng"
      breadcrumbs={[{ label: "Dashboard", href: "/clinic" }, { label: "Hồ sơ khách hàng" }]}
      headerActions={
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-px active:scale-98"
          style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
        >
          <Plus className="w-4 h-4" /> Thêm khách hàng mới
        </button>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ClinicStatCard label="Tổng khách hàng" value={stats.total} icon={Users} color="#2563EB" description="Chủ nuôi sở hữu thú cưng" />
        <ClinicStatCard label="Khách mới tháng này" value={`+${stats.newThisMonth}`} icon={TrendingUp} color="#f97316" description="Tăng trưởng thành viên mới" />
        <ClinicStatCard label="Khách hàng VIP" value={stats.vip} icon={Sparkles} color="#7c3aed" description="Chỉ số LTV vượt trội > $700" />
        <ClinicStatCard label="Rủi ro Churn cao" value={stats.churnHigh} icon={AlertTriangle} color="#dc2626" description="Cần chiến dịch tương tác lại" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email hoặc SĐT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-xs transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            style={{ border: "1.5px solid #e5e7eb" }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-500">Rủi ro Churn:</span>
          <select
            value={filterChurn}
            onChange={e => setFilterChurn(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 outline-none text-xs bg-white cursor-pointer font-semibold text-gray-700 focus:border-blue-500"
          >
            {["Tất cả", "Thấp", "Trung bình", "Cao"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Customers Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" style={{ minHeight: "350px" }}>
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-gray-500 mt-4">Đang tải danh sách khách hàng...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" style={{ minHeight: "350px" }}>
          <Users className="w-12 h-12 text-gray-300" />
          <p className="text-sm font-bold text-gray-500 mt-4">Không tìm thấy khách hàng nào</p>
          <p className="text-xs text-gray-400 mt-1">Vui lòng thử lại với từ khóa tìm kiếm hoặc bộ lọc khác.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {["Chủ nuôi", "Số điện thoại", "Lượt khám", "Tổng chi (LTV)", "SK", "Mức rủi ro", "Ghi chú chăm sóc", ""].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-[0.85rem] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {c.name[0]?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="text-[0.82rem] font-extrabold text-gray-900">{c.name}</p>
                          <p className="text-[0.68rem] font-medium text-gray-400 mt-0.5">{c.email || "Không có email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-[0.78rem] font-bold text-gray-600">
                      {c.phone || "---"}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-[0.8rem] font-bold text-gray-700 bg-gray-50 border px-2.5 py-1 rounded-lg">{c.visits}</span>
                    </td>
                    <td className="px-6 py-4.5 text-[0.85rem] font-extrabold text-blue-600">
                      ${c.ltv.toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${c.score >= 80 ? "text-green-600" : c.score >= 60 ? "text-orange-600" : "text-red-600"}`}>{c.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${churnColors[c.churn]}`}>
                        {c.churn}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 max-w-[200px] truncate text-[0.75rem] font-semibold text-gray-500">
                      {c.notes || <span className="text-gray-300 italic">Không có ghi chú</span>}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setShowPetsModal(c)}
                          title="Xem chi tiết thú cưng"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setNotesForm({ notes: c.notes });
                            setShowNotesModal(c);
                          }}
                          title="Sửa ghi chú"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPasswordForm({ newPassword: "" });
                            setShowPasswordModal(c);
                          }}
                          title="Đổi mật khẩu"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Thêm khách hàng mới</h3>
                <p className="text-[10px] text-gray-400 mt-1">Đăng ký hồ sơ chủ nuôi tại quầy dịch vụ</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                <span className="text-gray-500 font-bold">×</span>
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">HỌ VÀ TÊN CHỦ NUÔI *</label>
                <input
                  type="text"
                  required
                  value={addForm.fullName}
                  onChange={e => setAddForm(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">SỐ ĐIỆN THOẠI HỖ TRỢ *</label>
                <input
                  type="tel"
                  required
                  value={addForm.phone}
                  onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="VD: 0901 234 567"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">ĐỊA CHỈ EMAIL (TÙY CHỌN)</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="VD: nguyenvana@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">ĐỊA CHỈ LIÊN HỆ (TÙY CHỌN)</label>
                <input
                  type="text"
                  value={addForm.address}
                  onChange={e => setAddForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="VD: 123 Đường Ba Tháng Hai, Quận 10"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createCustomerMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  {createCustomerMutation.isPending ? "Đang tạo..." : "Xác nhận tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Show Temporary Password (Add success popup) */}
      {createdCustomerInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 flex flex-col items-center gap-5 text-center animate-in fade-in scale-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-100 shadow-inner">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Khách hàng đã đăng ký thành công!</h3>
              <p className="text-xs text-gray-400 mt-1">Đã cấp tài khoản PetTech thành viên cho {createdCustomerInfo.name}</p>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 w-full text-left flex flex-col gap-2.5">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Thông tin tài khoản của khách
              </p>
              <div className="text-xs flex flex-col gap-1.5 text-gray-600 font-semibold">
                <p>Họ tên: <span className="text-gray-900 font-black">{createdCustomerInfo.name}</span></p>
                <p>Email: <span className="text-gray-900 font-black">{createdCustomerInfo.email}</span></p>
                <div className="mt-3 p-3 bg-white rounded-xl border border-amber-100 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-gray-400">MẬT KHẨU TẠM THỜI ĐỂ ĐĂNG NHẬP</span>
                  <span className="font-mono text-base font-black text-orange-600 tracking-wider select-all">{createdCustomerInfo.tempPass}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-normal">
              💡 Vui lòng sao chép lại mật khẩu tạm thời trên và gửi cho chủ nuôi qua tin nhắn hoặc ghi chép để khách có thể đăng nhập vào cổng PetTech.
            </p>

            <button
              onClick={() => setCreatedCustomerInfo(null)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-green-500/20"
            >
              Tôi đã sao chép mật khẩu & Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Đặt lại mật khẩu</h3>
                <p className="text-[10px] text-gray-400 mt-1">Cấp lại mật khẩu đăng nhập cho {showPasswordModal.name}</p>
              </div>
              <button onClick={() => setShowPasswordModal(null)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                <span className="text-gray-500 font-bold">×</span>
              </button>
            </div>
            <form onSubmit={handleUpdatePassword} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">MẬT KHẨU MỚI *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Nhập tối thiểu 6 ký tự..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(null)}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  {updatePasswordMutation.isPending ? "Đang lưu..." : "Xác nhận đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Notes */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Ghi chú chăm sóc</h3>
                <p className="text-[10px] text-gray-400 mt-1">Chỉnh sửa lưu ý CRM cho {showNotesModal.name}</p>
              </div>
              <button onClick={() => setShowNotesModal(null)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                <span className="text-gray-500 font-bold">×</span>
              </button>
            </div>
            <form onSubmit={handleUpdateNotes} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">LƯU Ý QUẢN TRỊ</label>
                <textarea
                  rows={4}
                  value={notesForm.notes}
                  onChange={e => setNotesForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Ghi chú về thói quen, mức chi tiêu, phản hồi dịch vụ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowNotesModal(null)}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updateNotesMutation.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  {updateNotesMutation.isPending ? "Đang lưu..." : "Lưu ghi chú"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Pets Details */}
      {showPetsModal && (
        <CustomerPetsModal
          customer={showPetsModal}
          onClose={() => setShowPetsModal(null)}
        />
      )}
    </ClinicPageShell>
  );
}

// ── Secondary Component: CustomerPetsModal ─────────────────────────────────────────
function CustomerPetsModal({ customer, onClose }: { customer: any; onClose: () => void }) {
  const { data: res, isLoading } = usePetsByOwner(customer.id);
  
  const pets = useMemo(() => {
    const payload: any = res?.data || res?.value || res;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return [];
  }, [res]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Danh sách thú cưng</h3>
            <p className="text-[10px] text-gray-400 mt-1">
              Chủ nuôi: <span className="font-extrabold text-gray-700">{customer.name}</span> • {customer.phone}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm">
            <span className="text-gray-500 font-bold">×</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[350px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="text-[11px] font-bold text-gray-500 mt-3">Đang tải danh sách thú cưng...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-3 border border-gray-100">
                <Heart className="w-5 h-5 stroke-1" />
              </div>
              <p className="text-xs font-bold text-gray-500">Chủ nuôi chưa đăng ký thú cưng nào</p>
              <p className="text-[10px] text-gray-450 mt-1 leading-normal max-w-xs">
                Để thêm thú cưng, vui lòng truy cập trang Bệnh nhân và tạo hồ sơ bệnh nhân liên kết với chủ nuôi này.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pets.map((pet: any) => {
                const age = pet.age || (pet.dateOfBirth ? `${new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()} tuổi` : "N/A");
                const breed = pet.breed || pet.species || "Chưa xác định";
                
                return (
                  <div key={pet.id} className="p-4 rounded-2xl border border-gray-100 hover:border-blue-100 bg-white hover:bg-blue-50/10 transition-all flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm border border-blue-100">
                        {pet.name[0]?.toUpperCase() || "P"}
                      </div>
                      <div>
                        <h4 className="text-[0.8rem] font-black text-gray-900 leading-snug">{pet.name}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{breed} • {age}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wide">Cân nặng</span>
                        <span className="text-[11px] font-extrabold text-gray-800">{pet.weight || pet.weightQty || "---"} kg</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wide">Sức khỏe</span>
                        <span className={`text-[11px] font-black ${pet.healthScore >= 80 ? "text-green-600" : pet.healthScore >= 60 ? "text-orange-600" : "text-red-600"}`}>
                          {pet.healthScore || pet.score || 80}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
