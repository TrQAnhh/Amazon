import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const VerifyEmail: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const [message, setMessage] = useState('Verifying...');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();
    const called = useRef(false);

    useEffect(() => {
        if (!tokenId || called.current) return;
        called.current = true;

        const verify = async () => {
            try {
                await verifyEmail(tokenId);
                setMessage('Verifying successfully.');
                setSuccess(true);
                setTimeout(() => navigate('/products'), 3000);
            } catch (err: any) {
                setSuccess(false);
                setError(err.message || 'Email verification failed');
            }
        };

        verify();
    }, [tokenId, verifyEmail, navigate]);

    return (
        <div className="max-w-md mx-auto mt-16 text-center">
            <div className="flex justify-center mb-6">
                {success && !error && (
                    <span className="flex items-center justify-center w-24 h-24 rounded-full bg-green-500">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                )}
                {!success && error && (
                    <span className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                )}
            </div>
            {error ? <div className="text-red-600 text-lg">{error}</div> : <div className="text-green-600 text-lg">{message}</div>}
        </div>
    );
};
