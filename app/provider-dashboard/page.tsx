'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
import Link from 'next/link';
import {
  Wallet,
  Banknote,
  ClipboardList,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  Phone,
  Check,
  X,
  CircleCheckBig,
  Tag,
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
  });
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/provider-login';
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [profileRes, bookingsRes, dashboardRes] = await Promise.all([
        API.get('/provider/profile/me'),
        API.get('/booking/provider-bookings'),
        API.get('/provider/dashboard/me'),
      ]);
      setProfile(profileRes.data);
      setBookings(bookingsRes.data);
      setWithdrawals(dashboardRes.data.withdrawals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg('');
    setWithdrawError('');
    try {
      const res = await API.post('/provider/withdraw', {
        ...withdrawForm,
        amount: parseFloat(withdrawForm.amount),
      });
      setWithdrawMsg(res.data.message);
      setWithdrawForm({ amount: '', accountName: '', accountNumber: '', bankName: '' });
      fetchDashboard();
    } catch (err: any) {
      setWithdrawError(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await API.patch(`/booking/${bookingId}/status`, { status });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const statusStyles = (status: string) =>
    status === 'CONFIRMED'
      ? 'bg-success/10 text-success'
      : status === 'COMPLETED'
        ? 'bg-secondary text-primary'
        : status === 'CANCELLED' || status === 'REJECTED'
          ? 'bg-destructive/10 text-destructive'
          : status === 'APPROVED'
            ? 'bg-success/10 text-success'
            : 'bg-accent/10 text-warning';

  const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING').length;
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="text-2xl font-black">TTaskPro</div>
        <div className="flex items-center gap-4">
          <span className="text-primary-foreground/70 text-sm hidden md:block">
            Welcome, {profile?.username}
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-primary rounded-3xl p-8 text-primary-foreground mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-48 bg-primary-foreground/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="size-24 bg-primary-foreground rounded-full flex items-center justify-center text-primary text-4xl font-black shrink-0">
              {profile?.fullName?.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black">{profile?.fullName}</h1>
              <p className="text-primary-foreground/70">@{profile?.username}</p>
              <span className="inline-flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                <Tag className="size-3.5" />
                {profile?.category}
              </span>
            </div>
            <div className="md:ml-auto bg-primary-foreground/10 rounded-2xl p-6 text-center min-w-52">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/70 text-sm mb-1">
                <Wallet className="size-4" />
                Account Balance
              </div>
              <p className="text-4xl font-black">₦{profile?.balance?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: ClipboardList },
            { label: 'Pending', value: pendingBookings, icon: Inbox },
            { label: 'Completed', value: completedBookings, icon: CircleCheckBig },
            { label: 'Withdrawals', value: withdrawals.length, icon: Banknote },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-card border border-border rounded-2xl shadow-sm p-5 flex items-center gap-4"
              >
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-black text-card-foreground">{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdraw Funds */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="size-9 rounded-lg bg-secondary flex items-center justify-center text-primary">
                <Banknote className="size-5" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">Withdraw Funds</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-6 ml-11">A 20% fee applies to all withdrawals</p>

            {withdrawMsg && (
              <div className="flex items-center gap-2 bg-success/10 border border-success/20 text-success p-3 rounded-xl mb-4 text-sm">
                <CheckCircle2 className="size-4 shrink-0" />
                {withdrawMsg}
              </div>
            )}
            {withdrawError && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl mb-4 text-sm">
                <AlertTriangle className="size-4 shrink-0" />
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  required
                  min="1"
                  className="w-full border-2 border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Account Name</label>
                <input
                  type="text"
                  value={withdrawForm.accountName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                  required
                  className="w-full border-2 border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="Account holder name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Account Number</label>
                <input
                  type="text"
                  value={withdrawForm.accountNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  required
                  className="w-full border-2 border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="10-digit account number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Bank Name</label>
                <input
                  type="text"
                  value={withdrawForm.bankName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                  required
                  className="w-full border-2 border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. First Bank"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
              >
                <Banknote className="size-4" />
                Withdraw Funds
              </button>
            </form>
          </div>

          {/* Bookings & Withdrawals */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-sm p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                <ClipboardList className="size-4" />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Banknote className="size-4" />
                Withdrawals ({withdrawals.length})
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Inbox className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="border border-border rounded-xl p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-card-foreground">{booking.user?.fullName}</p>
                          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="size-3.5" />
                            {booking.user?.phone}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-success text-success-foreground py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            <Check className="size-3.5" />
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-destructive text-destructive-foreground py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            <X className="size-3.5" />
                            Decline
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-hover transition-colors mt-2"
                        >
                          <CircleCheckBig className="size-3.5" />
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Withdrawals Tab */}
            {activeTab === 'withdrawals' && (
              <div className="space-y-3">
                {withdrawals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Banknote className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No withdrawals yet</p>
                  </div>
                ) : (
                  withdrawals.map((w: any) => (
                    <div
                      key={w.id}
                      className="border border-border rounded-xl p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-card-foreground">₦{w.amount?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{w.bankName} - {w.accountNumber}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(w.status)}`}>
                          {w.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
