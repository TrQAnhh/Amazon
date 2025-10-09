import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Product } from '../types';
import { addToCart } from "../utils/cart.ts";
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useAuth } from "../context/AuthContext.tsx";
import { AlertCircle } from "lucide-react";

export const ProductDetail: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { sku } = useParams<{ sku: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    const apiService = new ApiService();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const response = await apiService.getProductDetails(sku!);
                setProduct(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [sku]);

    if (loading) return <div className="text-center">Loading product...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!product) return <div className="text-center">Product not found</div>;

    const handleAddToCart = () => {
        if (!product) return;

        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }

        try {
            addToCart(
                {
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity,
                    availableStock: product.availableStock,
                },
                product.availableStock
            );
            alert('Added to cart!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add to cart');
        }
    };

    const handleBuy = () => {
        if (!product) return;

        if (!isAuthenticated) {
            navigate("/signin");
            return;
        }

        navigate("/buy-now", {
            state: {
                product: {
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: quantity,
                    availableStock: product.availableStock,
                },
                quantity,
            },
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link to="/" className="flex items-center text-blue-600 font-bold mb-4">
                <ArrowLeft className="w-3 h-3 mr-2" />
                Continue shopping
            </Link>

            <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-cover rounded mb-4" />
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
                {product.availableStock > 0 ? (
                    <div className="text-sm text-gray-500">
                        Stock: {product.availableStock}
                    </div>
                ) : (
                    <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg text-center text-red-700 font-medium flex items-center justify-center gap-2">
                        <AlertCircle size={20} />
                        This product is currently out of stock.
                    </div>
                )}
                <div className="text-xl font-bold text-red-500">${product.price}</div>
            </div>

            <div className="flex items-center gap-4">
                {product.availableStock > 0 ? (
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            min={1}
                            max={product.availableStock}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-20 border rounded px-2 py-1"
                        />

                        <button
                            onClick={handleAddToCart}
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold transition"
                        >
                            <ShoppingCart className="w-6 h-6 mr-1" />
                            Add to Cart
                        </button>

                        <button
                            onClick={handleBuy}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition"
                        >
                            Buy Now
                        </button>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};