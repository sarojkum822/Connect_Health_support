"use client";

import { useState } from "react";
import { Droplet, Users, Plus } from "lucide-react";
import { useRequest } from "@/context/RequestContext";
import RequestModal from "@/components/RequestModal";
import Link from "next/link";

export default function BloodPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, currentUserType } = useRequest();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-600 rounded-2xl p-8 text-white mb-12 shadow-lg">
                <div className="md:flex justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold mb-2">Blood Donation Saves Lives</h1>
                        <p className="text-red-100 max-w-xl">
                            Find blood donors near you or register yourself as a donor.
                            In emergencies, post a request to notify nearby donors and hospitals instantly.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {isLoggedIn && currentUserType === 'USER' ? (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-md"
                            >
                                <Plus size={20} />
                                Request Blood
                            </button>
                        ) : !isLoggedIn && (
                            <Link href="/login" className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-md">
                                <Plus size={20} />
                                Login to Request
                            </Link>
                        )}
                        <button className="bg-red-700 text-white border border-red-500 px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition-colors">
                            Register as Donor
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
                    <button key={type} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-red-500 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-800 group-hover:text-red-600">{type}</span>
                            <Droplet className="text-gray-300 group-hover:text-red-500" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Find Donors</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="text-red-600" />
                    Recent Donors
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-4 font-semibold text-gray-600">Name</th>
                                <th className="pb-4 font-semibold text-gray-600">Blood Group</th>
                                <th className="pb-4 font-semibold text-gray-600">Location</th>
                                <th className="pb-4 font-semibold text-gray-600">Last Donation</th>
                                <th className="pb-4 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="py-4">John Doe {i}</td>
                                    <td className="py-4">
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">O+</span>
                                    </td>
                                    <td className="py-4 text-gray-600">New York, NY</td>
                                    <td className="py-4 text-gray-600">3 months ago</td>
                                    <td className="py-4">
                                        <button className="text-blue-600 hover:underline font-medium">Contact</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType="BLOOD"
            />
        </div>
    );
}
