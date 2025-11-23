"use client";

import { useState, useEffect } from "react";
import { useRequest } from "@/context/RequestContext";
import { motion } from "framer-motion";
import { Users, FileText, Heart, TrendingUp, Calendar, Download } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AnalyticsData {
    totalUsers: number;
    totalRequests: number;
    totalBloodRequests: number;
    totalMedicineRequests: number;
    fulfilledRequests: number;
    pendingRequests: number;
    thisMonthRequests: number;
}

export default function AnalyticsPage() {
    const { isAdmin, isLoggedIn } = useRequest();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalUsers: 0,
        totalRequests: 0,
        totalBloodRequests: 0,
        totalMedicineRequests: 0,
        fulfilledRequests: 0,
        pendingRequests: 0,
        thisMonthRequests: 0
    });

    useEffect(() => {
        if (!isLoggedIn || !isAdmin) {
            router.push('/');
            return;
        }
        loadAnalytics();
    }, [isLoggedIn, isAdmin]);

    const loadAnalytics = async () => {
        try {
            // Get all requests
            const requestsSnapshot = await getDocs(collection(db, "requests"));
            const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Get all users
            const usersSnapshot = await getDocs(collection(db, "users"));

            // Calculate this month's requests
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const thisMonthReqs = requests.filter((req: any) => {
                const createdAt = req.createdAt?.toDate();
                return createdAt && createdAt >= firstDayOfMonth;
            });

            setAnalytics({
                totalUsers: usersSnapshot.size,
                totalRequests: requests.length,
                totalBloodRequests: requests.filter((r: any) => r.type === 'BLOOD').length,
                totalMedicineRequests: requests.filter((r: any) => r.type === 'MEDICINE').length,
                fulfilledRequests: requests.filter((r: any) => r.status === 'fulfilled').length,
                pendingRequests: requests.filter((r: any) => !r.status || r.status === 'pending').length,
                thisMonthRequests: thisMonthReqs.length
            });
        } catch (error) {
            console.error("Error loading analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400">Loading analytics...</div>
            </div>
        );
    }

    const stats = [
        { label: "Total Users", value: analytics.totalUsers, icon: Users, color: "blue" },
        { label: "Total Requests", value: analytics.totalRequests, icon: FileText, color: "purple" },
        { label: "Blood Requests", value: analytics.totalBloodRequests, icon: Heart, color: "red" },
        { label: "Medicine Requests", value: analytics.totalMedicineRequests, icon: TrendingUp, color: "green" },
        { label: "Fulfilled", value: analytics.fulfilledRequests, icon: TrendingUp, color: "teal" },
        { label: "Pending", value: analytics.pendingRequests, icon: Calendar, color: "yellow" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform performance and statistics</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                                        <Icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* This Month Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 text-white shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">This Month's Activity</h2>
                            <p className="text-blue-100">New requests submitted this month</p>
                        </div>
                        <div className="text-6xl font-black opacity-90">{analytics.thisMonthRequests}</div>
                    </div>
                </motion.div>

                {/* Success Rate */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Success Rate</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-green-500 h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${analytics.totalRequests > 0 ? (analytics.fulfilledRequests / analytics.totalRequests) * 100 : 0}%`
                                }}
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {analytics.totalRequests > 0 ? Math.round((analytics.fulfilledRequests / analytics.totalRequests) * 100) : 0}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {analytics.fulfilledRequests} out of {analytics.totalRequests} requests fulfilled
                    </p>
                </div>
            </div>
        </div>
    );
}
