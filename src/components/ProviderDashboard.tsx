"use client";

import { useRequest } from "@/context/RequestContext";
import { Check, X, MapPin, Phone, User, Clock, AlertTriangle } from "lucide-react";

export default function ProviderDashboard() {
    const { requests, respondToRequest, dismissRequest } = useRequest();

    // Filter only pending requests for the dashboard
    const pendingRequests = requests.filter(req => req.status === 'PENDING');

    if (pendingRequests.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-600 mt-2">There are no pending requests in your area right now.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                Live Requests ({pendingRequests.length})
            </h2>

            <div className="grid gap-4">
                {pendingRequests.map((req) => (
                    <div key={req.id} className={`bg-white rounded-xl shadow-md border-l-4 p-6 transition-all hover:shadow-lg ${req.urgency === 'HIGH' ? 'border-red-500' : req.urgency === 'MEDIUM' ? 'border-yellow-500' : 'border-blue-500'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.type === 'BLOOD' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {req.type}
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${req.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {req.urgency === 'HIGH' && <AlertTriangle size={12} />}
                                        {req.urgency} URGENCY
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(req.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{req.itemName}</h3>
                                {req.description && <p className="text-gray-600 text-sm mt-1">{req.description}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700">
                                <User size={18} className="text-gray-400" />
                                <span className="font-medium">{req.userName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={18} className="text-gray-400" />
                                <span className="font-medium">{req.userContact}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                                <MapPin size={18} className="text-gray-400" />
                                <span className="font-medium">{req.userAddress}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => respondToRequest(req.id, {
                                    name: "City Hospital / Pharmacy",
                                    contact: "+1 234 567 8900",
                                    address: "123 Medical Center Dr"
                                })}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check size={20} />
                                I Have It
                            </button>
                            <button
                                onClick={() => dismissRequest(req.id)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={20} />
                                Ignore
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
