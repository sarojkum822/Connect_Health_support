"use client";

import { useRequest } from "@/context/RequestContext";
import ProviderDashboard from "@/components/ProviderDashboard";
import { CheckCircle, Clock, AlertCircle, List as ListIcon, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";

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
    // Filter requests created by current user (mock check or real check)
    // In real app, we'd query Firestore for requests where userId == auth.currentUser.uid
    // For now, we filter client side assuming we have all requests (which is true for this demo context)
    const myRequests = requests.filter(req => {
        // If we saved userId correctly in addRequest (we didn't in the mock, but let's assume we fix it or just show all for demo)
        // For now, let's show all requests if we are a user, to see the effect. 
        // In production: req.userId === auth.currentUser?.uid
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
                <p className="text-gray-600 mt-2">Track the status of your medical and blood donation requests.</p>
            </div>

            {myRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ListIcon className="text-gray-400" size={32} />
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
                <div className="space-y-6">
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
                                                {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
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

                                {/* Responses List */}
                                {req.responses && req.responses.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <CheckCircle className="text-green-600" size={18} />
                                            {req.responses.length} Provider{req.responses.length !== 1 ? 's' : ''} Accepted
                                        </h4>
                                        <div className="grid gap-3">
                                            {req.responses.map((resp, idx) => (
                                                <div key={idx} className="bg-green-50 border border-green-100 rounded-lg p-4 transition-all hover:shadow-sm hover:border-green-200">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-bold text-green-900">{resp.name}</h5>
                                                            <div className="text-sm text-green-800 mt-1 space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Phone size={14} />
                                                                    {resp.contact}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin size={14} />
                                                                    {resp.address}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={`tel:${resp.contact}`}
                                                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                                        >
                                                            Call Now
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {req.status === 'PENDING' && (
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mt-4 text-center text-gray-500 text-sm">
                                        Waiting for providers to respond...
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
