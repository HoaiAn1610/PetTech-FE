import { useState, useMemo } from 'react';
import { ClinicPageShell } from '@/components/clinic/ClinicPageShell';
import { useClinicInvoices, useUpdateDeliveryStatus } from '@/hooks/clinic/useClinicOrders';
import { inventoryService } from '@/api/services';
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  ExternalLink,
  Edit,
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

export default function ClinicOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Status Action Modal State
  const [actionOrder, setActionOrder] = useState<{ id: string; targetStatus: string } | null>(null);
  const [carrier, setCarrier] = useState('GHTK');
  const [trackingCode, setTrackingCode] = useState('');
  const [shipperNote, setShipperNote] = useState('');

  // Fetch invoices where OrderSource = Online
  const { data: rawInvoices, isLoading, refetch } = useClinicInvoices({
    orderSource: 'Online',
    pageSize: 100,
  });

  const updateDeliveryStatusMutation = useUpdateDeliveryStatus();

  // Extract items list
  const orders = useMemo(() => {
    const raw = rawInvoices?.items || rawInvoices?.data?.items || rawInvoices?.value?.items || (Array.isArray(rawInvoices) ? rawInvoices : []);
    const list = Array.isArray(raw) ? raw : [];

    // Filter by DeliveryStatus if tab is not 'all'
    let filtered = list;
    if (activeTab !== 'all') {
      filtered = list.filter((item: any) => item.deliveryStatus === activeTab);
    }

    // Filter by SearchTerm (invoice number or customer name)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item: any) =>
          (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(q)) ||
          (item.customerName && item.customerName.toLowerCase().includes(q)) ||
          (item.shippingAddress?.recipientName &&
            item.shippingAddress.recipientName.toLowerCase().includes(q))
      );
    }

    // Sort by createdAt descending
    return [...filtered].sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawInvoices, activeTab, searchTerm]);

  const renderShippingDetails = (notesString: string) => {
    if (!notesString) return null;
    try {
      const data = JSON.parse(notesString);
      if (data && (data.carrier || data.trackingCode)) {
        return (
          <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-2xl flex flex-col gap-2">
            <p className="text-[0.68rem] text-orange-700 font-black uppercase tracking-wider">Thông tin bàn giao vận chuyển:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div className="text-xs">
                <span className="text-gray-400 font-semibold">Đơn vị vận chuyển:</span>{" "}
                <span className="text-gray-800 font-black">{data.carrier || "—"}</span>
              </div>
              <div className="text-xs flex items-center gap-1.5 flex-wrap">
                <span className="text-gray-400 font-semibold">Mã vận đơn:</span>{" "}
                <span className="text-blue-600 font-black select-all bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{data.trackingCode || "—"}</span>
              </div>
            </div>
            {data.note && (
              <div className="text-xs border-t border-orange-100/50 pt-2 mt-1">
                <span className="text-gray-400 font-semibold">Ghi chú thêm:</span>{" "}
                <span className="text-gray-700 font-medium">{data.note}</span>
              </div>
            )}
          </div>
        );
      }
    } catch (e) {
      // Fallback if not valid JSON
    }

    return (
      <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-[0.68rem] text-blue-700 font-bold uppercase tracking-wider">Ghi chú đơn hàng:</p>
        <p className="text-xs text-blue-900 font-medium mt-1">{notesString}</p>
      </div>
    );
  };

  const handleUpdateStatus = (orderId: string, nextStatus: string, needsNote = false) => {
    if (needsNote) {
      setActionOrder({ id: orderId, targetStatus: nextStatus });
      setCarrier('Giao Hàng Tiết Kiệm (GHTK)');
      setTrackingCode('');
      setShipperNote('');
    } else {
      executeStatusUpdate(orderId, nextStatus);
    }
  };

  const executeStatusUpdate = (orderId: string, nextStatus: string, note?: string) => {
    updateDeliveryStatusMutation.mutate(
      {
        invoiceId: orderId,
        deliveryStatus: nextStatus,
        note: note || undefined,
      },
      {
        onSuccess: async () => {
          setActionOrder(null);
          setShipperNote('');
          refetch();

          if (nextStatus === 'Confirmed') {
            const order = orders.find((o: any) => o.id === orderId);
            if (order && order.items && order.items.length > 0) {
              toast.loading('Đang tự động tạo phiếu xuất kho...', { id: 'inventory-deduction' });
              try {
                await Promise.all(
                  order.items.map((item: any) =>
                    inventoryService.createMovement({
                      productId: item.productId || item.id,
                      movementType: 'OUT',
                      quantity: item.quantity || 1,
                      notes: `Xuất kho tự động từ đơn đặt hàng online ${order.invoiceNumber || `DH-${order.id.slice(0, 8)}`}`,
                    })
                  )
                );
                toast.success('Đã tự động tạo phiếu xuất kho và trừ tồn kho thành công!', { id: 'inventory-deduction' });
              } catch (err) {
                console.error('Lỗi khi tự động tạo phiếu xuất kho:', err);
                toast.error('Lỗi tự động trừ tồn kho. Vui lòng kiểm tra lại thủ công!', { id: 'inventory-deduction' });
              }
            }
          }
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WaitingConfirm':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Đã xác nhận
          </span>
        );
      case 'Shipping':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Đang giao hàng
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <ClinicPageShell
      title="Đơn hàng trực tuyến"
      breadcrumbs={[
        { label: 'Cửa hàng', href: '/clinic' },
        { label: 'Đơn hàng online' },
      ]}
      maxWidth="max-w-6xl"
    >
      <div className="flex flex-col gap-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Search & Tabs Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedOrder(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/15'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-all font-medium text-gray-900"
            />
          </div>
        </div>

        {/* Content List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Không tìm thấy đơn hàng nào</p>
              <p className="text-xs text-gray-400 mt-1">Các đơn hàng đặt từ cổng storefront sẽ xuất hiện tại đây.</p>
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
                  {/* Overview Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/40 select-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <p className="text-sm font-black text-gray-900">
                            {order.invoiceNumber || `DH-${order.id.slice(0, 8)}`}
                          </p>
                          <span className="text-xs text-gray-400 font-bold">·</span>
                          <p className="text-xs font-bold text-gray-700">
                            {order.shippingAddress?.recipientName || order.customerName || 'Khách vãng lai'}
                          </p>
                          {getStatusBadge(order.deliveryStatus || 'WaitingConfirm')}
                        </div>
                        <p className="text-[0.68rem] text-gray-500 mt-1">Ngày tạo đơn: {dateStr}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-150">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tổng thu</p>
                        <p className="text-base font-black text-orange-600">
                          {order.total.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 space-y-6 bg-gray-50/20">
                      {/* Grid Detail */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1: Client details */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3">
                          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="text-xs font-black text-gray-900">Thông tin người mua</p>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <p className="text-gray-800 font-semibold">
                              Họ tên: <span className="text-gray-900 font-bold">{order.shippingAddress?.recipientName || order.customerName}</span>
                            </p>
                            <p className="text-gray-800 font-semibold">
                              Điện thoại:{' '}
                              <span className="text-gray-900 font-bold">{order.shippingAddress?.phone}</span>
                            </p>
                            {order.petName && (
                              <p className="text-gray-800 font-semibold">
                                Thú cưng:{' '}
                                <span className="text-primary font-bold">🐾 {order.petName}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Address */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3">
                          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <MapPin className="w-4.5 h-4.5 text-gray-400" />
                            <p className="text-xs font-black text-gray-900">Địa chỉ giao nhận</p>
                          </div>
                          <div className="text-xs space-y-1">
                            <p className="text-gray-800 font-semibold">
                              Địa chỉ: {order.shippingAddress?.street}
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

                        {/* Column 3: Payment */}
                        <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3">
                          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <CreditCard className="w-4.5 h-4.5 text-gray-400" />
                            <p className="text-xs font-black text-gray-900">Hình thức thanh toán</p>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <p className="text-gray-800 font-semibold">
                              Phương thức: <span className="text-gray-900 font-bold">{paymentMethodLabel}</span>
                            </p>
                            <p className="text-gray-850 font-semibold">
                              Trạng thái:{' '}
                              <span
                                className={
                                  order.status?.toLowerCase() === 'paid'
                                    ? 'text-emerald-600 font-bold'
                                    : 'text-amber-600 font-bold'
                                }
                              >
                                {order.status?.toLowerCase() === 'paid'
                                  ? 'Đã thanh toán'
                                  : 'Chưa thanh toán'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="bg-white p-4 rounded-xl border border-gray-150">
                        <p className="text-xs font-black text-gray-900 mb-3 border-b border-gray-100 pb-2">
                          Mặt hàng đặt mua
                        </p>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 text-left font-bold">
                              <th className="pb-2">Tên sản phẩm</th>
                              <th className="pb-2 text-center">Số lượng</th>
                              <th className="pb-2 text-right">Đơn giá</th>
                              <th className="pb-2 text-right">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item: any) => (
                              <tr key={item.id} className="border-b border-gray-50 last:border-0 font-medium text-gray-800">
                                <td className="py-2.5 font-bold">{item.productName}</td>
                                <td className="py-2.5 text-center">{item.quantity}</td>
                                <td className="py-2.5 text-right">{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                                <td className="py-2.5 text-right font-bold text-gray-900">
                                  {item.totalPrice.toLocaleString('vi-VN')} ₫
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold">Phí ship: {order.shippingFee.toLocaleString('vi-VN')} ₫</span>
                          <span className="text-sm font-black text-orange-600">
                            Tổng tiền: {order.total.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </div>

                      {/* Shipper internal note if present */}
                      {renderShippingDetails(order.notes)}

                      {/* Staff operations: Delivery status update controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                          Trạng thái giao hàng hiện tại:{' '}
                          <span className="text-gray-800">{order.deliveryStatus || 'WaitingConfirm'}</span>
                        </div>

                        <div className="flex gap-2">
                          {order.deliveryStatus === 'WaitingConfirm' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                              >
                                Hủy đơn
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-all shadow-md shadow-primary/10"
                              >
                                Xác nhận đơn hàng
                              </button>
                            </>
                          )}

                          {order.deliveryStatus === 'Confirmed' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                              >
                                Hủy đơn
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Shipping', true)}
                                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold transition-all shadow-md shadow-orange-100"
                              >
                                Bàn giao vận chuyển
                              </button>
                            </>
                          )}

                          {order.deliveryStatus === 'Shipping' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-md shadow-emerald-100"
                            >
                              Xác nhận đã giao hàng
                            </button>
                          )}

                          {(order.deliveryStatus === 'Delivered' || order.deliveryStatus === 'Cancelled') && (
                            <div className="text-xs text-gray-400 font-bold">
                              Đơn hàng đã hoàn thành và không cần cập nhật thêm.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shipper Note Input Modal */}
      {actionOrder && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
          onClick={() => setActionOrder(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center mb-1">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900">Bàn giao vận chuyển</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Vui lòng chọn đơn vị vận chuyển đối tác và nhập mã vận đơn để bàn giao đơn hàng này.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Carrier Select */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Đơn vị vận chuyển *</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium text-gray-800"
                >
                  <option value="Giao Hàng Tiết Kiệm (GHTK)">Giao Hàng Tiết Kiệm (GHTK)</option>
                  <option value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</option>
                  <option value="Viettel Post">Viettel Post</option>
                  <option value="VNPost">VNPost</option>
                  <option value="GrabExpress">GrabExpress</option>
                  <option value="Ahamove">Ahamove</option>
                  <option value="Tự giao / Khác">Tự giao / Khác</option>
                </select>
              </div>

              {/* Tracking Code */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Mã vận đơn *</label>
                <input
                  type="text"
                  placeholder="Nhập mã vận đơn từ nhà vận chuyển..."
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium text-gray-800"
                />
              </div>

              {/* Additional Note */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Ghi chú giao hàng (Tùy chọn)</label>
                <textarea
                  placeholder="Nhập ghi chú shipper hoặc hướng dẫn giao hàng..."
                  rows={2}
                  value={shipperNote}
                  onChange={(e) => setShipperNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary transition-all font-medium text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setActionOrder(null)}
                className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!trackingCode.trim()) {
                    toast.error('Vui lòng nhập mã vận đơn để bàn giao vận chuyển');
                    return;
                  }
                  executeStatusUpdate(
                    actionOrder.id,
                    actionOrder.targetStatus,
                    JSON.stringify({
                      carrier,
                      trackingCode: trackingCode.trim(),
                      note: shipperNote.trim()
                    })
                  );
                }}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] shadow-lg shadow-orange-100 flex items-center justify-center gap-1.5"
              >
                Bàn giao
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicPageShell>
  );
}
