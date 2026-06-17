import Link from 'next/link';
import {
  Wrench,
  Sparkles,
  Zap,
  Leaf,
  Hammer,
  PaintRoller,
  Truck,
  Laptop,
  Search,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Star,
  Clock,
  Users,
  BadgeCheck,
  ArrowRight,
  Quote,
} from 'lucide-react';

const categories = [
  { icon: Wrench, label: 'Plumbing', count: '120+ pros' },
  { icon: Sparkles, label: 'Cleaning', count: '200+ pros' },
  { icon: Zap, label: 'Electrical', count: '95+ pros' },
  { icon: Leaf, label: 'Gardening', count: '80+ pros' },
  { icon: Hammer, label: 'Carpentry', count: '60+ pros' },
  { icon: PaintRoller, label: 'Painting', count: '70+ pros' },
  { icon: Truck, label: 'Moving', count: '45+ pros' },
  { icon: Laptop, label: 'Tech Help', count: '110+ pros' },
];

const steps = [
  {
    step: '01',
    title: 'Browse Providers',
    desc: 'Search and filter trusted, verified service providers by category, skill, and rating.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Book a Service',
    desc: 'Pick the professional that fits your needs and budget, then book in a few taps.',
    icon: CalendarCheck,
  },
  {
    step: '03',
    title: 'Get It Done',
    desc: 'Your task is completed by a verified pro, with secure payment held until you are happy.',
    icon: CheckCircle2,
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    desc: 'Every provider is identity-checked and reviewed before they can take bookings.',
  },
  {
    icon: Wallet,
    title: 'Secure Payments',
    desc: 'Funds are held safely in your wallet and only released when the job is complete.',
  },
  {
    icon: Clock,
    title: 'Fast Response',
    desc: 'Most providers respond within minutes so you are never left waiting around.',
  },
  {
    icon: Star,
    title: 'Rated & Reviewed',
    desc: 'Transparent ratings from real customers help you choose with confidence.',
  },
  {
    icon: Users,
    title: 'A Pro for Everything',
    desc: 'From quick fixes to big projects, find the right person across dozens of categories.',
  },
  {
    icon: BadgeCheck,
    title: 'Satisfaction First',
    desc: 'Not happy? Our support team works with you until the job is done right.',
  },
];

const stats = [
  { value: '12,000+', label: 'Tasks completed' },
  { value: '880+', label: 'Verified providers' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '24/7', label: 'Customer support' },
];

const testimonials = [
  {
    quote:
      'I booked a plumber within 10 minutes and he showed up the same afternoon. TTaskPro saved my weekend.',
    name: 'Amaka O.',
    role: 'Homeowner, Lagos',
  },
  {
    quote:
      'As a cleaner, the platform keeps my bookings and payments organized. My income has nearly doubled.',
    name: 'Daniel K.',
    role: 'Cleaning Provider',
  },
  {
    quote:
      'The verification gave me peace of mind. Every professional I have hired has been excellent.',
    name: 'Ngozi A.',
    role: 'Small Business Owner',
  },
];

