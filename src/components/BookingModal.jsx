import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Truck, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ equipment, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [rentalType, setRentalType] = useState('DAILY'); // 'DAILY' or 'HOURLY'
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [durationUnits, setDurationUnits] = useState(8); // For hourly
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.address && user?.city) {
      setDeliveryAddress(`${user.address}, ${user.city}`);
    }
  }, [user]);

  if (!isOpen || !equipment) return null;

  // Calculate pricing
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const calculatedDays = calculateDays();
  const baseCost = rentalType === 'DAILY'
    ? (equipment.dailyRate || 0) * calculatedDays
    : (equipment.hourlyRate || 0) * (durationUnits || 1);

  const securityDeposit = equipment.securityDeposit || 0;
  const deliveryFee = deliveryRequired ? 350 : 0;
  const totalAmount = baseCost + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        equipmentId: equipment.id,
        startDate: startDate,
        endDate: rentalType === 'HOURLY' ? startDate : endDate,
        rentalType: rentalType,
        durationUnits: rentalType === 'HOURLY' ? Number(durationUnits) : calculatedDays,
        deliveryRequired: deliveryRequired,
        deliveryAddress: deliveryRequired ? deliveryAddress : null,
        notes: notes,
      };

      const res = await api.post('/api/bookings', payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess(res.data);
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      console.error('Booking failed', err);
      setError(err.response?.data?.message || 'Failed to submit booking request. Please check availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Rent Equipment</h3>
            <p className="text-xs text-slate-500 mt-0.5">{equipment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-sm text-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Booking Request Submitted!</p>
                <p className="text-xs text-emerald-600">Redirecting to your bookings dashboard...</p>
              </div>
            </div>
          )}

          {/* Rental Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rental Duration Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRentalType('DAILY')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1 transition-all ${
                  rentalType === 'DAILY'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Daily Rental</span>
                <span className="text-[11px] font-normal text-slate-500">₹{equipment.dailyRate}/day</span>
              </button>

              <button
                type="button"
                onClick={() => setRentalType('HOURLY')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1 transition-all ${
                  rentalType === 'HOURLY'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Hourly Rental</span>
                <span className="text-[11px] font-normal text-slate-500">₹{equipment.hourlyRate}/hour</span>
              </button>
            </div>
          </div>

          {/* Date Range or Hours */}
          {rentalType === 'DAILY' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value > endDate) setEndDate(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hours Needed</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={durationUnits}
                  onChange={(e) => setDurationUnits(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Delivery Option */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryRequired}
                onChange={(e) => setDeliveryRequired(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Need equipment delivered to farm field (+₹350)
              </span>
            </label>

            {deliveryRequired && (
              <div>
                <input
                  type="text"
                  placeholder="Enter exact field address or landmark"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required={deliveryRequired}
                />
              </div>
            )}
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions or Field Requirements (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Need with operator, will use for paddy harvesting..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Price Breakdown Card */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>
                Rental ({rentalType === 'DAILY' ? `${calculatedDays} day(s)` : `${durationUnits} hour(s)`})
              </span>
              <span className="font-semibold text-slate-800">₹{baseCost.toLocaleString()}</span>
            </div>

            {deliveryRequired && (
              <div className="flex justify-between text-slate-600">
                <span>Field Delivery Fee</span>
                <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
              </div>
            )}

            {securityDeposit > 0 && (
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  Refundable Security Deposit
                </span>
                <span className="font-semibold text-slate-800">₹{securityDeposit.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-2 border-t border-emerald-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Estimated Total</span>
              <span className="text-lg font-extrabold text-emerald-800">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Payment is made upon booking confirmation. Security deposit is fully refunded after return inspection.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm Rental Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
