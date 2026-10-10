import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Tractor,
  CalendarCheck,
  Coins,
  Search,
} from 'lucide-react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('STATS'); // 'STATS', 'USERS', 'BOOKINGS'

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, bookRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/bookings'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBookings(bookRes.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>System Administrator Control Center</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          AgriRent Platform Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor nationwide machinery distribution, registered users, and rental transaction volume.
        </p>
      </div>

      {/* Analytics Summary */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Gross Platform GMV</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{(stats.totalRevenue || 0).toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Machinery</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {stats.totalEquipment}
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold">{stats.availableEquipment} available now</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {stats.totalBookings}
              </h3>
              <span className="text-[11px] text-blue-600 font-semibold">{stats.activeBookings} active in field</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Registered Users</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {stats.totalUsers}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {stats.totalFarmers} Farmers, {stats.totalOwners} Owners
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'BOOKINGS'
              ? 'text-purple-700'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <span>All Platform Bookings ({bookings.length})</span>
          {activeTab === 'BOOKINGS' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'USERS'
              ? 'text-purple-700'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <span>User Directory ({users.length})</span>
          {activeTab === 'USERS' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Bookings Table */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Equipment</th>
                  <th className="py-3.5 px-4">Farmer</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">#{b.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{b.equipmentTitle}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.farmerName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.ownerName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{b.startDate} to {b.endDate}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{b.totalCost?.toLocaleString()}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">City / State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">#{u.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ROLE_ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'ROLE_OWNER'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{u.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.city ? `${u.city}, ${u.state}` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
