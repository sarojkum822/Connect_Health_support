"use client";

import { useRequest } from "@/context/RequestContext";
import ProviderDashboard from "@/components/ProviderDashboard";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RequestsPage() {
    const { currentUserType, requests, isLoggedIn } = useRequest();

    if (!isLoggedIn) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to view your requests or manage incoming requests.</p>
                    <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    // Provider View
    if (currentUserType === 'PROVIDER') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage incoming requests from users in your area.</p>
                </div>
                <ProviderDashboard />
            </div>
        );
    }

    // User View
    const myRequests = requests.filter(req => req.userId === 'user-123'); // Mock ID matching RequestModal

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
                <p className="text-gray-600 mt-2">Track the status of your medical and blood donation requests.</p>
            </div>

            {myRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <List className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No Requests Yet</h3>
                    <p className="text-gray-600 mt-2 mb-6">You haven't posted any requests yet.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/medic" className="text-blue-600 font-medium hover:underline">Request Medicine</Link>
                        <span className="text-gray-300">|</span>
                        <Link href="/blood" className="text-red-600 font-medium hover:underline">Request Blood</Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {myRequests.map((req) => (
                        <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.type === 'BLOOD' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {req.type}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{req.itemName}</h3>
                                        {req.description && <p className="text-gray-600 text-sm mt-1">{req.description}</p>}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${req.status === 'ACCEPTED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {req.status === 'ACCEPTED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                        {req.status}
                                    </div>
                                </div>

                                {req.status === 'ACCEPTED' && req.acceptedBy && (
                                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-4">
                                        <h4 className="font-bold text-green-800 mb-2">Accepted By Provider</h4>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 block">Name</span>
                                                <span className="font-medium text-gray-900">{req.acceptedBy.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Contact</span>
                                                <span className="font-medium text-gray-900">{req.acceptedBy.contact}</span>
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-gray-500 block">Address</span>
                                                <span className="font-medium text-gray-900">{req.acceptedBy.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function List({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
    )
}
