// ─── Shared Pet Medical Profile Data ─────────────────────────────────────────
// Used across Shop (allergen detection) and Pets dashboard pages.

export interface PetAllergen {
  id: string;
  ingredient: string;   // standardized key for cross-referencing with product allergenFlags
  label: string;        // display name
  severity: "mild" | "moderate" | "severe";
  reaction: string;     // clinical description
  diagnosedDate: string;
}

export interface Medication {
  id: string;
  name: string;
  type: string;         // Antihistamine, Supplement, Antibiotic, etc.
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  status: "active" | "completed" | "paused";
  prescribedBy: string;
  refills?: number;
}

export interface LabResult {
  id: string;
  panel: string;        // CBC, Chemistry, Urinalysis
  test: string;
  date: string;
  value: string;
  unit: string;
  refRange: string;
  status: "normal" | "high" | "low" | "critical";
}

export interface WeightRecord {
  id?: string;
  date: string;
  label: string;        // abbreviated label for chart
  weight: number;       // kg
}

export interface Vaccine {
  name: string;
  date: string;
  due: string;
  status: "current" | "due-soon" | "overdue";
  manufacturer?: string;
  lotNumber?: string;
}

export interface PetProfile {
  id: string;
  name: string;
  species: string;
  breed: string;
  dob: string;
  age: string;
  weight: number;        // current weight in kg
  gender: string;
  color: string;
  microchip?: string;
  bloodType?: string;
  insuranceId?: string;
  emoji: string;
  color1: string;
  bg: string;
  allergens: PetAllergen[];
  conditions: string[];
  medications: Medication[];
  vaccines: Vaccine[];
  weightHistory: WeightRecord[];
  labResults: LabResult[];
  recentVisit: string;
  nextAppointment?: string;
  notes?: string;
  bodyConditionScore: number;   // 1–9 scale; 4–5 ideal
  diet: {
    food: string;
    brand: string;
    dailyCalories: number;
    mealsPerDay: number;
    restrictions: string[];
    notes?: string;
  };
  vitals: {
    date: string;
    temperature: number;   // °C
    heartRate: number;     // bpm
    respRate: number;      // breaths/min
    bloodPressure?: string;
  };
}

// ─── Pet Profiles ─────────────────────────────────────────────────────────────

