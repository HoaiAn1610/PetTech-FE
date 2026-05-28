import { Link } from "react-router";
import { AlertTriangle, Home } from "lucide-react";
import "@/styles/fonts.css";

export default function NotFoundShop() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 font-[Inter]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          Cửa hàng không khả dụng
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed text-sm">
          Rất tiếc, cửa hàng này không tồn tại hoặc đã ngừng hoạt động trên hệ thống PetTech. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ hỗ trợ nếu bạn là chủ cửa hàng.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="https://app.pettechvn.site"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Về trang chủ PetTech
          </Link>
          <a
            href="mailto:support@pettech.io"
            className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all border border-gray-200"
          >
            Liên hệ bộ phận hỗ trợ
          </a>
        </div>
      </div>
    </div>
  );
}
