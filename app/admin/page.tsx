'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
import {
  LogOut,
  Users,
  Wrench,
  BookMarked,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0d2d6e] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center max-w-md">
          <AlertCircle className="size-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#0d2d6e] to-[#0a2458] text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="text-2xl font-black">TTaskPro Admin</div>
        <button
          onClick={logout}
          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center gap-2"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, Icon: Users },
            { label: 'Total Providers', value: stats?.totalProviders, Icon: Wrench },
            { label: 'Total Bookings', value: stats?.totalBookings, Icon: BookMarked },
            { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals, Icon: DollarSign },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl shadow-lg border border-border p-6 text-center hover:shadow-xl hover:border-[#f59e0b]/30 transition">
              <div className="flex justify-center mb-3">
                <stat.Icon className="size-8 text-[#f59e0b]" />
              </div>
              <p className="text-3xl font-black text-[#0d2d6e]">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'users', 'providers', 'bookings', 'withdrawals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-[#0d2d6e] text-white shadow-lg'
                  : 'bg-card text-muted-foreground border border-border hover:border-[#0d2d6e]/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-[#0d2d6e] mb-4">Platform Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border-2 border-border rounded-xl p-4 hover:border-[#f59e0b]/50 hover:bg-muted/30 transition">
                  <p className="text-muted-foreground text-sm">Total Transactions</p>
                  <p className="text-2xl font-black text-[#0d2d6e]">{stats?.totalTransactions}</p>
                </div>
                <div className="border-2 border-border rounded-xl p-4 hover:border-[#f59e0b]/50 hover:bg-muted/30 transition">
                  <p className="text-muted-foreground text-sm">Total Withdrawals</p>
                  <p className="text-2xl font-black text-[#0d2d6e]">{stats?.totalWithdrawals}</p>
                </div>
                <div className="border-2 border-border rounded-xl p-4 hover:border-[#f59e0b]/50 hover:bg-muted/30 transition">
                  <p className="text-muted-foreground text-sm">Pending Bookings</p>
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
                    <tr className="bg-muted text-left">
                      <th className="p-3 rounded-tl-xl text-foreground font-bold">Name</th>
                      <th className="p-3 text-foreground font-bold">Username</th>
                      <th className="p-3 text-foreground font-bold">Email</th>
                      <th className="p-3 text-foreground font-bold">Balance</th>
                      <th className="p-3 rounded-tr-xl text-foreground font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="p-3 font-semibold text-foreground">{u.fullName}</td>
                        <td className="p-3 text-muted-foreground">@{u.username}</td>
                        <td className="p-3 text-muted-foreground">{u.email}</td>
                        <td className="p-3 text-muted-foreground">₦{u.balance?.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-destructive hover:text-destructive/80 font-semibold"
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
                    <tr className="bg-muted text-left">
                      <th className="p-3 rounded-tl-xl text-foreground font-bold">Name</th>
                      <th className="p-3 text-foreground font-bold">Category</th>
                      <th className="p-3 text-foreground font-bold">Email</th>
                      <th className="p-3 text-foreground font-bold">Balance</th>
                      <th className="p-3 rounded-tr-xl text-foreground font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p: any) => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="p-3 font-semibold text-foreground">{p.fullName}</td>
                        <td className="p-3 text-muted-foreground">{p.category}</td>
                        <td className="p-3 text-muted-foreground">{p.email}</td>
                        <td className="p-3 text-muted-foreground">₦{p.balance?.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteProvider(p.id)}
                            className="text-destructive hover:text-destructive/80 font-semibold"
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
                    <tr className="bg-muted text-left">
                      <th className="p-3 rounded-tl-xl text-foreground font-bold">User</th>
                      <th className="p-3 text-foreground font-bold">Provider</th>
                      <th className="p-3 text-foreground font-bold">Status</th>
                      <th className="p-3 rounded-tr-xl text-foreground font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b: any) => (
                      <tr key={b.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="p-3 font-semibold text-foreground">{b.user?.fullName}</td>
                        <td className="p-3 text-muted-foreground">{b.provider?.fullName}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            b.status === 'CONFIRMED' ? 'bg-success/10 text-success' :
                            b.status === 'COMPLETED' ? 'bg-primary/10 text-primary' :
                            b.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {b.status === 'COMPLETED' && <CheckCircle2 className="size-3" />}
                            {b.status === 'CONFIRMED' && <Clock className="size-3" />}
                            {b.status === 'CANCELLED' && <XCircle className="size-3" />}
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</td>
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
                    <tr className="bg-muted text-left">
                      <th className="p-3 rounded-tl-xl text-foreground font-bold">Provider</th>
                      <th className="p-3 text-foreground font-bold">Amount</th>
                      <th className="p-3 text-foreground font-bold">Bank Details</th>
                      <th className="p-3 text-foreground font-bold">Status</th>
                      <th className="p-3 rounded-tr-xl text-foreground font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w: any) => (
                      <tr key={w.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="p-3 font-semibold text-foreground">{w.provider?.fullName}</td>
                        <td className="p-3 text-muted-foreground">₦{w.amount?.toLocaleString()}</td>
                        <td className="p-3 text-muted-foreground">{w.bankName} - {w.accountNumber}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            w.status === 'APPROVED' ? 'bg-success/10 text-success' :
                            w.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {w.status === 'APPROVED' && <CheckCircle2 className="size-3" />}
                            {w.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {w.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateWithdrawal(w.id, 'APPROVED')}
                                className="text-success hover:text-success/80 font-semibold text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateWithdrawal(w.id, 'REJECTED')}
                                className="text-destructive hover:text-destructive/80 font-semibold text-xs"
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
