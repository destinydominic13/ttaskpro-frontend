'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
import Link from 'next/link';

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
          <span className="text-blue-200 text-sm hidden md:block">
            Welcome, {profile?.username}
          </span>
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
              {profile?.fullName?.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black">{profile?.fullName}</h1>
              <p className="text-blue-200">@{profile?.username}</p>
              <span className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                {profile?.category}
              </span>
            </div>
            <div className="md:ml-auto bg-white bg-opacity-20 rounded-2xl p-6 text-center">
              <p className="text-blue-200 text-sm">Account Balance</p>
              <p className="text-4xl font-black">₦{profile?.balance?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdraw Funds */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#0d2d6e] mb-2">Withdraw Funds</h2>
            <p className="text-xs text-gray-400 mb-6">A 20% fee applies to all withdrawals</p>

            {withdrawMsg && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-sm">
                ✅ {withdrawMsg}
              </div>
            )}
            {withdrawError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                ⚠️ {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  required
                  min="1"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={withdrawForm.accountName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Account holder name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={withdrawForm.accountNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="10-digit account number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={withdrawForm.bankName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="e.g. First Bank"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0d2d6e] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2458] transition"
              >
                Withdraw Funds
              </button>
            </form>
          </div>

          {/* Bookings & Withdrawals */}
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
                onClick={() => setActiveTab('withdrawals')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  activeTab === 'withdrawals'
                    ? 'bg-[#0d2d6e] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Withdrawals ({withdrawals.length})
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#0d2d6e] transition">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{booking.user?.fullName}</p>
                          <p className="text-sm text-gray-500">{booking.user?.phone}</p>
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
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="w-full bg-blue-500 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-600 transition mt-2"
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
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-4xl mb-2">💰</div>
                    <p>No withdrawals yet</p>
                  </div>
                ) : (
                  withdrawals.map((w: any) => (
                    <div key={w.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#0d2d6e] transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">₦{w.amount?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{w.bankName} - {w.accountNumber}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          w.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                          w.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
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