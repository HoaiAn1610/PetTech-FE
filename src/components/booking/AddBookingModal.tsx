import React, { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Calendar, Clock, User, Check, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";
import { ClinicConfirmModal } from "@/components/clinic/ClinicConfirmModal";
import { petService } from "@/api/petService";
import { bookingService } from "@/api/bookingService";
import { useTenant } from "@/context/TenantContext";

const TIME_SLOTS = [
  "09:00 SA", "09:30 SA", "10:00 SA", "10:30 SA",
  "11:00 SA", "11:30 SA", "02:00 CH", "02:30 CH",
  "03:00 CH", "03:30 CH", "04:00 CH", "04:30 CH",
];

const mapTimeSlotToTimeSpan = (slot: string): string => {
  const parts = slot.split(" ");
  const time = parts[0];
  const period = parts[1];
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  if (period === "CH" && hours < 12) {
    hours += 12;
  } else if (period === "SA" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minutesStr}:00`;
};

function parseVietnameseSlotToMinutes(slot: string): number {
  const clean = slot.trim().toUpperCase();
  const parts = clean.split(" ");
  const timePart = parts[0];
  const ampm = parts[1] || "";
  
  let [hoursStr, minutesStr] = timePart.split(":");
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10) || 0;
  
  if ((ampm === "CH" || ampm === "PM") && hours < 12) {
    hours += 12;
  } else if ((ampm === "SA" || ampm === "AM") && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

function parseSettingsTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

interface AddBookingModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preSelectedPet?: any;
}

export function AddBookingModal({ onClose, onSuccess, preSelectedPet }: AddBookingModalProps) {
  const { settings } = useTenant();
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Selector states
  const [petSearch, setPetSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<any | null>(preSelectedPet || null);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 SA");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: true,
    message: ""
  });

  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Load all initial data from live backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (preSelectedPet) {
          setSelectedPet(preSelectedPet);
        }
        // Load pets
        const petRes = await petService.getPets({ PageSize: 1000 });
        let parsedPets: any[] = [];
        if (petRes) {
          if (Array.isArray(petRes)) parsedPets = petRes;
          else if (Array.isArray((petRes as any).items)) parsedPets = (petRes as any).items;
          else if ((petRes as any).value && Array.isArray((petRes as any).value.items)) parsedPets = (petRes as any).value.items;
          else if ((petRes as any).data && Array.isArray((petRes as any).data.items)) parsedPets = (petRes as any).data.items;
        }
        setPets(parsedPets);

        // Load services
        const svcRes = await bookingService.getServices();
        let parsedSvcs: any[] = [];
        if (svcRes) {
          if (Array.isArray(svcRes)) parsedSvcs = svcRes;
          else if (Array.isArray((svcRes as any).items)) parsedSvcs = (svcRes as any).items;
          else if ((svcRes as any).value && Array.isArray((svcRes as any).value.items)) parsedSvcs = (svcRes as any).value.items;
        }
        setServices(parsedSvcs);
        if (parsedSvcs.length > 0) setSelectedServiceId(parsedSvcs[0].id);

        // Load staff
        const staffRes = await bookingService.getStaff();
        let parsedStaff: any[] = [];
        if (staffRes) {
          if (Array.isArray(staffRes)) parsedStaff = staffRes;
          else if (Array.isArray((staffRes as any).items)) parsedStaff = (staffRes as any).items;
          else if ((staffRes as any).value && Array.isArray((staffRes as any).value.items)) parsedStaff = (staffRes as any).value.items;
        }
        setStaffList(parsedStaff);
        if (parsedStaff.length > 0) setSelectedStaffId(parsedStaff[0].id);
      } catch (err) {
        console.error("Failed to load form metadata inside AddBookingModal:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtered pet list based on search term
  const filteredPets = useMemo(() => {
    if (!petSearch.trim()) return [];
    const query = petSearch.toLowerCase();
    return pets.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.breed && p.breed.toLowerCase().includes(query)) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(query))
    );
  }, [petSearch, pets]);

  const canSave = selectedPet && selectedServiceId && selectedStaffId && bookingDate && timeSlot;

  const handleCreate = async () => {
    if (!canSave) return;
    setSubmitting(true);
    try {
      const payload = {
        petId: selectedPet.id,
        ownerId: selectedPet.ownerId || "",
        serviceId: selectedServiceId,
        assignedStaffId: selectedStaffId || null,
        bookingDate: `${bookingDate}T00:00:00Z`,
        startTime: mapTimeSlotToTimeSpan(timeSlot),
        notes: notes || ""
      };

      const res = await bookingService.createBooking(payload);
      if (res && res.isSuccess !== false) {
        onSuccess();
        setNotification({
          show: true,
          success: true,
          message: `Lịch hẹn khám dịch vụ đã được thiết lập thành công cho bé ${selectedPet.name} vào ngày ${bookingDate} lúc ${timeSlot}.`
        });
      } else {
        setNotification({
          show: true,
          success: false,
          message: res?.message || "Không thể tạo lịch hẹn. Vui lòng kiểm tra lại khung giờ hoặc bác sĩ phụ trách!"
        });
      }
    } catch (err) {
      console.error("Failed to create booking through API:", err);
      setNotification({
        show: true,
        success: false,
        message: "Đã xảy ra lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền và thử lại sau!"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const ModalFooter = (
    <div className="flex w-full gap-2.5">
      <button
        onClick={onClose}
        type="button"
        className="px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-bold text-sm"
      >
        Hủy bỏ
      </button>
      <button
        disabled={!canSave || submitting}
        onClick={handleCreate}
        className="flex-1 py-3.5 rounded-xl transition-all font-black text-sm flex items-center justify-center gap-2"
        style={{
          background: canSave
            ? "linear-gradient(135deg,#2563EB,#1d4ed8)"
            : "#e5e7eb",
          color: canSave ? "white" : "#9ca3af",
          boxShadow: canSave ? "0 4px 12px rgba(37,99,235,0.2)" : "none"
        }}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
          </>
        ) : (
          <>Đặt lịch hẹn ngay</>
        )}
      </button>
    </div>
  );

  return (
    <ClinicModal
      title="Đặt lịch khám thú cưng"
      subtitle="Thiết lập ca khám, dịch vụ spa & phân công bác sĩ"
      onClose={onClose}
      footer={ModalFooter}
      maxWidth="max-w-md"
    >
      <div className="px-6 py-5 flex flex-col gap-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đang kết nối cơ sở dữ liệu...</p>
          </div>
        ) : (
          <>

            {/* Step 1: Pet Search Select */}
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                TÌM KIẾM BỆNH NHÂN THÚ CƯNG *
              </label>
              {selectedPet ? (
                <div className="border-2 border-green-500/30 bg-green-500/5 rounded-2xl p-3.5 flex items-center justify-between transition-all">
                  <div>
                    <p className="text-sm font-black text-gray-800">🐾 {selectedPet.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Chủ nuôi: {selectedPet.ownerName} · Giống: {selectedPet.breed || "Chưa rõ"}</p>
                  </div>
                  {!preSelectedPet && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPet(null);
                        setPetSearch("");
                      }}
                      className="text-xs font-black text-blue-600 hover:underline uppercase tracking-wider"
                    >
                      Thay đổi
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    value={petSearch}
                    onChange={(e) => setPetSearch(e.target.value)}
                    placeholder="Gõ tên thú cưng, giống hoặc tên chủ..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
                  />
                  {filteredPets.length > 0 && (
                    <div className="absolute top-[52px] left-0 right-0 z-30 max-h-48 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl divide-y divide-gray-50 p-2">
                      {filteredPets.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPet(p)}
                          className="p-3 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-bold text-gray-800">🐾 {p.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Giống: {p.breed || "Chưa rõ"} · Chủ nuôi: {p.ownerName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {petSearch.trim() && filteredPets.length === 0 && (
                    <div className="p-4 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 mt-1.5">
                      <p className="text-xs font-bold text-gray-500">Không tìm thấy thú cưng nào</p>
                      <p className="text-[10px] text-gray-400 mt-1">Hãy kiểm tra lại từ khóa hoặc thêm bệnh nhân mới!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Service & Vet inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                  DỊCH VỤ Y TẾ / SPA *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white font-medium"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                  BÁC SĨ PHỤ TRÁCH *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white font-medium"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName || "Bác sĩ trực"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time Slot inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                  NGÀY HẸN KHÁM *
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                  KHUNG GIỜ KHÁM *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white font-medium"
                >
                  {TIME_SLOTS.map((t) => {
                    const slotMinutes = parseVietnameseSlotToMinutes(t);
                    const startLimit = parseSettingsTimeToMinutes(settings.businessHoursStart);
                    const endLimit = parseSettingsTimeToMinutes(settings.businessHoursEnd);
                    const isOutOfHours = slotMinutes < startLimit || slotMinutes > endLimit;
                    return (
                      <option key={t} value={t} disabled={isOutOfHours}>
                        {t} {isOutOfHours ? "(Ngoài giờ làm việc)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Notes triệu chứng */}
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
                TRIỆU CHỨNG LÂM SÀNG / LƯU Ý
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập triệu chứng của thú cưng hoặc yêu cầu khác của chủ nuôi..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all resize-none"
              />
            </div>

            {/* Policy constraint info */}
            <div className="flex gap-2.5 p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <ShieldAlert className="w-4.5 h-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-blue-800 leading-normal">
                <strong>Hệ thống Phân quyền Staff:</strong> Hành động tạo lịch hẹn này tuân thủ chính sách RequireStaff. Lịch hẹn sau khi tạo sẽ tự động được gán cho bác sĩ phụ trách.
              </p>
            </div>
          </>
        )}
      </div>

      {notification.show && (
        <ClinicConfirmModal
          isOpen={notification.show}
          title={notification.success ? "Đặt lịch thành công!" : "Đặt lịch thất bại!"}
          message={notification.message}
          confirmLabel={notification.success ? "Tuyệt vời" : "Đóng"}
          cancelLabel=""
          variant={notification.success ? "success" : "danger"}
          onConfirm={() => {
            setNotification({ show: false, success: true, message: "" });
            if (notification.success) {
              onClose();
            }
          }}
          onCancel={() => {
            setNotification({ show: false, success: true, message: "" });
            if (notification.success) {
              onClose();
            }
          }}
        />
      )}
    </ClinicModal>
  );
}
