import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFeature } from "@/hooks/useFeature";
import { Lock } from "lucide-react";

function UpgradePromptModal({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white p-7 flex flex-col gap-6"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#fef3c7" }}>
            <Lock className="w-6 h-6" style={{ color: "#d97706" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Tính năng chưa mở khóa</h2>
            <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
              Vui lòng nâng cấp lên gói <strong>Pro</strong> để mở khóa tính năng Chăm sóc khách hàng (CRM) này!
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2.5" style={{ border: "1px solid #e5e7eb" }}>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
            <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Gửi tin nhắn chăm sóc tự động cho chủ nuôi</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
            <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Chiến dịch tiếp thị & Khuyến mãi cá nhân hóa</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
            <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Báo cáo phân tích hành vi khách hàng chuyên sâu</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl transition-colors hover:bg-gray-100"
            style={{ background: "#f3f4f6", color: "#374151", fontSize: "0.85rem", fontWeight: 700 }}>
            Hủy
          </button>
          <button onClick={onUpgrade} className="flex-1 py-3 rounded-xl transition-colors hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", fontSize: "0.85rem", fontWeight: 700, boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
            Nâng cấp ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export const Sidebar: React.FC = () => {
  const { hasCrm } = useFeature();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const navigate = useNavigate();

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUpgradePrompt(true);
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
      {showUpgradePrompt && (
        <UpgradePromptModal 
          onClose={() => setShowUpgradePrompt(false)} 
          onUpgrade={() => {
            setShowUpgradePrompt(false);
            navigate("/clinic/billing");
          }} 
        />
      )}
    </aside>
  );
};

export default Sidebar;
