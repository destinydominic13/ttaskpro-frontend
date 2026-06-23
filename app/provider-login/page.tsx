'use client';
import { useState } from 'react';
import API from '../lib/api';
import { saveToken, saveUser } from '../lib/auth';
import Link from 'next/link';

export default function ProviderLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/provider/login', form);
      saveToken(res.data.token);
      saveUser(res.data.provider);
      window.location.href = '/provider-dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
            Grow your business with TTaskPro.
          </h2>
          <p className="text-pretty leading-relaxed text-white/80">
            Sign in to manage bookings, connect with clients, and get paid for
            the work you do best.
          </p>
          <ul className="flex flex-col gap-3 pt-2 text-sm text-white/90">
            {[
              'Receive booking requests near you',
              'Manage your schedule in one place',
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
              Provider sign in
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Welcome back. Sign in to your provider account.
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
                className="w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="Enter your username"
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
                autoComplete="current-password"
                className="w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center rounded-lg bg-[#f59e0b] px-4 py-2.5 text-sm font-bold text-[#0d2d6e] transition hover:bg-[#f59e0b]/90 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-[#f59e0b]/30"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-2 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{' '}
              <Link
                href="/provider-register"
                className="font-bold text-[#f59e0b] hover:text-[#f59e0b]/80"
              >
                Register here
              </Link>
            </p>
            <p>
              Are you a customer?{' '}
              <Link
                href="/login"
                className="font-bold text-[#f59e0b] hover:text-[#f59e0b]/80"
              >
                Customer Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
