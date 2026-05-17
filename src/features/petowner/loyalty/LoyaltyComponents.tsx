import { useState } from "react";
import { Check, X, Copy, Zap, ArrowRight } from "lucide-react";

export function RedeemModal({ reward, points, onClose }: {
  reward: any; points: number; onClose: () => void;
}) {
  const canAfford = points >= reward.cost;
  const [confirmed, setConfirmed] = useState(false);
  const voucherCode = `PET-R-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (confirmed) return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-10 flex flex-col items-center gap-6 text-center animate-in zoom-in duration-300"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
          <Check className="w-10 h-10" style={{ color: "#16a34a" }} strokeWidth={4} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>Đã đổi thành công! 🎉</h3>
          <p style={{ fontSize: "1rem", fontWeight: 800, color: "#F97316", marginTop: "6px" }}>{reward.title}</p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "12px", lineHeight: 1.6 }}>
            Mã voucher đã được kích hoạt và gửi đến email của bạn.
          </p>
        </div>
        <div className="w-full px-6 py-4 rounded-2xl flex items-center justify-between"
          style={{ background: "#f8fafc", border: "2px dashed #e2e8f0" }}>
          <span style={{ fontSize: "1rem", fontWeight: 900, color: "#1e293b", fontFamily: "monospace" }}>{voucherCode}</span>
          <button onClick={() => { navigator.clipboard.writeText(voucherCode); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-md transition-all">
            <Copy className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <button onClick={onClose} className="w-full py-4 rounded-2xl shadow-lg shadow-blue-100"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 800, fontSize: "1rem" }}>
          Tiếp tục khám phá
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-[2rem] bg-white overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>Xác nhận đổi thưởng</p>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ background: "#f8fafc" }}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-6">
          <div className="flex items-center gap-5 p-6 rounded-3xl"
            style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)", border: "1.5px solid #e2e8f0" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 bg-white shadow-sm">
              {reward.emoji}
            </div>
            <div>
              <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>{reward.title}</p>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{reward.desc}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100">
                  <Zap className="w-3.5 h-3.5 text-orange-600" fill="currentColor" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#ea580c" }}>{reward.cost} điểm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="text-center">
              <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Số dư hiện tại</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>{points}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
              <ArrowRight className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-center">
              <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Còn lại sau đổi</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 900, color: canAfford ? "#10b981" : "#ef4444" }}>
                {canAfford ? points - reward.cost : "—"}
              </p>
            </div>
          </div>

          {!canAfford && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-100">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-red-600" strokeWidth={3} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "#b91c1c", fontWeight: 700 }}>
                Bạn cần thêm {reward.cost - points} điểm để thực hiện giao dịch này.
              </p>
            </div>
          )}

          <button onClick={() => canAfford && setConfirmed(true)} disabled={!canAfford}
            className="w-full py-4.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: canAfford ? "linear-gradient(135deg,#F97316,#ea580c)" : "#f1f5f9",
              color: canAfford ? "white" : "#94a3b8",
              fontWeight: 800, fontSize: "1rem",
              boxShadow: canAfford ? "0 8px 24px rgba(249,115,22,0.3)" : "none",
            }}>
            {canAfford ? `Xác nhận đổi lấy ${reward.cost} điểm` : `Không đủ điểm`}
          </button>
          
          <p style={{ fontSize: "0.7rem", color: "#94a3b8", textAlign: "center", fontWeight: 500 }}>
            Hành động này không thể hoàn tác. Voucher có giá trị trong vòng 90 ngày.
          </p>
        </div>
      </div>
    </div>
  );
}
