"use client";
import { useState, useEffect } from "react";
import API from "./lib/api";
import { getUser, logout } from "./lib/auth";
import Link from "next/link";
import {
  Sparkles,
  Wrench,
  Zap,
  PaintRoller,
  Phone,
  Search,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Clock,
  Truck,
  Headphones,
  Star,
  ArrowRight,
  ArrowLeft,
  Share2,
  AtSign,
  Send,
  Globe,
  MapPin,
  Mail,
  Calendar,
} from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Easy Cleaning",
    desc: "Spotless homes handled by vetted, professional cleaners you can trust.",
  },
  {
    icon: Wrench,
    title: "Best Plumbing",
    desc: "Fast, reliable plumbing repairs and installations, done right the first time.",
  },
  {
    icon: Zap,
    title: "Smart Electrical",
    desc: "Licensed electricians for safe wiring, fixtures, and quick fault fixes.",
  },
  {
    icon: PaintRoller,
    title: "Cool Painting",
    desc: "Fresh, flawless finishes from experienced painters for any room.",
  },
];

const whyChoose = [
  {
    icon: ShieldCheck,
    title: "Verified Pros",
    desc: "Every provider is identity-checked and reviewed before taking bookings.",
  },
  {
    icon: Clock,
    title: "Quick Service",
    desc: "Most providers respond within minutes so you are never left waiting.",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    desc: "Funds stay safe in your wallet and release only when the job is done.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Get matched with nearby pros for same-day help when you need it.",
  },
  {
    icon: CalendarCheck,
    title: "Online Booking",
    desc: "Book, reschedule, and track your tasks from a single dashboard.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our team is on hand around the clock to keep every job on track.",
  },
];

const experts = [
  {
    name: "Rosalina D. William",
    role: "Lead Cleaner",
    img: "/images/expert-2.png",
  },
  {
    name: "Gilima B. Bumbled",
    role: "Master Plumber",
    img: "/images/expert-1.png",
  },
  {
    name: "Humble H. Hiliam",
    role: "Electrician",
    img: "/images/expert-3.png",
  },
];

const portfolio = [
  "/images/work-1.png",
  "/images/work-2.png",
  "/images/work-3.png",
  "/images/work-4.png",
  "/images/appointment.png",
  "/images/news-2.png",
];

