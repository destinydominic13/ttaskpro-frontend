import Link from 'next/link';

export default function LandingPage() {
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
              {
                step: '01',
                title: 'Browse Providers',
                desc: 'Search and filter trusted service providers by category and skill',
                icon: '🔍',
              },
              {
                step: '02',
                title: 'Book a Service',
                desc: 'Choose a provider that fits your needs and book instantly',
                icon: '📅',
              },
              {
                step: '03',
                title: 'Get It Done',
                desc: 'Your task gets completed by a verified professional',
                icon: '✅',
              },
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