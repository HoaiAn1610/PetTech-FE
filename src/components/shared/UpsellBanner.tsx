import React from "react";
import { Link } from "react-router";
import { Sparkles, Lock, ArrowRight } from "lucide-react";

interface UpsellBannerProps {
  featureName: string;
  description?: string;
}

export const UpsellBanner: React.FC<UpsellBannerProps> = ({
  featureName,
  description = "Tính năng này giúp theo dõi tiến độ công việc theo thời gian thực, đồng bộ dữ liệu tức thì đến khách hàng của bạn và tối ưu hóa quy trình làm việc.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] p-8 text-center bg-gray-50 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto my-12">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
          <Lock className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
        Mở khóa tính năng {featureName}
      </h3>
      
      <p className="text-gray-500 font-medium leading-relaxed max-w-md mb-8">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link
          to="/clinic/billing"
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-black text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-200"
          style={{ background: "linear-gradient(135deg, #4f46e5, #4338ca)" }}
        >
          Nâng cấp gói dịch vụ
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        <Link
          to="/clinic"
          className="flex items-center justify-center px-8 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Quay lại Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UpsellBanner;
