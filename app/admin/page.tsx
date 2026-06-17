'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
import {
  Users,
  Wrench,
  ClipboardList,
  Wallet,
  LogOut,
  Ban,
  Trash2,
  Check,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  Clock,
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

  const statusStyles = (status: string) =>
    status === 'CONFIRMED' || status === 'APPROVED'
      ? 'bg-success/10 text-success'
      : status === 'COMPLETED'
        ? 'bg-secondary text-primary'
        : status === 'CANCELLED' || status === 'REJECTED'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-accent/10 text-warning';

  const tabIcons: Record<string, any> = {
    overview: LayoutDashboard,
    users: Users,
    providers: Wrench,
    bookings: ClipboardList,
    withdrawals: Banknote,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center max-w-md">
          <div className="size-14 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
            <Ban className="size-7" />
          </div>
          <h1 className="text-xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
            <LayoutDashboard className="size-5" />
          </div>
          <div className="text-2xl font-black">TTaskPro Admin</div>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: Users },
            { label: 'Total Providers', value: stats?.totalProviders, icon: Wrench },
            { label: 'Total Bookings', value: stats?.totalBookings, icon: ClipboardList },
            { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals, icon: Wallet },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-2xl shadow-sm p-6 flex items-center gap-4"
              >
                <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-card-foreground leading-none">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['overview', 'users', 'providers', 'bookings', 'withdrawals'].map((tab) => {
            const Icon = tabIcons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="size-4" />
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-card-foreground mb-4">Platform Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Transactions', value: stats?.totalTransactions, icon: ArrowLeftRight },
                  { label: 'Total Withdrawals', value: stats?.totalWithdrawals, icon: Banknote },
                  { label: 'Pending Bookings', value: stats?.pendingBookings, icon: Clock },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="border border-border rounded-xl p-5">
                      <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-3">
                        <Icon className="size-5" />
                      </div>
                      <p className="text-muted-foreground text-sm">{item.label}</p>
                      <p className="text-2xl font-black text-card-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-bold text-card-foreground mb-4">All Users ({users.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-left text-muted-foreground">
                      <th className="p-3 rounded-tl-xl font-semibold">Name</th>
                      <th className="p-3 font-semibold">Username</th>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Balance</th>
                      <th className="p-3 rounded-tr-xl font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-border">
                        <td className="p-3 font-semibold text-card-foreground">{u.fullName}</td>
                        <td className="p-3 text-muted-foreground">@{u.username}</td>
                        <td className="p-3 text-muted-foreground">{u.email}</td>
                        <td className="p-3 text-muted-foreground">₦{u.balance?.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="inline-flex items-center gap-1.5 text-destructive hover:underline font-semibold"
                          >
                            <Trash2 className="size-4" />
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
              <h2 className="text-xl font-bold text-card-foreground mb-4">All Providers ({providers.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-left text-muted-foreground">
                      <th className="p-3 rounded-tl-xl font-semibold">Name</th>
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Balance</th>
                      <th className="p-3 rounded-tr-xl font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p: any) => (
                      <tr key={p.id} className="border-b border-border">
                        <td className="p-3 font-semibold text-card-foreground">{p.fullName}</td>
                        <td className="p-3 text-muted-foreground">{p.category}</td>
                        <td className="p-3 text-muted-foreground">{p.email}</td>
                        <td className="p-3 text-muted-foreground">₦{p.balance?.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteProvider(p.id)}
                            className="inline-flex items-center gap-1.5 text-destructive hover:underline font-semibold"
                          >
                            <Trash2 className="size-4" />
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
              <h2 className="text-xl font-bold text-card-foreground mb-4">All Bookings ({bookings.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-left text-muted-foreground">
                      <th className="p-3 rounded-tl-xl font-semibold">User</th>
                      <th className="p-3 font-semibold">Provider</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 rounded-tr-xl font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b: any) => (
                      <tr key={b.id} className="border-b border-border">
                        <td className="p-3 font-semibold text-card-foreground">{b.user?.fullName}</td>
                        <td className="p-3 text-muted-foreground">{b.provider?.fullName}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(b.status)}`}>
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
              <h2 className="text-xl font-bold text-card-foreground mb-4">All Withdrawals ({withdrawals.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-left text-muted-foreground">
                      <th className="p-3 rounded-tl-xl font-semibold">Provider</th>
                      <th className="p-3 font-semibold">Amount</th>
                      <th className="p-3 font-semibold">Bank Details</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 rounded-tr-xl font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w: any) => (
                      <tr key={w.id} className="border-b border-border">
                        <td className="p-3 font-semibold text-card-foreground">{w.provider?.fullName}</td>
                        <td className="p-3 text-muted-foreground">₦{w.amount?.toLocaleString()}</td>
                        <td className="p-3 text-muted-foreground">{w.bankName} - {w.accountNumber}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(w.status)}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {w.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateWithdrawal(w.id, 'APPROVED')}
                                className="inline-flex items-center gap-1 text-success hover:underline font-semibold text-xs"
                              >
                                <Check className="size-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => updateWithdrawal(w.id, 'REJECTED')}
                                className="inline-flex items-center gap-1 text-destructive hover:underline font-semibold text-xs"
                              >
                                <X className="size-4" />
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
