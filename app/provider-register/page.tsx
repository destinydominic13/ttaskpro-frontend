'use client';
import { useState } from 'react';
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('password', form.password);
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('nin', form.nin);
      formData.append('category', form.category);
      formData.append('experience', form.experience);
      formData.append('skills', form.skills);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
      }

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/auth/provider/register', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.provider));
      window.location.href = '/provider-dashboard';
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
        {/* Brand panel */}
        <aside className="relative flex flex-col justify-between bg-gradient-to-br from-[#0d2d6e] to-[#0a2458] px-8 py-10 text-white lg:px-12 lg:py-14">
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

        {/* Right Panel - Form */}
        <div className="bg-white px-8 py-12 md:py-16 flex flex-col justify-center overflow-y-auto max-h-screen md:max-h-none">
          <h2 className="text-2xl font-bold text-[#0d2d6e] mb-6">Create Provider Account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-[#f59e0b] flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📷</span>
                )}
              </div>
              <label className="cursor-pointer bg-[#f59e0b] text-[#0d2d6e] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#f59e0b]/90 transition">
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400">Clear profile photo (optional)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Phone"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  NIN
                </label>
                <input
                  type="text"
                  name="nin"
                  value={form.nin}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="NIN"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="e.g. 3 years"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0d2d6e] transition-colors"
                placeholder="e.g. mopping, dusting, ironing"
              />
            </div>

                  {/* Location */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                    {locationStatus === 'granted' ? (
                      <div className="text-green-600 text-sm font-semibold flex items-center justify-center gap-2">
                        <span>✅</span> Location captured successfully!
                      </div>
                    ) : locationStatus === 'denied' ? (
                      <div className="text-red-500 text-sm">
                        Location access denied. You can still register without it.
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Share your location so users can find you nearby
                        </p>
                        <button
                          type="button"
                          onClick={getLocation}
                          disabled={locationStatus === 'loading'}
                          className="bg-[#0d2d6e] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a2458] transition disabled:opacity-60"
                        >
                          {locationStatus === 'loading' ? 'Getting location...' : '📍 Share My Location'}
                        </button>
                      </div>
                    )}
                  </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#f59e0b] px-4 py-2.5 text-sm font-bold text-[#0d2d6e] transition hover:bg-[#f59e0b]/90 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-[#f59e0b]/30"
            >
              {loading ? 'Creating account...' : 'Register as provider'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm text-muted-foreground">
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
      </div>
    </div>
  );
}
