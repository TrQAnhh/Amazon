import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignUp: React.FC = () => {
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [showResend, setShowResend] = useState(false);

    const { signup, isAuthenticated, resendEmail } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/products" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const message = await signup(email, password, firstName, middleName, lastName);
            setMessage(message);
            setSuccess(true);
        } catch (error: any) {
            setError(error instanceof Error ? error.message : 'Sign up failed');
            if (error.message.toLowerCase().includes('not verified')) {
                setShowResend(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto mt-16 text-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500">
              <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
                    <p>{message}</p>
                    <p className="mt-4 text-sm text-gray-600">
                        Go back to <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        );
    }

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
                <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

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
                                    If not, please sign up with a different account.
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Last name</label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Middle name</label>
                            <input
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">First name</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-blue-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