const news = [
  {
    img: "/images/news-1.png",
    date: "23rd Mar 2026",
    title: "Five simple habits that keep your home spotless all week long.",
  },
  {
    img: "/images/news-2.png",
    date: "21st Mar 2026",
    title: "How to choose the right service provider for any home project.",
  },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const leadingBlanks = [null, null, null]; // March starts on a Wednesday-ish offset for visual match

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const handleBooking = async () => {
    setBookingMsg("");
    setBookingError("");
    setBookingLoading(true);
    try {
      await API.post("/booking", { providerId: selectedProviderId });
      setBookingMsg("Appointment booked! The provider will confirm it on their dashboard.");
      setSelectedProviderId("");
    } catch (err: any) {
      setBookingError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
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
      const res = await API.get("/provider/all");
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
  // if (isLoggedIn) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       {/* Navbar */}
  //       <nav className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg">
  //         <div className="text-2xl font-black">
  //           TTaskPro<span className="text-accent">.</span>
  //         </div>
  //         <div className="flex items-center gap-4">
  //           <span className="text-primary-foreground/70 text-sm hidden md:block">
  //             Welcome, {user?.username}
  //           </span>
  //           <Link
  //             href="/profile"
  //             className="bg-card text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
  //           >
  //             My Profile
  //           </Link>
  //           <button
  //             onClick={logout}
  //             className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
  //           >
  //             Logout
  //           </button>
  //         </div>
  //       </nav>

  //       {/* Hero */}
  //       <div className="bg-primary text-primary-foreground py-16 px-6 text-center">
  //         <h1 className="text-4xl md:text-5xl font-black mb-4 text-balance">
  //           Find Your Perfect Service Provider
  //         </h1>
  //         <p className="text-primary-foreground/70 text-lg mb-8">
  //           Browse trusted professionals for every chore around your home
  //         </p>

  //         {/* Search */}
  //         <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
  //           <div className="flex-1 relative">
  //             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
  //             <input
  //               type="text"
  //               placeholder="Search by name or category..."
  //               value={search}
  //               onChange={(e) => setSearch(e.target.value)}
  //               className="w-full pl-11 pr-4 py-3 rounded-xl text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-accent"
  //             />
  //           </div>
  //           <select
  //             value={category}
  //             onChange={(e) => setCategory(e.target.value)}
  //             className="px-4 py-3 rounded-xl text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-accent"
  //           >
  //             <option value="">All Categories</option>
  //             <option value="Cleaning">Cleaning</option>
  //             <option value="Plumbing">Plumbing</option>
  //             <option value="Electrical">Electrical</option>
  //             <option value="Carpentry">Carpentry</option>
  //             <option value="Painting">Painting</option>
  //             <option value="Gardening">Gardening</option>
  //             <option value="Cooking">Cooking</option>
  //             <option value="Laundry">Laundry</option>
  //             <option value="Moving">Moving</option>
  //           </select>
  //         </div>
  //       </div>

  //       {/* Providers Grid */}
  //       <div className="max-w-6xl mx-auto px-6 py-12">
  //         <h2 className="text-2xl font-bold text-primary mb-6">
  //           {filtered.length} Service Providers Available
  //         </h2>

  //         {loading ? (
  //           <div className="flex justify-center items-center py-20">
  //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  //           </div>
  //         ) : filtered.length === 0 ? (
  //           <div className="text-center py-20 text-muted-foreground">
  //             <Search className="size-12 mx-auto mb-4" />
  //             <p className="text-xl">No providers found</p>
  //           </div>
  //         ) : (
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {filtered.map((provider: any) => (
  //               <div
  //                 key={provider.id}
  //                 className="bg-card rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-border"
  //               >
  //                 <div className="bg-primary p-6 text-primary-foreground">
  //                   <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center text-primary text-2xl font-black mx-auto mb-3">
  //                     {provider.fullName.charAt(0)}
  //                   </div>
  //                   <h3 className="text-lg font-bold text-center">
  //                     {provider.fullName}
  //                   </h3>
  //                   <p className="text-primary-foreground/70 text-sm text-center">
  //                     @{provider.username}
  //                   </p>
  //                 </div>

  //                 <div className="p-6 space-y-3">
  //                   <div className="flex items-center justify-between">
  //                     <span className="bg-secondary text-primary px-3 py-1 rounded-full text-xs font-semibold">
  //                       {provider.category}
  //                     </span>
  //                     <span className="text-muted-foreground text-sm">
  //                       {provider.experience} exp
  //                     </span>
  //                   </div>

  //                   {provider.skills?.length > 0 && (
  //                     <div className="flex flex-wrap gap-1">
  //                       {provider.skills.slice(0, 3).map((skill: string) => (
  //                         <span
  //                           key={skill}
  //                           className="bg-secondary text-muted-foreground px-2 py-1 rounded text-xs"
  //                         >
  //                           {skill}
  //                         </span>
  //                       ))}
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // ============ LOGGED OUT VIEW (Marketing Landing Page) ============
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur">
        <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-black text-primary">
            TTaskPro<span className="text-accent">.</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#home" className="hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-primary transition-colors">
              About
            </a>
            <a
              href="#services"
              className="hover:text-primary transition-colors"
            >
              Services
            </a>
            <a href="#booking" className="hover:text-primary transition-colors">
              Booking
            </a>
            <a href="#experts" className="hover:text-primary transition-colors">
              Experts
            </a>
            <a href="#news" className="hover:text-primary transition-colors">
              News
            </a>
          </div>
          <div className="flex items-center gap-4">
          {isLoggedIn ? (
  <>
    <span className="text-muted-foreground text-sm font-semibold hidden sm:block">
      Welcome, {user?.username}
    </span>
    <Link
      href="/profile"
      className="text-primary font-semibold hover:underline text-sm"
    >
      My Profile
    </Link>
    <button
      onClick={logout}
      className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link
      href="/login"
      className="text-primary font-semibold hover:underline text-sm"
    >
      Login
    </Link>
    <Link
      href="/register"
      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-hover transition-colors"
      >
          Get Started
    </Link>
      </>
  )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="relative min-h-[560px] md:min-h-[640px] overflow-hidden">
          <img
            src="/images/hero.png"
            alt="A team of friendly professional service providers in uniform"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />

          {/* Call badge */}
          <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-3 bg-accent text-accent-foreground px-5 py-3 rounded-full shadow-lg">
            <Phone className="size-5" />
            <span className="font-bold">Make A Call Now</span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="py-20 md:py-28 max-w-xl">
              <span className="inline-flex items-center gap-2 text-accent font-bold tracking-wide uppercase text-sm mb-4">
                <span className="h-px w-8 bg-accent" />
                Get The Right Help
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-primary leading-tight mb-6 text-balance">
                Trusted Home &amp; Task Services Here
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                Connect with verified professionals for cleaning, plumbing,
                electrical work and more — booked and paid for safely in one
                place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              {!isLoggedIn && (
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                  Get Started
                  <ArrowRight className="size-5" />
                </Link>
                )}
                <a
                  href="#services"
                  className="inline-flex items-center justify-center bg-accent text-accent-foreground px-7 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service icon row */}
      <section id="services" className="px-6 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {/* dashed connector */}
          <div className="hidden lg:block absolute top-9 left-[12%] right-[12%] border-t-2 border-dashed border-accent/50" />
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="relative text-center flex flex-col items-center"
              >
                <div className="size-20 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center text-primary mb-5 relative z-10">
                  <Icon className="size-9" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[15rem]">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Appointment */}
      <section className="px-6 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img
              src="/images/appointment.png"
              alt="Two service professionals reviewing a booking on a tablet"
              className="rounded-3xl w-full object-cover aspect-[4/3] shadow-sm"
            />
            <div className="absolute -bottom-6 left-6 right-6 sm:left-10 sm:right-auto bg-accent text-accent-foreground rounded-2xl px-6 py-4 shadow-lg flex items-center gap-4">
              <div className="size-11 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  Make A Call
                </p>
                <p className="text-lg font-black">+876 (87) 656 656</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-accent font-bold uppercase tracking-wide text-sm">
              24/7 We Are Here
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary mt-2 mb-6 text-balance">
              Make An Appointment
            </h2>
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <Calendar className="size-5" />
                  24th March 2026
                </div>
                <div className="flex items-center gap-3">
                  <ArrowLeft className="size-4 opacity-80" />
                  <ArrowRight className="size-4 opacity-80" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {leadingBlanks.map((_, i) => (
                    <div key={`blank-${i}`} />
                  ))}
                  {calendarDays.map((day) => (
                    <div
                      key={day}
                      className={`py-2 rounded-lg ${
                        day === 24
                          ? "bg-accent text-accent-foreground font-bold"
                          : "text-card-foreground hover:bg-secondary"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative px-6 py-20 md:py-28 mt-6">
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <img
            src="/images/about.png"
            alt="A confident professional service provider in uniform"
            className="rounded-3xl w-full object-cover aspect-[4/5] max-h-[560px] shadow-sm"
          />
          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm">
            <span className="text-accent font-bold uppercase tracking-wide text-sm">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary mt-2 mb-5 text-balance">
              We Offer The Best Home Services
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              TTaskPro connects you with trusted, background-checked
              professionals for every task around your home and business. From a
              quick fix to a full project, the right pro is only a few taps
              away.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every booking is protected with secure payments and transparent
              reviews, so you can hire with total peace of mind.
            </p>
            <div className="flex items-center gap-4 border-t border-border pt-6">
              <img
                src="/images/expert-2.png"
                alt="Rosalina D. William, Founder"
                className="size-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-card-foreground">
                  Rosalina D. William
                </p>
                <p className="text-sm text-muted-foreground">Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="px-6 py-20 md:py-24 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-accent font-bold uppercase tracking-wide text-sm">
            Booking
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-primary mt-2 text-balance">
            Complete Your Booking
          </h2>
        </div>
        <div className="bg-card border border-border rounded-3xl shadow-sm p-6 md:p-10">
          <p className="text-center font-bold text-primary mb-6">
            Service Information
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {["1 Task", "2 Tasks", "3 Tasks", "4 Tasks", "Custom"].map(
              (opt, i) => (
                <span
                  key={opt}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border ${
                    i === 1
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {opt}
                </span>
              )
            )}
          </div>
          {isLoggedIn ? (
  <>
    {bookingMsg && (
      <div className="mb-4 rounded-xl bg-secondary text-primary px-4 py-3 text-sm font-semibold text-center">
        {bookingMsg}
      </div>
    )}
    {bookingError && (
      <div className="mb-4 rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm font-semibold text-center">
        {bookingError}
      </div>
    )}
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <select
        value={selectedProviderId}
        onChange={(e) => setSelectedProviderId(e.target.value)}
        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:col-span-2"
      >
        <option value="">Select a Service Provider</option>
        {providers.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.fullName} — {p.category}
          </option>
        ))}
      </select>
    </div>
    <div className="flex justify-center pt-2">
      <button
        onClick={handleBooking}
        disabled={!selectedProviderId || bookingLoading}
        className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {bookingLoading ? "Booking..." : "Get An Appointment"}
        <ArrowRight className="size-5" />
      </button>
    </div>
  </>
) : (
  <div className="flex justify-center pt-2">
    <Link
      href="/register"
      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
    >
      Get An Appointment
      <ArrowRight className="size-5" />
    </Link>
  </div>
)}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary/60 px-6 py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-accent font-bold uppercase tracking-wide text-sm">
              Benefits of working with us
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary mt-2 text-balance">
              Why Choose Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {whyChoose.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex gap-4">
                  <div className="size-12 shrink-0 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="px-6 py-20 md:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-bold uppercase tracking-wide text-sm">
            Works
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-primary mt-2 text-balance">
            Our Portfolio
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {portfolio.map((src, i) => (
            <div
              key={src}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <img
                src={src || "/placeholder.svg"}
                alt="Completed service work by a TTaskPro professional"
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Experts */}
      <section id="experts" className="bg-primary px-6 py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-accent font-bold uppercase tracking-wide text-sm">
                Workers
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mt-2 text-balance">
                Our Experts
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <button
                className="size-11 rounded-full border border-primary-foreground/30 text-primary-foreground flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
                aria-label="Previous"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                className="size-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Next"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((e) => (
              <div
                key={e.name}
                className="bg-card rounded-3xl overflow-hidden shadow-sm"
              >
                <img
                  src={e.img || "/placeholder.svg"}
                  alt={e.name}
                  className="w-full h-72 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-primary">{e.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{e.role}</p>
                  <div className="flex items-center justify-center gap-3 text-muted-foreground border-t border-border pt-4">
                    <Share2 className="size-4 hover:text-primary transition-colors" />
                    <AtSign className="size-4 hover:text-primary transition-colors" />
                    <Send className="size-4 hover:text-primary transition-colors" />
                    <Globe className="size-4 hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News + CTA */}
      <section id="news" className="px-6 py-20 md:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-bold uppercase tracking-wide text-sm">
            News
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-primary mt-2 text-balance">
            Get Every Update
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <article
              key={n.title}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
            >
              <img
                src={n.img || "/placeholder.svg"}
                alt={n.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-accent font-semibold mb-3">
                  <Calendar className="size-4" />
                  {n.date}
                </div>
                <h3 className="text-lg font-bold text-primary leading-snug text-pretty">
                  {n.title}
                </h3>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4 hover:underline"
                >
                  Read More <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}

          {/* CTA card */}
          <div className="bg-primary rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 size-40 bg-primary-foreground/10 rounded-full -mr-12 -mt-12" />
            <div className="relative z-10">
              <span className="text-accent font-bold uppercase tracking-wide text-sm">
                Call To Action
              </span>
              <h3 className="text-2xl font-black text-primary-foreground mt-2 mb-3 text-balance">
                Our team of experts is ready to help in your area.
              </h3>
              <p className="text-primary-foreground/70 mb-6 leading-relaxed">
                Join thousands of happy customers and book your first task
                today.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity w-fit"
              >
                Subscribe Now
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="text-2xl font-black mb-4">
                TTaskPro<span className="text-accent">.</span>
              </div>
              <p className="text-primary-foreground/70 leading-relaxed text-sm mb-6">
                The trusted marketplace connecting you with verified
                professionals for every task around your home and business.
              </p>
              <div className="flex items-center gap-3">
                {[Share2, AtSign, Send, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="size-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label="Social link"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li>
                  <a
                    href="#about"
                    className="hover:text-accent transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-accent transition-colors"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="#experts"
                    className="hover:text-accent transition-colors"
                  >
                    Our Experts
                  </a>
                </li>
                <li>
                  <a
                    href="#news"
                    className="hover:text-accent transition-colors"
                  >
                    News &amp; Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-accent" /> Mon – Fri: 8:00 –
                  18:00
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-accent" /> +876 (87) 656 656
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-accent" /> hello@ttaskpro.com
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent" /> 24 Service Street,
                  Lagos
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Gallery</h4>
              <div className="grid grid-cols-3 gap-2">
                {portfolio.slice(0, 6).map((src) => (
                  <img
                    key={src}
                    src={src || "/placeholder.svg"}
                    alt="Service work thumbnail"
                    className="w-full h-16 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-primary-foreground/60">
            <p>© 2026 TTaskPro. All rights reserved.</p>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
              <span className="ml-2">Rated 4.9/5 by 12,000+ customers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
