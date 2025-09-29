import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';

export const CheckoutFailed: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown === 0) {
            navigate(`/orders/${orderId}`);
            return;
        }
        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
        <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow text-center">
            <h1 className="text-3xl font-bold mb-5">Checkout Cancelled</h1>

            <div className="flex justify-center mb-8">
        <span className="flex items-center justify-center w-28 h-28 rounded-full bg-yellow-500">
          <svg
              className="w-24 h-24 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
            </div>

            <p className="mb-5 text-2xl font-bold">
                You cancelled the payment.
            </p>
            <p className="mb-7">
                Your checkout session is still open and will expire automatically if not completed.
            </p>
            <p className="mb-6 text-sm">
                You will be redirected to your orders in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
        </div>
    );
};
