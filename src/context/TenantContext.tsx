import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/api/axiosInstance"; // used by useServices/useCategories below

export interface TenantSettings {
  primaryColor: string;
  acceptOnlineBookings: boolean;
  businessHoursStart: string; // e.g. "08:00:00"
  businessHoursEnd: string;   // e.g. "19:00:00"
  receiptFooter: string;
}

export interface PlanFeatures {
  aiAllergy: boolean;
  crmAutomation: boolean;
  liveTracking: boolean;
  customDomain: boolean;
  apiAccess: boolean;
}

interface TenantContextType {
  settings: TenantSettings;
  features: PlanFeatures;
  loading: boolean;
  isLoadingFeatures: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  refreshFeatures: () => Promise<void>;
}

const defaultSettings: TenantSettings = {
  primaryColor: "#2563EB", // Elegant Paws blue
  acceptOnlineBookings: true,
  businessHoursStart: "08:00:00",
  businessHoursEnd: "19:00:00",
  receiptFooter: "Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của PetTech!"
};

const defaultFeatures: PlanFeatures = {
  aiAllergy: false,
  crmAutomation: false,
  liveTracking: false,
  customDomain: false,
  apiAccess: false,
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings] = useState<TenantSettings>(defaultSettings);
  const [features] = useState<PlanFeatures>(defaultFeatures);

  const noop = async () => {};

  return (
    <TenantContext.Provider value={{
      settings,
      features,
      loading: false,
      isLoadingFeatures: false,
      error: null,
      refreshSettings: noop,
      refreshFeatures: noop,
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};



// 4. Dynamic Data Hooks
export const useServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res: any = await axiosInstance.get('/api/shop/services');
        setServices(Array.isArray(res) ? res : res.items || []);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return { services, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res: any = await axiosInstance.get('/api/shop/categories');
        setCategories(Array.isArray(res) ? res : res.items || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading };
};
