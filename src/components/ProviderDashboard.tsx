"use client";

import { useRequest } from "@/context/RequestContext";
import { CheckCircle, XCircle, Clock, MapPin, Phone, User, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function ProviderDashboard() {
    const { requests, respondToRequest, dismissRequest } = useRequest();

    // Filter requests that are relevant (PENDING or ACCEPTED)
    // We want to see requests that are PENDING, or requests that are ACCEPTED but NOT by me yet
    const pendingRequests = requests.filter(req => {
        const amIResponder = req.responses?.some(r => r.providerId === auth.currentUser?.uid);
        return req.status !== 'REJECTED' && !amIResponder;
    });

    const handleAccept = (requestId: string) => {
        // In a real app, we'd fetch the provider's actual details from their profile
        // For this demo, we'll use mock details or what's available
        const providerDetails = {
            name: auth.currentUser?.displayName || "Provider",
            contact: "123-456-7890", // Ideally fetched from profile
            address: "123 Medical St" // Ideally fetched from profile
        };
        respondToRequest(requestId, providerDetails);
    };

    if (pendingRequests.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-600 mt-2">There are no new pending requests in your area.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {pendingRequests.map((req) => {
                const responseCount = req.responses?.length || 0;

                return (
                    <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.type === 'BLOOD' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {req.type}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.urgency === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200' :
                                                req.urgency === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                                                    'bg-green-50 text-green-600 border border-green-200'
                                            }`}>
                                            {req.urgency} URGENCY
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock size={12} />
                                            {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleTimeString() : 'Just now'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{req.itemName}</h3>
                                    {req.description && <p className="text-gray-600 text-sm mt-1">{req.description}</p>}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Patient Details</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400" />
                                        <span className="font-medium text-gray-900">{req.userName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="font-medium text-gray-900">{req.userContact}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span className="font-medium text-gray-900">{req.userAddress}</span>
                                    </div>
                                </div>
                            </div>

                            {responseCount > 0 && (
                                <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                    <AlertCircle size={16} />
                                    <span className="font-medium">{responseCount} other provider{responseCount !== 1 ? 's' : ''} already responded. You can still offer help!</span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAccept(req.id)}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    I Have It / Can Help
                                </button>
                                <button
                                    onClick={() => dismissRequest(req.id)}
                                    className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} />
                                    Ignore
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
