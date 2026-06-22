import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { CatalogGrid } from "@/features/clinic/pos/CatalogGrid";
import { CartSidebar, Customer, Pet } from "@/features/clinic/pos/CartSidebar";
import { ReceiptModal } from "@/features/clinic/pos/ReceiptModal";
import { posService } from "@/api/services";
import { usePOSCatalog, usePOSCategories, useCreateInvoice, usePayInvoice, usePayOnline } from "@/hooks/clinic/usePosQueries";
import { useClinicCustomers, usePetsByOwner } from "@/hooks/clinic/usePatientQueries";
import { toast } from "sonner";
import "@/styles/fonts.css";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tất cả", "Khám & Tư vấn", "Tắm chải", "Vaccine", "Dược phẩm", "Xét nghiệm", "Thức ăn thú cưng", "Bánh thưởng & Pate", "Phụ kiện thú cưng", "Bộ sưu tập"];

type CartItem = { id: string; name: string; price: number; qty: number; icon: string; hasAllergenWarning?: boolean };

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function POSPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "cart">("catalog");

  // New states for unpaid medical records feature
  const [viewMode, setViewMode] = useState<"products" | "records">("products");
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");
  const autoLoadParam = searchParams.get("autoLoadInvoice");
  
  // API Queries
  const { data: rawCatalog, isLoading: catalogLoading } = usePOSCatalog();
  const { data: rawCategories, isLoading: categoriesLoading } = usePOSCategories();
  const { data: rawCustomers, isLoading: customersLoading } = useClinicCustomers();

  // Form State
  const [selectedPatient, setSelectedPatient] = useState<Customer | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "cash" | "mobile" | "payos">("card");
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Dependent Query
  const { data: rawPets } = usePetsByOwner(selectedPatient?.id);

  // Mutations
  const createInvoiceMutation = useCreateInvoice();
  const payInvoiceMutation = usePayInvoice();
  const payOnlineMutation = usePayOnline();

  // Mapped Data
  const catalog = useMemo(() => {
    const rawProducts = rawCatalog?.items || rawCatalog?.data || (Array.isArray(rawCatalog) ? rawCatalog : []);
    return rawProducts.map((p: any) => ({
      id: p.id || p.productId || Math.random().toString(),
      sku: p.sku || p.id || p.productId || "",
      categoryId: p.categoryId || "Khác",
      cat: p.category || p.categoryName || "Khác",
      name: p.name || p.productName || "Sản phẩm",
      price: p.price || 0,
      icon: p.icon || p.emoji || "📦",
      color: p.color || "var(--primary-theme-color, #2563EB)",
      bg: p.bg || "color-mix(in srgb, var(--primary-theme-color, #2563EB) 8%, transparent)",
      stock: p.stockQty ?? p.stockQuantity ?? p.stock ?? null,
      ingredients: p.ingredients || []
    }));
  }, [rawCatalog]);

  const customers = useMemo(() => {
    const rawCusts = rawCustomers?.items || rawCustomers?.data || (Array.isArray(rawCustomers) ? rawCustomers : []);
    return rawCusts.map((c: any) => ({
      id: c.id || c.customerId || Math.random().toString(),
      name: c.fullName || c.name || "Khách vãng lai",
      phone: c.phoneNumber || c.phone || "",
      email: c.email || ""
    }));
  }, [rawCustomers]);

  const categories = useMemo(() => {
    const rawCats = rawCategories?.items || rawCategories?.data || (Array.isArray(rawCategories) ? rawCategories : []);
    const mapped = rawCats
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((c: any) => ({
        id: c.id || c.categoryId || Math.random().toString(),
        name: c.name || c.categoryName || "Khác"
      }));
    return [{ id: "all", name: "Tất cả" }, ...mapped];
  }, [rawCategories]);

  const pets = useMemo(() => {
    if (!selectedPatient) return [];
    const rawPetsData = rawPets as any;
    const rawItems = rawPetsData?.items || rawPetsData?.data || (Array.isArray(rawPets) ? rawPets : []);
    return rawItems.map((p: any) => ({
      id: p.id || p.petId || Math.random().toString(),
      name: p.name || "Không rõ",
      species: p.species || "",
      breed: p.breed || ""
    }));
  }, [rawPets, selectedPatient]);

  useEffect(() => {
    if (pets.length === 1) {
      setSelectedPet(pets[0]);
    } else {
      setSelectedPet(null);
    }
  }, [pets]);

  // Fetch pending invoices
  const fetchPendingInvoices = async () => {
    setLoadingPending(true);
    try {
      const res = await posService.getPendingInvoices({ status: "Pending", pageSize: 50 });
      const items = res?.items || res?.data?.items || res?.data || res?.value || [];
      setPendingInvoices(items);
    } catch (err) {
      console.error("Lỗi lấy danh sách hóa đơn chờ:", err);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchPendingInvoices();
  }, []);

  const handleSelectInvoice = (invoice: any) => {
    if (!invoice) return;
    
    // 1. Find and set selected customer
    const matchedCustomer = customers.find((c: any) => c.id === invoice.customerId);
    if (matchedCustomer) {
      setSelectedPatient(matchedCustomer);
    } else {
      setSelectedPatient({
        id: invoice.customerId,
        name: invoice.customerName || "Khách hàng",
        phone: invoice.customerPhone || "",
        email: invoice.customerEmail || ""
      });
    }

    // 2. Set selected pet
    setSelectedPet({
      id: invoice.petId,
      name: invoice.petName || "Thú cưng",
      species: "",
      breed: ""
    });

    // 3. Map items to cart
    const mappedItems = invoice.items.map((it: any) => {
      const prodId = it.productId || it.id;
      const catalogItem = catalog.find((p: any) => p.id === prodId || p.sku === prodId);
      
      const price = catalogItem ? catalogItem.price : (it.price || 0);
      const icon = catalogItem ? catalogItem.icon : (it.icon || it.emoji || "📦");
      const name = catalogItem ? catalogItem.name : (it.productName || it.name || "Sản phẩm");
      
      return {
        id: prodId,
        name: name,
        price: price,
        qty: it.quantity || it.qty || 1,
        icon: icon,
        hasAllergenWarning: it.hasAllergenWarning || false
      };
    });

    setCart(mappedItems);
    setActiveInvoiceId(invoice.id);
    setDiscount(invoice.discount || 0);

    toast.success(`Đã nạp đơn thuốc chờ của ${invoice.petName || "thú cưng"} vào giỏ hàng!`);
    
    // On mobile, switch to cart view
    setActiveTab("cart");
  };

  // Automatically select customer from URL query parameters
  useEffect(() => {
    if (customerIdParam && customers.length > 0) {
      const match = customers.find((c: any) => c.id === customerIdParam);
      if (match) {
        setSelectedPatient(match);
        toast.success(`Tự động chọn khách hàng: ${match.name}`);
        // Auto-switch to cart tab if loaded on mobile
        setActiveTab("cart");
      }
    }
  }, [customerIdParam, customers]);

  const loading = catalogLoading || categoriesLoading || customersLoading;

  const filteredCatalog = useMemo(() => catalog.filter((item: any) => {
    const matchCat = activeCat === "all" || item.categoryId === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeCat, search, catalog]);

  const filteredPatients = useMemo(() => customers.filter((p: any) =>
    !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.phone?.includes(patientSearch)
  ), [patientSearch, customers]);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && search.trim()) {
      const match = catalog.find((item: any) => item.sku?.toLowerCase() === search.trim().toLowerCase() || item.id === search.trim());
      if (match) {
        addToCart(match);
        setSearch("");
        toast.success(`Đã thêm ${match.name} vào giỏ hàng`);
      }
    }
  }

  async function addToCart(item: any) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, icon: item.icon }];
    });

    if (selectedPet && item.ingredients && item.ingredients.length > 0) {
      try {
         const res = await posService.checkAllergy(selectedPet.id, item.id, { productIngredients: item.ingredients });
         const conflicts = res?.conflicts || res?.data?.conflicts || (Array.isArray(res) ? res : []); 
         if (conflicts && conflicts.length > 0) {
            toast.error(`⚠️ CẢNH BÁO DỊ ỨNG: Sản phẩm này chứa chất gây dị ứng cho thú cưng!`, { duration: 5000, style: { background: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" } });
            setCart(prev => prev.map(c => c.id === item.id ? { ...c, hasAllergenWarning: true } : c));
         }
      } catch (err) {
         console.error("Allergy check error", err);
      }
    }
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * (discount / 100);
  const tax = (subtotal - discountAmt) * 0.08;
  const total = subtotal - discountAmt + tax;

  async function handleCharge() {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      let invoiceId = activeInvoiceId;

      if (!invoiceId) {
        const payload = {
          customerId: selectedPatient?.id || null,
          petId: selectedPet?.id || null,
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.qty,
            price: item.price,
            hasAllergenWarning: item.hasAllergenWarning || false
          })),
          subtotal,
          discount,
          tax,
          total,
          paymentMethod: payMethod
        };
        
        // BƯỚC 1: TẠO HÓA ĐƠN (Pending)
        const res = await createInvoiceMutation.mutateAsync(payload);
        const invoiceData = res?.data || res?.value || res;
        invoiceId = invoiceData?.id;
      }
      
      if (!invoiceId) {
        throw new Error("Không lấy được mã Hóa đơn từ hệ thống.");
      }
      
      if (payMethod === "payos") {
        try {
          toast.loading("Đang tạo link thanh toán PayOS...", { id: "payos" });
          const payRes = await payOnlineMutation.mutateAsync(invoiceId);
          toast.dismiss("payos");
          
          const paymentUrl = payRes?.paymentUrl || payRes?.data?.paymentUrl || payRes?.value?.paymentUrl;
          
          if (paymentUrl) {
            window.location.href = paymentUrl;
            return;
          } else {
            throw new Error("Không nhận được URL thanh toán từ PayOS");
          }
        } catch(e) {
          console.error("PayOS error", e);
          toast.error("Lỗi tạo link thanh toán PayOS. Vui lòng thử lại!");
        }
      } else {
        // BƯỚC 2: XÁC NHẬN THANH TOÁN (Kích hoạt trừ kho) cho các phương thức khác
        try {
          await payInvoiceMutation.mutateAsync(invoiceId);
          toast.success("Thanh toán thành công! Đã tự động trừ tồn kho.");
          // clearSale will be called when closing ReceiptModal
          setShowReceipt(true);
          fetchPendingInvoices();
        } catch (payErr) {
          console.error("Lỗi xác nhận thanh toán:", payErr);
        }
      }
      
    } catch (err) {
      console.error("Lỗi khi tạo/thanh toán hóa đơn:", err);
    } finally {
      setProcessing(false);
    }
  }

  function clearSale() {
    setCart([]); 
    setSelectedPatient(null); 
    setSelectedPet(null);
    setDiscount(0); 
    setShowReceipt(false); 
    setActiveInvoiceId(null);
    setPatientSearch("");
    fetchPendingInvoices();
  }

  return (
    <ClinicPageShell
      title="POS thông minh"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "POS" }]}
      maxWidth="max-w-none"
      noPadding
      fullHeight
    >
      {/* Mobile Tabs Switcher */}
      <div className="lg:hidden flex border-b border-gray-200/80 bg-white p-2 shrink-0 gap-2">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-3 text-center text-sm font-black rounded-xl transition-all ${
            activeTab === "catalog"
              ? "bg-blue-50 text-blue-600 border border-blue-100"
              : "text-gray-400 hover:text-gray-600 border border-transparent"
          }`}
        >
          Sản phẩm & Dịch vụ
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          className={`flex-1 py-3 text-center text-sm font-black rounded-xl transition-all relative ${
            activeTab === "cart"
              ? "bg-blue-50 text-blue-600 border border-blue-100"
              : "text-gray-400 hover:text-gray-600 border border-transparent"
          }`}
        >
          Giỏ hàng & Thanh toán
          {cart.length > 0 && (
            <span className="absolute top-2.5 right-4 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-white">
        {loading && catalog.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-r" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
            <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className={`flex-1 h-full min-w-0 ${activeTab === "catalog" ? "block" : "hidden lg:block"}`}>
            <CatalogGrid
              search={search}
              setSearch={setSearch}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              categories={categories}
              filteredCatalog={filteredCatalog as any}
              cart={cart}
              addToCart={addToCart as any}
              onSearchKeyDown={handleSearchKeyDown}
              viewMode={viewMode}
              setViewMode={setViewMode}
              pendingInvoices={pendingInvoices}
              loadingPending={loadingPending}
              onSelectInvoice={handleSelectInvoice}
              customers={customers}
            />
          </div>
        )}

        <div className={`w-full lg:w-[420px] xl:w-[450px] shrink-0 h-full border-l border-gray-100 shadow-sm ${activeTab === "cart" ? "block" : "hidden lg:block"}`}>
          <CartSidebar
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            patientSearch={patientSearch}
            setPatientSearch={setPatientSearch}
            filteredPatients={filteredPatients}
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
            pets={pets}
            cart={cart}
            setCart={setCart}
            activeInvoiceId={activeInvoiceId}
            setActiveInvoiceId={setActiveInvoiceId}
            autoLoadParam={autoLoadParam}
            updateQty={updateQty}
            discount={discount}
            setDiscount={setDiscount}
            subtotal={subtotal}
            discountAmt={discountAmt}
            tax={tax}
            total={total}
            payMethod={payMethod}
            setPayMethod={setPayMethod}
            handleCharge={handleCharge}
            processing={processing}
            clearSale={clearSale}
            catalog={catalog}
            pendingInvoices={pendingInvoices}
          />
        </div>
      </div>

      {showReceipt && (
        <ReceiptModal
          items={cart}
          total={total}
          discount={discount}
          patient={selectedPatient}
          method={payMethod === "card" ? "Thẻ" : payMethod === "cash" ? "Tiền mặt" : payMethod === "payos" ? "PayOS" : "Ví điện tử"}
          onClose={clearSale}
        />
      )}
    </ClinicPageShell>
  );
}
