'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import API from '../lib/api';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found');
      return;
    }
    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const res = await API.get(`/user/verify-payment/${reference}`);
      setStatus('success');
      setMessage(res.data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Payment verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d2d6e] mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              href="/profile"
              className="inline-block bg-[#0d2d6e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0a2458] transition"
            >
              Back to Profile
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              href="/profile"
              className="inline-block bg-[#0d2d6e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0a2458] transition"
            >
              Back to Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}