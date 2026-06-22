import React, { useState } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ServicesTab } from "./ServicesTab";
import { ServiceModal, ServiceDto } from "./ServiceModal";
import { CategoriesTab } from "./CategoriesTab";
import { CategoryModal, CategoryDto } from "./CategoryModal";
import { ProductsTab } from "./ProductsTab";
import { ProductModal, ProductDto } from "./ProductModal";
import { Plus, Sparkles, Layers, Package, Folder, ShieldCheck } from "lucide-react";

export const CatalogLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"services" | "products" | "categories">("services");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDto | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddClick = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (service: ServiceDto) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategoryClick = (category: CategoryDto) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProductClick = (product: ProductDto) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const tabItems = [
    { id: "services" as const, label: "Dịch vụ", icon: Sparkles },
    { id: "products" as const, label: "Sản phẩm", icon: Package },
    { id: "categories" as const, label: "Danh mục", icon: Folder },
  ];

  return (
    <ClinicPageShell
      title="Quản lý Danh mục"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Quản lý Danh mục" },
      ]}
    >
      <div className="flex flex-col gap-6 max-w-7xl mx-auto py-2">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
          {/* Tabs Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-50 border border-gray-100/60 w-full sm:w-auto overflow-x-auto whitespace-nowrap scrollbar-none">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Action button */}
          {activeTab === "services" && (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-black text-xs transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20"
              style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, black))" }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Thêm dịch vụ
            </button>
          )}
          {activeTab === "categories" && (
            <button
              onClick={handleAddCategoryClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-black text-xs transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20"
              style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, black))" }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Thêm danh mục
            </button>
          )}
          {activeTab === "products" && (
            <button
              onClick={handleAddProductClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-black text-xs transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20"
              style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, black))" }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Thêm sản phẩm
            </button>
          )}
        </div>

        {/* Tab content renderer */}
        <div className="flex-1">
          {activeTab === "services" && (
            <ServicesTab
              onEdit={handleEditClick}
              refreshTrigger={refreshTrigger}
              onRefresh={handleSuccess}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesTab
              onEdit={handleEditCategoryClick}
              refreshTrigger={refreshTrigger}
              onRefresh={handleSuccess}
            />
          )}

          {activeTab === "products" && (
            <ProductsTab
              onEdit={handleEditProductClick}
              refreshTrigger={refreshTrigger}
              onRefresh={handleSuccess}
            />
          )}

          {activeTab !== "services" && activeTab !== "categories" && activeTab !== "products" && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Layers className="w-12 h-12 text-gray-300 mb-3 stroke-1" />
              <h4 className="text-base font-black text-gray-800">Chức năng đang phát triển</h4>
              <p className="text-gray-400 text-xs font-semibold max-w-xs mt-1">
                Tab {tabItems.find((t) => t.id === activeTab)?.label} đang được lập trình và sẽ sẵn sàng trong bản cập nhật kế tiếp.
              </p>
            </div>
          )}
        </div>

        {/* Modal additions/modifications */}
        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          initialData={editingService}
        />
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={handleSuccess}
          initialData={editingCategory}
        />
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSuccess={handleSuccess}
          initialData={editingProduct}
        />
      </div>
    </ClinicPageShell>
  );
};

export default CatalogLayout;
