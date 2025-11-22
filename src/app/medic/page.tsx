"use client";

import { useState } from "react";
import { Search, MapPin, Star, Plus } from "lucide-react";
import { useRequest } from "@/context/RequestContext";
import RequestModal from "@/components/RequestModal";
import Link from "next/link";

export default function MedicPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, currentUserType } = useRequest();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Medicines & Stores</h1>
                    <p className="text-gray-600">Search for medicines or post a request if you can't find what you need.</p>
                </div>
                {isLoggedIn && currentUserType === 'USER' ? (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        <Plus size={20} />
                        Post Medicine Request
                    </button>
                ) : !isLoggedIn && (
                    <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
                        <Plus size={20} />
                        Login to Post Request
                    </Link>
                )}
            </div>

            {/* Search Section */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for medicines or stores..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="relative w-full md:w-48">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium">
                        Search
                    </button>
                </div>
            </div>

            {/* Store Listings */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-200 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                                Store Image {item}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">City Pharmacy {item}</h3>
                                <span className="flex items-center text-sm font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded">
                                    <Star size={14} className="fill-current mr-1" />
                                    4.5
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                                <MapPin size={14} /> 123 Main St, Downtown
                            </p>
                            <div className="flex gap-2">
                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">Open Now</span>
                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">Delivery Available</span>
                            </div>
                            <button className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType="MEDIC"
            />
        </div>
    );
}
