import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Product } from '../types';

export const ProductDetail: React.FC = () => {
    const { sku } = useParams<{ sku: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div className="max-w-3xl mx-auto p-6">
            <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-cover rounded mb-4" />
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="text-xl font-bold text-red-500 mb-2">${product.price}</div>
            <div className="text-sm text-gray-500">Stock: {product.availableStock}</div>
        </div>
    );
};