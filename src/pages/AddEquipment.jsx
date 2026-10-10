import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const PRESET_IMAGES = [
  { label: 'Tractor 1', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tractor 2', url: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80' },
  { label: 'Harvester', url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rotavator', url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sprayer', url: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80' },
];

const AddEquipment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TRACTORS',
    modelYear: 2024,
    horsepower: 50,
    fuelType: 'Diesel',
    hourlyRate: '',
    dailyRate: '',
    securityDeposit: '',
    location: '',
    city: '',
    state: '',
    pincode: '',
    imageUrl: PRESET_IMAGES[0].url,
    equipmentCondition: 'Excellent',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        modelYear: Number(formData.modelYear),
        horsepower: Number(formData.horsepower),
        hourlyRate: Number(formData.hourlyRate),
        dailyRate: Number(formData.dailyRate),
        securityDeposit: formData.securityDeposit ? Number(formData.securityDeposit) : 0,
      };

      await api.post('/api/equipment', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/owner/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Failed to create equipment', err);
      setError(err.response?.data?.message || 'Failed to list machinery. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Owner Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            List Agricultural Machinery for Rent
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add your tractor, harvester, or farm implement to the marketplace and start receiving rental requests from farmers.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-bold">Equipment Listed Successfully!</p>
              <p className="text-xs text-emerald-600">Redirecting to your owner management portal...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Machine Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Equipment Title / Model Name *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Mahindra 575 DI 45HP Tractor or Shaktiman Rotavator"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                required
              >
                <option value="TRACTORS">Tractors & Haulers</option>
                <option value="HARVESTING">Combine Harvesters</option>
                <option value="TILLAGE">Tillage & Rotavators</option>
                <option value="SOWING_PLANTING">Sowing & Transplanters</option>
                <option value="IRRIGATION">Irrigation & Water Pumps</option>
                <option value="SPRAYERS_PROTECTION">Crop Protection / Sprayers</option>
                <option value="POST_HARVEST">Post-Harvest / Threshers</option>
                <option value="OTHER">Other Farm Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                name="equipmentCondition"
                value={formData.equipmentCondition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="Like New">Like New (Mint Condition)</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good / Field Tested</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description & Included Attachments *
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Describe machine capability, implements included, diesel consumption, operator requirement..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              required
            />
          </div>

          {/* Specs: Horsepower, Model Year, Fuel Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Horsepower (HP)</label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                placeholder="e.g. 45"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model Year</label>
              <input
                type="number"
                name="modelYear"
                value={formData.modelYear}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fuel / Drive Type</label>
              <input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                placeholder="Diesel / PTO / Solar"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Rates & Pricing */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Rental Pricing Structure (₹ INR)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rate Per Day (₹) *</label>
                <input
                  type="number"
                  name="dailyRate"
                  value={formData.dailyRate}
                  onChange={handleChange}
                  placeholder="e.g. 3200"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rate Per Hour (₹) *</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 450"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Depot / Village Address</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. GT Road Farm Hub"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / District *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Ludhiana"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Punjab"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Image URL & Preset selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Machine Photo (Image URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quick Photo Presets:</span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {formData.imageUrl && (
              <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-7 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Publish Equipment Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;
