import React, { useEffect, useState, useRef } from 'react';
import { Ticket, TicketDetail } from '../types';
import { ApiService } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

interface TicketListProps {
    onCollected?: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({ onCollected }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [collecting, setCollecting] = useState<number | null>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const apiService = new ApiService();
    const scrollRef = useRef<HTMLDivElement>(null);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const response = await apiService.getTickets();
            setTickets(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleCollect = async (ticketId: number) => {
        try {
            if (!isAuthenticated) {
                navigate("/signin");
                return;
            }
            setCollecting(ticketId);
            const res = await apiService.collectTicket(ticketId);
            if (res.success) {
                alert(res.message);
                if (onCollected) onCollected();
            }
        } catch (err: any) {
            if (err?.message) {
                alert(err.message);
            } else {
                alert('Failed to collect ticket');
            }
        } finally {
            setCollecting(null);
        }
    };


    useEffect(() => {
        loadTickets();
    }, []);

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
    }, [tickets]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleShowDetail = async (ticketId: number) => {
        try {
            setLoadingDetail(true);
            const res = await apiService.getTicketDetail(ticketId);
            setSelectedTicket(res.data);
            setShowModal(true);
        } catch (err) {
            alert('Failed to load ticket details');
        } finally {
            setLoadingDetail(false);
        }
    };

    if (loading) return <div>Loading tickets...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (tickets.length === 0) return <div>No active tickets available.</div>;

    return (
        <div className="relative bg-white p-6 rounded-xl shadow-lg mb-8">
            {showLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow transition-opacity"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden scroll-smooth"
            >
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => handleShowDetail(ticket.id)}
                        className="min-w-[260px] border border-gray-200 rounded-xl p-5 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-blue-700">{ticket.code}</h3>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                        ticket.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                  {ticket.status}
                </span>
                            </div>

                            <p className="text-gray-800 text-lg font-semibold mb-1">
                                {ticket.type === 'PERCENT'
                                    ? `Save ${parseFloat(ticket.value).toFixed(0)}%`
                                    : `Save $${parseFloat(ticket.value).toFixed(2)}`}
                            </p>

                            {ticket.maxDiscount && (
                                <p className="text-sm text-gray-600">
                                    Max discount: ${parseFloat(ticket.maxDiscount).toFixed(2)}
                                </p>
                            )}

                            <p className="text-sm text-gray-600">
                                Minimum order: ${parseFloat(ticket.minOrderAmount).toFixed(2)}
                            </p>

                            <p className="text-xs text-gray-400 mt-3">
                                Valid until: {new Date(ticket.endDate).toLocaleDateString('en-US')}
                            </p>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCollect(ticket.id);
                            }}
                            disabled={collecting === ticket.id}
                            className={`mt-4 py-2 font-semibold rounded-lg transition-all duration-200 ${
                                collecting === ticket.id
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {collecting === ticket.id ? 'Collecting...' : 'Collect Ticket'}
                        </button>
                    </div>
                ))}
            </div>

            {showRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow transition-opacity"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {showModal && selectedTicket && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-[400px] p-6 relative animate-[fadeInUp_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                        >
                            ✕
                        </button>

                        {loadingDetail ? (
                            <div className="text-center text-gray-500 py-8">Loading details...</div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center w-full mb-2 mt-4">
                                    <h2 className="text-2xl font-bold text-blue-700 mb-1">{selectedTicket.code}</h2>
                                    <p
                                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-4 ${
                                            selectedTicket.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : selectedTicket.status === 'EXPIRED'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {selectedTicket.status}
                                    </p>
                                </div>

                                <div className="space-y-2 text-gray-700 text-sm">
                                    {selectedTicket.type && (
                                        <p>
                                            <span className="font-medium">Type:</span> {selectedTicket.type}
                                        </p>
                                    )}
                                    {selectedTicket.value && (
                                        <p>
                                            <span className="font-medium">Value:</span>{' '}
                                            {selectedTicket.type === 'PERCENT'
                                                ? `${parseFloat(selectedTicket.value).toFixed(0)}%`
                                                : `$${parseFloat(selectedTicket.value).toFixed(2)}`}
                                        </p>
                                    )}
                                    {selectedTicket.maxDiscount && (
                                        <p>
                                            <span className="font-medium">Max Discount:</span>{' '}
                                            ${parseFloat(selectedTicket.maxDiscount).toFixed(2)}
                                        </p>
                                    )}
                                    {selectedTicket.minOrderAmount && (
                                        <p>
                                            <span className="font-medium">Min Order:</span>{' '}
                                            ${parseFloat(selectedTicket.minOrderAmount).toFixed(2)}
                                        </p>
                                    )}
                                    {selectedTicket.total && (
                                        <p>
                                            <span className="font-medium">Total Available:</span> {selectedTicket.total}
                                        </p>
                                    )}
                                    {selectedTicket.usageLimit && (
                                        <p>
                                            <span className="font-medium">Usage Limit:</span> {selectedTicket.usageLimit}
                                        </p>
                                    )}
                                    {(selectedTicket.startDate || selectedTicket.endDate) && (
                                        <p>
                                            <span className="font-medium">Valid:</span>{' '}
                                            {selectedTicket.startDate
                                                ? new Date(selectedTicket.startDate).toLocaleDateString()
                                                : '—'}{' '}
                                            →{' '}
                                            {selectedTicket.endDate
                                                ? new Date(selectedTicket.endDate).toLocaleDateString()
                                                : '—'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleCollect(selectedTicket.id)}
                                    disabled={collecting === selectedTicket.id}
                                    className={`mt-6 w-full py-2 font-semibold rounded-lg transition-all duration-200 ${
                                        collecting === selectedTicket.id
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {collecting === selectedTicket.id ? 'Collecting...' : 'Collect Ticket'}
                                </button>
                            </>
                        )}
                    </div>

                    <style>
                        {`
                          @keyframes fadeInUp {
                            from {
                              opacity: 0;
                              transform: translateY(20px);
                            }
                            to {
                              opacity: 1;
                              transform: translateY(0);
                            }
                          }
                        `}
                    </style>
                </div>
            )}

        </div>
    );
};
