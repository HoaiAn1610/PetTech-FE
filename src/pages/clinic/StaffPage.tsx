import { useState, useEffect } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { Plus, MoreHorizontal, ShieldAlert, Edit, Trash2 } from "lucide-react";
import { staffService } from "@/api/services";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";
import { StaffModal } from "@/features/clinic/staff/StaffModal";
import { toast } from "sonner";
import "@/styles/fonts.css";

export default function StaffPage() {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  // Restrict access to ShopManager only
  const isShopManager = user?.role === Role.ShopManager;

  const fetchStaff = async () => {
    if (!isShopManager) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res: any = await staffService.getStaff();
      const items = res?.data?.items || res?.data || res || [];
      setStaffList(Array.isArray(items) ? items : []);
    } catch (err: any) {
      console.error("Failed to fetch staff", err);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [isShopManager]);

  const handleEdit = (staff: any) => {
    setEditingStaff(staff);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn vô hiệu hóa tài khoản của ${name}?`)) {
      try {
        await staffService.deleteStaff(id);
        toast.success(`Đã vô hiệu hóa tài khoản ${name}`);
        fetchStaff();
      } catch (err) {
        toast.error("Không thể vô hiệu hóa tài khoản này");
      }
    }
  };

  if (!isShopManager) {
    return (
      <ClinicPageShell title="Nhân sự" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Nhân sự" }]}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quyền truy cập bị từ chối</h2>
          <p className="text-gray-500 max-w-md">Chỉ có Quản lý cửa hàng (ShopManager) mới có quyền truy cập và quản lý nhân sự.</p>
        </div>
      </ClinicPageShell>
    );
  }

  const getRoleLabel = (role: string) => {
    switch(role) {
      case Role.ShopManager: return "Quản lý";
      case Role.Vet: return "Bác sĩ thú y";
      case Role.Groomer: return "Thợ Grooming";
      case Role.Receptionist: return "Lễ tân";
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case Role.ShopManager: return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case Role.Vet: return "bg-purple-50 text-purple-700 ring-purple-600/20";
      case Role.Groomer: return "bg-orange-50 text-orange-700 ring-orange-600/20";
      case Role.Receptionist: return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      default: return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <ClinicPageShell
      title="Nhóm & Phân quyền"
      subtitle="Quản lý các thiết lập và cấu hình cho nhóm & phân quyền của bạn."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Nhân sự" },
      ]}
      maxWidth="max-w-6xl"
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Thành viên nhóm</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">{staffList.length} thành viên</p>
          </div>
          <button 
            onClick={() => { setEditingStaff(null); setShowModal(true); }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Mời thành viên
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" /></div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Chưa có nhân viên nào trong danh sách.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {staffList.map((staff, idx) => {
              // Generate Initials (e.g. "Nguyễn Thị Lan" -> "NL")
              const nameParts = (staff.fullName || "").split(" ").filter(Boolean);
              let initials = "U";
              if (nameParts.length >= 2) {
                initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
              } else if (nameParts.length === 1) {
                initials = nameParts[0].substring(0, 2).toUpperCase();
              }

              const roleColor = getRoleColor(staff.role);
              const isActive = staff.isActive !== false;

              return (
                <div key={staff.id || idx} className={`flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent hover:border-gray-100 hover:bg-gray-50/50 hover:shadow-sm group ${!isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 bg-blue-50 flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{staff.fullName} {!isActive && <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-2">Đã khóa</span>}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{staff.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ring-1 ring-inset ${roleColor}`}>
                      {getRoleLabel(staff.role)}
                    </span>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(staff)}
                        title="Chỉnh sửa"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {isActive && (
                        <button 
                          onClick={() => handleDelete(staff.id, staff.fullName)}
                          title="Vô hiệu hóa"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <StaffModal 
          staff={editingStaff} 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            fetchStaff();
          }}
        />
      )}
    </ClinicPageShell>
  );
}
