import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiService } from "../services/api";
import { CartItem, TicketDetail } from "../types";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export const BuyNow: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const apiService = new ApiService();

    const { product, quantity: initialQuantity } = location.state as {
        product: CartItem;
        quantity: number;
    };

    const [quantity, setQuantity] = useState(initialQuantity || 1);
    const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "COD">("STRIPE");
    const [userTickets, setUserTickets] = useState<TicketDetail[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const totalPrice = Number(product.price) * quantity;

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const res = await apiService.getUserTickets();
                setUserTickets(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        loadTickets();
    }, []);

    const discountAmount = selectedTicket
        ? (() => {
            if (totalPrice < Number(selectedTicket.minOrderAmount)) return 0;

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

    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;

        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        setShowLeft(!atStart);
        setShowRight(!atEnd);
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            el.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, [userTickets]);

    const handlePlaceOrder = async () => {
        const orderBody: any = {
            paymentMethod,
            items: [
                {
                    productId: product.id,
                    quantity,
                },
            ],
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
            if (paymentMethod === "STRIPE" && response.data) {
                window.location.href = response.data;
            } else {
                alert("Order placed successfully!");
                navigate("/orders");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to place order");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Buy Now</h1>

            <div className="flex items-center gap-4 border-b pb-4">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded"
                />
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p className="text-gray-700 text-lg">${Number(product.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
                <label className="mr-4 font-semibold">Payment Method:</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as "STRIPE" | "COD")}
                    className="border rounded px-2 py-1"
                >
                    <option value="STRIPE">Stripe</option>
                    <option value="COD">Cash on Delivery</option>
                </select>
            </div>

            {/* Ticket Apply */}
            {userTickets.length > 0 && (
                <div className="mt-4 relative">
                    <h3 className="font-semibold mb-2">Discount Ticket:</h3>

                    {showLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full shadow"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    {showRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full shadow"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <div ref={scrollRef} className="flex gap-4 overflow-x-hidden scroll-smooth p-2">
                        {userTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className={`min-w-[230px] border rounded-lg p-3 cursor-pointer flex-shrink-0 flex flex-col justify-between transition-shadow ${
                                    selectedTicket?.id === ticket.id ? "border-blue-600 shadow-lg" : "border-gray-200"
                                } ${selectedTicket && selectedTicket.id !== ticket.id ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-blue-700">{ticket.code}</h4>
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded ${
                                                ticket.status === "AVAILABLE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm">
                                        {ticket.type === "PERCENT"
                                            ? `Save ${ticket.value}%`
                                            : `Save $${ticket.value}`}
                                    </p>
                                    {Number(ticket.minOrderAmount) > 0 && (
                                        <p className="text-xs text-gray-600">Min order: ${ticket.minOrderAmount}</p>
                                    )}
                                    {Number(ticket.maxDiscount) > 0 && (
                                        <p className="text-xs text-gray-600">Max discount: ${ticket.maxDiscount}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                        Valid: {new Date(ticket.startDate).toLocaleDateString()} →{" "}
                                        {new Date(ticket.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                {selectedTicket?.id !== ticket.id ? (
                                    totalPrice >= Number(ticket.minOrderAmount) ? (
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="mt-2 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        >
                                            Apply
                                        </button>
                                    ) : (
                                        <div className="mt-2 w-full min-h-[32px] flex justify-center items-center">
                                            <p className="text-sm text-gray-400 text-center">
                                                Buy ${ (Number(ticket.minOrderAmount) - totalPrice).toFixed(2) } more to apply
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="mt-2 w-full py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Total, Discount, Subtotal */}
            <div className="mt-6 flex flex-col gap-2 text-right">
                <p className="text-lg">Subtotal: ${totalPrice.toFixed(2)}</p>
                {selectedTicket && (
                    <p className="text-lg text-green-700">Discount: -${discountAmount.toFixed(2)}</p>
                )}
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
