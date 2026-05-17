import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Package,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  ShieldAlert,
  Syringe,
  Pill,
  Droplets,
  Scissors,
  Box,
  X,
  TrendingDown,
  Clock,
  Tag,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Cookie,
  ShoppingBag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type StockStatus = "ok" | "low" | "critical" | "out";
type ExpiryStatus = "ok" | "expiring-soon" | "expired" | "no-expiry";
type Category =
  // ── Medical ──────────────────────────────────
  | "Vaccine" | "Medicine" | "Grooming" | "Equipment" | "Consumable" | "Supplement"
  // ── Retail ───────────────────────────────────
  | "Pet Food" | "Treats & Pate" | "Pet Supplies" | "Accessories";

// Category groups for UI
const MEDICAL_CATS: Category[]  = ["Vaccine", "Medicine", "Consumable", "Equipment", "Grooming", "Supplement"];
const RETAIL_CATS:  Category[]  = ["Pet Food", "Treats & Pate", "Pet Supplies", "Accessories"];

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: Category;
  inStock: number;
  minStock: number;
  unit: string;
  expiryDate: string | null;
  expiryStatus: ExpiryStatus;
  stockStatus: StockStatus;
  supplier: string;
  unitCost: number;
  location: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const INVENTORY: InventoryItem[] = [
  {
    id: "i1",  name: "Rabies Vaccine (1mL)", sku: "VAC-RAB-001", category: "Vaccine",
    inStock: 6,  minStock: 15, unit: "vials",  expiryDate: "2026-03-18", expiryStatus: "expiring-soon",
    stockStatus: "critical", supplier: "VetPharm Co.", unitCost: 12.50, location: "Fridge A",
  },
  {
    id: "i2",  name: "Bordetella Vaccine",  sku: "VAC-BOR-002", category: "Vaccine",
    inStock: 0,  minStock: 10, unit: "vials",  expiryDate: "2026-03-10", expiryStatus: "expired",
    stockStatus: "out",      supplier: "VetPharm Co.", unitCost: 9.80,  location: "Fridge A",
  },
  {
    id: "i3",  name: "DHPP Combo Vaccine",  sku: "VAC-DHP-003", category: "Vaccine",
    inStock: 22, minStock: 12, unit: "vials",  expiryDate: "2026-09-15", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "ImmunoPet Labs", unitCost: 18.00, location: "Fridge A",
  },
  {
    id: "i4",  name: "Amoxicillin 250mg",   sku: "MED-AMX-011", category: "Medicine",
    inStock: 8,  minStock: 30, unit: "tabs",   expiryDate: "2026-03-25", expiryStatus: "expiring-soon",
    stockStatus: "critical", supplier: "MedVet Supply", unitCost: 0.45,  location: "Cabinet 2",
  },
  {
    id: "i5",  name: "Metronidazole 500mg", sku: "MED-MTR-012", category: "Medicine",
    inStock: 45, minStock: 20, unit: "tabs",   expiryDate: "2027-01-10", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "MedVet Supply", unitCost: 0.30,  location: "Cabinet 2",
  },
  {
    id: "i6",  name: "Prednisolone 5mg",    sku: "MED-PRD-013", category: "Medicine",
    inStock: 14, minStock: 25, unit: "tabs",   expiryDate: "2026-04-01", expiryStatus: "expiring-soon",
    stockStatus: "low",      supplier: "PharmaVet Inc.", unitCost: 0.65, location: "Cabinet 3",
  },
  {
    id: "i7",  name: "Ivermectin 1% Inj.",  sku: "MED-IVM-014", category: "Medicine",
    inStock: 3,  minStock: 8,  unit: "bottles", expiryDate: "2026-03-12", expiryStatus: "expired",
    stockStatus: "critical", supplier: "AgriVet Ltd.", unitCost: 22.00, location: "Fridge B",
  },
  {
    id: "i8",  name: "Saline Solution 500mL", sku: "CON-SAL-021", category: "Consumable",
    inStock: 60, minStock: 24, unit: "bags",   expiryDate: "2027-06-30", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "MedVet Supply", unitCost: 2.10,  location: "Storage A",
  },
  {
    id: "i9",  name: "Surgical Gloves (M)",  sku: "CON-GLV-022", category: "Consumable",
    inStock: 11, minStock: 50, unit: "boxes",  expiryDate: null,          expiryStatus: "no-expiry",
    stockStatus: "low",      supplier: "CleanPro Med",  unitCost: 5.80,  location: "Storage B",
  },
  {
    id: "i10", name: "Gauze Bandage 4in",    sku: "CON-GAZ-023", category: "Consumable",
    inStock: 80, minStock: 30, unit: "rolls",  expiryDate: null,          expiryStatus: "no-expiry",
    stockStatus: "ok",       supplier: "CleanPro Med",  unitCost: 1.25,  location: "Storage B",
  },
  {
    id: "i11", name: "Pet Shampoo (Pro)",     sku: "GRM-SHP-031", category: "Grooming",
    inStock: 9,  minStock: 12, unit: "bottles", expiryDate: "2027-03-20", expiryStatus: "ok",
    stockStatus: "low",      supplier: "FurCare Brands", unitCost: 8.50, location: "Salon Shelf",
  },
  {
    id: "i12", name: "Ear Cleaning Solution", sku: "GRM-EAR-032", category: "Grooming",
    inStock: 24, minStock: 10, unit: "bottles", expiryDate: "2026-11-05", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "FurCare Brands", unitCost: 6.20, location: "Salon Shelf",
  },
  {
    id: "i13", name: "Grooming Clippers #7", sku: "EQP-CLP-041", category: "Equipment",
    inStock: 4,  minStock: 2,  unit: "units",  expiryDate: null,          expiryStatus: "no-expiry",
    stockStatus: "ok",       supplier: "ProGroom Tools",  unitCost: 95.00, location: "Salon Rack",
  },
  {
    id: "i14", name: "Omega-3 Supplement",   sku: "SUP-OM3-051", category: "Supplement",
    inStock: 30, minStock: 15, unit: "bottles", expiryDate: "2026-08-22", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "NutriPet Corp.", unitCost: 14.00, location: "Cabinet 4",
  },
  {
    id: "i15", name: "Probiotic Chews",       sku: "SUP-PRB-052", category: "Supplement",
    inStock: 7,  minStock: 20, unit: "packs",  expiryDate: "2026-03-28", expiryStatus: "expiring-soon",
    stockStatus: "critical", supplier: "NutriPet Corp.", unitCost: 11.50, location: "Cabinet 4",
  },
  {
    id: "i16", name: "Flea & Tick Spray",     sku: "MED-FLT-015", category: "Medicine",
    inStock: 18, minStock: 10, unit: "cans",   expiryDate: "2027-02-14", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "PestAway Vet",  unitCost: 7.75,  location: "Cabinet 3",
  },
  {
    id: "i17", name: "IV Catheter 22G",       sku: "CON-IVC-024", category: "Consumable",
    inStock: 35, minStock: 20, unit: "pcs",    expiryDate: "2028-01-01", expiryStatus: "ok",
    stockStatus: "ok",       supplier: "MedVet Supply", unitCost: 1.90,  location: "Storage A",
  },
  {
    id: "i18", name: "Leptospirosis Vaccine", sku: "VAC-LEP-004", category: "Vaccine",
    inStock: 4,  minStock: 10, unit: "vials",  expiryDate: "2026-03-22", expiryStatus: "expiring-soon",
    stockStatus: "critical", supplier: "ImmunoPet Labs", unitCost: 16.00, location: "Fridge A",
  },
  // ── Retail: Pet Food ─────────────────────────────────────────────────────────
  { id: "r1",  name: "Royal Canin Adult Dog 15kg",   sku: "FOOD-RC-D01", category: "Pet Food",      inStock: 12, minStock: 8,  unit: "bags",    expiryDate: "2027-06-30", expiryStatus: "ok",             stockStatus: "ok",       supplier: "Royal Canin VN",       unitCost: 38.00, location: "Store Shelf A" },
  { id: "r2",  name: "Hill's Science Diet Cat 7kg",  sku: "FOOD-HS-C01", category: "Pet Food",      inStock: 5,  minStock: 6,  unit: "bags",    expiryDate: "2027-03-15", expiryStatus: "ok",             stockStatus: "low",      supplier: "Hill's Pet Nutrition", unitCost: 32.00, location: "Store Shelf A" },
  { id: "r3",  name: "Purina Pro Plan Puppy 12kg",   sku: "FOOD-PP-D02", category: "Pet Food",      inStock: 9,  minStock: 6,  unit: "bags",    expiryDate: "2027-08-20", expiryStatus: "ok",             stockStatus: "ok",       supplier: "Purina Petcare",       unitCost: 29.00, location: "Store Shelf A" },
  { id: "r4",  name: "Royal Canin Kitten 4kg",       sku: "FOOD-RC-C02", category: "Pet Food",      inStock: 3,  minStock: 6,  unit: "bags",    expiryDate: "2026-03-20", expiryStatus: "expiring-soon",  stockStatus: "critical", supplier: "Royal Canin VN",       unitCost: 22.00, location: "Store Shelf A" },
  { id: "r5",  name: "Pedigree Adult Wet Food",      sku: "FOOD-PD-D03", category: "Pet Food",      inStock: 48, minStock: 24, unit: "cans",    expiryDate: "2027-12-01", expiryStatus: "ok",             stockStatus: "ok",       supplier: "Mars Petcare VN",      unitCost: 1.80,  location: "Store Shelf B" },
  // ── Retail: Treats & Pate ────────────────────────────────────────────────────
  { id: "r6",  name: "Whiskas Tuna Pate (12×85g)",   sku: "TRT-WH-C01", category: "Treats & Pate", inStock: 20, minStock: 12, unit: "packs",   expiryDate: "2027-01-10", expiryStatus: "ok",             stockStatus: "ok",       supplier: "Mars Petcare VN",      unitCost: 9.50,  location: "Store Shelf B" },
  { id: "r7",  name: "Temptations Cat Treats 200g",  sku: "TRT-TM-C02", category: "Treats & Pate", inStock: 35, minStock: 20, unit: "pouches", expiryDate: "2026-11-30", expiryStatus: "ok",             stockStatus: "ok",       supplier: "Mars Petcare VN",      unitCost: 5.20,  location: "Store Shelf B" },
  { id: "r8",  name: "Dentastix Daily Chews 28pcs",  sku: "TRT-DX-D01", category: "Treats & Pate", inStock: 14, minStock: 16, unit: "boxes",   expiryDate: "2027-04-15", expiryStatus: "ok",             stockStatus: "low",      supplier: "Mars Petcare VN",      unitCost: 10.00, location: "Store Shelf C" },
  { id: "r9",  name: "Blue Buffalo Biscuits 340g",   sku: "TRT-BB-D02", category: "Treats & Pate", inStock: 18, minStock: 12, unit: "bags",    expiryDate: "2026-09-01", expiryStatus: "ok",             stockStatus: "ok",       supplier: "Blue Buffalo Intl",    unitCost: 7.80,  location: "Store Shelf C" },
  { id: "r10", name: "Sheba Chicken Pate (6×85g)",   sku: "TRT-SH-C03", category: "Treats & Pate", inStock: 25, minStock: 18, unit: "packs",   expiryDate: "2026-04-01", expiryStatus: "expiring-soon",  stockStatus: "ok",       supplier: "Mars Petcare VN",      unitCost: 11.00, location: "Store Shelf B" },
  // ── Retail: Pet Supplies ─────────────────────────────────────────────────────
  { id: "r11", name: "SS Pet Bowl Set (2-piece)",    sku: "SUP-BW-001", category: "Pet Supplies",  inStock: 22, minStock: 10, unit: "sets",    expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "ok",       supplier: "PetPro Accessories",   unitCost: 12.00, location: "Store Shelf D" },
  { id: "r12", name: "Portable Pet Carrier Bag",     sku: "SUP-CR-001", category: "Pet Supplies",  inStock: 7,  minStock: 5,  unit: "units",   expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "ok",       supplier: "PetAir Supplies",      unitCost: 28.00, location: "Store Shelf D" },
  { id: "r13", name: "ClumpMax Cat Litter 10L",      sku: "SUP-LT-001", category: "Pet Supplies",  inStock: 30, minStock: 20, unit: "bags",    expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "ok",       supplier: "ClumpMax Asia",        unitCost: 10.50, location: "Store Shelf E" },
  // ── Retail: Accessories ──────────────────────────────────────────────────────
  { id: "r14", name: "Leather Dog Collar (Medium)",  sku: "ACC-CL-D01", category: "Accessories",   inStock: 10, minStock: 8,  unit: "units",   expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "ok",       supplier: "PawStyle Co.",         unitCost: 14.00, location: "Display Rack"  },
  { id: "r15", name: "Retractable Dog Leash 5m",     sku: "ACC-LS-D01", category: "Accessories",   inStock: 6,  minStock: 8,  unit: "units",   expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "low",      supplier: "FlexyPet Ltd.",        unitCost: 18.00, location: "Display Rack"  },
  { id: "r16", name: "Cat Harness + Leash Set",      sku: "ACC-HA-C01", category: "Accessories",   inStock: 8,  minStock: 5,  unit: "units",   expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "ok",       supplier: "CatWalk Gear",         unitCost: 12.00, location: "Display Rack"  },
  { id: "r17", name: "Kong Classic Chew Toy",        sku: "ACC-TY-D01", category: "Accessories",   inStock: 15, minStock: 10, unit: "units",   expiryDate: null,          expiryStatus: "no-expiry",      stockStatus: "ok",       supplier: "Kong Company",         unitCost: 9.50,  location: "Display Rack"  },
];

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; bg: string }> = {
  // ── Medical ───────────────────────────────────────────────────────────────
  Vaccine:         { icon: Syringe,         color: "#7c3aed", bg: "rgba(124,58,237,0.08)"  },
  Medicine:        { icon: Pill,            color: "#2563EB", bg: "rgba(37,99,235,0.08)"   },
  Grooming:        { icon: Scissors,        color: "#0891b2", bg: "rgba(8,145,178,0.08)"   },
  Equipment:       { icon: Box,             color: "#374151", bg: "rgba(55,65,81,0.08)"    },
  Consumable:      { icon: Droplets,        color: "#16a34a", bg: "rgba(22,163,74,0.08)"   },
  Supplement:      { icon: Package,         color: "#d97706", bg: "rgba(217,119,6,0.08)"   },
  // ── Retail ────────────────────────────────────────────────────────────────
  "Pet Food":      { icon: UtensilsCrossed, color: "#ec4899", bg: "rgba(236,72,153,0.08)"  },
  "Treats & Pate": { icon: Cookie,          color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
  "Pet Supplies":  { icon: ShoppingBag,     color: "#06b6d4", bg: "rgba(6,182,212,0.08)"   },
  "Accessories":   { icon: Tag,             color: "#8b5cf6", bg: "rgba(139,92,246,0.08)"  },
};

// ─── Expiry badge ─────────────────────────────────────────────────────────────
function ExpiryBadge({ item }: { item: InventoryItem }) {
  if (item.expiryStatus === "no-expiry") {
    return (
      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>—</span>
    );
  }

  const dateLabel = item.expiryDate
    ? new Date(item.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  if (item.expiryStatus === "expired") {
    return (
      <div className="flex flex-col gap-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1.5px solid rgba(220,38,38,0.35)",
          }}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#dc2626" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#dc2626", letterSpacing: "0.01em" }}>
            HẾT HẠN
          </span>
        </div>
        <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{dateLabel}</span>
      </div>
    );
  }

  if (item.expiryStatus === "expiring-soon") {
    const days = item.expiryDate
      ? Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / 86400000)
      : 0;
    return (
      <div className="flex flex-col gap-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{
            background: "rgba(249,115,22,0.1)",
            border: "1.5px solid rgba(249,115,22,0.4)",
          }}
        >
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#ea580c" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#ea580c" }}>
            Sắp hết hạn!
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" style={{ color: "#9ca3af" }} />
          <span style={{ fontSize: "0.67rem", color: "#9ca3af" }}>
            {dateLabel} · còn {days} ngày
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg"
        style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.18)" }}
      >
        <CheckCircle2 className="w-3 h-3" style={{ color: "#16a34a" }} />
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>Còn hạn</span>
      </div>
      <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{dateLabel}</span>
    </div>
  );
}

