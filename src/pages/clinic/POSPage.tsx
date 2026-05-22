import { useState, useMemo, useEffect } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { CatalogGrid } from "@/features/clinic/pos/CatalogGrid";
import { CartSidebar, Customer, Pet } from "@/features/clinic/pos/CartSidebar";
import { ReceiptModal } from "@/features/clinic/pos/ReceiptModal";
import { posService, customerService, petService } from "@/api/services";
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
  
  // API Data
  const [catalog, setCatalog] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([{ id: "all", name: "Tất cả" }]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedPatient, setSelectedPatient] = useState<Customer | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "cash" | "mobile">("card");
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, customersRes, categoriesRes] = await Promise.all([
        posService.getProducts().catch(() => ({ data: [] })),
        customerService.getCustomers().catch(() => ({ data: [] })),
        posService.getCategories().catch(() => ({ data: [] }))
      ]);
      
      // Map API data. Adjust fields as necessary.
      const rawProducts = productsRes?.items || productsRes?.data || (Array.isArray(productsRes) ? productsRes : []);
      const mappedProducts = rawProducts.map((p: any) => ({
        id: p.id || p.productId || Math.random().toString(),
        sku: p.sku || p.id || p.productId || "",
        categoryId: p.categoryId || "Khác",
        cat: p.category || p.categoryName || "Khác",
        name: p.name || p.productName || "Sản phẩm",
        price: p.price || 0,
        icon: p.icon || p.emoji || "📦",
        color: p.color || "#2563EB",
        bg: p.bg || "rgba(37,99,235,0.08)",
        stock: p.stockQty ?? p.stockQuantity ?? p.stock ?? null,
        ingredients: p.ingredients || []
      }));
      setCatalog(mappedProducts);

      const rawCustomers = customersRes?.items || customersRes?.data || (Array.isArray(customersRes) ? customersRes : []);
      const mappedCustomers = rawCustomers.map((c: any) => ({
        id: c.id || c.customerId || Math.random().toString(),
        name: c.fullName || c.name || "Khách vãng lai",
        phone: c.phoneNumber || c.phone || "",
        email: c.email || ""
      }));
      setCustomers(mappedCustomers);

      const rawCategories = categoriesRes?.items || categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);
      const mappedCategories = rawCategories
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((c: any) => ({
          id: c.id || c.categoryId || Math.random().toString(),
          name: c.name || c.categoryName || "Khác"
        }));
      setCategories([{ id: "all", name: "Tất cả" }, ...mappedCategories]);
    } catch (err) {
      console.error("Error fetching POS data:", err);
      toast.error("Không thể tải dữ liệu sản phẩm hoặc khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      petService.getPets({ ownerId: selectedPatient.id })
        .then(res => {
           const resData = res as any;
           const rawPets = resData?.items || resData?.data || (Array.isArray(resData) ? resData : []);
           const mappedPets = rawPets.map((p: any) => ({
             id: p.id || p.petId || Math.random().toString(),
             name: p.name || "Không rõ",
             species: p.species || "",
             breed: p.breed || ""
           }));
           setPets(mappedPets);
           if (mappedPets.length === 1) setSelectedPet(mappedPets[0]);
           else setSelectedPet(null);
        })
        .catch(() => setPets([]));
    } else {
      setPets([]);
      setSelectedPet(null);
    }
  }, [selectedPatient]);

  const filteredCatalog = useMemo(() => catalog.filter(item => {
    const matchCat = activeCat === "all" || item.categoryId === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeCat, search, catalog]);

  const filteredPatients = useMemo(() => customers.filter(p =>
    !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.phone?.includes(patientSearch)
  ), [patientSearch, customers]);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && search.trim()) {
      const match = catalog.find(item => item.sku?.toLowerCase() === search.trim().toLowerCase() || item.id === search.trim());
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
      const res: any = await posService.createInvoice(payload);
      const invoiceData = res?.data || res?.value || res;
      const invoiceId = invoiceData?.id;
      
      if (!invoiceId) {
        throw new Error("Không lấy được mã Hóa đơn từ hệ thống.");
      }
      
      // BƯỚC 2: XÁC NHẬN THANH TOÁN (Kích hoạt trừ kho)
      try {
        await posService.payInvoice(invoiceId);
        
        toast.success("Thanh toán thành công! Đã tự động trừ tồn kho.");
        // clearSale will be called when closing ReceiptModal
        setShowReceipt(true);
        fetchData(); // Cập nhật lại tồn kho trên UI
      } catch (payErr) {
        console.error("Lỗi xác nhận thanh toán:", payErr);
        toast.error("Hóa đơn đã tạo nhưng quá trình xác nhận thanh toán/trừ kho gặp lỗi. Vui lòng thử lại!");
      }
      
    } catch (err) {
      console.error("Lỗi khi tạo hóa đơn:", err);
      toast.error("Lỗi khi tạo hóa đơn. Vui lòng kiểm tra lại!");
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
    setPatientSearch("");
  }

  return (
    <ClinicPageShell
      title="POS thông minh"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "POS" }]}
      maxWidth="max-w-none"
      noPadding
    >
      <div className="flex h-[calc(100vh-140px)] min-h-0 overflow-hidden">
        {loading && catalog.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-r" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
            <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-blue-200 border-t-blue-600" />
          </div>
        ) : (
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
          />
        )}

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
        />
      </div>

      {showReceipt && (
        <ReceiptModal
          items={cart}
          total={total}
          discount={discount}
          patient={selectedPatient}
          method={payMethod === "card" ? "Thẻ" : payMethod === "cash" ? "Tiền mặt" : "Ví điện tử"}
          onClose={clearSale}
        />
      )}
    </ClinicPageShell>
  );
}
