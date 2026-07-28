'use client';
import { useState, useEffect } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
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
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
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

      const reviewsRes = await API.get(`/provider/${profileRes.data.id}/reviews`);
      setReviews(reviewsRes.data.reviews);
      setAvgRating(reviewsRes.data.avgRating);
      setTotalReviews(reviewsRes.data.totalReviews);
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
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-accent/30 shadow-lg">
  {profile?.profileImage ? (
    <img
      src={profile.profileImage}
      alt={profile.fullName}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-white flex items-center justify-center text-primary text-4xl font-black">
      {profile?.fullName?.charAt(0)}
    </div>
  )}
</div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-black">{profile?.fullName}</h1>
              <p className="text-primary-foreground/80">@{profile?.username}</p>
              <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-xs font-bold mt-2 shadow-md">
                {profile?.category}
              </span>
              {avgRating > 0 && (
                <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-white/20 text-white/20'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-blue-200 text-xs ml-1">
                    {avgRating} ({totalReviews} reviews)
                  </span>
                </div>
              )}
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
          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
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
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                Withdraw Funds
              </button>
            </form>
          </div>

          {/* Tabs Panel */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-lg p-6 border border-border">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  activeTab === 'withdrawals'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Withdrawals ({withdrawals.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  activeTab === 'reviews'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reviews ({totalReviews})
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
                    <div key={booking.id} className="border-2 border-border rounded-xl p-4 hover:border-primary/50 transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{booking.user?.fullName}</p>
                          <p className="text-sm text-muted-foreground">{booking.user?.phone}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 flex items-center gap-1 whitespace-nowrap ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                          booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
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
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="w-full bg-primary text-white py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition mt-3"
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
                    <div key={w.id} className="border-2 border-border rounded-xl p-4 hover:border-accent/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">₦{w.amount?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{w.bankName} - {w.accountNumber}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 ${
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

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Average Rating Summary */}
                <div className="bg-primary rounded-2xl p-6 text-white text-center mb-6">
                  <p className="text-blue-200 text-sm mb-1">Your Average Rating</p>
                  <p className="text-5xl font-black mb-2">{avgRating > 0 ? avgRating : '—'}</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(avgRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-white/20 text-white/20'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-blue-200 text-sm">
                    {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Individual Reviews */}
                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-4xl mb-2">⭐</div>
                    <p>No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Complete bookings to start receiving reviews
                    </p>
                  </div>
                ) : (
                  reviews.map((review: any) => (
                    <div key={review.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      )}
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