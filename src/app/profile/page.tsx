"use client";

import { useState, useEffect } from "react";
import { useRequest } from "@/context/RequestContext";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { User, Heart, Droplet, Pill, Settings, Shield, Bell, Award, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
    name: string;
    email: string;
    bloodType: string;
    allergies: string;
    emergencyContact: string;
    notificationPreferences: {
        bloodRequests: boolean;
        medicineRequests: boolean;
        emailNotifications: boolean;
    };
}

interface UserStats {
    requestsMade: number;
    responsesGiven: number;
    requestsFulfilled: number;
}

export default function ProfilePage() {
    const { isLoggedIn, currentUserType } = useRequest();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'settings'>('profile');

    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        bloodType: "",
        allergies: "",
        emergencyContact: "",
        notificationPreferences: {
            bloodRequests: true,
            medicineRequests: true,
            emailNotifications: true
        }
    });

    const [stats, setStats] = useState<UserStats>({
        requestsMade: 0,
        responsesGiven: 0,
        requestsFulfilled: 0
    });

    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        loadUserProfile();
    }, [isLoggedIn]);

    const loadUserProfile = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // Load profile
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setProfile({
                    name: data.name || user.displayName || "",
                    email: user.email || "",
                    bloodType: data.bloodType || "",
                    allergies: data.allergies || "",
                    emergencyContact: data.emergencyContact || "",
                    notificationPreferences: data.notificationPreferences || {
                        bloodRequests: true,
                        medicineRequests: true,
                        emailNotifications: true
                    }
                });
            }

            // Load stats
            const requestsQuery = query(
                collection(db, "requests"),
                where("userId", "==", user.uid)
            );
            const requestsSnapshot = await getDocs(requestsQuery);
            const requestsMade = requestsSnapshot.size;
            const requestsFulfilled = requestsSnapshot.docs.filter(doc =>
                doc.data().status === 'fulfilled'
            ).length;

            // Count responses given
            const allRequestsQuery = query(collection(db, "requests"));
            const allRequestsSnapshot = await getDocs(allRequestsQuery);
            let responsesGiven = 0;
            allRequestsSnapshot.forEach(doc => {
                const responses = doc.data().responses || [];
                if (responses.some((r: any) => r.userId === user.uid)) {
                    responsesGiven++;
                }
            });

            setStats({
                requestsMade,
                responsesGiven,
                requestsFulfilled
            });

            // Load recent activity
            const recentQuery = query(
                collection(db, "requests"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(5)
            );
            const recentSnapshot = await getDocs(recentQuery);
            const activities = recentSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecentActivity(activities);

        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const user = auth.currentUser;
            if (!user) return;

            await updateDoc(doc(db, "users", user.uid), {
                bloodType: profile.bloodType,
                allergies: profile.allergies,
                emergencyContact: profile.emergencyContact,
                notificationPreferences: profile.notificationPreferences
            });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                            {profile.name[0] || "U"}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                            <p className="text-gray-500">{profile.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                    {currentUserType}
                                </span>
                                {profile.bloodType && (
                                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Droplet size={14} /> {profile.bloodType}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{stats.requestsMade}</div>
                            <div className="text-sm text-gray-500">Requests Made</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{stats.responsesGiven}</div>
                            <div className="text-sm text-gray-500">Responses Given</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-teal-600">{stats.requestsFulfilled}</div>
                            <div className="text-sm text-gray-500">Fulfilled</div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'profile'
                                ? 'bg-white text-blue-600 shadow-sm border border-gray-100'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <User size={18} className="inline mr-2" />
                        Profile Info
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'activity'
                                ? 'bg-white text-blue-600 shadow-sm border border-gray-100'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Activity size={18} className="inline mr-2" />
                        Recent Activity
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'settings'
                                ? 'bg-white text-blue-600 shadow-sm border border-gray-100'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Settings size={18} className="inline mr-2" />
                        Settings
                    </button>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                >
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blood Type
                                </label>
                                <select
                                    value={profile.bloodType}
                                    onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Blood Type</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Allergies
                                </label>
                                <textarea
                                    value={profile.allergies}
                                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                                    placeholder="List any allergies (e.g., Penicillin, Peanuts)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Emergency Contact
                                </label>
                                <input
                                    type="tel"
                                    value={profile.emergencyContact}
                                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                            {recentActivity.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No recent activity
                                </div>
                            ) : (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${activity.type === 'BLOOD' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {activity.type === 'BLOOD' ? <Droplet size={20} /> : <Pill size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{activity.itemName}</h3>
                                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {activity.createdAt?.toDate().toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'fulfilled' ? 'bg-green-50 text-green-600' :
                                                    activity.status === 'responded' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-yellow-50 text-yellow-600'
                                                }`}>
                                                {activity.status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Droplet className="text-red-500" size={20} />
                                        <div>
                                            <div className="font-medium text-gray-900">Blood Requests</div>
                                            <div className="text-sm text-gray-500">Get notified about urgent blood requests</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notificationPreferences.bloodRequests}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            notificationPreferences: {
                                                ...profile.notificationPreferences,
                                                bloodRequests: e.target.checked
                                            }
                                        })}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Pill className="text-blue-500" size={20} />
                                        <div>
                                            <div className="font-medium text-gray-900">Medicine Requests</div>
                                            <div className="text-sm text-gray-500">Get notified about medicine availability</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notificationPreferences.medicineRequests}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            notificationPreferences: {
                                                ...profile.notificationPreferences,
                                                medicineRequests: e.target.checked
                                            }
                                        })}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Bell className="text-green-500" size={20} />
                                        <div>
                                            <div className="font-medium text-gray-900">Email Notifications</div>
                                            <div className="text-sm text-gray-500">Receive updates via email</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notificationPreferences.emailNotifications}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            notificationPreferences: {
                                                ...profile.notificationPreferences,
                                                emailNotifications: e.target.checked
                                            }
                                        })}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </label>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Preferences"}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
