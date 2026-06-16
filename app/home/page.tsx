'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { getUser, logout } from '../lib/auth';
import Link from 'next/link';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d2d6e]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0d2d6e] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="text-2xl font-black">TTaskPro</div>
        <div className="flex items-center gap-4">
          <Link href="/home" className="text-blue-200 hover:text-white text-sm transition">
            Browse Providers
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-[#0d2d6e] rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#0d2d6e] text-4xl font-black">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black">{user?.fullName}</h1>
              <p className="text-blue-200">@{user?.username}</p>
              <p className="text-blue-200 text-sm">{user?.email}</p>
            </div>
            <div className="md:ml-auto bg-white bg-opacity-20 rounded-2xl p-6 text-center">
              <p className="text-blue-200 text-sm">Account Balance</p>
              <p className="text-4xl font-black">₦{user?.balance?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Funds */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#0d2d6e] mb-6">Transfer Funds</h2>

            {transferMsg && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-sm">
                ✅ {transferMsg}
              </div>
            )}
            {transferError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                ⚠️ {transferError}
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Provider Username
                </label>
                <input
                  type="text"
                  value={transferForm.providerUsername}
                  onChange={(e) => setTransferForm({ ...transferForm, providerUsername: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Enter provider username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  required
                  min="1"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Enter amount"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0d2d6e] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2458] transition"
              >
                Transfer Funds
              </button>
            </form>
          </div>

          {/* Bookings & Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  activeTab === 'bookings'
                    ? 'bg-[#0d2d6e] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  activeTab === 'transactions'
                    ? 'bg-[#0d2d6e] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Transactions ({transactions.length})
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No bookings yet</p>
                    <Link href="/home" className="text-[#0d2d6e] font-semibold hover:underline text-sm">
                      Browse Providers
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#0d2d6e] transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{booking.provider?.fullName}</p>
                          <p className="text-sm text-gray-500">{booking.provider?.category}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                          booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
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
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-4xl mb-2">💳</div>
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx: any) => (
                    <div key={tx.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#0d2d6e] transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{tx.note}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-red-500 font-bold">-₦{tx.amount?.toLocaleString()}</span>
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