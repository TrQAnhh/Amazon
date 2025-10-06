import React, { useEffect, useState, useRef } from 'react';
import { getCart, saveCart } from '../utils/cart';
import { Trash2, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ApiService } from '../services/api';
import { CartItem, TicketDetail } from "../types";
import { useNavigate } from "react-router-dom";

export const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'COD'>('STRIPE');
    const [userTickets, setUserTickets] = useState<TicketDetail[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

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

        const loadTickets = async () => {
            try {
                const res = await apiService.getUserTickets();
                setUserTickets(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadCart();
        loadTickets();
    }, []);

    // Scroll button logic
    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;

        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        setShowLeft(!atStart);
        setShowRight(!atEnd);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [userTickets]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const updateQuantity = (sku: string, delta: number) => {
        const updatedCart = cart.map(item => {
            if (item.sku === sku) {
                const newQuantity = Math.min(Math.max(item.quantity + delta, 1), item.availableStock);
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

    const discountAmount = selectedTicket
        ? (() => {
            let amount = 0;

            if (selectedTicket.type === "PERCENT") {
                amount = totalPrice * (Number(selectedTicket.value) / 100);
            } else if (selectedTicket.type === "FIXED") {
                amount = Number(selectedTicket.value);
            }

            if (Number(selectedTicket.maxDiscount) > 0) {
                amount = Math.min(amount, Number(selectedTicket.maxDiscount));
            }

            return amount;
        })()
        : 0;

    const finalTotal = totalPrice - discountAmount;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        const orderBody: any = {
            paymentMethod,
            items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        };

        if (selectedTicket) {
            if (selectedTicket.type === "PERCENT" || selectedTicket.type === "FIXED") {
                orderBody.discountId = selectedTicket.id;
            } else {
                orderBody.freeshipId = selectedTicket.id;
            }
        }

        try {
            const response = await apiService.createOrder(orderBody);
            if (paymentMethod === 'STRIPE' && response.data) {
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
                    <div key={item.sku} className="grid grid-cols-[3fr_1fr_2fr_auto] items-center border-b pb-4 gap-4">
                        <div className="flex items-center gap-4">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded flex-shrink-0" />
                            <div className="min-w-0">
                                <h2 className="text-xl font-semibold truncate max-w-[300px]">{item.name}</h2>
                                <p className="text-gray-500">${Number(item.price).toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <button onClick={() => updateQuantity(item.sku, -1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.sku, 1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-lg font-semibold text-center">${(Number(item.price) * item.quantity).toFixed(2)}</div>

                        <div className="text-center">
                            <button onClick={() => removeItem(item.sku)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Method */}
            <div className="mt-6">
                <label className="mr-4 font-semibold">Payment Method:</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as 'STRIPE' | 'COD')} className="border rounded px-2 py-1">
                    <option value="STRIPE">Stripe</option>
                    <option value="COD">Cash on Delivery</option>
                </select>
            </div>

            {/* Ticket Apply */}
            { userTickets.length > 0 &&
                <div className="mt-4 relative">
                    <h3 className="font-semibold mb-2">Apply Ticket</h3>

                    {showLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full shadow"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    {showRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full shadow"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-hidden scroll-smooth p-2"
                    >
                        {userTickets.map(ticket => (
                            <div
                                key={ticket.id}
                                className={`min-w-[230px] border rounded-lg p-3 cursor-pointer flex-shrink-0 flex flex-col justify-between transition-shadow ${
                                    selectedTicket?.id === ticket.id ? 'border-blue-600 shadow-lg' : 'border-gray-200'
                                } ${selectedTicket && selectedTicket.id !== ticket.id ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-blue-700">{ticket.code}</h4>
                                        <span className={`px-2 py-0.5 text-xs rounded ${ticket.status === 'AVAILABLE' ?
                                            'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm">
                                        {ticket.type === 'PERCENT' ? `Save ${ticket.value}%` : `Save $${ticket.value}`}
                                    </p>
                                    {
                                        Number(ticket.minOrderAmount) > 0 &&
                                        <p className="text-xs text-gray-600">
                                            Min order: ${ticket.minOrderAmount}
                                        </p>
                                    }
                                    {
                                        Number(ticket.maxDiscount) > 0 &&
                                        <p className="text-xs text-gray-600">
                                            Max discount: ${ticket.maxDiscount}
                                        </p>
                                    }
                                    <p className="text-xs text-gray-400 mt-1">
                                        Valid: {new Date(ticket.startDate).toLocaleDateString()} → {new Date(ticket.endDate).toLocaleDateString()}
                                    </p>
                                </div>

                                {selectedTicket?.id !== ticket.id ? (
                                    <button
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="mt-2 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Apply
                                    </button>
                                ) : (
                                    <button onClick={() => setSelectedTicket(null)} className="mt-2 w-full py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
            </div>
            }

            {/* Total & Discount */}
            <div className="mt-6 flex flex-col gap-2 text-right">
                { userTickets.length > 0 &&
                    <p className="text-lg">
                        Subtotal: ${totalPrice.toFixed(2)}
                    </p>
                }
                {selectedTicket && <p className="text-lg text-green-700">Discount: -${discountAmount.toFixed(2)}</p>}
                <p className="text-2xl font-bold">Total: ${finalTotal.toFixed(2)}</p>
            </div>

            <div className="mt-4 flex justify-end">
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