export const PET_PROFILES: PetProfile[] = [
  {
    id: "buddy",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    dob: "March 15, 2022",
    age: "3 years",
    weight: 28.4,
    gender: "Male (neutered)",
    color: "Golden",
    microchip: "982000123456789",
    bloodType: "DEA 1.1+",
    insuranceId: "PET-INS-20220450",
    emoji: "🐕",
    color1: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    allergens: [
      {
        id: "a1",
        ingredient: "soy",
        label: "Soy / Soy Protein",
        severity: "moderate",
        reaction: "Skin rash, excessive scratching, hot spots on hindquarters",
        diagnosedDate: "Sep 12, 2023",
      },
      {
        id: "a2",
        ingredient: "beef",
        label: "Beef / Beef Meal",
        severity: "mild",
        reaction: "Mild gastrointestinal upset, loose stools within 24–48 hrs",
        diagnosedDate: "Jan 5, 2024",
      },
    ],
    conditions: ["Seasonal allergies (mild)", "Hip dysplasia (monitored)", "Anxiety (storm-triggered)"],
    medications: [
      {
        id: "m1",
        name: "Cetirizine (Zyrtec)",
        type: "Antihistamine",
        dosage: "10 mg",
        frequency: "Once daily",
        startDate: "Mar 1, 2026",
        purpose: "Seasonal allergy management",
        status: "active",
        prescribedBy: "Dr. Sarah Lee",
        refills: 3,
      },
      {
        id: "m2",
        name: "Cosequin DS Joint Supplement",
        type: "Supplement",
        dosage: "2 chewable tablets",
        frequency: "Once daily with food",
        startDate: "Nov 15, 2024",
        purpose: "Hip dysplasia support & joint health",
        status: "active",
        prescribedBy: "Dr. Sarah Lee",
        refills: 5,
      },
      {
        id: "m3",
        name: "Apoquel (Oclacitinib)",
        type: "Immunomodulator",
        dosage: "16 mg",
        frequency: "Twice daily for 14 days, then once daily",
        startDate: "Jul 20, 2023",
        endDate: "Oct 15, 2023",
        purpose: "Acute allergy flare — soy exposure incident",
        status: "completed",
        prescribedBy: "Dr. Marcus Chen",
      },
    ],
    vaccines: [
      { name: "Rabies",     date: "Mar 15, 2025", due: "Mar 15, 2026", status: "due-soon", manufacturer: "Boehringer Ingelheim", lotNumber: "RA-2025-BK91" },
      { name: "DHPP",       date: "Feb 25, 2026", due: "Feb 25, 2027", status: "current",  manufacturer: "Zoetis",               lotNumber: "DH-2026-ZT44" },
      { name: "Bordetella", date: "Jun 1, 2025",  due: "Jun 1, 2026",  status: "current",  manufacturer: "Elanco",               lotNumber: "BD-2025-EL22" },
      { name: "Leptospira", date: "Feb 25, 2026", due: "Feb 25, 2027", status: "current",  manufacturer: "Zoetis",               lotNumber: "LE-2026-ZT18" },
    ],
    weightHistory: [
      { date: "Sep 2025", label: "Sep", weight: 26.1 },
      { date: "Oct 2025", label: "Oct", weight: 26.8 },
      { date: "Nov 2025", label: "Nov", weight: 27.3 },
      { date: "Dec 2025", label: "Dec", weight: 27.9 },
      { date: "Jan 2026", label: "Jan", weight: 28.1 },
      { date: "Feb 2026", label: "Feb", weight: 28.4 },
    ],
    labResults: [
      // CBC Panel
      { id: "l1",  panel: "CBC",       test: "Red Blood Cells",   date: "Feb 25, 2026", value: "6.5",  unit: "M/µL",   refRange: "5.5–8.5",    status: "normal"   },
      { id: "l2",  panel: "CBC",       test: "Hemoglobin",        date: "Feb 25, 2026", value: "15.2", unit: "g/dL",   refRange: "12.0–18.0",  status: "normal"   },
      { id: "l3",  panel: "CBC",       test: "Hematocrit",        date: "Feb 25, 2026", value: "44",   unit: "%",      refRange: "37–55",      status: "normal"   },
      { id: "l4",  panel: "CBC",       test: "White Blood Cells", date: "Feb 25, 2026", value: "11.8", unit: "K/µL",   refRange: "6.0–17.0",   status: "normal"   },
      { id: "l5",  panel: "CBC",       test: "Platelets",         date: "Feb 25, 2026", value: "310",  unit: "K/µL",   refRange: "200–500",    status: "normal"   },
      // Chemistry Panel
      { id: "l6",  panel: "Chemistry", test: "BUN (Blood Urea N.)",date: "Feb 25, 2026", value: "22",  unit: "mg/dL",  refRange: "10–30",      status: "normal"   },
      { id: "l7",  panel: "Chemistry", test: "Creatinine",        date: "Feb 25, 2026", value: "0.9", unit: "mg/dL",  refRange: "0.5–1.5",    status: "normal"   },
      { id: "l8",  panel: "Chemistry", test: "ALT",               date: "Feb 25, 2026", value: "87",  unit: "U/L",    refRange: "10–100",     status: "normal"   },
      { id: "l9",  panel: "Chemistry", test: "Alkaline Phosphatase",date:"Feb 25, 2026", value: "142", unit: "U/L",   refRange: "20–150",     status: "high"     },
      { id: "l10", panel: "Chemistry", test: "Total Protein",     date: "Feb 25, 2026", value: "6.8", unit: "g/dL",   refRange: "5.4–7.1",    status: "normal"   },
      { id: "l11", panel: "Chemistry", test: "Glucose",           date: "Feb 25, 2026", value: "98",  unit: "mg/dL",  refRange: "65–120",     status: "normal"   },
    ],
    recentVisit: "Feb 25, 2026 — Annual Checkup + DHPP booster",
    nextAppointment: "Mar 15, 2026 — Rabies booster due",
    notes: "Buddy is a friendly, high-energy dog. Gets anxious during storms — consider calming supplement. Prefers Dr. Lee. Soy allergy confirmed via elimination diet trial.",
    bodyConditionScore: 5,
    diet: {
      food: "Royal Canin Large Breed Adult",
      brand: "Royal Canin",
      dailyCalories: 1600,
      mealsPerDay: 2,
      restrictions: ["No soy", "No beef", "Limit high-fat treats"],
      notes: "Grain-free option preferred due to soy sensitivity. Currently on chicken-based formula. Avoid table scraps.",
    },
    vitals: {
      date: "Feb 25, 2026",
      temperature: 38.6,
      heartRate: 82,
      respRate: 18,
      bloodPressure: "125/80",
    },
  },
  {
    id: "whiskers",
    name: "Whiskers",
    species: "Cat",
    breed: "Persian",
    dob: "Aug 22, 2020",
    age: "5 years",
    weight: 4.2,
    gender: "Female (spayed)",
    color: "White / Silver",
    microchip: "982000987654321",
    bloodType: "Type A",
    insuranceId: "PET-INS-20200821",
    emoji: "🐱",
    color1: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    allergens: [
      {
        id: "a1",
        ingredient: "amoxicillin",
        label: "Amoxicillin (Antibiotic)",
        severity: "severe",
        reaction: "Anaphylactic response — facial swelling, hives, respiratory distress. Requires immediate EpiPen intervention.",
        diagnosedDate: "Apr 3, 2022",
      },
      {
        id: "a2",
        ingredient: "wheat",
        label: "Wheat / Wheat Gluten",
        severity: "moderate",
        reaction: "Chronic digestive upset, vomiting, poor coat condition and dandruff when on grain-containing foods",
        diagnosedDate: "Oct 17, 2023",
      },
      {
        id: "a3",
        ingredient: "corn",
        label: "Corn / Corn Syrup",
        severity: "mild",
        reaction: "Mild skin flare-ups and itching, particularly around face and ears",
        diagnosedDate: "Oct 17, 2023",
      },
    ],
    conditions: ["Chronic rhinitis", "Hairball-prone", "Mild anemia (monitored)", "Dental disease Stage 1"],
    medications: [
      {
        id: "m1",
        name: "Lysine (L-Lysine) Supplement",
        type: "Amino Acid Supplement",
        dosage: "250 mg",
        frequency: "Twice daily with meals",
        startDate: "Jan 15, 2025",
        purpose: "Feline herpesvirus-1 / chronic rhinitis management",
        status: "active",
        prescribedBy: "Dr. Sarah Lee",
        refills: 6,
      },
      {
        id: "m2",
        name: "Laxatone (Hairball Remedy)",
        type: "Lubricant Laxative",
        dosage: "1 tsp",
        frequency: "Every 2–3 days",
        startDate: "Jun 1, 2024",
        purpose: "Hairball prevention",
        status: "active",
        prescribedBy: "Dr. Sarah Lee",
        refills: 4,
      },
      {
        id: "m3",
        name: "Prednisolone",
        type: "Corticosteroid",
        dosage: "5 mg",
        frequency: "Once daily",
        startDate: "Nov 10, 2023",
        endDate: "Dec 10, 2023",
        purpose: "Acute rhinitis flare & wheat sensitivity reaction",
        status: "completed",
        prescribedBy: "Dr. Marcus Chen",
      },
    ],
    vaccines: [
      { name: "Feline FVRCP", date: "Jan 10, 2026", due: "Jan 10, 2027", status: "current",  manufacturer: "Zoetis",               lotNumber: "FV-2026-ZT77" },
      { name: "Rabies (Cat)", date: "Jan 10, 2026", due: "Jan 10, 2027", status: "current",  manufacturer: "Boehringer Ingelheim", lotNumber: "RC-2026-BK33" },
      { name: "FeLV",         date: "Mar 5, 2025",  due: "Mar 5, 2026",  status: "due-soon", manufacturer: "Zoetis",               lotNumber: "FL-2025-ZT55" },
    ],
    weightHistory: [
      { date: "Sep 2025", label: "Sep", weight: 4.6 },
      { date: "Oct 2025", label: "Oct", weight: 4.5 },
      { date: "Nov 2025", label: "Nov", weight: 4.4 },
      { date: "Dec 2025", label: "Dec", weight: 4.3 },
      { date: "Jan 2026", label: "Jan", weight: 4.2 },
      { date: "Feb 2026", label: "Feb", weight: 4.2 },
    ],
    labResults: [
      // CBC Panel
      { id: "l1",  panel: "CBC",        test: "Red Blood Cells",   date: "Feb 12, 2026", value: "6.1",  unit: "M/µL",  refRange: "5.0–10.0",   status: "normal"   },
      { id: "l2",  panel: "CBC",        test: "Hemoglobin",        date: "Feb 12, 2026", value: "8.9",  unit: "g/dL",  refRange: "9.0–15.0",   status: "low"      },
      { id: "l3",  panel: "CBC",        test: "Hematocrit",        date: "Feb 12, 2026", value: "28",   unit: "%",     refRange: "30–45",      status: "low"      },
      { id: "l4",  panel: "CBC",        test: "White Blood Cells", date: "Feb 12, 2026", value: "9.5",  unit: "K/µL",  refRange: "5.5–19.5",   status: "normal"   },
      { id: "l5",  panel: "CBC",        test: "Platelets",         date: "Feb 12, 2026", value: "275",  unit: "K/µL",  refRange: "200–500",    status: "normal"   },
      // Chemistry Panel
      { id: "l6",  panel: "Chemistry",  test: "BUN",               date: "Feb 12, 2026", value: "28",   unit: "mg/dL", refRange: "15–35",      status: "normal"   },
      { id: "l7",  panel: "Chemistry",  test: "Creatinine",        date: "Feb 12, 2026", value: "1.4",  unit: "mg/dL", refRange: "0.6–2.4",    status: "normal"   },
      { id: "l8",  panel: "Chemistry",  test: "ALT",               date: "Feb 12, 2026", value: "45",   unit: "U/L",   refRange: "12–130",     status: "normal"   },
      { id: "l9",  panel: "Chemistry",  test: "Total Protein",     date: "Feb 12, 2026", value: "7.2",  unit: "g/dL",  refRange: "6.0–8.4",    status: "normal"   },
      { id: "l10", panel: "Chemistry",  test: "Glucose",           date: "Feb 12, 2026", value: "88",   unit: "mg/dL", refRange: "70–120",     status: "normal"   },
      // Urinalysis
      { id: "l11", panel: "Urinalysis", test: "Urine Specific Gravity", date:"Feb 12, 2026", value:"1.035", unit:"",  refRange: "1.035–1.060", status: "normal"  },
      { id: "l12", panel: "Urinalysis", test: "pH",                date: "Feb 12, 2026", value: "6.5",  unit:"",      refRange: "6.0–7.0",    status: "normal"   },
      { id: "l13", panel: "Urinalysis", test: "Protein",           date: "Feb 12, 2026", value: "Trace",unit:"",      refRange: "Negative",   status: "high"     },
    ],
    recentVisit: "Feb 12, 2026 — Grooming + Ear Cleaning + Blood Panel",
    nextAppointment: "Mar 5, 2026 — FeLV booster due",
    notes: "Whiskers has a sensitive stomach and confirmed grain intolerance. Strict grain-free diet mandatory. SEVERE amoxicillin allergy — all team members must be notified before any antibiotic prescription. Mild anemia being monitored — recheck in 3 months.",
    bodyConditionScore: 4,
    diet: {
      food: "Wellness CORE Grain-Free Indoor",
      brand: "Wellness",
      dailyCalories: 240,
      mealsPerDay: 3,
      restrictions: ["No wheat", "No corn", "No grains", "No amoxicillin or penicillin-class antibiotics"],
      notes: "Strictly grain-free diet required due to wheat and corn allergies. High-protein, low-carb wet food preferred. Supplement with occasional raw freeze-dried topper.",
    },
    vitals: {
      date: "Feb 12, 2026",
      temperature: 38.4,
      heartRate: 165,
      respRate: 28,
    },
  },
];

// ─── Allergen Detection Utility ───────────────────────────────────────────────

export interface AllergenConflict {
  petId: string;
  petName: string;
  petEmoji: string;
  allergenLabel: string;
  severity: PetAllergen["severity"];
  reaction: string;
}

/**
 * Cross-references a product's allergen flags against all registered pet profiles.
 * Returns a list of conflicts (pet + allergen pairs).
 */
export function detectAllergenConflicts(productAllergenFlags: string[]): AllergenConflict[] {
  const conflicts: AllergenConflict[] = [];
  const flags = productAllergenFlags.map(f => f.toLowerCase());

  for (const pet of PET_PROFILES) {
    for (const allergen of pet.allergens) {
      if (flags.includes(allergen.ingredient.toLowerCase())) {
        conflicts.push({
          petId: pet.id,
          petName: pet.name,
          petEmoji: pet.emoji,
          allergenLabel: allergen.label,
          severity: allergen.severity,
          reaction: allergen.reaction,
        });
      }
    }
  }
  return conflicts;
}
