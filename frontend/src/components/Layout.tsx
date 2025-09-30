import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [showMenu, setShowMenu] = useState(false);
    const { user, isAuthenticated, signout } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const currentPath = location.pathname;

    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setShowMenu((prev) => !prev);

    const handleSignout = async () => {
        await signout();
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="font-bold text-xl">
                            E-Commerce
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4" ref={menuRef}>
                                <Link to="/cart" className="hover:text-blue-600">
                                    Cart
                                </Link>
                                <Link to="/orders" className="hover:text-blue-600">
                                    Orders
                                </Link>
                                <div className="relative">
                                    <img
                                        src={user?.avatarUrl || "/images/default-avatar-profile.jpg"}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer"
                                        onClick={toggleMenu}
                                    />

                                    {showMenu && (
                                        <div className="absolute right-4 w-40 bg-white border rounded shadow-md z-10">
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    navigate("/profile");
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Setting
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                onClick={async () => {
                                                    setShowMenu(false);
                                                    await handleSignout();
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/signin"
                                    className={`px-4 py-2 rounded ${
                                        currentPath === "/signin"
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-blue-100"
                                    }`}
                                >
                                    Sign In
                                </Link>

                                <Link
                                    to="/signup"
                                    className={`px-4 py-2 rounded ${
                                        currentPath === "/signup" || !["/signin","/signup"].includes(currentPath)
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-blue-100"
                                    }`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </div>
    );
};
