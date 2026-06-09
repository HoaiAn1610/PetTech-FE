import { useState } from 'react';
import { X, CreditCard, DollarSign, Wallet, Loader2 } from 'lucide-react';
import { useMyPets } from '@/hooks/petowner/useMyPets';
import { useCheckout } from '@/hooks/petowner/useStorefront';
import { petOwnerApi } from '@/api/petOwnerApi';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
  totalAmount: number;
}

export function CheckoutModal({ onClose, onSuccess, totalAmount }: CheckoutModalProps) {
  // Query pets & wallet balance
  const { data: pets = [] } = useMyPets();
  const { data: walletData, isLoading: loadingWallet } = useQuery<any>({
    queryKey: ['storefront', 'wallet'],
    queryFn: () => petOwnerApi.getMyWallet(),
  });

  const walletBalance = (walletData as any)?.balance ?? (walletData as any)?.amount ?? (walletData as any)?.value?.balance ?? 0;

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'wallet'>('online');

  const checkoutMutation = useCheckout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim()) return toast.error('Vui lòng nhập tên người nhận');
    if (!phone.trim()) return toast.error('Vui lòng nhập số điện thoại');
    if (!street.trim()) return toast.error('Vui lòng nhập địa chỉ (số nhà, tên đường)');
    if (!district.trim()) return toast.error('Vui lòng nhập Quận/Huyện');
    if (!city.trim()) return toast.error('Vui lòng nhập Tỉnh/Thành phố');

    if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
      return toast.error('Số dư ví không đủ để thanh toán đơn hàng này');
    }

    const payload = {
      petId: selectedPetId ? selectedPetId : undefined,
      paymentMethod,
      notes: orderNotes.trim() ? orderNotes : undefined,
      shippingAddress: {
        recipientName,
        phone,
        street,
        ward: ward.trim() ? ward : undefined,
        district,
        city,
        deliveryNote: deliveryNote.trim() ? deliveryNote : undefined,
      },
    };

    checkoutMutation.mutate(payload, {
      onSuccess: (data: any) => {
        const result = data?.data || data?.value || data;
        toast.success('Đặt hàng thành công! 🎉');
        if (paymentMethod === 'online' && result?.paymentUrl) {
          toast.info('Đang chuyển hướng sang cổng thanh toán trực tuyến...');
          setTimeout(() => {
            window.location.href = result.paymentUrl;
          }, 1000);
        } else {
          onSuccess();
        }
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', fontFamily: 'Inter, sans-serif' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white max-h-[90dvh] flex flex-col animate-in zoom-in-95 duration-200"
        style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-black text-gray-900">Đặt hàng & Thanh toán 🛍️</h3>
            <p className="text-xs text-gray-500 mt-1">Cung cấp thông tin giao hàng và chọn phương thức thanh toán</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Shipping Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin giao hàng</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Tên người nhận *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Số nhà, tên đường *</label>
                <input
                  type="text"
                  required
                  placeholder="123 Đường Trần Hưng Đạo"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Phường/Xã (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Phường Bến Thành"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Quận/Huyện *</label>
                <input
                  type="text"
                  required
                  placeholder="Quận 1"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Tỉnh/Thành phố *</label>
                <input
                  type="text"
                  required
                  placeholder="TP. Hồ Chí Minh"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Ghi chú giao hàng (Tùy chọn)</label>
              <input
                type="text"
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Optional Pet & Order Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Liên kết với thú cưng (Tùy chọn)</label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-bold text-gray-700 cursor-pointer"
              >
                <option value="">-- Không chọn --</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji || '🐾'} {p.name} ({p.breed || p.species})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Ghi chú đơn hàng (Tùy chọn)</label>
              <input
                type="text"
                placeholder="Ghi chú thêm cho shop..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phương thức thanh toán</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* PayOS */}
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl flex flex-col gap-2.5 items-start text-left border-2 transition-all hover:scale-[1.01] ${
                  paymentMethod === 'online'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${paymentMethod === 'online' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">QR Code trực tuyến</p>
                  <p className="text-[0.68rem] text-gray-500 mt-0.5">Thanh toán tức thì qua PayOS</p>
                </div>
              </button>

              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-2xl flex flex-col gap-2.5 items-start text-left border-2 transition-all hover:scale-[1.01] ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Tiền mặt khi nhận</p>
                  <p className="text-[0.68rem] text-gray-500 mt-0.5">Thanh toán trực tiếp khi nhận hàng</p>
                </div>
              </button>

              {/* Wallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-2xl flex flex-col gap-2.5 items-start text-left border-2 transition-all hover:scale-[1.01] ${
                  paymentMethod === 'wallet'
                    ? 'border-purple-600 bg-purple-50/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 justify-between w-full">
                    <p className="text-sm font-bold text-gray-900">Ví PetTech</p>
                    {loadingWallet ? (
                      <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
                    ) : (
                      <span className="text-[0.68rem] font-black text-purple-600 bg-purple-100/60 px-1.5 py-0.5 rounded">
                        {walletBalance.toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                  </div>
                  <p className="text-[0.68rem] text-gray-500 mt-0.5">Trừ trực tiếp từ số dư ví của bạn</p>
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs text-gray-500 font-semibold">TỔNG CỘNG</p>
            <p className="text-xl font-black text-gray-900">{totalAmount.toLocaleString('vi-VN')} ₫</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-gray-700 font-bold text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={checkoutMutation.isPending}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {checkoutMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {paymentMethod === 'online' ? 'Thanh toán trực tuyến' : 'Xác nhận đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
