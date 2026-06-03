import { useState, useEffect } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { authService } from "@/api/authService";
import { User, Mail, Phone, Shield, Key } from "lucide-react";
import { toast } from "sonner";
import "@/styles/fonts.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe();
        setProfile(res?.data || res);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error("Change password error", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Đổi mật khẩu thất bại, vui lòng kiểm tra lại mật khẩu hiện tại!");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ClinicPageShell
      title="Hồ sơ của tôi"
      subtitle="Quản lý thông tin cá nhân và bảo mật tài khoản."
      breadcrumbs={[
        { label: "Dashboard", href: "/clinic" },
        { label: "Hồ sơ của tôi" },
      ]}
      maxWidth="max-w-4xl"
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : profile ? (
        <div className="flex flex-col gap-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border border-gray-200/60">
                  {profile.displayName || profile.name || "Chưa cập nhật"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border border-gray-200/60 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {profile.email || "Chưa cập nhật"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border border-gray-200/60 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {profile.phone || "Chưa cập nhật"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vai trò (Role)</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border border-gray-200/60 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  {profile.role || "Chưa cập nhật"}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Đổi mật khẩu
            </h3>
            <form onSubmit={handlePasswordChange} className="max-w-md flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className={`px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 ${isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isChangingPassword ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">Không tìm thấy thông tin hồ sơ.</p>
        </div>
      )}
    </ClinicPageShell>
  );
}
