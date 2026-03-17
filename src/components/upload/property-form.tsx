'use client';

import { PropertyDetails, PropertyAddress, PriceQualifier, Tenure } from '@/types/property';

interface PropertyFormProps {
  value: Partial<PropertyDetails>;
  onChange: (details: Partial<PropertyDetails>) => void;
}

export function PropertyForm({ value, onChange }: PropertyFormProps) {
  const update = (field: string, val: string | number) => {
    onChange({ ...value, [field]: val });
  };

  const updateAddress = (field: keyof PropertyAddress, val: string) => {
    onChange({
      ...value,
      address: { ...defaultAddress, ...value.address, [field]: val },
    });
  };

  return (
    <div className="space-y-6">
      {/* Address */}
      <fieldset>
        <legend className="text-lg font-semibold mb-3">Address</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input
              type="text"
              value={value.address?.line1 || ''}
              onChange={(e) => updateAddress('line1', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. 14 Elm Park Gardens"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              value={value.address?.line2 || ''}
              onChange={(e) => updateAddress('line2', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. Chelsea"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City / Town</label>
            <input
              type="text"
              value={value.address?.city || ''}
              onChange={(e) => updateAddress('city', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. London"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
            <input
              type="text"
              value={value.address?.county || ''}
              onChange={(e) => updateAddress('county', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. Greater London"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <input
              type="text"
              value={value.address?.postcode || ''}
              onChange={(e) => updateAddress('postcode', e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. SW3 6PE"
            />
          </div>
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-lg font-semibold mb-3">Price</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (£)</label>
            <input
              type="number"
              value={value.price || ''}
              onChange={(e) => update('price', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. 1250000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Qualifier</label>
            <select
              value={value.priceQualifier || 'guide_price'}
              onChange={(e) => update('priceQualifier', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            >
              <option value="guide_price">Guide Price</option>
              <option value="offers_over">Offers Over</option>
              <option value="offers_in_region">Offers in the Region of</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* Property Details */}
      <fieldset>
        <legend className="text-lg font-semibold mb-3">Property Details</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number"
              min="0"
              max="20"
              value={value.bedrooms || ''}
              onChange={(e) => update('bedrooms', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number"
              min="0"
              max="20"
              value={value.bathrooms || ''}
              onChange={(e) => update('bathrooms', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receptions</label>
            <input
              type="number"
              min="0"
              max="20"
              value={value.receptions || ''}
              onChange={(e) => update('receptions', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sq Ft</label>
            <input
              type="number"
              value={value.sqft || ''}
              onChange={(e) => update('sqft', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="Optional"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              value={value.propertyType || ''}
              onChange={(e) => update('propertyType', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            >
              <option value="">Select type</option>
              <option value="Detached House">Detached House</option>
              <option value="Semi-Detached House">Semi-Detached House</option>
              <option value="Terraced House">Terraced House</option>
              <option value="Flat / Apartment">Flat / Apartment</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Cottage">Cottage</option>
              <option value="Country House">Country House</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Maisonette">Maisonette</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure</label>
            <select
              value={value.tenure || 'freehold'}
              onChange={(e) => update('tenure', e.target.value as Tenure)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            >
              <option value="freehold">Freehold</option>
              <option value="leasehold">Leasehold</option>
              <option value="share_of_freehold">Share of Freehold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
            <input
              type="text"
              value={value.yearBuilt || ''}
              onChange={(e) => update('yearBuilt', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. 1890 or Victorian"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Council Tax Band</label>
            <select
              value={value.councilTaxBand || ''}
              onChange={(e) => update('councilTaxBand', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            >
              <option value="">Select band</option>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((b) => (
                <option key={b} value={b}>Band {b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EPC Rating</label>
            <select
              value={value.epcRating || ''}
              onChange={(e) => update('epcRating', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
            >
              <option value="">Select rating</option>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Agent Details */}
      <fieldset>
        <legend className="text-lg font-semibold mb-3">Agent Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
            <input
              type="text"
              value={value.agentName || ''}
              onChange={(e) => update('agentName', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={value.agentPhone || ''}
              onChange={(e) => update('agentPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. 020 7861 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={value.agentEmail || ''}
              onChange={(e) => update('agentEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
              placeholder="e.g. agent@knightfrank.com"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

const defaultAddress: PropertyAddress = {
  line1: '',
  line2: '',
  city: '',
  county: '',
  postcode: '',
};
