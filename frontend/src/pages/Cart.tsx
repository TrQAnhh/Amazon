import React, { useEffect, useState } from 'react';
import { getCart, saveCart } from '../utils/cart';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ApiService } from '../services/api';
import { CartItem } from "../types";
import { useNavigate } from "react-router-dom";

export const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'COD'>('STRIPE');

    const apiService = new ApiService();

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            try {
                const cartData = getCart().map(item => ({ ...item, price: Number(item.price) }));
                setCart(cartData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, []);

    const updateQuantity = (sku: string, delta: number) => {
        const updatedCart = cart.map(item => {
            if (item.sku === sku) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCart(updatedCart);
        saveCart(updatedCart);
    };

    const removeItem = (sku: string) => {
        const updatedCart = cart.filter(item => item.sku !== sku);
        setCart(updatedCart);
        saveCart(updatedCart);
    };

    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        const orderBody = {
            paymentMethod,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await apiService.createOrder(orderBody);
            if (response.data) {
                window.location.href = response.data;
            } else {
                alert('Order placed successfully!');
                setCart([]);
                saveCart([]);
                navigate("/orders");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to place order');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading cart...</div>;
    if (cart.length === 0) return <div className="text-center mt-10">Your cart is empty.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item.sku} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
                            <div>
                                <h2 className="text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-500">${Number(item.price).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.sku, -1)}
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.sku, 1)}
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-lg font-semibold">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                        <button
                            onClick={() => removeItem(item.sku)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <label className="mr-4 font-semibold">Payment Method:</label>
                <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as 'STRIPE' | 'COD')}
                    className="border rounded px-2 py-1"
                >
                    <option value="STRIPE">Stripe</option>
                    <option value="COD">Cash on Delivery</option>
                </select>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    Total: ${totalPrice.toFixed(2)}
                </h2>
                <button
                    onClick={handlePlaceOrder}
                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400 font-bold"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};
