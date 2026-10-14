import React, { useState } from 'react';
import {
  X,
  Upload,
  Camera,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Package,
} from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../services/mockData';
import { useTakaStore } from '../services/store';
import { MaterialCondition, PricingMode } from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ELDORET_AREAS = [
  'West Indies',
  'Eldoret CBD',
  'Huruma',
  'Langas',
  'Pioneer',
  'Kapsoya',
  'Maili Nne',
  'Kimumu',
  'Annex',
  'Action',
  'Elgon View',
  'Turbo Industrial Corridor',
];

const PRESET_SAMPLE_PHOTOS = [
  {
    label: 'Baled PET Bottles',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    desc: 'Clear post-consumer water bottles baled',
  },
  {
    label: 'Cardboard Boxes',
    url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80',
    desc: 'Corrugated supermarket cartons dry flattened',
  },
  {
    label: 'Aluminium Cans',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    desc: 'Sorted UBC beverage cans pressed',
  },
  {
    label: 'HDPE Jerrycans',
    url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
    desc: 'Rigid plastic cooking oil containers',
  },
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addListing } = useTakaStore();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(MATERIAL_CATEGORIES[0].id);
  const [subcategory, setSubcategory] = useState(MATERIAL_CATEGORIES[0].commonSubtypes[0]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([PRESET_SAMPLE_PHOTOS[0].url]);
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<string>('kg');
  const [condition, setCondition] = useState<MaterialCondition>('sorted_clean');
  const [contaminationNotes, setContaminationNotes] = useState('');
  const [pricingMode, setPricingMode] = useState<PricingMode>('negotiable');
  const [askingPricePerUnit, setAskingPricePerUnit] = useState<number>(25);
  const [area, setArea] = useState<string>('West Indies');
  const [landmark, setLandmark] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('Immediate (Available for loading)');
  const [minQuantity, setMinQuantity] = useState<number>(100);

  // AI Classification state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);
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
        setAskingPricePerUnit(Math.round((cat.typicalMarketPriceRange.min + cat.typicalMarketPriceRange.max) / 2));
      }
    }
  };

  const handleAiClassify = async () => {
    setIsAnalyzing(true);
    setErrorMsg('');
    try {
      const activePhoto = photos[0] || '';
      const res = await fetch('/api/ai/classify-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activePhoto.startsWith('data:') ? activePhoto : undefined,
          descriptionText: `${title} ${description} ${subcategory} in Eldoret`,
        }),
      });
      const data = await res.json();
      setAiSuggestion(data);
    } catch (err) {
      console.error('AI Classification failed:', err);
      setErrorMsg('Classification request could not be completed. You can still fill the fields manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    if (aiSuggestion.suggestedTitle) setTitle(aiSuggestion.suggestedTitle);
    if (aiSuggestion.condition) setCondition(aiSuggestion.condition);
    if (aiSuggestion.contaminationAssessment) setContaminationNotes(aiSuggestion.contaminationAssessment);
    if (aiSuggestion.recommendedUnit) setUnit(aiSuggestion.recommendedUnit);
    if (aiSuggestion.estimatedPriceMinKES) {
      setAskingPricePerUnit(Math.round((aiSuggestion.estimatedPriceMinKES + aiSuggestion.estimatedPriceMaxKES) / 2));
    }

    // Match category
    const matched = MATERIAL_CATEGORIES.find(
      (c) => c.name.toLowerCase().includes(aiSuggestion.categoryName.toLowerCase()) ||
             aiSuggestion.categoryName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (matched) {
      setCategoryId(matched.id);
      if (aiSuggestion.subcategory) setSubcategory(aiSuggestion.subcategory);
    }

    setAiSuggestion(null);
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size must be under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotos([reader.result, ...photos]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a listing title.');
      return;
    }
    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than 0.');
      return;
    }

    addListing({
      categoryId,
      categoryName: currentCategoryObj.name,
      subcategory,
      title: title.trim(),
      description: description.trim() || `${quantity} ${unit} of clean ${subcategory} available for immediate collection in ${area}, Eldoret.`,
      photos: photos.length > 0 ? photos : [PRESET_SAMPLE_PHOTOS[0].url],
      quantity: Number(quantity),
      unit,
      condition,
      contaminationNotes: contaminationNotes.trim(),
      pricingMode,
      askingPricePerUnit: pricingMode === 'request_offers' ? 0 : Number(askingPricePerUnit),
      currency: 'KES',
      approximateLocation: {
        town: 'Eldoret',
        area,
        landmark: landmark.trim() || undefined,
      },
      availabilityDate,
      minQuantity: Number(minQuantity) || undefined,
      status: 'active',
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#17324D]/10">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-[#17324D] font-heading">
              List Recyclable Waste
            </h2>
            <p className="text-xs text-gray-500">
              Publish material for Eldoret recyclers, aggregators, and buyers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#17324D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Selection Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#17324D] mb-1.5">
              Material Photograph
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="w-32 h-28 rounded-xl overflow-hidden border border-gray-300 bg-gray-50 shrink-0">
                <img
                  src={photos[0]}
                  alt="Selected material preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17324D] text-white text-xs font-semibold rounded-lg hover:bg-[#17324D]/90 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomPhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {/* AI Photo Classifier Trigger */}
                  <button
                    type="button"
                    onClick={handleAiClassify}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#176B4D] text-white text-xs font-semibold rounded-lg hover:bg-[#176B4D]/90 transition shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzing ? 'Analyzing Material...' : 'AI Photo Assistant'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-gray-500">
                  <span>Or pick standard Eldoret material sample:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESET_SAMPLE_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotos([preset.url])}
                        className={`text-[10px] px-2 py-0.5 rounded border transition ${
                          photos[0] === preset.url
                            ? 'bg-[#176B4D] text-white border-[#176B4D]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestion Banner if returned */}
          {aiSuggestion && (
            <div className="p-4 bg-[#176B4D]/10 border border-[#176B4D]/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#176B4D]" />
                  <span className="text-xs font-bold text-[#17324D]">
                    AI Classification Suggestion ({aiSuggestion.source})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#176B4D] bg-white px-2 py-0.5 rounded">
                  {Math.round(aiSuggestion.confidenceScore * 100)}% Confidence
                </span>
              </div>

              <div className="text-xs text-[#17324D] space-y-1">
                <p>
                  <strong>Detected:</strong> {aiSuggestion.categoryName} &gt; {aiSuggestion.subcategory}
                </p>
                <p>
                  <strong>Suggested Title:</strong> {aiSuggestion.suggestedTitle}
                </p>
                <p>
                  <strong>Condition & Contamination:</strong> {aiSuggestion.contaminationAssessment}
                </p>
                <p>
                  <strong>Eldoret Benchmark:</strong> KES {aiSuggestion.estimatedPriceMinKES} – {aiSuggestion.estimatedPriceMaxKES} / {aiSuggestion.recommendedUnit}
                </p>
                {aiSuggestion.isPotentiallyHazardous && (
                  <p className="text-amber-800 font-semibold">
                    ⚠️ Caution: Potential hazardous handling required. Must adhere to NEMA transport guidelines.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="px-3 py-1 bg-[#176B4D] text-white text-xs font-bold rounded-lg hover:bg-[#176B4D]/90 transition"
                >
                  Confirm & Pre-fill Fields
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="px-3 py-1 bg-white text-gray-600 text-xs rounded-lg hover:bg-gray-100 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 850 kg Clean Baled Clear PET Water & Soda Bottles"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D] focus:border-transparent"
              required
            />
          </div>

          {/* Category & Subtype */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Material Category *
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
                Subcategory / Grade *
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

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Quantity Available *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Unit of Measure *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="tonnes">tonnes (Metric Tonnes)</option>
                <option value="pieces">pieces</option>
                <option value="litres">litres</option>
                <option value="bales">bales</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Minimum Purchase
              </label>
              <input
                type="number"
                min="1"
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              />
            </div>
          </div>

          {/* Condition & Contamination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Material Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as MaterialCondition)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                <option value="sorted_clean">Sorted & Clean (Premium)</option>
                <option value="mixed_recyclable">Mixed Recyclable (Needs Segregation)</option>
                <option value="needs_cleaning">Needs Cleaning / Washing</option>
                <option value="raw_industrial">Raw Industrial / Agro Pulp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Contamination Disclosure
              </label>
              <input
                type="text"
                value={contaminationNotes}
                onChange={(e) => setContaminationNotes(e.target.value)}
                placeholder="e.g., Under 1% dust; caps removed; dry shed stored"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              />
            </div>
          </div>

          {/* Pricing Mode & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F7F8F4] rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Pricing Preference
              </label>
              <select
                value={pricingMode}
                onChange={(e) => setPricingMode(e.target.value as PricingMode)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                <option value="fixed">Fixed Price</option>
                <option value="negotiable">Price Negotiable</option>
                <option value="request_offers">Request Offers (No Asking Price)</option>
              </select>
            </div>

            {pricingMode !== 'request_offers' ? (
              <div>
                <label className="block text-xs font-bold text-[#17324D] mb-1">
                  Asking Price in KES (per {unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={askingPricePerUnit}
                  onChange={(e) => setAskingPricePerUnit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Est. Batch Value: KES {(quantity * askingPricePerUnit).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-gray-500 pt-5">
                Buyers will submit bids based on quantity.
              </div>
            )}
          </div>

          {/* Location Area in Eldoret */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Collection Hub / Area (Eldoret) *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                {ELDORET_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}, Eldoret
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Approximate Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near West Indies sub-county office"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Description & Packaging Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail collection access, loading ramps, packaging (bales vs sacks), and purity."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
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
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