// ─── Stock badge ──────────────────────────────────────────────────────────────
function StockCell({ item }: { item: InventoryItem }) {
  const pct = Math.min((item.inStock / item.minStock) * 100, 100);

  const barColor =
    item.stockStatus === "out"      ? "#dc2626" :
    item.stockStatus === "critical" ? "#ea580c" :
    item.stockStatus === "low"      ? "#d97706" :
    "#16a34a";

  const textColor =
    item.stockStatus === "out"      ? "#dc2626" :
    item.stockStatus === "critical" ? "#ea580c" :
    item.stockStatus === "low"      ? "#d97706" :
    "#111827";

  return (
    <div className="flex flex-col gap-1.5 min-w-[90px]">
      <div className="flex items-center gap-1.5">
        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: textColor }}>
          {item.inStock}
        </span>
        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{item.unit}</span>
        {item.stockStatus === "out" && (
          <span
            className="px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(220,38,38,0.1)", fontSize: "0.6rem", fontWeight: 800, color: "#dc2626" }}
          >
            HẾT
          </span>
        )}
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>
        tối thiểu {item.minStock} {item.unit}
      </span>
    </div>
  );
}

// ─── Low stock badge inline ───────────────────────────────────────────────────
function StockAlertBadge({ status }: { status: StockStatus }) {
  if (status === "ok") return null;
  const config = {
    low:      { label: "Tồn kho thấp",  bg: "rgba(217,119,6,0.1)",  border: "rgba(217,119,6,0.35)",  color: "#d97706" },
    critical: { label: "Nguy hiểm",     bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.4)",  color: "#ea580c" },
    out:      { label: "Hết hàng",      bg: "rgba(220,38,38,0.1)",  border: "rgba(220,38,38,0.35)", color: "#dc2626" },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <TrendingDown className="w-2.5 h-2.5" style={{ color: config.color }} />
      <span style={{ fontSize: "0.62rem", fontWeight: 800, color: config.color }}>{config.label}</span>
    </span>
  );
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────
type SortKey = "name" | "sku" | "category" | "inStock" | "expiryDate";
type SortDir = "asc" | "desc" | null;

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc")  return <ChevronUp   className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />;
  if (dir === "desc") return <ChevronDown className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />;
  return <ChevronsUpDown className="w-3.5 h-3.5" style={{ color: "#d1d5db" }} />;
}

