'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
import Link from 'next/link';
import {
  LogOut,
  Wallet,
  DollarSign,
  BookMarked,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="text-2xl font-black">TTaskPro</div>
        <div className="flex items-center gap-4">
          <span className="text-primary-foreground/80 text-sm hidden md:block font-medium">
            Welcome, {profile?.username}
          </span>
          <button
            onClick={logout}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-8 text-white mb-8 shadow-lg border border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-4xl font-black ring-4 ring-accent/30 shadow-lg">
              {profile?.fullName?.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-black">{profile?.fullName}</h1>
              <p className="text-primary-foreground/80">@{profile?.username}</p>
              <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-xs font-bold mt-2 shadow-md">
                {profile?.category}
              </span>
            </div>
            <div className="md:ml-auto bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <p className="text-primary-foreground/80 text-sm flex items-center gap-2 justify-center mb-2">
                <Wallet className="size-4" />
                Account Balance
              </p>
              <p className="text-4xl font-black">₦{profile?.balance?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdraw Funds */}
          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-primary mb-1 flex items-center gap-2">
              <DollarSign className="size-5" />
              Withdraw Funds
            </h2>
            <p className="text-xs text-muted-foreground mb-6">A 20% fee applies to all withdrawals</p>

            {withdrawMsg && (
              <div className="bg-success/10 border border-success text-success p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 flex-shrink-0" />
                {withdrawMsg}
              </div>
            )}
            {withdrawError && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <AlertCircle className="size-4 flex-shrink-0" />
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
                  className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors bg-card"
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
                  className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors bg-card"
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
                  className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors bg-card"
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
                  className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors bg-card"
                  placeholder="e.g. First Bank"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition shadow-md shadow-primary/30"
              >
                Withdraw Funds
              </button>
            </form>
          </div>

          {/* Bookings & Withdrawals */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-shadow">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <BookMarked className="size-4" />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === 'withdrawals'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <TrendingUp className="size-4" />
                Withdrawals ({withdrawals.length})
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <BookMarked className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No bookings yet</p>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="border-2 border-border rounded-xl p-4 hover:border-primary/50 hover:bg-muted/20 transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{booking.user?.fullName}</p>
                          <p className="text-sm text-muted-foreground">{booking.user?.phone}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 flex items-center gap-1 whitespace-nowrap ${
                          booking.status === 'CONFIRMED' ? 'bg-success/10 text-success' :
                          booking.status === 'COMPLETED' ? 'bg-primary/10 text-primary' :
                          booking.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {booking.status === 'COMPLETED' && <CheckCircle2 className="size-3" />}
                          {booking.status === 'CONFIRMED' && <Clock className="size-3" />}
                          {booking.status === 'CANCELLED' && <XCircle className="size-3" />}
                          {booking.status}
                        </span>
                      </div>
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            className="flex-1 bg-success text-success-foreground py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition mt-3"
                        >
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
                  <div className="text-center py-10 text-muted-foreground">
                    <TrendingUp className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No withdrawals yet</p>
                  </div>
                ) : (
                  withdrawals.map((w: any) => (
                    <div key={w.id} className="border-2 border-border rounded-xl p-4 hover:border-accent/50 hover:bg-accent/5 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">₦{w.amount?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{w.bankName} - {w.accountNumber}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 flex items-center gap-1 whitespace-nowrap ${
                          w.status === 'APPROVED' ? 'bg-success/10 text-success' :
                          w.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {w.status === 'APPROVED' && <CheckCircle2 className="size-3" />}
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
