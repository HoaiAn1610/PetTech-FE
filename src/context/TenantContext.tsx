import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { shopSettingsService } from "@/api/services";
import axiosInstance from "@/api/axiosInstance";

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
  const { isAuthenticated, user } = useAuth();
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [features, setFeatures] = useState<PlanFeatures>(defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!isAuthenticated) {
      setSettings(defaultSettings);
      setFeatures(defaultFeatures);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await shopSettingsService.getSettings();
      if (res) {
        // Handle axios auto wrap or standard value wrapper from backend
        // Since our interceptor unwraps response.data.data, 'res' itself might be the raw object
        const raw = res;
        
        const mapped: TenantSettings = {
          primaryColor: raw.primaryColor || raw.PrimaryColor || defaultSettings.primaryColor,
          acceptOnlineBookings: raw.acceptOnlineBookings !== undefined 
            ? raw.acceptOnlineBookings 
            : (raw.AcceptOnlineBookings !== undefined ? raw.AcceptOnlineBookings : defaultSettings.acceptOnlineBookings),
          businessHoursStart: raw.businessHoursStart || raw.BusinessHoursStart || defaultSettings.businessHoursStart,
          businessHoursEnd: raw.businessHoursEnd || raw.BusinessHoursEnd || defaultSettings.businessHoursEnd,
          receiptFooter: raw.receiptFooter || raw.ReceiptFooter || defaultSettings.receiptFooter
        };
        setSettings(mapped);

        // Apply primary color to CSS custom property
        applyThemeColor(mapped.primaryColor);
      }
    } catch (err: any) {
      console.warn("Failed to fetch tenant settings, falling back to default.", err);
      // Fallback color setting
      applyThemeColor(defaultSettings.primaryColor);
    } finally {
      setLoading(false);
    }
  };

  const applyThemeColor = (color: string) => {
    try {
      const root = document.documentElement;
      root.style.setProperty("--primary-theme-color", color);
      root.style.setProperty("--primary-theme-color-hover", `${color}dd`);
    } catch (e) {
      console.error("Failed to apply theme color:", e);
    }
  };

  const fetchPlanFeatures = async () => {
    if (!isAuthenticated) {
      setFeatures(defaultFeatures);
      return;
    }
    setIsLoadingFeatures(true);
    try {
      const res = await axiosInstance.get('/api/shop/my-plan');
      const planDto: any = res || {};
      const planFeatures = planDto.features || planDto.Features || {};

      setFeatures({
        aiAllergy: !!(planFeatures.aiAllergy ?? planFeatures.AiAllergy ?? false),
        crmAutomation: !!(planFeatures.crmAutomation ?? planFeatures.CrmAutomation ?? false),
        liveTracking: !!(planFeatures.liveTracking ?? planFeatures.LiveTracking ?? false),
        customDomain: !!(planFeatures.customDomain ?? planFeatures.CustomDomain ?? false),
        apiAccess: !!(planFeatures.apiAccess ?? planFeatures.ApiAccess ?? false),
      });
    } catch (err: any) {
      console.warn("Failed to fetch plan features, falling back to default.", err);
      setFeatures(defaultFeatures);
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchPlanFeatures();
  }, [isAuthenticated, user]);

  return (
    <TenantContext.Provider value={{ settings, features, loading, isLoadingFeatures, error, refreshSettings: fetchSettings, refreshFeatures: fetchPlanFeatures }}>
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
