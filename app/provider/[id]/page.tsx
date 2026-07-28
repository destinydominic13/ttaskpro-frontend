'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import API from '../../lib/api';
import Link from 'next/link';

export default function ProviderReviewsPage() {
  const params = useParams();
  const providerId = params.id as string;
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      const [providerRes, reviewsRes] = await Promise.all([
        API.get(`/provider/${providerId}`),
        API.get(`/provider/${providerId}/reviews`),
      ]);
      setProvider(providerRes.data);
      setReviews(reviewsRes.data.reviews);
      setAvgRating(reviewsRes.data.avgRating);
      setTotalReviews(reviewsRes.data.totalReviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">Provider not found</p>
          <Link href="/" className="text-primary hover:underline text-sm mt-2 block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="text-2xl font-black">TTaskPro</div>
        <Link
          href="/"
          className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-semibold transition"
        >
          ← Back to Home
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Provider Profile Card */}
        <div className="bg-primary rounded-3xl p-8 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
  {provider.profileImage ? (
    <img
      src={provider.profileImage}
      alt={provider.fullName}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-white flex items-center justify-center text-primary text-4xl font-black">
      {provider.fullName?.charAt(0)}
    </div>
  )}
</div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black">{provider.fullName}</h1>
              <p className="text-primary-foreground/80">@{provider.username}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                  {provider.category}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                  {provider.experience} experience
                </span>
              </div>
              {provider.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {provider.skills.map((skill: string) => (
                    <span key={skill} className="bg-white/10 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Summary */}
            <div className="bg-white/15 rounded-2xl p-5 text-center min-w-[120px]">
              <p className="text-4xl font-black">
                {avgRating > 0 ? avgRating : '—'}
              </p>
              <div className="flex justify-center gap-0.5 my-2">
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
              </div>
              <p className="text-xs text-primary-foreground/80">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-card rounded-2xl shadow-md border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Customer Reviews ({totalReviews})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">⭐</div>
              <p className="font-medium text-lg">No reviews yet</p>
              <p className="text-sm mt-1">
                Be the first to book and review this provider!
              </p>
              <Link
                href="/register"
                className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
            {reviews
            .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
            .map((review: any) => (
                <div
                  key={review.id}
                  className="border-2 border-border rounded-xl p-5 hover:border-primary/40 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Reviewer Avatar */}
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {review.reviewerName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.reviewerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {/* Star Rating */}
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
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>         
          )}
          {/* Pagination */}
{Math.ceil(reviews.length / reviewsPerPage) > 1 && (
  <div className="flex items-center justify-center gap-2 mt-6">
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 border-border hover:border-primary transition disabled:opacity-40"
    >
      ←
    </button>
    {Array.from(
      { length: Math.ceil(reviews.length / reviewsPerPage) },
      (_, i) => i + 1
    ).map((page) => (
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
    ))}
    <button
      onClick={() =>
        setCurrentPage((p) =>
          Math.min(Math.ceil(reviews.length / reviewsPerPage), p + 1)
        )
      }
      disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
      className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 border-border hover:border-primary transition disabled:opacity-40"
    >
      →
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
}