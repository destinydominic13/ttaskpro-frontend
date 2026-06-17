'use client';
import { useState, useEffect, useMemo } from 'react';
import API from '../lib/api';
import { logout } from '../lib/auth';
import Link from 'next/link';
import {
  Search,
  LogOut,
  Wallet,
  UserRound,
  Star,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Clock,
  CreditCard,
  Headphones,
  ArrowRight,
  Hammer,
  Wrench,
  Paintbrush,
  Plug,
  Scissors,
  Truck,
  Laptop,
  Leaf,
  X,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Plumbing', icon: Wrench },
  { name: 'Electrical', icon: Plug },
  { name: 'Cleaning', icon: Sparkles },
  { name: 'Carpentry', icon: Hammer },
  { name: 'Painting', icon: Paintbrush },
  { name: 'Beauty', icon: Scissors },
  { name: 'Moving', icon: Truck },
  { name: 'Tech', icon: Laptop },
  { name: 'Gardening', icon: Leaf },
];

const STEPS = [
  { title: 'Find a pro', desc: 'Search verified providers by category or name.', icon: Search },
  { title: 'Book instantly', desc: 'Request a booking in a couple of taps.', icon: CalendarCheck },
  { title: 'Get it done', desc: 'Track progress and pay securely from your wallet.', icon: CheckCircle2 },
];

const PERKS = [
  { title: 'Verified providers', desc: 'Every pro is vetted before they can take bookings.', icon: ShieldCheck },
  { title: 'Secure wallet', desc: 'Pay and transfer safely from your TTaskPro balance.', icon: CreditCard },
  { title: 'Fast turnaround', desc: 'Most requests are confirmed within minutes.', icon: Clock },
  { title: '24/7 support', desc: 'Our team is always a message away.', icon: Headphones },
];

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, providersRes] = await Promise.allSettled([
        API.get('/user/profile'),
        API.get('/provider'),
      ]);
      if (profileRes.status === 'fulfilled') setUser(profileRes.value.data);
      if (providersRes.status === 'fulfilled') {
        const data = providersRes.value.data;
        setProviders(Array.isArray(data) ? data : data?.providers ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBook = async (provider: any) => {
    setBookingId(provider.id);
    try {
      await API.post('/booking', { providerId: provider.id });
      showToast('success', `Booking requested with ${provider.fullName || provider.username}.`);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Could not create booking.');
    } finally {
      setBookingId(null);
    }
  };

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' ||
        (p.category || '').toLowerCase() === activeCategory.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (p.fullName || '').toLowerCase().includes(q) ||
        (p.username || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [providers, activeCategory, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg ${
              toast.type === 'success'
                ? 'bg-success/10 border-success/20 text-success'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="size-5 shrink-0" />
            ) : (
              <AlertTriangle className="size-5 shrink-0" />
            )}
            <p className="text-sm font-medium text-foreground">{toast.msg}</p>
            <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="text-2xl font-black">TTaskPro</div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors"
          >
            <UserRound className="size-4" />
            <span className="hidden sm:inline">My Profile</span>
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 pb-16 pt-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-xl">
              <p className="text-primary-foreground/70 text-sm">Welcome back,</p>
              <h1 className="text-4xl font-black tracking-tight text-balance">
                {user?.fullName?.split(' ')[0] || 'there'}
              </h1>
              <p className="mt-3 text-pretty leading-relaxed text-primary-foreground/80">
                Find trusted professionals for any task and book them in seconds.
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-2xl p-5 min-w-56">
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
                <Wallet className="size-4" />
                Wallet Balance
              </div>
              <p className="text-3xl font-black">{'\u20A6'}{user?.balance?.toLocaleString() ?? 0}</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-card rounded-2xl p-2 flex items-center gap-2 shadow-lg max-w-2xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="size-5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search providers by name, username or category..."
                className="w-full bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors">
              Search
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">Browse by category</h2>
              <p className="text-muted-foreground text-sm">Pick a service to get started.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('All')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeCategory === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="size-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Providers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">
              {activeCategory === 'All' ? 'Available providers' : `${activeCategory} providers`}
              <span className="text-muted-foreground font-semibold text-base ml-2">
                ({filtered.length})
              </span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="size-14 mx-auto rounded-2xl bg-secondary flex items-center justify-center text-primary mb-4">
                <UserRound className="size-7" />
              </div>
              <p className="font-semibold text-card-foreground">No providers found</p>
              <p className="text-muted-foreground text-sm mt-1">
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-xl font-black shrink-0">
                      {(p.fullName || p.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-card-foreground truncate">
                        {p.fullName || p.username}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">@{p.username}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {p.category && (
                      <span className="inline-flex items-center gap-1.5 bg-secondary text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        <Wrench className="size-3.5" />
                        {p.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-warning text-xs font-semibold">
                      <Star className="size-3.5 fill-warning" />
                      {typeof p.rating === 'number' ? p.rating.toFixed(1) : '4.8'}
                    </span>
                    {p.location && (
                      <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin className="size-3.5" />
                        {p.location}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">
                    {p.bio || 'Experienced professional ready to help with your next task.'}
                  </p>

                  <button
                    onClick={() => handleBook(p)}
                    disabled={bookingId === p.id}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60"
                  >
                    {bookingId === p.id ? 'Booking...' : (
                      <>
                        <CalendarCheck className="size-4" />
                        Book Now
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-black text-foreground mb-6 text-center">How TTaskPro works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="bg-card border border-border rounded-2xl p-6 relative">
                  <span className="absolute top-6 right-6 text-5xl font-black text-secondary">
                    {i + 1}
                  </span>
                  <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-bold text-card-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Perks */}
        <section>
          <h2 className="text-2xl font-black text-foreground mb-6">Why people choose us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="bg-card border border-border rounded-2xl p-6">
                  <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-bold text-card-foreground mb-1">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary rounded-3xl p-10 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-primary-foreground/10 rounded-full -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-lg">
              <h2 className="text-3xl font-black text-balance">Want to keep track of your bookings?</h2>
              <p className="mt-2 text-primary-foreground/80 leading-relaxed">
                View your bookings, transactions and transfer funds from your profile dashboard.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-lg font-black text-foreground">TTaskPro</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TTaskPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
