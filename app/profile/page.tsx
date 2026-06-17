'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { getUser, logout } from '../lib/auth';
import Link from 'next/link';
import {
  Wallet,
  Send,
  ClipboardList,
  CreditCard,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  ArrowDownRight,
  Mail,
  AtSign,
  Receipt,
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

  const statusStyles = (status: string) =>
    status === 'CONFIRMED'
      ? 'bg-success/10 text-success'
      : status === 'COMPLETED'
        ? 'bg-secondary text-primary'
        : status === 'CANCELLED'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-accent/10 text-warning';

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
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors"
          >
            <Search className="size-4" />
            Browse Providers
          </Link>
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
              {user?.fullName?.charAt(0)}
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl font-black">{user?.fullName}</h1>
              <p className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/70">
                <AtSign className="size-4" />
                {user?.username}
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/70 text-sm">
                <Mail className="size-4" />
                {user?.email}
              </p>
            </div>
            <div className="md:ml-auto bg-primary-foreground/10 rounded-2xl p-6 text-center min-w-52">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/70 text-sm mb-1">
                <Wallet className="size-4" />
                Account Balance
              </div>
              <p className="text-4xl font-black">₦{user?.balance?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Wallet Balance', value: `₦${user?.balance?.toLocaleString() ?? 0}`, icon: Wallet },
            { label: 'Total Bookings', value: bookings.length, icon: ClipboardList },
            { label: 'Transactions', value: transactions.length, icon: Receipt },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-card border border-border rounded-2xl shadow-sm p-5 flex items-center gap-4"
              >
                <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Icon className="size-6" />
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
          {/* Transfer Funds */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-9 rounded-lg bg-secondary flex items-center justify-center text-primary">
                <Send className="size-5" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">Transfer Funds</h2>
            </div>

            {transferMsg && (
              <div className="flex items-center gap-2 bg-success/10 border border-success/20 text-success p-3 rounded-xl mb-4 text-sm">
                <CheckCircle2 className="size-4 shrink-0" />
                {transferMsg}
              </div>
            )}
            {transferError && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl mb-4 text-sm">
                <AlertTriangle className="size-4 shrink-0" />
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
                  className="w-full border-2 border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:border-primary transition-colors"
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
                  className="w-full border-2 border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter amount"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
              >
                <Send className="size-4" />
                Transfer Funds
              </button>
            </form>
          </div>

          {/* Bookings & Transactions */}
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
                onClick={() => setActiveTab('transactions')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === 'transactions'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
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
                  <div className="text-center py-12 text-muted-foreground">
                    <Inbox className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No bookings yet</p>
                    <Link href="/home" className="text-primary font-semibold hover:underline text-sm">
                      Browse Providers
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="border border-border rounded-xl p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-card-foreground">{booking.provider?.fullName}</p>
                          <p className="text-sm text-muted-foreground">{booking.provider?.category}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles(booking.status)}`}>
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
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="border border-border rounded-xl p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                            <ArrowDownRight className="size-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-card-foreground">{tx.note}</p>
                            <p className="text-xs text-muted-foreground/70">
                              {new Date(tx.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-destructive font-bold">-₦{tx.amount?.toLocaleString()}</span>
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
