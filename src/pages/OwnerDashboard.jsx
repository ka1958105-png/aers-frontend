import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  CalendarCheck,
  PlayCircle,
  Coins,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Check,
  AlertCircle,
  MapPin,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
} from 'lucide-react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    totalBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });

  const [ownerEquipment, setOwnerEquipment] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('BOOKINGS'); // 'BOOKINGS' or 'EQUIPMENT'
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, equipRes, bookRes] = await Promise.all([
        api.get('/api/dashboard/owner'),
        api.get('/api/equipment/owner/my'),
        api.get('/api/bookings/owner'),
      ]);
      setStats(statsRes.data);
      setOwnerEquipment(equipRes.data);
      setOwnerBookings(bookRes.data);
    } catch (err) {
      console.error('Error loading owner dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/status`, { status: newStatus });
      setStatusMessage(`Booking #${bookingId} marked as ${newStatus}`);
      setTimeout(() => setStatusMessage(''), 3000);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update status', err);
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleToggleAvailability = async (equipmentId) => {
    try {
      await api.patch(`/api/equipment/${equipmentId}/toggle-availability`);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    if (!window.confirm('Are you sure you want to delete this equipment listing?')) return;
    try {
      await api.delete(`/api/equipment/${equipmentId}`);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to delete equipment', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Partner Vendor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Owner Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Monitor incoming farmer rental requests, manage fleet availability, and track revenue.
          </p>
        </div>

        <Link
          to="/owner/add-equipment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List New Machinery</span>
        </Link>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Gross Revenue</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{(stats.totalRevenue || 0).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Bookings</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalBookings || 0}
            </h3>
            <span className="text-[11px] text-amber-600 font-semibold">{stats.pendingBookings || 0} pending review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Active In Field</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.activeBookings || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Listed Fleet</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalEquipment || 0}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">{stats.availableEquipment || 0} ready for rent</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'BOOKINGS'
              ? 'text-emerald-700'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <span>Incoming Rental Requests ({ownerBookings.length})</span>
          {activeTab === 'BOOKINGS' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('EQUIPMENT')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'EQUIPMENT'
              ? 'text-emerald-700'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <span>My Machinery Fleet ({ownerEquipment.length})</span>
          {activeTab === 'EQUIPMENT' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          {loading ? (
            <div className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
          ) : ownerBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No rental requests yet</h3>
              <p className="text-xs text-slate-500">
                When farmers request to rent your machinery, they will show up here for your approval.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Booking</th>
                      <th className="py-3.5 px-4">Machinery</th>
                      <th className="py-3.5 px-4">Farmer Info</th>
                      <th className="py-3.5 px-4">Duration & Dates</th>
                      <th className="py-3.5 px-4">Total Cost</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ownerBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900">
                          #{b.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={b.equipmentImageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=200&q=80'}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1">{b.equipmentTitle}</p>
                              <span className="text-[10px] text-slate-400">{b.equipmentCategory}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-slate-800">{b.farmerName}</p>
                          <p className="text-[11px] text-slate-500">{b.farmerPhone}</p>
                          {b.deliveryRequired && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold">
                              Delivery to: {b.deliveryAddress || 'Yes'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-slate-700">
                            {b.startDate} {b.startDate !== b.endDate && `to ${b.endDate}`}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {b.rentalType === 'DAILY' ? `${b.durationUnits} Day(s)` : `${b.durationUnits} Hour(s)`}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-slate-900 text-sm">
                          ₹{b.totalCost?.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'APPROVED')}
                                  className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                  title="Approve rental"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                                  className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                  title="Decline request"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {b.status === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'ACTIVE')}
                                className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                Mark In-Use
                              </button>
                            )}

                            {b.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                                className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark Returned
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Machinery Management */}
      {activeTab === 'EQUIPMENT' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerEquipment.map((eq) => (
              <div
                key={eq.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={eq.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'}
                      alt={eq.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleAvailability(eq.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide backdrop-blur transition-all ${
                          eq.isAvailable
                            ? 'bg-emerald-600/90 text-white'
                            : 'bg-slate-800/90 text-slate-200'
                        }`}
                      >
                        {eq.isAvailable ? '● Available' : '● Hidden / Off'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                      {eq.category?.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1 line-clamp-1">{eq.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{eq.city}, {eq.state}</span>
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">₹{eq.dailyRate}</span>
                      <span className="text-slate-400">/day</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">₹{eq.hourlyRate}</span>
                      <span className="text-slate-400">/hr</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Link
                    to={`/equipment/${eq.id}`}
                    className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAvailability(eq.id)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      title="Toggle availability"
                    >
                      {eq.isAvailable ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(eq.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
