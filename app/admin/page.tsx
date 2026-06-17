'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, providersRes, bookingsRes, withdrawalsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/providers'),
        API.get('/admin/bookings'),
        API.get('/admin/withdrawals'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProviders(providersRes.data);
      setBookings(bookingsRes.data);
      setWithdrawals(withdrawalsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access denied. Admins only.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/user/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
      await API.delete(`/admin/provider/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const updateWithdrawal = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await API.patch(`/admin/withdrawal/${id}`, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d2d6e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0d2d6e] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="text-2xl font-black">TTaskPro Admin</div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: '👤' },
            { label: 'Total Providers', value: stats?.totalProviders, icon: '🔧' },
            { label: 'Total Bookings', value: stats?.totalBookings, icon: '📋' },
            { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals, icon: '💰' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-black text-[#0d2d6e]">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'users', 'providers', 'bookings', 'withdrawals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-[#0d2d6e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-[#0d2d6e] mb-4">Platform Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border-2 border-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Total Transactions</p>
                  <p className="text-2xl font-black text-[#0d2d6e]">{stats?.totalTransactions}</p>
                </div>
                <div className="border-2 border-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Total Withdrawals</p>
                  <p className="text-2xl font-black text-[#0d2d6e]">{stats?.totalWithdrawals}</p>
                </div>
                <div className="border-2 border-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Pending Bookings</p>
                  <p className="text-2xl font-black text-[#0d2d6e]">{stats?.pendingBookings}</p>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-bold text-[#0d2d6e] mb-4">All Users ({users.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 rounded-tl-xl">Name</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Balance</th>
                      <th className="p-3 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-gray-100">
                        <td className="p-3 font-semibold text-gray-800">{u.fullName}</td>
                        <td className="p-3 text-gray-600">@{u.username}</td>
                        <td className="p-3 text-gray-600">{u.email}</td>
                        <td className="p-3 text-gray-600">₦{u.balance?.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Providers */}
          {activeTab === 'providers' && (
            <div>
              <h2 className="text-xl font-bold text-[#0d2d6e] mb-4">All Providers ({providers.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 rounded-tl-xl">Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Balance</th>
                      <th className="p-3 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p: any) => (
                      <tr key={p.id} className="border-b border-gray-100">
                        <td className="p-3 font-semibold text-gray-800">{p.fullName}</td>
                        <td className="p-3 text-gray-600">{p.category}</td>
                        <td className="p-3 text-gray-600">{p.email}</td>
                        <td className="p-3 text-gray-600">₦{p.balance?.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteProvider(p.id)}
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-bold text-[#0d2d6e] mb-4">All Bookings ({bookings.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 rounded-tl-xl">User</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-tr-xl">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b: any) => (
                      <tr key={b.id} className="border-b border-gray-100">
                        <td className="p-3 font-semibold text-gray-800">{b.user?.fullName}</td>
                        <td className="p-3 text-gray-600">{b.provider?.fullName}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            b.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                            b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' :
                            b.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Withdrawals */}
          {activeTab === 'withdrawals' && (
            <div>
              <h2 className="text-xl font-bold text-[#0d2d6e] mb-4">All Withdrawals ({withdrawals.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 rounded-tl-xl">Provider</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Bank Details</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w: any) => (
                      <tr key={w.id} className="border-b border-gray-100">
                        <td className="p-3 font-semibold text-gray-800">{w.provider?.fullName}</td>
                        <td className="p-3 text-gray-600">₦{w.amount?.toLocaleString()}</td>
                        <td className="p-3 text-gray-600">{w.bankName} - {w.accountNumber}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            w.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                            w.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {w.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateWithdrawal(w.id, 'APPROVED')}
                                className="text-green-600 hover:text-green-800 font-semibold text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateWithdrawal(w.id, 'REJECTED')}
                                className="text-red-500 hover:text-red-700 font-semibold text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}