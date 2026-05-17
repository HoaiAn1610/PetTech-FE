import React from "react";
import { BookOpen, ChevronRight, Search, FileText, Code2, Globe } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  const sections = [
    { title: "Bắt đầu", items: ["Cài đặt cơ bản", "Tạo tài khoản bác sĩ", "Nhập danh sách thú cưng"], icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Hướng dẫn sử dụng", items: ["Quản lý lịch hẹn", "Xuất hóa đơn POS", "Hồ sơ bệnh án điện tử"], icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "API & Tích hợp", items: ["Webhooks", "Tích hợp thiết bị xét nghiệm", "Kết nối Zalo OA"], icon: Code2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Cộng đồng", items: ["Diễn đàn người dùng", "Video hướng dẫn", "Hỗ trợ trực tiếp"], icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trung tâm trợ giúp"
      subtitle="Tìm kiếm hướng dẫn và tài liệu kỹ thuật"
      maxWidth="3xl"
    >
      <div className="px-8 py-8 space-y-8 bg-white">
        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Tìm kiếm hướng dẫn (ví dụ: cách tạo hóa đơn)..." 
            className="h-16 pl-14 pr-6 rounded-3xl bg-gray-50 border-gray-100 text-lg focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform", section.bg, section.color)}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{section.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <button 
                      key={i}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors text-left group/item"
                    >
                      <span className="text-[0.95rem] font-medium text-gray-600 group-hover/item:text-blue-600">{item}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-20 blur-3xl" />
          <div className="space-y-1 relative">
            <p className="text-lg font-black tracking-tight">Không tìm thấy thứ bạn cần?</p>
            <p className="text-slate-400 font-medium">Đội ngũ hỗ trợ của chúng tôi sẵn sàng trợ giúp 24/7.</p>
          </div>
          <button className="relative px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black transition-all active:scale-95 shadow-xl shadow-blue-500/20 whitespace-nowrap">
            Chat với chúng tôi
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
