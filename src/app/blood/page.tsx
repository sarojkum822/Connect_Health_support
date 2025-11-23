"use client";

import Link from "next/link";
import { Heart, Users, Activity, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function BloodPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Blood Donation Hub
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Connect with donors, find blood drives, and save lives. Your contribution matters.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Donate Blood Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                            <Heart size={32} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Donate Blood</h2>
                        <p className="text-gray-600 mb-8 flex-grow">
                            Register as a donor to help those in need. You'll be notified when there's an emergency nearby.
                        </p>
                        <Link
                            href="/blood/register"
                            className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                        >
                            Register as Donor
                        </Link>
                    </motion.div>

                    {/* Find Blood / Feed Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                            <Activity size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Blood Requests</h2>
                        <p className="text-gray-600 mb-8 flex-grow">
                            View urgent blood requests and donation campaigns from hospitals in your area.
                        </p>
                        <Link
                            href="/blood/feed"
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            View Requests
                        </Link>
                    </motion.div>

                    {/* For Hospitals Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 text-teal-600">
                            <Calendar size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">For Hospitals</h2>
                        <p className="text-gray-600 mb-8 flex-grow">
                            Organize blood drives and manage emergency requests. Connect with registered donors.
                        </p>
                        <Link
                            href="/provider/blood"
                            className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
                        >
                            Provider Dashboard
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
