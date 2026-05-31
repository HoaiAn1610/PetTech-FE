import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { shopService, shopSettingsService } from "@/api/services";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

export interface TenantInfo {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  domain?: string;
  phone?: string;
  email?: string;
}

export interface TenantSettings {
  primaryColor: string;
  acceptOnlineBookings: boolean;
  businessHoursStart: string; // e.g. "08:00:00"
  businessHoursEnd: string;   // e.g. "19:00:00"
  receiptFooter: string;
  customShopName?: string;
  customLogoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  bannerUrl?: string;
  aboutUsText?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  zaloPhone?: string;
  showTeamSection?: boolean;
  showReviewsSection?: boolean;
}

export interface PlanFeatures {
  aiAllergy: boolean;
  crmAutomation: boolean;
  liveTracking: boolean;
  customDomain: boolean;
  apiAccess: boolean;
}

interface TenantContextType {
  tenant: TenantInfo | null;
  settings: TenantSettings;
  features: PlanFeatures;
  loading: boolean;
  isInitializing: boolean;
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
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [features, setFeatures] = useState<PlanFeatures>(defaultFeatures);
  const [isInitializing, setIsInitializing] = useState(() => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isBaseDomain = hostname === 'pettechvn.site' || hostname === 'app.pettechvn.site';
    const isNotFoundPage = window.location.pathname === '/shop-not-found';
    return !isLocalhost && !isBaseDomain && !isNotFoundPage;
  });
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);
  const [hasFetchedFeatures, setHasFetchedFeatures] = useState(false);

  const fetchFeatures = async () => {
    try {
      setIsLoadingFeatures(true);
      
      const allowedRoles = [Role.ShopManager, Role.Vet, Role.Groomer, Role.Receptionist];
      if (!user || !allowedRoles.includes(user.role as Role)) {
        setIsLoadingFeatures(false);
        return;
      }

      const res: any = await shopService.getMyPlan();
      const myPlan = res?.data || res;
      
      let actualFeatures = myPlan?.features;

      // Ensure we have the correct features for the plan by cross-referencing with the plans list
      try {
        const plansRes: any = await shopService.getBillingPlans();
        const plans = Array.isArray(plansRes?.data?.items) ? plansRes.data.items : 
                      Array.isArray(plansRes?.data) ? plansRes.data : 
                      Array.isArray(plansRes) ? plansRes : [];
        
        const matchedPlan = plans.find((p: any) => p.id === myPlan?.id);
        if (matchedPlan && matchedPlan.features) {
          actualFeatures = matchedPlan.features;
        }
      } catch (planErr) {
        console.warn("Could not fetch billing plans to cross-reference features", planErr);
      }

      if (actualFeatures) {
        setFeatures({
          ...defaultFeatures,
          ...actualFeatures
        });
      }
    } catch (error) {
      console.error("Failed to fetch plan features:", error);
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  // Dynamically inject primary color CSS custom property globally
  useEffect(() => {
    if (settings?.primaryColor) {
      document.documentElement.style.setProperty('--primary-theme-color', settings.primaryColor);
    }
  }, [settings?.primaryColor]);

  // Eagerly verify tenant existence and load settings on mount
  useEffect(() => {
    const initTenant = async () => {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const isBaseDomain = hostname === 'pettechvn.site' || hostname === 'app.pettechvn.site';
      const isNotFoundPage = window.location.pathname === '/shop-not-found';
      
      // If we are on a specific tenant's domain/subdomain, verify it exists
      // Skip verification if we are already on the error page to prevent infinite redirect loop
      if (!isLocalhost && !isBaseDomain && !isNotFoundPage) {
        try {
          const res: any = await shopSettingsService.getPublicSettings();
          const data = res?.data || res?.value || res;
          if (data) {
            setTenant({
              id: data.id || '',
              name: data.shopName || data.name || 'Paws & Claws',
              logoUrl: data.logoUrl,
              address: data.address,
              domain: data.domain,
              phone: data.contactPhone || data.phone,
              email: data.contactEmail || data.email,
            });
            
            // Persist tenant identification in localStorage to enable seamless multi-tenant header injection on localhost
            if (data.domain) {
              localStorage.setItem('pettech_current_tenant_domain', data.domain);
              if (data.domain.includes('pettechvn.site')) {
                const code = data.domain.replace('.pettechvn.site', '');
                localStorage.setItem('pettech_current_tenant_code', code);
              }
            } else {
              const currentHost = window.location.hostname;
              if (currentHost.includes('pettechvn.site')) {
                const code = currentHost.replace('.pettechvn.site', '');
                localStorage.setItem('pettech_current_tenant_code', code);
                localStorage.setItem('pettech_current_tenant_domain', currentHost);
              }
            }
            const settingsData = data.settings || data;
            const tenantId = data.id || '';
            const localOverride = localStorage.getItem(`pettech_theme_settings_${tenantId}`);
            let parsedOverride = {};
            if (localOverride) {
              try {
                parsedOverride = JSON.parse(localOverride);
              } catch (e) {
                console.error("Failed to parse local theme settings override", e);
              }
            }
            setSettings(prev => ({ ...prev, ...settingsData, ...parsedOverride }));
          }
        } catch (err: any) {
          console.error("Failed to fetch tenant settings:", err);
          // Force redirect on 404 or 400 to guarantee the user is booted out of invalid subdomains
          if (err?.response?.status === 404 || err?.response?.status === 400) {
            window.location.href = '/shop-not-found';
            return; // Prevent setting isInitializing to false if redirecting
          }
        }
      }
      setIsInitializing(false);
    };
    initTenant();
  }, []);

  const fetchSettings = async () => {
    try {
      const res: any = await shopSettingsService.getPublicSettings();
      const data = res?.data || res?.value || res;
      if (data) {
        const tenantId = data.id || tenant?.id || '';
        const localOverride = localStorage.getItem(`pettech_theme_settings_${tenantId}`);
        let parsedOverride = {};
        if (localOverride) {
          try {
            parsedOverride = JSON.parse(localOverride);
          } catch (e) {}
        }

        // Persist tenant identification in localStorage to enable seamless multi-tenant header injection on localhost
        if (data.domain) {
          localStorage.setItem('pettech_current_tenant_domain', data.domain);
          if (data.domain.includes('pettechvn.site')) {
            const code = data.domain.replace('.pettechvn.site', '');
            localStorage.setItem('pettech_current_tenant_code', code);
          }
        }
        
        const settingsData = data.settings || data;
        setSettings(prev => ({ ...prev, ...settingsData, ...parsedOverride }));
        setTenant(prev => prev ? {
          ...prev,
          name: data.shopName || data.name || prev.name,
          logoUrl: data.logoUrl || prev.logoUrl,
          address: data.address || prev.address,
          phone: data.contactPhone || data.phone || prev.phone,
          email: data.contactEmail || data.email || prev.email,
        } : {
          id: data.id || '',
          name: data.shopName || data.name || 'Paws & Claws',
          logoUrl: data.logoUrl,
          address: data.address,
          domain: data.domain,
          phone: data.contactPhone || data.phone,
          email: data.contactEmail || data.email,
        });
      }
    } catch (err) {
      console.error("Failed to refresh settings:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && !hasFetchedFeatures) {
      fetchFeatures().then(() => setHasFetchedFeatures(true));
    } else if (!isAuthenticated) {
      setIsLoadingFeatures(false);
      setHasFetchedFeatures(false);
      setFeatures(defaultFeatures);
    }
  }, [isAuthenticated, user, hasFetchedFeatures]);

  return (
    <TenantContext.Provider value={{
      tenant,
      settings,
      features,
      loading: false, // Legacy field
      isInitializing,
      isLoadingFeatures,
      error: null,
      refreshSettings: fetchSettings,
      refreshFeatures: fetchFeatures
    }}>
      {isInitializing ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : children}
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
