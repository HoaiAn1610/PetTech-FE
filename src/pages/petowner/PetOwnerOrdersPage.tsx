import { useState } from 'react';
import { PetOwnerShell } from '@/components/petowner/PetOwnerShell';
import {
  useMyOrders,
  useCancelMyOrder,
} from '@/hooks/petowner/useStorefront';
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'WaitingConfirm', label: 'Chờ xác nhận' },
  { id: 'Confirmed', label: 'Đã xác nhận' },
  { id: 'Shipping', label: 'Đang giao' },
  { id: 'Delivered', label: 'Đã giao' },
  { id: 'Cancelled', label: 'Đã hủy' },
];

const CANCEL_REASONS = [
  'Tôi muốn đổi sản phẩm khác',
  'Đặt trùng đơn hàng',
  'Đổi ý không muốn mua nữa',
  'Tìm thấy nơi khác giá tốt hơn',
  'Thời gian giao hàng quá lâu',
];

export default function PetOwnerOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Cancel Order Modal State
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Fetch orders
  const { data: orders = [], isLoading, refetch } = useMyOrders({
    deliveryStatus: activeTab === 'all' ? undefined : activeTab,
  });

  const cancelOrderMutation = useCancelMyOrder();

  const handleCancelOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingOrderId) return;

    const finalReason = cancelReason === 'Khác' ? customReason.trim() : cancelReason;
    if (!finalReason) {
      return toast.error('Vui lòng chọn hoặc nhập lý do hủy đơn');
    }

    cancelOrderMutation.mutate(
      {
        id: cancelingOrderId,
        payload: { reason: finalReason },
      },
      {
        onSuccess: () => {
          setCancelingOrderId(null);
          setCancelReason('');
          setCustomReason('');
          refetch();
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WaitingConfirm':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Đã xác nhận
          </span>
        );
      case 'Shipping':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Đang giao hàng
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-100">
            {status}
          </span>
        );
    }
  };

  const renderDeliverySteps = (currentStatus: string) => {
    if (currentStatus === 'Cancelled') {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50/50 border border-red-100 rounded-2xl gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-xs font-bold text-red-700">Đơn hàng này đã bị hủy</p>
        </div>
      );
    }

    const steps = [
      { id: 'WaitingConfirm', label: 'Chờ xác nhận', icon: Clock },
      { id: 'Confirmed', label: 'Đã chuẩn bị', icon: Package },
      { id: 'Shipping', label: 'Đang giao hàng', icon: Truck },
      { id: 'Delivered', label: 'Đã nhận hàng', icon: CheckCircle2 },
    ];

    const getStatusIndex = (status: string) => {
      switch (status) {
        case 'WaitingConfirm': return 0;
        case 'Confirmed': return 1;
        case 'Shipping': return 2;
        case 'Delivered': return 3;
        default: return -1;
      }
    };

    const currentIndex = getStatusIndex(currentStatus);

    return (
      <div className="relative py-4 flex items-center justify-between w-full max-w-lg mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isDone
                    ? isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>
              <span
                className={`text-[0.68rem] font-bold whitespace-nowrap transition-colors duration-300 ${
                  isDone ? (isCurrent ? 'text-blue-600' : 'text-emerald-600') : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <PetOwnerShell pageTitle="Đơn hàng của tôi">
      <div className="max-w-7xl mx-auto flex flex-col gap-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Đơn hàng trực tuyến 📦</h2>
            <p className="text-xs text-gray-500 mt-1">Quản lý, theo dõi hành trình giao nhận sản phẩm của bạn</p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedOrder(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Không tìm thấy đơn hàng</p>
              <p className="text-xs text-gray-400 mt-1">Đơn hàng trực tuyến của bạn sẽ hiển thị tại đây.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order: any) => {
              const isExpanded = expandedOrder === order.id;
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—';

              const paymentMethodLabel =
                order.paymentMethod === 'wallet'
                  ? 'Ví tích lũy'
                  : order.paymentMethod === 'online'
                  ? 'PayOS trực tuyến'
                  : 'Tiền mặt';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:border-gray-300"
                >
                  {/* Order Overview Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/40 select-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <p className="text-sm font-black text-gray-900">
                            {order.invoiceNumber || `DH-${order.id.slice(0, 8)}`}
                          </p>
                          {getStatusBadge(order.deliveryStatus || 'WaitingConfirm')}
                        </div>
                        <p className="text-[0.68rem] text-gray-500 mt-1">Ngày đặt: {dateStr}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">TỔNG TIỀN</p>
                        <p className="text-base font-black text-orange-600">
                          {order.total.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Tracker & Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 space-y-6 bg-gray-50/20">
                      {/* Stepper */}
                      <div className="border-b border-gray-100 pb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trạng thái vận chuyển</p>
                        {renderDeliverySteps(order.deliveryStatus || 'WaitingConfirm')}
                      </div>

                      {/* Details Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address & Payment Info */}
                        <div className="space-y-4">
                          {/* Shipping Info */}
                          <div className="bg-white p-4 rounded-xl border border-gray-150 flex gap-3">
                            <MapPin className="w-4.5 h-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-black text-gray-900">Địa chỉ giao hàng</p>
                              <p className="text-xs text-gray-800 font-semibold mt-1">
                                {order.shippingAddress?.recipientName} · {order.shippingAddress?.phone}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {order.shippingAddress?.street}
                                {order.shippingAddress?.ward ? `, ${order.shippingAddress.ward}` : ''}
                                {`, ${order.shippingAddress?.district}, ${order.shippingAddress?.city}`}
                              </p>
                              {order.shippingAddress?.deliveryNote && (
                                <p className="text-[0.68rem] text-orange-600 font-semibold mt-1.5 italic bg-orange-50 px-2 py-1 rounded">
                                  💡 Ghi chú: {order.shippingAddress.deliveryNote}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Payment info */}
                          <div className="bg-white p-4 rounded-xl border border-gray-150 flex gap-3">
                            <CreditCard className="w-4.5 h-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-black text-gray-900">Thanh toán</p>
                              <p className="text-xs text-gray-700 font-medium mt-1">
                                Hình thức: <strong className="text-gray-900">{paymentMethodLabel}</strong>
                              </p>
                              <p className="text-xs text-gray-750 font-medium mt-0.5">
                                Trạng thái:{' '}
                                <strong
                                  className={
                                    order.status?.toLowerCase() === 'paid'
                                      ? 'text-emerald-600'
                                      : 'text-amber-600'
                                  }
                                >
                                  {order.status?.toLowerCase() === 'paid'
                                    ? 'Đã thanh toán'
                                    : 'Chưa thanh toán'}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order items list */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 flex flex-col">
                          <p className="text-xs font-black text-gray-900 mb-3 border-b border-gray-100 pb-2">
                            Sản phẩm đã chọn
                          </p>
                          <div className="flex-1 space-y-3 max-h-[180px] overflow-y-auto pr-1">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-xs gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-gray-800 truncate">{item.productName}</p>
                                  <p className="text-[0.65rem] text-gray-400 mt-0.5">
                                    Đơn giá: {item.unitPrice.toLocaleString('vi-VN')} ₫
                                  </p>
                                </div>
                                <span className="text-gray-500 font-medium">x{item.quantity}</span>
                                <span className="font-bold text-gray-900">
                                  {item.totalPrice.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-bold">Tổng đơn hàng</span>
                            <span className="text-sm font-black text-orange-600">
                              {order.total.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cancel Order Action Button */}
                      {(order.deliveryStatus === 'WaitingConfirm' || order.deliveryStatus === 'Confirmed') && (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => setCancelingOrderId(order.id)}
                            className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-black transition-all active:scale-[0.98]"
                          >
                            Hủy đơn hàng này
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {cancelingOrderId && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
          onClick={() => setCancelingOrderId(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center mb-1">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900">Xác nhận hủy đơn hàng</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Đơn hàng sẽ bị hủy và không thể khôi phục lại. Bạn vui lòng chọn lý do hủy đơn.
              </p>
            </div>

            <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-150 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                    />
                    <span className="text-xs font-semibold text-gray-700">{reason}</span>
                  </label>
                ))}

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-150 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Khác"
                    checked={cancelReason === 'Khác'}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                  />
                  <span className="text-xs font-semibold text-gray-700">Lý do khác...</span>
                </label>

                {cancelReason === 'Khác' && (
                  <textarea
                    required
                    placeholder="Vui lòng nhập lý do cụ thể..."
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-red-500 transition-all font-medium text-gray-800 placeholder-gray-400 resize-none"
                  />
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setCancelingOrderId(null)}
                  className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={cancelOrderMutation.isPending || !cancelReason}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] shadow-lg shadow-red-100 flex items-center justify-center gap-1.5"
                >
                  {cancelOrderMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Đồng ý hủy đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PetOwnerShell>
  );
}
