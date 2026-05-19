import React from "react";
import { Link } from "react-router";
import { useFeature } from "@/hooks/useFeature";
import { Lock } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { hasCrm } = useFeature();

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Vui lòng nâng cấp gói Growth để mở khóa tính năng này!");
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <div className="text-xl font-bold mb-8 px-2 text-indigo-400">PetTech Admin</div>
      
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
          Dashboard
        </Link>
        <Link to="/bookings" className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
          Đặt lịch
        </Link>
        <Link to="/pets" className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
          Thú cưng
        </Link>

        {/* Chăm sóc KH (CRM) - Phụ thuộc vào cờ hasCrm */}
        {hasCrm ? (
          <Link to="/crm/campaigns" className="px-4 py-2 hover:bg-gray-800 rounded-md transition-colors">
            Chăm sóc KH (CRM)
          </Link>
        ) : (
          <div 
            onClick={handleLockedClick}
            className="px-4 py-2 rounded-md flex items-center justify-between text-gray-500 bg-gray-850 hover:bg-gray-800/30 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          >
            <span>Chăm sóc KH (CRM)</span>
            <Lock size={16} className="text-gray-500" />
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