// ─── Add Stock Modal ──────────────────────────────────────────────────────────
function AddStockModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", margin: "16px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
            >
              <Plus className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Thêm hàng mới</h3>
              <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Điền thông tin sản phẩm bên dưới</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
          >
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Tên sản phẩm", placeholder: "vd. Vaccine Dại 1mL", span: 2 },
              { label: "SKU",          placeholder: "vd. VAC-RAB-001",     span: 1 },
              { label: "Nhà cung cấp", placeholder: "vd. VetPharm Co.",    span: 1 },
            ].map((f) => (
              <div key={f.label} className={f.span === 2 ? "col-span-2" : ""}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                  {f.label}
                </label>
                <input
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl outline-none transition-all"
                  style={{
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    fontSize: "0.83rem",
                    color: "#374151",
                    background: "#fafafa",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Danh mục
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.83rem", color: "#374151", background: "#fafafa" }}
              >
                <optgroup label="── Y TẾ ──">
                  {MEDICAL_CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="── CỬA HÀNG BÁN LẺ ──">
                  {RETAIL_CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Vị trí lưu kho
              </label>
              <input
                placeholder="vd. Tủ lạnh A"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.83rem", color: "#374151", background: "#fafafa" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Số lượng
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.83rem", color: "#374151", background: "#fafafa" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Tồn kho tối thiểu
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.83rem", color: "#374151", background: "#fafafa" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
                Giá nhập ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.83rem", color: "#374151", background: "#fafafa" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>
              Expiry Date <span style={{ fontWeight: 400, color: "#9ca3af" }}>(leave blank if N/A)</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.83rem", color: "#374151", background: "#fafafa" }}
            />
          </div>

          {/* Critical warning note */}
          <div
            className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ea580c" }} />
            <p style={{ fontSize: "0.72rem", color: "#92400e", lineHeight: 1.55 }}>
              Vaccines and injectable medicines <strong>must</strong> include an expiry date. Items expiring within 30 days will be flagged automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl transition-colors hover:bg-gray-100"
            style={{ fontSize: "0.83rem", fontWeight: 600, color: "#374151", border: "1.5px solid rgba(0,0,0,0.1)" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
              fontSize: "0.83rem",
              fontWeight: 700,
              color: "white",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add to Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Row action menu ──────────────────────────────────────────────────────────
function RowMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute right-8 z-30 rounded-xl overflow-hidden flex flex-col py-1"
      style={{
        top: "calc(100% + 4px)",
        background: "white",
        border: "1.5px solid rgba(0,0,0,0.09)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        minWidth: "160px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {[
        { icon: Eye,      label: "Xem chi tiết",  color: "#374151" },
        { icon: Edit2,    label: "Chỉnh sửa",     color: "#2563EB" },
        { icon: RefreshCw,label: "Nhập hàng",     color: "#16a34a" },
        { icon: Trash2,   label: "Xoá",           color: "#dc2626" },
      ].map(({ icon: Icon, label, color }) => (
        <button
          key={label}
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left transition-colors hover:bg-gray-50"
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: color === "#374151" ? "#374151" : color }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function InventoryTable() {
  const [search, setSearch]           = useState("");
  const [categoryFilter, setCategory] = useState<Category | "All">("All");
  const [statusFilter, setStatus]     = useState<"all" | "alerts" | "ok">("all");
  const [sortKey,    setSortKey]      = useState<SortKey>("name");
  const [sortDir,    setSortDir]      = useState<SortDir>("asc");
  const [openMenu,   setOpenMenu]     = useState<string | null>(null);
  const [showModal,  setShowModal]    = useState(false);
  const [page, setPage]               = useState(1);
  const PAGE_SIZE = 10;

  // ── KPI counts ──
  const alerts      = INVENTORY.filter((i) => i.expiryStatus === "expired" || i.expiryStatus === "expiring-soon").length;
  const lowStock    = INVENTORY.filter((i) => i.stockStatus !== "ok").length;
  const totalValue  = INVENTORY.reduce((s, i) => s + i.inStock * i.unitCost, 0);
  const categories  = Array.from(new Set(INVENTORY.map((i) => i.category)));

  // ── Filter + sort ──
  const filtered = useMemo(() => {
    let data = INVENTORY.filter((item) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q);
      const matchCat = categoryFilter === "All" || item.category === categoryFilter;
      const matchStatus =
        statusFilter === "all" ? true :
        statusFilter === "alerts"
          ? item.expiryStatus === "expired" || item.expiryStatus === "expiring-soon" || item.stockStatus !== "ok"
          : item.expiryStatus === "ok" && item.stockStatus === "ok";
      return matchQ && matchCat && matchStatus;
    });

    if (sortKey && sortDir) {
      data = [...data].sort((a, b) => {
        let av: string | number = a[sortKey] ?? "";
        let bv: string | number = b[sortKey] ?? "";
        if (sortKey === "inStock") { av = a.inStock; bv = b.inStock; }
        if (sortKey === "expiryDate") {
          av = a.expiryDate ?? "9999-99-99";
          bv = b.expiryDate ?? "9999-99-99";
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ?  1 : -1;
        return 0;
      });
    }
    return data;
  }, [search, categoryFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const COL_HEADERS: { key: SortKey; label: string; width: string }[] = [
    { key: "name",       label: "Tên sản phẩm",  width: "26%"  },
    { key: "sku",        label: "SKU",            width: "11%"  },
    { key: "category",   label: "Danh mục",       width: "13%"  },
    { key: "inStock",    label: "Tồn kho",        width: "17%"  },
    { key: "expiryDate", label: "Hạn sử dụng",   width: "22%"  },
  ];

  return (
    <>
      {showModal && <AddStockModal onClose={() => setShowModal(false)} />}

      <div
        className="flex flex-col gap-5"
        style={{ fontFamily: "Inter, sans-serif" }}
        onClick={() => setOpenMenu(null)}
      >
        {/* ── KPI Strip ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Tổng sản phẩm",
              value: INVENTORY.length,
              sub: `${categories.length} danh mục`,
              icon: Package,
              color: "#2563EB",
              bg: "rgba(37,99,235,0.07)",
            },
            {
              label: "Cảnh báo hạn dùng",
              value: alerts,
              sub: "Cần xử lý ngay",
              icon: AlertTriangle,
              color: "#ea580c",
              bg: "rgba(249,115,22,0.07)",
              pulse: true,
            },
            {
              label: "Tồn kho thấp / Hết hàng",
              value: lowStock,
              sub: "Dưới ngưỡng tối thiểu",
              icon: TrendingDown,
              color: "#dc2626",
              bg: "rgba(220,38,38,0.07)",
              pulse: lowStock > 0,
            },
            {
              label: "Tổng giá trị kho",
              value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
              sub: "Tổng tất cả mặt hàng",
              icon: BarChart3,
              color: "#16a34a",
              bg: "rgba(22,163,74,0.07)",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl"
              style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.bg }}
              >
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} strokeWidth={2.5} />
                {kpi.pulse && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ background: kpi.color, border: "2px solid white" }}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {kpi.value}
                </p>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#9ca3af", marginTop: "2px" }}>
                  {kpi.label}
                </p>
                <p style={{ fontSize: "0.65rem", color: "#d1d5db", marginTop: "1px" }}>
                  {kpi.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Action Bar ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Row 1: Search + primary actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm theo tên sản phẩm, SKU, nhà cung cấp…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl outline-none transition-all"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.09)",
                  fontSize: "0.83rem",
                  color: "#374151",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  <X className="w-3 h-3" style={{ color: "#9ca3af" }} />
                </button>
              )}
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategory(e.target.value as Category | "All"); setPage(1); }}
              className="px-3 py-2.5 rounded-xl outline-none cursor-pointer transition-all hover:border-blue-300"
              style={{
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#374151",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <option value="All">Tất cả danh mục</option>
              <optgroup label="── Y TẾ ──">
                {MEDICAL_CATS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
              <optgroup label="── CỬA HÀNG BÁN LẺ ──">
                {RETAIL_CATS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
            </select>

            {/* Status filter tabs */}
            <div
              className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: "1.5px solid rgba(0,0,0,0.09)", background: "white" }}
            >
              {(["all", "alerts", "ok"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatus(s); setPage(1); }}
                  className="px-3.5 py-2 transition-all"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: statusFilter === s ? 800 : 600,
                    color:
                      statusFilter === s
                        ? s === "alerts" ? "#ea580c" : s === "ok" ? "#16a34a" : "#2563EB"
                        : "#9ca3af",
                    background:
                      statusFilter === s
                        ? s === "alerts" ? "rgba(249,115,22,0.08)" : s === "ok" ? "rgba(22,163,74,0.08)" : "rgba(37,99,235,0.08)"
                        : "transparent",
                  }}
                >
                  {s === "all" ? "Tất cả" : s === "alerts" ? `⚠ Cảnh báo` : "✓ Bình thường"}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Secondary actions */}
            <button
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all hover:bg-gray-50"
              style={{ border: "1.5px solid rgba(0,0,0,0.09)", background: "white", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}
            >
              <Upload className="w-3.5 h-3.5" />
              Nhập
            </button>
            <button
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all hover:bg-gray-50"
              style={{ border: "1.5px solid rgba(0,0,0,0.09)", background: "white", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}
            >
              <Download className="w-3.5 h-3.5" />
              Xuất
            </button>

            {/* PRIMARY: Add Stock */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "white",
                boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Thêm hàng
            </button>
          </div>

          {/* Row 2: Active filters summary */}
          {(categoryFilter !== "All" || statusFilter !== "all" || search) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Active filters:</span>
              {search && (
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer hover:opacity-80"
                  style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.72rem", fontWeight: 700, color: "#2563EB" }}
                  onClick={() => setSearch("")}
                >
                  <Search className="w-3 h-3" />"{search}"<X className="w-2.5 h-2.5" />
                </span>
              )}
              {categoryFilter !== "All" && (
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer hover:opacity-80"
                  style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.72rem", fontWeight: 700, color: "#2563EB" }}
                  onClick={() => setCategory("All")}
                >
                  <Tag className="w-3 h-3" />{categoryFilter}<X className="w-2.5 h-2.5" />
                </span>
              )}
              {statusFilter !== "all" && (
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer hover:opacity-80"
                  style={{ background: "rgba(249,115,22,0.08)", fontSize: "0.72rem", fontWeight: 700, color: "#ea580c" }}
                  onClick={() => setStatus("all")}
                >
                  <Filter className="w-3 h-3" />{statusFilter === "alerts" ? "Alerts only" : "Healthy only"}<X className="w-2.5 h-2.5" />
                </span>
              )}
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                · Showing {filtered.length} of {INVENTORY.length} items
              </span>
            </div>
          )}
        </div>

        {/* ── Critical alert banner ─────────────────────────────────── */}
        {(alerts > 0 || lowStock > 0) && statusFilter !== "ok" && (
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(220,38,38,0.06), rgba(249,115,22,0.06))",
              border: "1.5px solid rgba(220,38,38,0.2)",
            }}
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0" style={{ color: "#dc2626" }} />
            <div className="flex-1">
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#dc2626" }}>
                Urgent Attention Required —&nbsp;
              </span>
              <span style={{ fontSize: "0.82rem", color: "#7f1d1d" }}>
                {alerts} item{alerts !== 1 ? "s" : ""} with expiry issues and {lowStock} item{lowStock !== 1 ? "s" : ""} below minimum stock. Review and restock immediately.
              </span>
            </div>
            <button
              onClick={() => setStatus("alerts")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all hover:opacity-80 flex-shrink-0"
              style={{
                background: "#dc2626",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              View Alerts
            </button>
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.07)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          {/* Table header */}
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: `${COL_HEADERS.map((c) => c.width).join(" ")} 11%`,
              borderBottom: "1.5px solid rgba(0,0,0,0.07)",
              background: "#fafafa",
            }}
          >
            {COL_HEADERS.map((col) => (
              <button
                key={col.key}
                onClick={() => toggleSort(col.key)}
                className="flex items-center gap-1.5 transition-opacity hover:opacity-70 text-left"
              >
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6b7280", letterSpacing: "0.05em" }}>
                  {col.label.toUpperCase()}
                </span>
                <SortIcon dir={sortKey === col.key ? sortDir : null} />
              </button>
            ))}
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6b7280", letterSpacing: "0.05em" }}>
              ACTIONS
            </span>
          </div>

          {/* Rows */}
          {paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Package className="w-10 h-10" style={{ color: "#d1d5db" }} />
              <p style={{ fontSize: "0.9rem", color: "#9ca3af", fontWeight: 600 }}>No items match your filters</p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); setStatus("all"); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
                style={{ border: "1.5px solid rgba(0,0,0,0.09)", color: "#374151" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            paged.map((item, idx) => {
              const catCfg = CATEGORY_CONFIG[item.category];
              const CatIcon = catCfg.icon;
              const isAlert =
                item.expiryStatus === "expired" ||
                item.expiryStatus === "expiring-soon" ||
                item.stockStatus === "critical" ||
                item.stockStatus === "out";

              return (
                <div
                  key={item.id}
                  className="relative grid items-center px-5 py-4 transition-colors hover:bg-blue-50/30"
                  style={{
                    gridTemplateColumns: `${COL_HEADERS.map((c) => c.width).join(" ")} 11%`,
                    borderBottom: idx < paged.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    background: isAlert
                      ? item.expiryStatus === "expired" || item.stockStatus === "out"
                        ? "rgba(220,38,38,0.025)"
                        : "rgba(249,115,22,0.025)"
                      : "transparent",
                    borderLeft: isAlert
                      ? `3px solid ${item.expiryStatus === "expired" || item.stockStatus === "out" ? "#dc2626" : "#f97316"}`
                      : "3px solid transparent",
                  }}
                >
                  {/* ── Product Name ── */}
                  <div className="flex items-start gap-3 pr-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: catCfg.bg, border: `1px solid ${catCfg.color}22` }}
                    >
                      <CatIcon className="w-4 h-4" style={{ color: catCfg.color }} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate"
                        style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>📍 {item.location}</span>
                        {item.stockStatus !== "ok" && <StockAlertBadge status={item.stockStatus} />}
                      </div>
                    </div>
                  </div>

                  {/* ── SKU ── */}
                  <div className="pr-2">
                    <span
                      className="px-2 py-1 rounded-lg"
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        color: "#374151",
                        background: "#f3f4f6",
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.sku}
                    </span>
                  </div>

                  {/* ── Category ── */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                      style={{
                        background: catCfg.bg,
                        border: `1px solid ${catCfg.color}25`,
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        color: catCfg.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <CatIcon className="w-3 h-3" />
                      {item.category}
                    </span>
                  </div>

                  {/* ── In Stock ── */}
                  <div>
                    <StockCell item={item} />
                  </div>

                  {/* ── Expiry Date ── */}
                  <div>
                    <ExpiryBadge item={item} />
                  </div>

                  {/* ── Actions ── */}
                  <div className="relative flex items-center gap-1">
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-green-50"
                      title="Restock"
                    >
                      <RefreshCw className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                      onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === item.id ? null : item.id); }}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
                    </button>
                    {openMenu === item.id && <RowMenu onClose={() => setOpenMenu(null)} />}
                  </div>
                </div>
              );
            })
          )}

          {/* ── Pagination footer ── */}
          {filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderTop: "1.5px solid rgba(0,0,0,0.06)", background: "#fafafa" }}
            >
              <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                Showing <strong style={{ color: "#374151" }}>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of{" "}
                <strong style={{ color: "#374151" }}>{filtered.length}</strong> results
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-30"
                  style={{ border: "1.5px solid rgba(0,0,0,0.09)" }}
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: "#374151" }} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: p === page ? 800 : 500,
                      background: p === page ? "#2563EB" : "transparent",
                      color: p === page ? "white" : "#374151",
                      border: p === page ? "none" : "1.5px solid rgba(0,0,0,0.09)",
                      boxShadow: p === page ? "0 4px 10px rgba(37,99,235,0.3)" : "none",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-30"
                  style={{ border: "1.5px solid rgba(0,0,0,0.09)" }}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "#374151" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}