const faqs = [
  {
    q: 'How do I book a service provider?',
    a: 'Create a free account, browse providers by category, and send a booking request. The provider confirms and you are ready to go.',
  },
  {
    q: 'Are the providers verified?',
    a: 'Yes. Every provider goes through identity verification and is continuously rated by customers to maintain quality.',
  },
  {
    q: 'How do payments work?',
    a: 'You fund your wallet and pay providers securely through the platform. Providers can withdraw their earnings to their bank.',
  },
  {
    q: 'What if I am not satisfied with the work?',
    a: 'Reach out to our support team. We mediate between you and the provider to make sure the job is completed to your standard.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-black text-primary">TTaskPro</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#categories" className="hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#how" className="hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-primary transition-colors">
              Why us
            </a>
            <a href="#providers" className="hover:text-primary transition-colors">
              For providers
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline text-sm px-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="size-4" />
              Welcome to TTaskPro
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-tight mb-6 text-balance">
              Find Trusted Help for Every Chore
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
              Connect with verified service providers for cleaning, plumbing, electrical work,
              and more — all booked and paid for safely in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
              >
                Find a Service Provider
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/provider-register"
                className="inline-flex items-center justify-center border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
              >
                Become a Provider
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-10 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-primary"
                  >
                    <Users className="size-4" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Trusted by 12,000+ happy customers
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 size-40 bg-primary-foreground/10 rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 size-32 bg-primary-foreground/10 rounded-full -ml-10 -mb-10" />
              <div className="relative z-10 grid grid-cols-2 gap-4">
                {categories.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="bg-card rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
                    >
                      <div className="size-11 rounded-xl bg-secondary flex items-center justify-center text-primary">
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <p className="font-bold text-card-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto bg-card border border-border rounded-3xl shadow-sm px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-black text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="px-6 py-20 md:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-balance">
            Browse Popular Categories
          </h2>
          <p className="text-muted-foreground">
            Whatever the task, there is a trusted pro ready to help
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href="/register"
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-card-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-secondary/50 px-6 py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-balance">
              How It Works
            </h2>
            <p className="text-muted-foreground">Get help in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
                >
                  <div className="size-14 mx-auto rounded-2xl bg-secondary flex items-center justify-center text-primary mb-4">
                    <Icon className="size-7" />
                  </div>
                  <div className="text-sm font-bold text-accent mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 md:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-balance">
            Why Choose TTaskPro
          </h2>
          <p className="text-muted-foreground">
            Built to make finding and hiring help simple and safe
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-4">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* For Providers */}
      <section id="providers" className="px-6 py-20 md:py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-primary rounded-3xl p-8 md:p-10 relative overflow-hidden order-last md:order-first">
            <div className="absolute top-0 right-0 size-48 bg-primary-foreground/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10 space-y-4">
              {[
                { icon: Wallet, label: 'Earn on your schedule', desc: 'Accept the jobs that work for you' },
                { icon: Users, label: 'Grow your customer base', desc: 'Reach thousands of nearby clients' },
                { icon: ShieldCheck, label: 'Get paid securely', desc: 'Fast, reliable bank withdrawals' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-card rounded-2xl p-5 flex items-center gap-4 shadow-lg"
                  >
                    <div className="size-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <p className="font-bold text-card-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <span className="inline-block bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              For Service Providers
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-4 text-balance">
              Turn Your Skills Into Steady Income
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
              Join hundreds of professionals growing their business on TTaskPro. Manage bookings,
              track earnings, and withdraw to your bank — all from one dashboard.
            </p>
            <Link
              href="/provider-register"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
            >
              Start Earning Today
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 px-6 py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-balance">
              Loved by Customers and Pros
            </h2>
            <p className="text-muted-foreground">Real stories from the TTaskPro community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <Quote className="size-8 text-accent mb-4" />
                <p className="text-card-foreground leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-secondary flex items-center justify-center text-primary font-black">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-card-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 md:py-24 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-3 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">Everything you need to know to get started</p>
        </div>
        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group bg-card border border-border rounded-2xl p-6 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between font-semibold text-card-foreground list-none">
                {item.q}
                <ArrowRight className="size-5 text-primary transition-transform group-open:rotate-90" />
              </summary>
              <p className="text-muted-foreground leading-relaxed mt-4">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 size-64 bg-primary-foreground/5 rounded-full -ml-20 -mt-20" />
          <div className="absolute bottom-0 right-0 size-64 bg-primary-foreground/5 rounded-full -mr-20 -mb-20" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-4 text-balance">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/70 mb-8 text-lg">
              Join thousands of users finding trusted help every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-card text-primary px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
              >
                Sign Up as User
              </Link>
              <Link
                href="/provider-register"
                className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary-foreground hover:text-primary transition-colors"
              >
                Sign Up as Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="text-xl font-black text-primary mb-3">TTaskPro</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connecting you with trusted, verified service providers for every task.
              </p>
            </div>
            <div>
              <p className="font-semibold text-card-foreground mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-card-foreground mb-3">Support</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-card-foreground mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">© 2026 TTaskPro. All rights reserved.</p>
            <p className="text-muted-foreground text-sm">Made for getting things done.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
