import React, { useState } from 'react';
import { X, Layers, AlertCircle, Info } from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../services/mockData';
import { useTakaStore } from '../services/store';

interface CreateBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBulkModal: React.FC<CreateBulkModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createBulkRequest } = useTakaStore();

  const [categoryId, setCategoryId] = useState(MATERIAL_CATEGORIES[0].id);
  const [subcategory, setSubcategory] = useState(MATERIAL_CATEGORIES[0].commonSubtypes[0]);
  const [title, setTitle] = useState('');
  const [targetQuantity, setTargetQuantity] = useState<number>(5000);
  const [unit, setUnit] = useState<string>('kg');
  const [targetPricePerUnit, setTargetPricePerUnit] = useState<number>(30);
  const [qualityRequirements, setQualityRequirements] = useState(
    'Sorted and compressed into tight bales. No toxic chemical or motor oil containers.'
  );
  const [maxContaminationAcceptable, setMaxContaminationAcceptable] = useState(
    'Max 2% moisture/dust. Zero PVC or chlorinated plastic content.'
  );
  const [locationArea, setLocationArea] = useState('Eldoret Industrial Area (Depot)');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentCategoryObj = MATERIAL_CATEGORIES.find((c) => c.id === categoryId) || MATERIAL_CATEGORIES[0];

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const cat = MATERIAL_CATEGORIES.find((c) => c.id === newCatId);
    if (cat) {
      setSubcategory(cat.commonSubtypes[0] || '');
      setUnit(cat.unitDefault || 'kg');
      if (cat.typicalMarketPriceRange) {
        setTargetPricePerUnit(cat.typicalMarketPriceRange.max);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a descriptive request title.');
      return;
    }
    if (targetQuantity <= 0) {
      setErrorMsg('Target quantity must be greater than zero.');
      return;
    }

    try {
      createBulkRequest({
        categoryId,
        categoryName: currentCategoryObj.name,
        subcategory,
        title: title.trim(),
        targetQuantity: Number(targetQuantity),
        unit,
        qualityRequirements: qualityRequirements.trim(),
        maxContaminationAcceptable: maxContaminationAcceptable.trim(),
        targetPricePerUnit: Number(targetPricePerUnit),
        currency: 'KES',
        locationArea: locationArea.trim(),
        deadline,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create bulk procurement pool.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#17324D]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading">
              Create Bulk Procurement Request
            </h3>
            <p className="text-xs text-white/70">
              Invite multiple Eldoret suppliers to aggregate volume toward your quota
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Procurement Pool Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sourcing 5,000 kg Clear PET Bottles for Washing Line"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              required
            />
          </div>

          {/* Category & Subtype */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                {MATERIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Target Grade / Subtype *
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                {currentCategoryObj.commonSubtypes.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Quantity & Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Target Volume *
              </label>
              <input
                type="number"
                min="10"
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                <option value="kg">kg</option>
                <option value="tonnes">tonnes</option>
                <option value="pieces">pieces</option>
                <option value="litres">litres</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Target Rate (KES/{unit}) *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={targetPricePerUnit}
                onChange={(e) => setTargetPricePerUnit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
            </div>
          </div>

          {/* Quality & Contamination */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Quality Specs & Accepted Forms
            </label>
            <input
              type="text"
              value={qualityRequirements}
              onChange={(e) => setQualityRequirements(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Max Allowable Contamination
            </label>
            <input
              type="text"
              value={maxContaminationAcceptable}
              onChange={(e) => setMaxContaminationAcceptable(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
          </div>

          {/* Location & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Delivery / Consolidation Depot
              </label>
              <input
                type="text"
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                placeholder="e.g. Eldoret Industrial Area"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Fulfillment Target Date
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-xl shadow-md transition"
            >
              Publish Aggregation Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
