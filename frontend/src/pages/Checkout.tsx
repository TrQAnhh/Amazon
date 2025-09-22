import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Product, OrderItem, CreateOrderRequest, PaymentRequest } from '../types';
import { ApiService } from '../services/api';

export const Checkout: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const apiService = new ApiService();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      setError('Failed to load products');
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = orderItems.find(item => item.productId === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        quantity: 1,
        price: product.price,
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(orderItems.filter(item => item.productId !== productId));
    } else {
      setOrderItems(orderItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      setError('Please add items to your cart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData: CreateOrderRequest = {
        products: orderItems,
      };
      
      const order = await apiService.createOrder(orderData);
      
      // Redirect to payment for the created order
      navigate(`/checkout?orderId=${order.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      setError('No order ID found');
      return;
    }

    setPaymentLoading(true);
    setError('');

    try {
      const paymentData: PaymentRequest = {
        orderId: orderId,
        amount: getTotalAmount(),
        currency: 'USD',
      };

      await apiService.processPayment(paymentData);
      
      // Redirect to orders page on successful payment
      navigate('/orders');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {orderId ? 'Payment' : 'Create Order'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!orderId && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Products</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <p className="text-lg font-bold">${product.price}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
              {orderItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{getProductName(item.productId)}</span>
                          <p className="text-sm text-gray-600">${item.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="bg-gray-200 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="bg-gray-200 px-2 py-1 rounded"
                          >
                            +
                          </button>
                          <span className="ml-4 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total: ${getTotalAmount().toFixed(2)}</span>
                    </div>
                    
                    <button
                      onClick={handleCreateOrder}
                      disabled={loading || orderItems.length === 0}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {loading ? 'Creating Order...' : 'Create Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {orderId && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Order ID: {orderId}</p>
              <p className="text-2xl font-bold">Amount: ${getTotalAmount().toFixed(2)}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                This is a mock payment form. In production, you would integrate with Stripe Elements.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {paymentLoading ? 'Processing Payment...' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};