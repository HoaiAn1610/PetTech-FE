import { useState, useMemo } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { CatalogGrid } from "@/features/clinic/pos/CatalogGrid";
import { CartSidebar } from "@/features/clinic/pos/CartSidebar";
import { ReceiptModal } from "@/features/clinic/pos/ReceiptModal";
import "@/styles/fonts.css";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tất cả", "Khám & Tư vấn", "Tắm chải", "Vaccine", "Dược phẩm", "Xét nghiệm", "Thức ăn thú cưng", "Bánh thưởng & Pate", "Phụ kiện thú cưng", "Bộ sưu tập"];

const CATALOG = [
  { id: "c1", cat: "Khám & Tư vấn", name: "Khám sức khỏe tổng quát",    price: 85,  icon: "🩺", color: "#2563EB", bg: "rgba(37,99,235,0.08)",  stock: null },
  { id: "c2", cat: "Khám & Tư vấn", name: "Tư vấn chuyên khoa",          price: 150, icon: "👨‍⚕️", color: "#2563EB", bg: "rgba(37,99,235,0.08)",  stock: null },
  { id: "c3", cat: "Khám & Tư vấn", name: "Khám cấp cứu",                 price: 220, icon: "🚨", color: "#dc2626", bg: "rgba(220,38,38,0.08)",  stock: null },
  { id: "g1", cat: "Tắm chải", name: "Tắm chải toàn bộ (nhỏ)",         price: 55,  icon: "✂️", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", stock: null },
  { id: "g2", cat: "Tắm chải", name: "Tắm chải toàn bộ (lớn)",         price: 85,  icon: "🛁", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", stock: null },
  { id: "g3", cat: "Tắm chải", name: "Cắt móng",                        price: 18,  icon: "💅", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", stock: null },
  { id: "v1", cat: "Vaccine", name: "Vaccine Dại",                      price: 38,  icon: "💉", color: "#16a34a", bg: "rgba(22,163,74,0.08)",  stock: 42   },
  { id: "v2", cat: "Vaccine", name: "Vaccine DHPP Combo",               price: 52,  icon: "💉", color: "#16a34a", bg: "rgba(22,163,74,0.08)",  stock: 28   },
  { id: "p1", cat: "Dược phẩm", name: "Apoquel 16mg (30 viên)",         price: 65,  icon: "💊", color: "#f97316", bg: "rgba(249,115,22,0.08)", stock: 8    },
  { id: "p2", cat: "Dược phẩm", name: "Simparica Trio (1 liều)",        price: 28,  icon: "💊", color: "#f97316", bg: "rgba(249,115,22,0.08)", stock: 24   },
  { id: "l1", cat: "Xét nghiệm", name: "Xét nghiệm máu toàn bộ (CBC)", price: 75,  icon: "🔬", color: "#0891b2", bg: "rgba(8,145,178,0.08)",  stock: null },
  { id: "f1", cat: "Thức ăn thú cưng", name: "Royal Canin Chó Trưởng Thành 15kg", price: 48,  icon: "🐶", color: "#ec4899", bg: "rgba(236,72,153,0.08)", stock: 12 },
  { id: "f2", cat: "Thức ăn thú cưng", name: "Hill's Science Diet Mèo 7kg",        price: 42,  icon: "🐱", color: "#ec4899", bg: "rgba(236,72,153,0.08)", stock: 5  },
  { id: "t1", cat: "Bánh thưởng & Pate", name: "Whiskas Pate Cá Ngừ",          price: 13,  icon: "🐟", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", stock: 20 },
  { id: "s1", cat: "Phụ kiện thú cưng", name: "Bộ bát ăn inox",                price: 19,  icon: "🥣", color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  stock: 22 },
  { id: "a1", cat: "Bộ sưu tập", name: "Vòng cổ da chó (M)",              price: 22,  icon: "🏷️", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", stock: 10 },
];

const PATIENTS_LIST = [
  { id: "p1", name: "Bella",  owner: "Maria Santos",    species: "Dog", breed: "Golden Retriever"   },
  { id: "p2", name: "Mochi",  owner: "James Kim",       species: "Cat", breed: "Mèo vàng"           },
  { id: "p3", name: "Max",    owner: "Sarah Johnson",   species: "Dog", breed: "German Shepherd"    },
  { id: "p4", name: "Luna",   owner: "Alex Wong",       species: "Cat", breed: "British Shorthair"  },
  { id: "p5", name: "Coco",   owner: "Lisa Park",       species: "Dog", breed: "Poodle"             },
];

type CartItem = { id: string; name: string; price: number; qty: number; icon: string };

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function POSPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Tất cả");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<typeof PATIENTS_LIST[0] | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "cash" | "mobile">("card");
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [processing, setProcessing] = useState(false);

  const filteredCatalog = useMemo(() => CATALOG.filter(item => {
    const matchCat = activeCat === "Tất cả" || item.cat === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeCat, search]);

  const filteredPatients = useMemo(() => PATIENTS_LIST.filter(p =>
    !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.owner.toLowerCase().includes(patientSearch.toLowerCase())
  ), [patientSearch]);

  function addToCart(item: typeof CATALOG[0]) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, icon: item.icon }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * (discount / 100);
  const tax = (subtotal - discountAmt) * 0.08;
  const total = subtotal - discountAmt + tax;

  function handleCharge() {
    if (cart.length === 0) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setShowReceipt(true); }, 1200);
  }

  function clearSale() {
    setCart([]); setSelectedPatient(null); setDiscount(0); setShowReceipt(false); setPatientSearch("");
  }

  return (
    <ClinicPageShell
      title="POS thông minh"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "POS" }]}
      maxWidth="max-w-none"
      noPadding
    >
      <div className="flex h-[calc(100vh-140px)] min-h-0 overflow-hidden">
        <CatalogGrid
          search={search}
          setSearch={setSearch}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          categories={CATEGORIES}
          filteredCatalog={filteredCatalog as any}
          cart={cart}
          addToCart={addToCart as any}
        />

        <CartSidebar
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          patientSearch={patientSearch}
          setPatientSearch={setPatientSearch}
          filteredPatients={filteredPatients}
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

