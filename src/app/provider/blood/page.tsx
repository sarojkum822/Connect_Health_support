"use client";

import { useState } from "react";
import { Users, FileText, Megaphone, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRequest } from "@/context/RequestContext";
import toast from "react-hot-toast";

export default function ProviderBloodDashboard() {
    const [showModal, setShowModal] = useState(false);
    const { addRequest } = useRequest();
    const [formData, setFormData] = useState({
        title: "",
        bloodType: "A+",
        urgency: "MEDIUM",
        location: "",
        contact: "",
        description: "",
        units: "1"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addRequest({
                type: 'BLOOD',
                itemName: formData.bloodType,
                userName: formData.title,
                userAddress: formData.location,
                userContact: formData.contact,
                description: formData.description,
                urgency: formData.urgency as 'HIGH' | 'MEDIUM' | 'LOW',
                userId: 'provider-blood'
            });

            toast.success("Blood request created successfully!");
            setShowModal(false);
            setFormData({
                title: "",
                bloodType: "A+",
                urgency: "MEDIUM",
                location: "",
                contact: "",
                description: "",
                units: "1"
            });
        } catch (error) {
            console.error("Error creating request:", error);
            toast.error("Failed to create request");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blood Services Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage donors, requests, and campaigns.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gray-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
                    >
                        + Create New Post
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats Column */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Registered Donors</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">1,248</p>
                            <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm">
                                <Users size={16} className="mr-1" />
                                <span>+12 this week</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Requests</h3>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">5</p>
                            <div className="mt-4 flex items-center text-red-600 dark:text-red-400 text-sm">
                                <FileText size={16} className="mr-1" />
                                <span>2 Critical</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Recent Donor Registrations */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Donor Registrations</h2>
                                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                                                JD
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">John Doe</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">O+ • Mumbai</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                                                <Check size={18} />
                                            </button>
                                            <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Campaigns */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Active Campaigns</h2>
                                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Manage</button>
                            </div>
                            <div className="p-6">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100">Mega Blood Donation Drive</h3>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">Active</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Dec 15, 2024 • Community Center</p>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>120 Registered</span>
                                        <span>Goal: 200</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Blood Request</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Post a new blood donation request</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Request Title / Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., Emergency Blood Needed for Surgery"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Blood Type
                                        </label>
                                        <select
                                            value={formData.bloodType}
                                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Urgency
                                        </label>
                                        <select
                                            value={formData.urgency}
                                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Hospital name and address"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description / Additional Details
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Provide any additional information about the requirement..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Create Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
