import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CheckoutSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown === 0) {
            navigate('/orders');
            return;
        }
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
        <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow text-center">
            <h1 className="text-3xl font-bold mb-5">Payment Successful!</h1>

            <div className="flex justify-center mb-8">
                <span className="flex items-center justify-center w-28 h-28 rounded-full bg-green-500">
                  <svg
                      className="w-24 h-24 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
            </div>

            <p>You will be redirected in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
        </div>
    );
};
