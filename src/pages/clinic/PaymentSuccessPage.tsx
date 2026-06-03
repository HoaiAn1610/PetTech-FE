import { Link } from "react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import "@/styles/fonts.css";

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Thanh toán thành công!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Giao dịch của bạn đã được xác nhận thành công. Trạng thái hoá đơn đã được cập nhật tự động trong hệ thống.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/clinic/pos"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB) 0%, color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black) 100%)",
              boxShadow: "0 10px 25px -5px color-mix(in srgb, var(--primary-theme-color, #2563EB) 40%, transparent)"
            }}
          >
            Quay lại trang bán hàng <ArrowRight className="w-4 h-4" />
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
