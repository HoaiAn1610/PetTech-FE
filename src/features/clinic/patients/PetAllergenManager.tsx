import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { AlertTriangle, Plus, Trash2, X } from "lucide-react";
import { PetDto, PetAllergen, AllergenSeverity } from "@/types/pet";
import { petService } from "@/api/petService";
import { toast } from "sonner";

interface PetAllergenManagerProps {
  pet: PetDto;
  onUpdate: (updatedPet: PetDto) => void;
}

interface AllergenOption {
  value: string;
  label: string;
}

interface AllergenForm {
  ingredientOption: AllergenOption | null;
  severity: AllergenSeverity;
  reaction: string;
}

const ingredientOptions = [
  { value: 'thit_ga', label: 'Thịt gà' },
  { value: 'thit_bo', label: 'Thịt bò' },
  { value: 'ngu_coc', label: 'Ngũ cốc' },
  { value: 'sua', label: 'Sữa' }
];

export function PetAllergenManager({ pet, onUpdate }: PetAllergenManagerProps) {
  const [allergens, setAllergens] = useState<PetAllergen[]>(pet.allergens || []);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<AllergenForm>({
    defaultValues: {
      ingredientOption: null,
      severity: "Mild",
      reaction: ""
    }
  });

  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        const res: any = await petService.getAllergens(pet.id);
        const data = res?.value || res?.data || res?.items || (Array.isArray(res) ? res : []);
        setAllergens(data);
      } catch (err) {
        console.error("Failed to fetch allergens", err);
      }
    };
    fetchAllergens();
  }, [pet.id]);

  const onSubmit = async (data: AllergenForm) => {
    if (!data.ingredientOption) return;
    setIsSaving(true);
    try {
      const severityMap: Record<AllergenSeverity, number> = {
        Mild: 0,
        Moderate: 1,
        Severe: 2
      };

      const payload = {
        ingredientKey: data.ingredientOption.value,
        label: data.ingredientOption.label,
        severity: severityMap[data.severity],
        reaction: data.reaction
      };
      
      const res: any = await petService.addAllergen(pet.id, [payload]);
      if (res && res.isSuccess !== false) {
        let createdItem = res.data || res.value || payload;
        if (Array.isArray(createdItem)) createdItem = createdItem[0];
        
        const updated = [...allergens, createdItem];
        setAllergens(updated);
        onUpdate({ ...pet, allergens: updated });
        toast.success("Đã thêm dị ứng thành công", { style: { background: "#10b981", color: "white" } });
        setShowForm(false);
        reset();
      } else {
        toast.error((res && res.message) || "Thêm thất bại. Vui lòng kiểm tra lại!");
      }
    } catch (err) {
      console.error("Failed to add allergen:", err);
      toast.error("Đã xảy ra lỗi kết nối khi lưu dị ứng!");
    } finally {
      setIsSaving(false);
    }
  };

  const removeAllergen = async (allergenId: string | undefined, index: number) => {
    if (!allergenId) {
      const updated = allergens.filter((_, i) => i !== index);
      setAllergens(updated);
      return;
    }
    
    setIsSaving(true);
    try {
      const res: any = await petService.deleteAllergen(allergenId);
      if (!res || res.isSuccess !== false) {
        const updated = allergens.filter((a) => a.id !== allergenId);
        setAllergens(updated);
        onUpdate({ ...pet, allergens: updated });
        toast.success("Đã xóa chất dị ứng", { style: { background: "#10b981", color: "white" } });
      } else {
        toast.error((res && res.message) || "Xóa thất bại!");
      }
    } catch (err) {
      console.error("Failed to delete allergen:", err);
      toast.error("Đã xảy ra lỗi khi xóa!");
    } finally {
      setIsSaving(false);
    }
  };

  const severityColors: Record<AllergenSeverity, string> = {
    Mild: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Moderate: "bg-orange-50 text-orange-700 border-orange-200",
    Severe: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[0.95rem] font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Hồ sơ Dị ứng (Allergens)
        </h3>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm chất dị ứng
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-gray-800">Thêm mới Dị ứng</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Từ khóa chất dị ứng *</label>
              <Controller
                name="ingredientOption"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    isClearable
                    options={ingredientOptions}
                    placeholder="Chọn hoặc gõ (VD: Cà rốt)..."
                    formatCreateLabel={(inputValue) => `Tạo mới: "${inputValue}"`}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
                        boxShadow: 'none',
                        minHeight: '40px',
                        fontSize: '0.875rem'
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: '0.875rem',
                        zIndex: 100
                      })
                    }}
                  />
                )}
              />
              {errors.ingredientOption && <span className="text-[0.65rem] text-red-500 mt-1 block">Bắt buộc chọn</span>}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mức độ nghiêm trọng</label>
              <select 
                {...register("severity")}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 transition-all bg-white"
              >
                <option value="Mild">Nhẹ (Mild)</option>
                <option value="Moderate">Vừa (Moderate)</option>
                <option value="Severe">Nghiêm trọng (Severe)</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Biểu hiện / Phản ứng (Không bắt buộc)</label>
            <textarea 
              {...register("reaction")}
              placeholder="Ghi chú các biểu hiện khi dị ứng..." 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 transition-all h-20 resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
              {isSaving ? "Đang lưu..." : "Lưu Dị ứng"}
            </button>
          </div>
        </form>
      )}

      {allergens.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Chưa ghi nhận dị ứng nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allergens.map((alg, idx) => (
            <div key={idx} className={`p-3 rounded-xl border flex justify-between items-start ${severityColors[alg.severity]}`}>
              <div>
                <p className="text-[0.85rem] font-bold mb-0.5 capitalize">{alg.label || alg.ingredientKey}</p>
                {alg.reaction && <p className="text-[0.7rem] opacity-80 mt-1 line-clamp-2">{alg.reaction}</p>}
              </div>
              <button onClick={() => removeAllergen(alg.id, idx)} disabled={isSaving} className="p-1 hover:bg-white/50 rounded-md transition-colors opacity-70 hover:opacity-100 disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
