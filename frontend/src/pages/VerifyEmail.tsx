import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const VerifyEmail: React.FC = () => {
    const [message, setMessage] = useState('Verifying...');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [resendLoading, setResendLoading] = useState(false);

    const navigate = useNavigate();
    const { verifyEmail, resendEmail } = useAuth();
    const called = useRef(false);

    const queryParams = new URLSearchParams(location.search);
    const tokenId = queryParams.get('tokenId');
    const email = queryParams.get('email');

    useEffect(() => {
        if (!tokenId || !email) {
            setSuccess(false);
            setError('Invalid verification link.');
            return;
        }
        if (called.current) return;

        called.current = true;
        const verify = async () => {
            try {
                await verifyEmail(tokenId, email);
                setMessage('Your email has been verified successfully!');
                setSuccess(true);
            } catch (err: any) {
                setSuccess(false);
                setError(err.message || 'Email verification failed.');
            }
        };

        verify();
    }, [tokenId, email]);

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        if (!success) return;

        if (countdown === 0) {
            navigate('/products');
            return;
        }

        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, success, navigate]);

    const handleResend = async () => {
        if (!email) return;
        setResendLoading(true);

        try {
            const message = await resendEmail(email);
            alert(message);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 text-center">
            {success && !error && (
                <div className="p-6 border border-green-300 bg-green-50 rounded-xl text-center shadow-sm">
                    <div className="flex justify-center mb-3">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/90">
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
                    <h2 className="text-xl font-semibold text-green-700 mb-2">
                        Email Verified Successfully!
                    </h2>
                    <p className="text-green-600 mb-2">{message}</p>
                    <p className="mt-1 text-sm text-gray-700">
                        Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </p>
                </div>
            )}

            {!success && error && (
                <div className="p-6 border border-red-300 bg-red-50 rounded-xl text-center shadow-sm mt-6">
                    <div className="flex justify-center mb-3">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/90">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3m0 4h.01M5.07 19h13.86A2.07 2.07 0 0021 16.93V7.07A2.07 2.07 0 0018.93 5H5.07A2.07 2.07 0 003 7.07v9.86A2.07 2.07 0 005.07 19z"
                                />
                            </svg>
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-red-700 mb-2">
                        Verification Failed
                    </h2>
                    <p className="text-red-600 mb-4">
                        {error.includes('expired') || error.includes('Invalid')
                            ? 'Your verification link has expired or is invalid.'
                            : error}
                    </p>

                    {email && isValidEmail(email) && (
                        <div>
                            <p className="text-gray-700 mb-3">
                                Please resend the confirmation email to verify again.
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={resendLoading}
                                className={`mt-2 px-6 py-2 font-medium rounded-lg shadow transition-all ${
                                    resendLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                            >
                                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
