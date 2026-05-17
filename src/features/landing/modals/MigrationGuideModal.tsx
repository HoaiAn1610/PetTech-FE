import React from "react";
import { Download, BookOpen, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

interface MigrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
}

export function MigrationGuideModal({ isOpen, onClose, onClaim }: MigrationGuideModalProps) {
  const steps = [
    { title: "Xuất dữ liệu", desc: "Hướng dẫn export từ ezyVet, Cornerstone & Vetspire.", icon: Download },
    { title: "Làm sạch & Chuẩn hóa", desc: "Công cụ tự động định dạng số điện thoại & địa chỉ.", icon: Search },
    { title: "Nhập vào PetTech", desc: "Upload CSV và ánh xạ các trường thông tin.", icon: BookOpen },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Hướng dẫn di chuyển dữ liệu"
      subtitle="Tự mình thực hiện hoặc nhờ chúng tôi hỗ trợ"
      maxWidth="lg"
    >
      <div className="px-8 py-8 space-y-8 bg-white">
        <div className="space-y-4">
          <p className="text-[0.7rem] font-black text-gray-400 tracking-widest uppercase">3 BƯỚC ĐƠN GIẢN</p>
          <div className="grid gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[0.95rem] font-black text-gray-900">{s.title}</h4>
                    <p className="text-sm font-medium text-gray-500 leading-normal">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-blue-50 border border-blue-100 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-black text-blue-900 uppercase tracking-tight">Gợi ý từ chuyên gia</span>
          </div>
          <p className="text-[0.9rem] font-medium text-blue-800 leading-relaxed">
            Việc di chuyển dữ liệu thú y rất phức tạp do tính chất bệnh án. Chúng tôi khuyên bạn nên sử dụng 
            <span className="font-black"> Dịch vụ di chuyển chuyên nghiệp</span> của chúng tôi để đảm bảo 100% độ chính xác.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-gray-200 font-black text-gray-500"
          >
            Tải PDF Hướng dẫn (2MB)
          </Button>
          <Button 
            onClick={() => { onClose(); onClaim(); }}
            className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            Đăng ký di chuyển hộ <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
