import { X, Activity, Thermometer, Heart, Calendar, Pill, FileText, Camera } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

interface MedicalRecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  pet: any;
}

export function MedicalRecordDetailModal({ isOpen, onClose, record, pet }: MedicalRecordDetailModalProps) {
  if (!isOpen || !record) return null;

  const dateStr = record.visitDate 
    ? new Date(record.visitDate).toLocaleDateString("vi-VN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "Không rõ ngày khám";
  
  const timeStr = record.visitDate
    ? new Date(record.visitDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div 
          className="flex items-center justify-between px-8 py-6 text-white"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <FileText className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Chi Tiết Bệnh Án Cũ</h3>
              <p className="text-xs font-bold text-blue-100/60 uppercase tracking-widest mt-0.5">
                {dateStr} {timeStr ? `· ${timeStr}` : ""}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
          
          {/* Pet Context Summary */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <ImageWithFallback 
                src={pet?.avatarUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200"} 
                alt={pet?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Bệnh nhân</p>
              <h4 className="text-base font-black text-gray-900 mt-0.5">
                {pet?.name} <span className="font-medium text-gray-500 text-sm">({pet?.species || "Chó"} · {pet?.breed || "Giống chưa rõ"})</span>
              </h4>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" /> Chỉ số sinh tồn (Vitals)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Nhiệt độ", value: record.vitals?.temperature ? `${record.vitals.temperature} °C` : "---", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50" },
                { label: "Cân nặng", value: record.vitals?.weight ? `${record.vitals.weight} kg` : "---", icon: Activity, color: "text-violet-500", bg: "bg-violet-50" },
                { label: "Nhịp tim", value: record.vitals?.heartRate ? `${record.vitals.heartRate} bpm` : "---", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
                { label: "Nhịp thở", value: record.vitals?.respiratoryRate ? `${record.vitals.respiratoryRate} /ph` : "---", icon: Activity, color: "text-green-500", bg: "bg-green-50" }
              ].map((v, i) => (
                <div key={i} className={`p-4 rounded-2xl ${v.bg} border border-transparent flex items-center gap-3`}>
                  <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0`}>
                    <v.icon className={`w-4 h-4 ${v.color}`} />
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-black text-gray-400 uppercase tracking-widest">{v.label}</p>
                    <p className="text-sm font-black text-gray-900 mt-0.5">{v.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <h5 className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Chẩn đoán chính</h5>
              <p className="text-sm font-black text-gray-900 bg-white px-3 py-2 rounded-xl border border-gray-200/60 shadow-sm inline-block">
                {record.diagnosis || "Chưa ghi nhận chẩn đoán"}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <h5 className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Triệu chứng chính</h5>
              <p className="text-sm font-bold text-gray-800">
                {record.chiefComplaint || "Không ghi nhận triệu chứng"}
              </p>
            </div>
            <div className="md:col-span-2 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <h5 className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ghi chú lâm sàng</h5>
              <p className="text-sm font-medium text-gray-700 whitespace-pre-line leading-relaxed">
                {record.clinicalNotes || "Không có ghi chú lâm sàng bổ sung."}
              </p>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-500" /> Đơn thuốc điều trị
            </h4>
            {record.prescriptions && record.prescriptions.length > 0 ? (
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-400 font-black text-[0.7rem] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Tên Thuốc</th>
                      <th className="px-6 py-4">Đường dùng</th>
                      <th className="px-6 py-4">Liều lượng</th>
                      <th className="px-6 py-4">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold text-gray-800">
                    {record.prescriptions.map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-black text-gray-900">{p.medicationName || p.medicine || "Tên thuốc chưa rõ"}</p>
                          {p.notes && <p className="text-xs font-medium text-gray-400 mt-0.5">💡 {p.notes}</p>}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium text-xs">{p.route || "---"}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-black">
                            {p.dosage}
                          </span>
                          <span className="text-xs text-gray-400 ml-2 font-medium">{p.frequency}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{p.durationDays ? `${p.durationDays} ngày` : p.duration || "---"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-sm font-bold text-gray-400 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                Không có đơn thuốc nào được kê trong lần khám này.
              </div>
            )}
          </div>

          {/* Photos Slot */}
          {(record.beforeImageUrl || record.afterImageUrl) && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-500" /> Ảnh chụp lâm sàng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {record.beforeImageUrl && (
                  <div className="space-y-2">
                    <p className="text-[0.62rem] font-black text-gray-400 tracking-wider uppercase">Trước điều trị</p>
                    <div className="h-44 rounded-2xl overflow-hidden border-2 border-orange-500/10">
                      <img src={record.beforeImageUrl} className="w-full h-full object-cover" alt="Before" />
                    </div>
                  </div>
                )}
                {record.afterImageUrl && (
                  <div className="space-y-2">
                    <p className="text-[0.62rem] font-black text-gray-400 tracking-wider uppercase">Sau điều trị</p>
                    <div className="h-44 rounded-2xl overflow-hidden border-2 border-green-500/10">
                      <img src={record.afterImageUrl} className="w-full h-full object-cover" alt="After" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Follow-up Note */}
          {record.followUpDate && (
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-orange-50 border border-orange-100/50">
              <Calendar className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <p className="text-[0.65rem] font-black text-orange-400 uppercase tracking-widest">Hẹn tái khám</p>
                <p className="text-sm font-black text-orange-950/80 tracking-tight mt-0.5">
                  Ngày hẹn tiếp theo: {new Date(record.followUpDate).toLocaleDateString("vi-VN", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-black text-sm transition-all"
          >
            Đóng Lại
          </button>
        </div>

      </div>
    </div>
  );
}
