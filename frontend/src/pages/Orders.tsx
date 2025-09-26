import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { ApiService } from '../services/api';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiService = new ApiService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center">Loading orders...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

        {orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
                <p>No orders found.</p>
                <Link to="/" className="text-blue-500 hover:underline">
                    Let's buy something
                </Link>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        to={`/orders/${order.id}`}
                        key={order.id}
                        className="bg-white p-6 rounded-lg shadow-md flex items-stretch space-x-4"
                    >
                        <img
                            src="/images/order-icon-vector.jpg"
                            alt="Order"
                            className="w-auto h-full max-h-24 object-cover rounded self-center"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-600">
                                        Date: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                                    <p className="text-sm text-gray-600">Payment Status: {order.paymentStatus}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        order.status.toLowerCase() === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : order.status.toLowerCase() === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                    }`}
                                >{order.status}</span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">
                                        Total: ${parseFloat(order.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        )}
    </div>
  );
};