import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-bold text-xl">E-Commerce</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/products" className="hover:text-blue-600">Products</Link>
                <Link to="/orders" className="hover:text-blue-600">Orders</Link>
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button 
                  onClick={handleSignout}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/signin" className="hover:text-blue-600">Sign In</Link>
                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};