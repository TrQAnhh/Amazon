import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const { signin, isAuthenticated, resendEmail } = useAuth();


  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signin(email, password);
    } catch (error: any) {
      setError(error instanceof Error ? error.message : 'Sign in failed');
      if (error.message.toLowerCase().includes('not verified')) {
        setShowResend(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);

    try {
        const message = await resendEmail(email);
        alert(message);
    } catch (err: any) {
        alert(err.message || 'Failed to resend email.');
    } finally {
        setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            {showResend && (
              <div className="mt-3">
                  <p className="text-sm text-gray-700 mb-3">
                      Do you still have access to <b>{email}</b>?
                      If yes, click below to receive a new verification email.
                  </p>
                  <div className="flex justify-center">
                      <button
                          onClick={handleResend}
                          disabled={resendLoading}
                          className={`px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm transition ${
                              resendLoading
                                  ? 'bg-gray-400 cursor-not-allowed text-white'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                      >
                          {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                      </button>
                  </div>
                  <span className="mt-3 text-sm text-gray-700 mb-3">
                        If not, please sign in with a different account.
                  </span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};