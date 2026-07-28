"use client";
import { useState, useEffect } from "react";
import API from "../lib/api";
import { logout } from "../lib/auth";
import Link from "next/link";
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
} from "lucide-react";

// ============ REVIEW FORM COMPONENT ============
function ReviewForm({
  bookingId,
  providerId,
  providerName,
  username,
  onReviewed,
}: {
  bookingId: string;
  providerId: string;
  providerName: string;
  username: string;
  onReviewed: (review: any) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedReview, setSubmittedReview] = useState<any>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post(`/provider/${providerId}/review`, {
        reviewerName: username,
        rating,
        comment,
      });
      const review = {
        reviewerName: username,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      setSubmittedReview(review);
      onReviewed(review);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  // Show review card after submission
  if (submittedReview) {
    return (
      <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm font-semibold text-foreground mb-3">
          ✅ Your Review
        </p>
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= submittedReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(submittedReview.createdAt).toLocaleDateString()}
            </span>
          </div>
          {submittedReview.comment && (
            <p className="text-sm text-foreground leading-relaxed">
              {submittedReview.comment}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show review form
  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-sm font-semibold text-foreground mb-3">
        Rate your experience with {providerName}
      </p>

      {error && <p className="text-xs text-destructive mb-2">{error}</p>}

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <svg
              className={`w-7 h-7 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-2 self-center">
          {rating > 0
            ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]
            : "Select rating"}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        rows={3}
        className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-background resize-none mb-3"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

// ============ MAIN PROFILE PAGE ============
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<Record<string, any>>({});
  const [transferForm, setTransferForm] = useState({
    providerUsername: "",
    amount: "",
  });
  const [transferMsg, setTransferMsg] = useState("");
  const [transferError, setTransferError] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileRes, bookingsRes, transactionsRes] = await Promise.all([
        API.get("/user/profile"),
        API.get("/user/bookings"),
        API.get("/user/transactions"),
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
    setTransferMsg("");
    setTransferError("");
    try {
      const res = await API.post("/user/transfer", {
        providerUsername: transferForm.providerUsername,
        amount: parseFloat(transferForm.amount),
      });
      setTransferMsg(res.data.message);
      setTransferForm({ providerUsername: "", amount: "" });
      fetchProfile();
    } catch (err: any) {
      setTransferError(err.response?.data?.message || "Transfer failed");
    }
  };

  const handleFundAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/fund-account", {
        amount: parseFloat(fundAmount),
      });
      window.location.href = res.data.authorizationUrl;
    } catch (err: any) {
      setTransferError(err.response?.data?.message || "Funding failed");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

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
          <Link
            href="/"
            className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition"
          >
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
              <p className="text-4xl font-black mt-2">
                ₦{user?.balance?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Fund Account Modal */}
        {showFundModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Fund Your Account
              </h3>
              <form onSubmit={handleFundAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Amount (₦)
                  </label>
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
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 flex-shrink-0" />
                {transferMsg}
              </div>
            )}
            {transferError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
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
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      providerUsername: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      amount: e.target.value,
                    })
                  }
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
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === "bookings"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <BookMarked className="size-4" />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === "transactions"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <CreditCard className="size-4" />
                Transactions ({transactions.length})
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <div className="space-y-3">
                  {bookings.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <BookMarked className="size-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No bookings yet</p>
                      <Link
                        href="/"
                        className="text-primary font-semibold hover:underline text-sm"
                      >
                        Browse Providers
                      </Link>
                    </div>
                  ) : (
                    paginatedBookings.map((booking: any) => (
                      <div
                        key={booking.id}
                        className="border-2 border-border rounded-xl p-4 hover:border-primary/50 hover:bg-muted/30 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {booking.provider?.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.provider?.category}
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 flex items-center gap-1 ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-100 text-green-600"
                                : booking.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-600"
                                : booking.status === "CANCELLED"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {booking.status === "COMPLETED" && (
                              <CheckCircle2 className="size-3" />
                            )}
                            {booking.status === "CONFIRMED" && (
                              <Clock className="size-3" />
                            )}
                            {booking.status === "CANCELLED" && (
                              <XCircle className="size-3" />
                            )}
                            {booking.status}
                          </span>
                        </div>

                        {/* Show review form or submitted review */}
                        {booking.status === "COMPLETED" && (
                          reviewedBookingIds[booking.id] ? (
                            <div className="mt-4 border-t border-border pt-4">
                              <p className="text-sm font-semibold text-foreground mb-3">
                                ✅ Your Review
                              </p>
                              <div className="bg-muted/30 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= reviewedBookingIds[booking.id].rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-200 text-gray-200"
                                        }`}
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reviewedBookingIds[booking.id].createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {reviewedBookingIds[booking.id].comment && (
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {reviewedBookingIds[booking.id].comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <ReviewForm
                              key={booking.id}
                              bookingId={booking.id}
                              providerId={booking.providerId}
                              providerName={booking.provider?.fullName}
                              username={user?.username}
                              onReviewed={(review) =>
                                setReviewedBookingIds((prev) => ({
                                  ...prev,
                                  [booking.id]: review,
                                }))
                              }
                            />
                          )
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 border-border hover:border-primary transition disabled:opacity-40"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "border-2 border-border hover:border-primary"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 border-border hover:border-primary transition disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CreditCard className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="border-2 border-border rounded-xl p-4 hover:border-destructive/30 hover:bg-destructive/5 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {tx.note}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-destructive font-bold ml-4">
                          -₦{tx.amount?.toLocaleString()}
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