import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import api from '../api/axios';
import EquipmentCard from '../components/EquipmentCard';
import BookingModal from '../components/BookingModal';

const CATEGORIES = [
  { id: '', label: 'All Equipment' },
  { id: 'TRACTORS', label: 'Tractors' },
  { id: 'HARVESTING', label: 'Harvesters' },
  { id: 'TILLAGE', label: 'Tillage & Rotavators' },
  { id: 'SOWING_PLANTING', label: 'Seeders & Planters' },
  { id: 'IRRIGATION', label: 'Irrigation & Pumps' },
  { id: 'SPRAYERS_PROTECTION', label: 'Crop Sprayers' },
];

const EquipmentCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from query params
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [sortBy, setSortBy] = useState('DEFAULT'); // 'DEFAULT', 'PRICE_ASC', 'PRICE_DESC', 'RATING'

  const [selectedForBooking, setSelectedForBooking] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, [category, city, keyword]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (city) params.city = city;
      if (keyword) params.keyword = keyword;

      const res = await api.get('/api/equipment', { params });
      setEquipmentList(res.data);
    } catch (err) {
      console.error('Failed to load equipment catalog', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId) newParams.set('category', catId);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  const clearAllFilters = () => {
    setCategory('');
    setCity('');
    setKeyword('');
    setSearchParams({});
  };

  // Sorting
  const sortedEquipment = [...equipmentList].sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return (a.dailyRate || 0) - (b.dailyRate || 0);
    if (sortBy === 'PRICE_DESC') return (b.dailyRate || 0) - (a.dailyRate || 0);
    if (sortBy === 'RATING') return (b.averageRating || 0) - (a.averageRating || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Breadcrumb */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Agriculture Machinery Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore and rent verified agricultural equipment directly from trusted owners in your district.
        </p>
      </div>

      {/* Filter / Search Bar Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Inputs */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, brand, or model..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
            />
            {keyword && (
              <button type="button" onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Filter by city/region (e.g. Ludhiana, Karnal)..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
            />
            {city && (
              <button type="button" onClick={() => setCity('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
            >
              Filter Fleet
            </button>
            {(category || city || keyword) && (
              <button
                type="button"
                onClick={clearAllFilters}
                title="Reset Filters"
                className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        {/* Category Pills & Sorting Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  category === cat.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="DEFAULT">Recommended</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="RATING">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-96 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : sortedEquipment.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-2xl">
            🚜
          </div>
          <h3 className="text-xl font-bold text-slate-800">No machinery found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any equipment matching your selected filters. Try broadening your location or category search.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center text-xs text-slate-500 mb-4 px-1">
            <span>Showing <strong>{sortedEquipment.length}</strong> agriculture machines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedEquipment.map((eq) => (
              <EquipmentCard
                key={eq.id}
                equipment={eq}
                onBookClick={(item) => setSelectedForBooking(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedForBooking && (
        <BookingModal
          equipment={selectedForBooking}
          isOpen={!!selectedForBooking}
          onClose={() => setSelectedForBooking(null)}
          onSuccess={() => fetchEquipment()}
        />
      )}
    </div>
  );
};

export default EquipmentCatalog;
