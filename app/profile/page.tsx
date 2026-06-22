'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { getUser, logout } from '../lib/auth';
import Link from 'next/link';
import {
  LogOut,
  Wallet,
  Send,
  BookMarked,
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transferForm, setTransferForm] = useState({ providerUsername: '', amount: '' });
  const [transferMsg, setTransferMsg] = useState('');
  const [transferError, setTransferError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileRes, bookingsRes, transactionsRes] = await Promise.all([
        API.get('/user/profile'),
        API.get('/user/bookings'),
        API.get('/user/transactions'),
      ]);
      setUser(profileRes.data);
      setBookings(bookingsRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferMsg('');
    setTransferError('');
    try {
      const res = await API.post('/user/transfer', {
        providerUsername: transferForm.providerUsername,
        amount: parseFloat(transferForm.amount),
      });
      setTransferMsg(res.data.message);
      setTransferForm({ providerUsername: '', amount: '' });
      fetchProfile();
    } catch (err: any) {
      setTransferError(err.response?.data?.message || 'Transfer failed');
    }
  };

  const handleFundAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/user/fund-account', {
        amount: parseFloat(fundAmount),
      });
      setTransferMsg(`Successfully funded with ₦${fundAmount}`);
      setFundAmount('');
      setShowFundModal(false);
      fetchProfile();
    } catch (err: any) {
      setTransferError(err.response?.data?.message || 'Funding failed');
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
      <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="text-2xl font-black">TTaskPro</div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition flex items-center gap-1">
            Browse Providers
          </Link>
          <button
            onClick={() => setShowFundModal(true)}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="size-4" />
            Fund Account
          </button>
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
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-4xl font-black ring-4 ring-accent/30">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black">{user?.fullName}</h1>
              <p className="text-primary-foreground/80">@{user?.username}</p>
              <p className="text-primary-foreground/70 text-sm">{user?.email}</p>
            </div>
            <div className="md:ml-auto bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-6 text-center">
              <p className="text-primary-foreground/80 text-sm flex items-center gap-2 justify-center">
                <Wallet className="size-4" />
                Account Balance
              </p>
              <p className="text-4xl font-black mt-2">₦{user?.balance?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Fund Account Modal */}
        {showFundModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Fund Your Account</h3>
              <form onSubmit={handleFundAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Amount (₦)</label>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    required
                    min="100"
                    placeholder="Enter amount"
                    className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFundModal(false)}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-xl font-semibold hover:opacity-80 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-semibold hover:bg-primary/90 transition"
                  >
                    Fund Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Funds */}
          <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <Send className="size-5" />
              Transfer Funds
            </h2>

            {transferMsg && (
              <div className="bg-success/10 border border-success text-success p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 flex-shrink-0" />
                {transferMsg}
              </div>
            )}
            {transferError && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <AlertCircle className="size-4 flex-shrink-0" />
                {transferError}
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Provider Username
                </label>
                <input
                  type="text"
                  value={transferForm.providerUsername}
                  onChange={(e) => setTransferForm({ ...transferForm, providerUsername: e.target.value })}
                  required
                  className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors bg-card"
                  placeholder="Enter provider username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  required
                  min="1"
                  className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors bg-card"
                  placeholder="Enter amount"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                Transfer Funds
              </button>
            </form>
          </div>

          {/* Bookings & Transactions */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-md p-6 border border-border">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <BookMarked className="size-4" />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === 'transactions'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <CreditCard className="size-4" />
                Transactions ({transactions.length})
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <BookMarked className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No bookings yet</p>
                    <Link href="/" className="text-primary font-semibold hover:underline text-sm">
                      Browse Providers
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="border-2 border-border rounded-xl p-4 hover:border-primary/50 hover:bg-muted/30 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{booking.provider?.fullName}</p>
                          <p className="text-sm text-muted-foreground">{booking.provider?.category}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 flex items-center gap-1 ${
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
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CreditCard className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx: any) => (
                    <div key={tx.id} className="border-2 border-border rounded-xl p-4 hover:border-destructive/30 hover:bg-destructive/5 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{tx.note}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-destructive font-bold ml-4">-₦{tx.amount?.toLocaleString()}</span>
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
