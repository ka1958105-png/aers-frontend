import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Truck, AlertCircle, Star, Tractor, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import ReviewModal from '../components/ReviewModal';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedForReview, setSelectedForReview] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await api.patch(`/api/bookings/${bookingId}/status`, { status: 'CANCELLED' });
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking', err);
      setActionError(err.response?.data?.message || 'Could not cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Farmer Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            My Equipment Rentals
          </h1>
          <p className="text-sm text-slate-500">Track and manage your machinery rental reservations.</p>
        </div>

        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Tractor className="w-4 h-4" />
          <span>Rent More Machinery</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {actionError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-3 px-3 text-xs font-bold transition-all relative ${
              activeTab === tab
                ? 'text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.replace('_', ' ')}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Booking Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-2xl">
            📅
          </div>
          <h3 className="font-bold text-slate-800">No {activeTab.toLowerCase()} bookings</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any bookings matching this status. Explore our catalog to hire agricultural equipment.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
            >
              {/* Machine thumbnail and core info */}
              <div className="flex gap-4 items-center">
                <img
                  src={b.equipmentImageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'}
                  alt={b.equipmentTitle}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-200 bg-slate-100"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-[11px] text-slate-400 font-medium">Booking #{b.id}</span>
                  </div>

                  <Link to={`/equipment/${b.equipmentId}`}>
                    <h3 className="font-extrabold text-base text-slate-900 hover:text-emerald-700 transition-colors">
                      {b.equipmentTitle}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {b.startDate} {b.startDate !== b.endDate && `→ ${b.endDate}`}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      {b.rentalType === 'DAILY' ? `${b.durationUnits} Day(s)` : `${b.durationUnits} Hour(s)`}
                    </span>
                    {b.ownerName && (
                      <>
                        <span>•</span>
                        <span>Owner: {b.ownerName}</span>
                      </>
                    )}
                  </div>

                  {b.deliveryRequired && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-0.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery requested: {b.deliveryAddress || 'Yes'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                    Rental Cost
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{b.totalCost?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {b.status === 'COMPLETED' && (
                    <button
                      onClick={() => setSelectedForReview(b)}
                      className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      Write Review
                    </button>
                  )}

                  {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  <Link
                    to={`/equipment/${b.equipmentId}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    View Machine
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedForReview && (
        <ReviewModal
          equipmentId={selectedForReview.equipmentId}
          equipmentTitle={selectedForReview.equipmentTitle}
          isOpen={!!selectedForReview}
          onClose={() => setSelectedForReview(null)}
          onReviewAdded={() => {
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;
