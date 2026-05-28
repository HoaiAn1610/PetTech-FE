import { Link } from "react-router";
import { XCircle, ArrowLeft } from "lucide-react";
import "@/styles/fonts.css";

export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Thanh toán thất bại / Đã huỷ</h1>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Giao dịch chưa được hoàn tất. Bạn có thể thử thanh toán lại hoặc chọn phương thức khác tại trang bán hàng.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/clinic/pos"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              boxShadow: "0 10px 25px -5px rgba(220,38,38,0.4)"
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang thanh toán
          </Link>
          <Link
            to="/clinic"
            className="flex items-center justify-center w-full py-3.5 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Về trang Tổng quan
          </Link>
        </div>
      </div>
    </div>
  );
}
