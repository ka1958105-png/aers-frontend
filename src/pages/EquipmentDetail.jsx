import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Gauge,
  Zap,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  User,
  ArrowLeft,
  CheckCircle,
  Truck,
  MessageSquareQuote,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    fetchEquipmentAndReviews();
  }, [id]);

  const fetchEquipmentAndReviews = async () => {
    setLoading(true);
    try {
      const [eqRes, revRes] = await Promise.all([
        api.get(`/api/equipment/${id}`),
        api.get(`/api/reviews/equipment/${id}`),
      ]);
      setEquipment(eqRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error('Failed to load equipment details', err);
      setError('Equipment not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Equipment Not Found</h2>
        <p className="text-sm text-slate-500">The machinery listing you requested could not be located.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === equipment.ownerId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back navigation */}
      <div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Machinery</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Photo Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-lg aspect-video max-h-[460px] w-full">
            <img
              src={equipment.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80'}
              alt={equipment.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/95 text-emerald-900 shadow-md">
                {equipment.category?.replace('_', ' ')}
              </span>
              {equipment.equipmentCondition && (
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/80 text-emerald-300 backdrop-blur shadow-md">
                  Condition: {equipment.equipmentCondition}
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              {equipment.isAvailable ? (
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                  ● Available Now
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                  ● Currently In Rental
                </span>
              )}
            </div>
          </div>

          {/* Title & Overview Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {equipment.location || equipment.city}, {equipment.city}, {equipment.state}
                </span>
                {equipment.pincode && <span>({equipment.pincode})</span>}
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs font-bold text-amber-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{equipment.averageRating ? equipment.averageRating.toFixed(1) : '5.0'} / 5.0</span>
                <span className="text-amber-700 font-normal">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {equipment.title}
            </h1>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                Machine Overview & Capability
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {equipment.description}
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Horsepower</span>
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-600" />
                  {equipment.horsepower ? `${equipment.horsepower} HP` : 'Standard'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Fuel / Drive</span>
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5 truncate">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {equipment.fuelType || 'Diesel'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Year Model</span>
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {equipment.modelYear || '2023'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Inspection</span>
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified OK
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Farmer Reviews & Ratings</h3>
                <p className="text-xs text-slate-500">Real feedback from farmers who hired this machine</p>
              </div>

              {isAuthenticated && !isOwner && (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                >
                  Write Review
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No reviews yet for this machine. Be the first farmer to leave feedback!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          {rev.farmerName?.charAt(0) || 'F'}
                        </div>
                        <span className="font-bold text-xs text-slate-800">{rev.farmerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-9">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Booking Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Booking Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rental Rates</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{equipment.dailyRate?.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ full day</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                or ₹{equipment.hourlyRate?.toLocaleString()} / hour
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero hidden service charges</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep farm delivery available</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Refundable deposit: ₹{equipment.securityDeposit?.toLocaleString()}</span>
              </div>
            </div>

            {/* Action CTA */}
            {isOwner ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs font-bold text-amber-800">
                This is your equipment listing.
              </div>
            ) : equipment.isAvailable ? (
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-98 text-sm"
              >
                Book This Machine Now
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-slate-400 bg-slate-100 cursor-not-allowed text-sm"
              >
                Currently Reserved
              </button>
            )}

            {/* Equipment Owner Details */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verified Equipment Owner
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {equipment.ownerName?.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{equipment.ownerName}</h4>
                  <p className="text-xs text-slate-400">Partner Vendor Since 2023</p>
                </div>
              </div>

              {equipment.ownerPhone && (
                <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{equipment.ownerPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          equipment={equipment}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => fetchEquipmentAndReviews()}
        />
      )}

      {/* Review Modal */}
      {isReviewOpen && (
        <ReviewModal
          equipmentId={equipment.id}
          equipmentTitle={equipment.title}
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onReviewAdded={() => fetchEquipmentAndReviews()}
        />
      )}
    </div>
  );
};

export default EquipmentDetail;
