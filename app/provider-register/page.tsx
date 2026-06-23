'use client';
import { useState } from 'react';
import API from '../lib/api';
import { saveToken, saveUser } from '../lib/auth';
import Link from 'next/link';

export default function ProviderRegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    nin: '',
    category: '',
    experience: '',
    skills: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/provider/register', {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()),
      });
      saveToken(res.data.token);
      saveUser(res.data.provider);
      window.location.href = '/provider-dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30';

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Brand panel */}
      <aside className="relative flex flex-col justify-between bg-gradient-to-br from-[#0d2d6e] to-[#0a2458] px-8 py-10 text-white lg:w-[45%] lg:px-12 lg:py-14">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f59e0b] ring-1 ring-[#f59e0b]/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-[#0d2d6e]"
              aria-hidden="true"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight">
            TTaskPro <span className="font-normal opacity-80">for Providers</span>
          </span>
        </div>

        <div className="hidden max-w-sm flex-col gap-5 lg:flex">
          <h2 className="text-balance text-3xl font-black leading-tight tracking-tight">
            Start earning on your terms.
          </h2>
          <p className="text-pretty leading-relaxed text-white/80">
            Create your provider profile to start receiving bookings from
            clients in your area.
          </p>
          <ul className="flex flex-col gap-3 pt-2 text-sm text-white/90">
            {[
              'Showcase your skills and experience',
              'Get matched with nearby clients',
              'Fast, secure payouts',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f59e0b]/20 text-[#f59e0b] font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-sm text-white/60 lg:block">
          &copy; {new Date().getFullYear()} TTaskPro. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Register as Provider
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tell us about yourself to set up your provider profile.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className={inputClass}
                placeholder="Choose a username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={inputClass}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="nin"
                className="text-sm font-medium text-foreground"
              >
                NIN
              </label>
              <input
                id="nin"
                type="text"
                name="nin"
                value={form.nin}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter your NIN"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select a category</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Gardening">Gardening</option>
                <option value="Cooking">Cooking</option>
                <option value="Laundry">Laundry</option>
                <option value="Moving">Moving</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="experience"
                className="text-sm font-medium text-foreground"
              >
                Experience
              </label>
              <input
                id="experience"
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="e.g. 3 years"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={inputClass}
                placeholder="Choose a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center rounded-lg bg-[#f59e0b] px-4 py-2.5 text-sm font-bold text-[#0d2d6e] transition hover:bg-[#f59e0b]/90 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-[#f59e0b]/30"
            >
              {loading ? 'Creating account...' : 'Register as provider'}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-2 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <Link
                href="/provider-login"
                className="font-bold text-[#f59e0b] hover:text-[#f59e0b]/80"
              >
                Login here
              </Link>
            </p>
            <p>
              Are you a customer?{' '}
              <Link
                href="/register"
                className="font-bold text-[#f59e0b] hover:text-[#f59e0b]/80"
              >
                Register as Customer
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
