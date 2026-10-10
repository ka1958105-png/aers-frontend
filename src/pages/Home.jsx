import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tractor,
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  BadgePercent,
  Coins,
} from 'lucide-react';
import api from '../api/axios';
import EquipmentCard from '../components/EquipmentCard';
import BookingModal from '../components/BookingModal';

const CATEGORIES = [
  { id: 'TRACTORS', label: 'Tractors', icon: '🚜', count: '45+ HP' },
  { id: 'HARVESTING', label: 'Harvesters', icon: '🌾', count: 'Combine & Paddy' },
  { id: 'TILLAGE', label: 'Tillage & Ploughs', icon: '⚙️', count: 'Rotavator & Disc' },
  { id: 'SOWING_PLANTING', label: 'Seeders', icon: '🌱', count: 'Transplanters' },
  { id: 'IRRIGATION', label: 'Pumps & Irrigation', icon: '💧', count: 'Solar & Diesel' },
  { id: 'SPRAYERS_PROTECTION', label: 'Sprayers', icon: '🛡️', count: 'Boom & Pressure' },
];

const Home = () => {
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await api.get('/api/equipment');
      setFeaturedEquipment(res.data.slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch equipment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.append('keyword', searchKeyword);
    if (searchCity) params.append('city', searchCity);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background decorative glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Empowering 50,000+ Farmers with Modern Agtech</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Rent Modern Farming Machinery <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-amber-300">
              When You Need, By Day or Hour
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Eliminate high machinery capital costs. Access verified tractors, combine harvesters, rotavators, and sprayers with doorstep farm field delivery.
          </p>

          {/* Search Box Card */}
          <div className="max-w-3xl mx-auto mt-8 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl text-slate-800 border border-white/40">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
              <div className="sm:col-span-5 flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Machine (e.g. Tractor, Harvester...)"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location / District / City"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular Searches:</span>
              <button
                type="button"
                onClick={() => navigate('/catalog?keyword=Mahindra')}
                className="hover:text-emerald-700 underline"
              >
                Mahindra 575 DI
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/catalog?category=HARVESTING')}
                className="hover:text-emerald-700 underline"
              >
                Kubota Combine
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/catalog?keyword=Rotavator')}
                className="hover:text-emerald-700 underline"
              >
                Rotavator
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/catalog?category=IRRIGATION')}
                className="hover:text-emerald-700 underline"
              >
                Solar Pumps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Equipment Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Browse Machinery By Category
            </h2>
          </div>
          <Link
            to="/catalog"
            className="mt-2 sm:mt-0 flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                {cat.label}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Equipment Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verified Listings</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Machines Ready For Rent
            </h2>
          </div>
          <Link
            to="/catalog"
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>See Full Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEquipment.map((eq) => (
              <EquipmentCard
                key={eq.id}
                equipment={eq}
                onBookClick={(item) => setSelectedEquipmentForBooking(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose AgriRent Value Props */}
      <section className="bg-slate-100/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The AgriRent Advantage</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              Designed For Agricultural Productivity
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Transforming how farmers farm and how equipment owners monetize their capital machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">100% Insured & Verified</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All machinery is physically checked for hydraulic performance, engine health, and registered with valid farm commercial insurance.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Flexible Hourly & Daily Rent</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Need a 45HP tractor just for 4 hours of leveling? Or a combine harvester for a 3-day harvest season? Pay only for what you work.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Equipment Owner Earnings</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Equipment owners can earn up to ₹85,000/month by listing idle machinery during off-peak windows with guaranteed payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA: Farmer vs Owner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-green-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-700/80 text-emerald-200">
                For Farmers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Ready to Boost Your Crop Yields?
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                Browse our real-time catalog of agricultural tractors, rotavators, and sprayers. Book with instant confirmation and farm delivery.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <span>Find Machines Near You</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-700 text-amber-400">
                For Equipment Owners
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Own Machinery? Start Earning Daily.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Turn your tractors, harvesters, and implements into regular rental revenue. List your equipment in 3 minutes with zero onboarding fees.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/owner/add-equipment"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm transition-colors shadow-lg"
              >
                <span>List Your Equipment Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedEquipmentForBooking && (
        <BookingModal
          equipment={selectedEquipmentForBooking}
          isOpen={!!selectedEquipmentForBooking}
          onClose={() => setSelectedEquipmentForBooking(null)}
          onSuccess={() => {
            fetchFeatured();
          }}
        />
      )}
    </div>
  );
};

export default Home;
