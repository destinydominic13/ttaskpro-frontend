'use client';
import { useState, useEffect } from 'react';
import API from './lib/api';
import { getUser, logout } from './lib/auth';
import Link from 'next/link';

export default function LandingHomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUser(getUser());
      fetchProviders();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await API.get('/provider/all');
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = providers.filter((p: any) => {
    const matchSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? p.category === category : true;
    return matchSearch && matchCategory;
  });

  // ============ LOGGED IN VIEW ============
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-[#0d2d6e] text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="text-2xl font-black">TTaskPro</div>
          <div className="flex items-center gap-4">
            <span className="text-blue-200 text-sm hidden md:block">
              Welcome, {user?.username}
            </span>
            <Link
              href="/profile"
              className="bg-white text-[#0d2d6e] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              My Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-[#0d2d6e] text-white py-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Find Your Perfect Service Provider
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Browse trusted professionals for every chore around your home
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl text-gray-800 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Painting">Painting</option>
              <option value="Gardening">Gardening</option>
              <option value="Cooking">Cooking</option>
              <option value="Laundry">Laundry</option>
              <option value="Moving">Moving</option>
            </select>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-[#0d2d6e] mb-6">
            {filtered.length} Service Providers Available
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d2d6e]"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl">No providers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((provider: any) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="bg-[#0d2d6e] p-6 text-white">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0d2d6e] text-2xl font-black mx-auto mb-3">
                      {provider.fullName.charAt(0)}
                    </div>
                    <h3 className="text-lg font-bold text-center">{provider.fullName}</h3>
                    <p className="text-blue-200 text-sm text-center">@{provider.username}</p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-[#0d2d6e] px-3 py-1 rounded-full text-xs font-semibold">
                        {provider.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {provider.experience} exp
                      </span>
                    </div>

                    {provider.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {provider.skills.slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ LOGGED OUT VIEW (Marketing Landing Page) ============
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-black text-[#0d2d6e]">TTaskPro</div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#0d2d6e] font-semibold hover:underline text-sm">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#0d2d6e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a2458] transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-100 text-[#0d2d6e] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              👋 Welcome to TTaskPro
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0d2d6e] leading-tight mb-6">
              Find Trusted Help for Every Chore
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Connect with verified service providers for cleaning, plumbing, electrical
              work, and more — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="bg-[#0d2d6e] text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-[#0a2458] transition shadow-lg"
              >
                Find a Service Provider
              </Link>
              <Link
                href="/provider-register"
                className="border-2 border-[#0d2d6e] text-[#0d2d6e] px-8 py-4 rounded-xl font-semibold text-center hover:bg-blue-50 transition"
              >
                Become a Provider
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#0d2d6e] rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
              <div className="relative z-10 space-y-4">
                {[
                  { icon: '🔧', label: 'Plumbing', count: '120+ pros' },
                  { icon: '🧹', label: 'Cleaning', count: '200+ pros' },
                  { icon: '⚡', label: 'Electrical', count: '95+ pros' },
                  { icon: '🌿', label: 'Gardening', count: '80+ pros' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg"
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <p className="font-bold text-[#0d2d6e]">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0d2d6e] mb-3">
              How It Works
            </h2>
            <p className="text-gray-500">Get help in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse Providers', desc: 'Search and filter trusted service providers by category and skill', icon: '🔍' },
              { step: '02', title: 'Book a Service', desc: 'Choose a provider that fits your needs and book instantly', icon: '📅' },
              { step: '03', title: 'Get It Done', desc: 'Your task gets completed by a verified professional', icon: '✅' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-blue-300 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-[#0d2d6e] mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-[#0d2d6e] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-200 mb-8 text-lg">
              Join thousands of users finding trusted help every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#0d2d6e] px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Sign Up as User
              </Link>
              <Link
                href="/provider-register"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#0d2d6e] transition"
              >
                Sign Up as Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-black text-[#0d2d6e]">TTaskPro</div>
          <p className="text-gray-400 text-sm">© 2026 TTaskPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}