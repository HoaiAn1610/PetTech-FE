export interface DietDto {
  currentFood?: string;
  dailyCalories?: number;
  mealsPerDay?: number;
  restrictions?: string[];
  notes?: string;
}

export type AllergenSeverity = "Mild" | "Moderate" | "Severe";

export interface PetAllergen {
  id?: string;
  ingredientKey: string;
  label?: string;
  severity: AllergenSeverity;
  reaction?: string;
}

export interface LatestVitalsDto {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
}

export interface PetDto {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  species: string;
  breed?: string;
  dob?: string;
  gender: string;
  color?: string;
  currentWeight?: number;
  microchip?: string;
  bloodType?: string;
  insuranceId?: string;
  bodyConditionScore?: number;
  conditions?: string[];
  notes?: string;
  emoji?: string;
  photoUrl?: string;
  diet?: DietDto;
  allergens?: PetAllergen[];
  latestVitals?: LatestVitalsDto;
  createdAt: string;
  isDeleted: boolean;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ResultEnvelope<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
  value?: T;
  error?: any;
}

export interface PetRequestParameters {
  Name?: string;
  Species?: string;
  Breed?: string;
  CustomerId?: string;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  IsDescending?: boolean;
}

export interface CreatePetRequest {
  ownerId: string;
  name: string;
  species: string;
  breed?: string;
  dob?: string;
  gender: string;
  color?: string;
  currentWeight?: number;
  microchip?: string;
  bloodType?: string;
  insuranceId?: string;
  bodyConditionScore?: number;
  conditions?: string[];
  notes?: string;
  emoji?: string;
  photoUrl?: string;
  diet?: DietDto;
  allergens?: PetAllergen[];
}

export interface UpdatePetRequest {
  name?: string;
  species?: string;
  breed?: string;
  dob?: string;
  gender?: string;
  color?: string;
  currentWeight?: number;
  microchip?: string;
  bloodType?: string;
  insuranceId?: string;
  bodyConditionScore?: number;
  conditions?: string[];
  notes?: string;
  emoji?: string;
  photoUrl?: string;
  diet?: DietDto;
  allergens?: PetAllergen[];
}
