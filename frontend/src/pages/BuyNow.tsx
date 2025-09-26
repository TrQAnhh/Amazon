import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiService } from "../services/api";
import { CartItem } from "../types";
import {Minus, Plus} from "lucide-react";

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
    const totalPrice = Number(product.price) * quantity;

    const handlePlaceOrder = async () => {
        const orderBody = {
            paymentMethod,
            items: [
                {
                    productId: product.id,
                    quantity,
                },
            ],
        };

        try {
            const response = await apiService.createOrder(orderBody);
            if (response.data) {
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
        <div className="max-w-3xl mx-auto p-6">
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
                        <p className="text-gray-700 text-lg">
                            ${Number(product.price).toFixed(2)}
                        </p>
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

            <div className="mt-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
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
