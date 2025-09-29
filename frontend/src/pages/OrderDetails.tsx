import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Order, PaymentMethod } from "../types";

export const OrderDetails: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();

    const navigate = useNavigate();
    const apiService = new ApiService();

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await apiService.getOrderDetails(Number(orderId));
            setPaymentMethod(response.data.paymentMethod);
            setOrder(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    if (loading) return <div>Loading order...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!order) return <div>No order found.</div>;

    const handleCancelOrder = async () => {
        if (!order) return;

        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await apiService.cancelOrder(order.id);
                alert('Order canceled successfully.');
                setOrder({ ...order, status: 'CANCELED',  paymentStatus: 'CANCELED' });
            } catch (error: any) {
                alert(error.message || 'Failed to cancel order');
            }
        }
    };

    const handleOrderUpdate = async () => {
        if (!order) return;
        try {
            await apiService.updateOrder(order.id, {
             paymentMethod: paymentMethod as PaymentMethod,
            });
            setIsEditing(false);
            alert("Order updated successfully");
            fetchOrder();
        } catch (err: any) {
            alert(err.message || "Failed to update order");
        }
    };

    const handleCheckout = async () => {
        if (!order) return;

        try {
            const response = await apiService.checkout(order.id);
            window.location.href = response.data;
        } catch (error: any) {
            alert(error.message);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
            <Link to="/orders" className="text-blue-600 underline mb-4 inline-block">← Back to Orders</Link>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>
                <p>
                    <span className={`px-2 py-1 rounded font-semibold ${
                        order.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' :
                                order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                    }`}>
                        {order.status}
                    </span>
                </p>
            </div>

            <div className="flex justify-between items-center border rounded p-4 space-y-2">
                <div>
                    <p><strong>Full Name:</strong> {order.orderInfo?.firstName} {order.orderInfo?.middleName} {order.orderInfo?.lastName}</p>
                    <p><strong>Email:</strong> {order.orderInfo?.email}</p>
                    <p><strong>Address:</strong> {order.orderInfo?.address}</p>
                </div>
                <div>
                    <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                    <p>
                        <strong>Payment Method:</strong>{' '}
                        {isEditing ? (
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="STRIPE">STRIPE</option>
                                <option value="COD">COD</option>
                            </select>
                        ) : (
                            order.paymentMethod
                        )}
                    </p>
                    <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Items</h2>
            <div className="space-y-4">
                {order.items.map((item: any) => (
                    <div key={item.productId} className="flex items-center space-x-4 border rounded p-4">
                        <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.product.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price per item: ${parseFloat(item.price).toFixed(2)}</p>
                            <p>Total: ${parseFloat(item.total).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-6 border-t pt-4 text-right text-xl font-bold">
                <div className="space-x-4">
                {!(
                    order.status.toLowerCase() === 'canceled' ||
                    order.paymentStatus.toLowerCase() === 'paid' ||
                    order.paymentStatus.toLowerCase() === 'processing' ||
                    order.paymentStatus.toLowerCase() === 'failed'
                ) && (
                    <>
                        {!(
                            order.paymentMethod.toLowerCase() === 'cod'
                        ) && (
                            <button
                                onClick={() => handleCheckout()}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded"
                            >
                                Checkout
                            </button>
                        )}
                        <button
                            onClick={() => handleCancelOrder()}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded"
                        >
                            Cancel
                        </button>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded"
                            >
                                Update
                            </button>
                        ) : (
                            <button
                                onClick={() => handleOrderUpdate()}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded"
                            >
                                Save
                            </button>
                        )}
                    </>
                )}
                {order.paymentStatus === 'PROCESSING' && order.checkoutUrl && (
                    <a
                        onClick={() => navigate(`${order.checkoutUrl}`)}
                        href={order.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Continue Checkout
                    </a>
                )}
                </div>
                <div>
                    Total: ${parseFloat(order.totalAmount).toFixed(2)}
                </div>
            </div>
        </div>
    );
};
