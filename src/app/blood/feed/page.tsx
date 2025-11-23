"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, AlertCircle, Phone, Share2, Droplet, Info, Trash2, Pencil, Save, X, Filter, SlidersHorizontal } from "lucide-react";
import { useRequest } from "@/context/RequestContext";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from "@/components/StatusBadge";

// Mock Campaigns (Keep static for now or move to DB later if needed)
const CAMPAIGNS = [
    {
        id: 1,
        title: "Mega Blood Donation Drive",
        organizer: "Red Cross Society",
        date: "Dec 15, 2024",
        time: "9:00 AM - 5:00 PM",
        location: "Community Center, Bangalore",
        description: "Join us for our annual blood donation camp. Every donor gets a certificate and refreshments.",
        registered: 120
    },
    {
        id: 2,
        title: "Corporate Life Saver Week",
        organizer: "Tech Park Association",
        date: "Dec 20, 2024",
        time: "10:00 AM - 4:00 PM",
        location: "Cyber City, Hyderabad",
        description: "Calling all techies! Take a break and save a life.",
        registered: 45
    }
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodFeedPage() {
    const [activeTab, setActiveTab] = useState<'requests' | 'campaigns'>('requests');
    const { requests, isAdmin, updateRequestStatus } = useRequest();

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        bloodType: 'all',
        urgency: 'all',
        status: 'all'
    });

    // Filter for Blood requests
    const bloodRequests = useMemo(() => {
        let filtered = requests.filter(req => req.type === 'BLOOD');

        if (filters.bloodType !== 'all') {
            filtered = filtered.filter(req => req.itemName === filters.bloodType);
        }

        if (filters.urgency !== 'all') {
            filtered = filtered.filter(req => req.urgency === filters.urgency);
        }

        if (filters.status !== 'all') {
            filtered = filtered.filter(req => (req.status || 'pending') === filters.status);
        }

        return filtered;
    }, [requests, filters]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this request?")) {
            try {
                await deleteDoc(doc(db, "requests", id));
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        }
    };

    const startEditing = (req: any) => {
        setEditingId(req.id);
        setEditForm({
            userName: req.userName,
            userAddress: req.userAddress,
            userContact: req.userContact,
            description: req.description,
            urgency: req.urgency,
            itemName: req.itemName // Blood Group
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = async (reqId: string) => {
        try {
            await updateDoc(doc(db, "requests", reqId), editForm);
            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Failed to update request");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header Section with Illustration Placeholder */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Live Blood Feed
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Real-time updates on blood requirements and donation drives. Your timely response can save a life today.
                        </p>
                    </div>
                    <div className="md:w-1/3 flex justify-center">
                        {/* Minimalist Illustration Placeholder using Icons */}
                        <div className="relative w-48 h-48">
                            <div className="absolute inset-0 bg-red-50 rounded-full opacity-50 animate-pulse"></div>
                            <div className="absolute inset-4 bg-red-100 rounded-full opacity-50"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-red-500">
                                <Droplet size={80} fill="currentColor" className="drop-shadow-xl" />
                            </div>
                            <div className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-md">
                                <AlertCircle size={24} className="text-red-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'requests'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            Emergency Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('campaigns')}
                            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'campaigns'
                                ? 'bg-teal-600 text-white shadow-lg'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            Donation Campaigns
                        </button>
                    </div>
                </div>

                {/* Filters for Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-4"
                        >
                            <SlidersHorizontal size={18} />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                            {(filters.bloodType !== 'all' || filters.urgency !== 'all' || filters.status !== 'all') && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                    Active
                                </span>
                            )}
                        </button>

                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Blood Type
                                        </label>
                                        <select
                                            value={filters.bloodType}
                                            onChange={(e) => setFilters({ ...filters, bloodType: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Types</option>
                                            {BLOOD_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgency
                                        </label>
                                        <select
                                            value={filters.urgency}
                                            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Levels</option>
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="responded">Responded</option>
                                            <option value="fulfilled">Fulfilled</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setFilters({ bloodType: 'all', urgency: 'all', status: 'all' })}
                                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </motion.div>
                        )}

                        <div className="text-sm text-gray-500 mt-4">
                            Showing {bloodRequests.length} request{bloodRequests.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === 'requests' ? (
                        bloodRequests.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No active blood requests at the moment.
                            </div>
                        ) : (
                            bloodRequests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:w-2 transition-all"></div>

                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditing(req);
                                                }}
                                                className="p-2 bg-white text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors shadow-md border border-blue-100"
                                                title="Edit Request"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(req.id);
                                                }}
                                                className="p-2 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors shadow-md border border-red-100"
                                                title="Delete Request"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}

                                    {editingId === req.id ? (
                                        <div className="space-y-3 pl-4 pt-8">
                                            <div className="flex gap-2">
                                                <select
                                                    value={editForm.urgency || 'MEDIUM'}
                                                    onChange={(e) => setEditForm({ ...editForm, urgency: e.target.value })}
                                                    className="p-2 border rounded text-sm bg-white"
                                                >
                                                    <option value="HIGH">High Urgency</option>
                                                    <option value="MEDIUM">Medium Urgency</option>
                                                    <option value="LOW">Low Urgency</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={editForm.itemName || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                                                    className="w-20 p-2 border rounded text-sm font-bold text-center"
                                                    placeholder="Group"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={editForm.userName || ""}
                                                onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                                                className="w-full p-2 border rounded text-lg font-bold"
                                                placeholder="Patient/Hospital Name"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.userAddress || ""}
                                                onChange={(e) => setEditForm({ ...editForm, userAddress: e.target.value })}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Location"
                                            />
                                            <textarea
                                                value={editForm.description || ""}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Description/Condition"
                                                rows={2}
                                            />
                                            <input
                                                type="text"
                                                value={editForm.userContact || ""}
                                                onChange={(e) => setEditForm({ ...editForm, userContact: e.target.value })}
                                                className="w-full p-2 border rounded text-sm font-medium"
                                                placeholder="Contact Number"
                                            />
                                            <div className="flex gap-2 justify-end mt-2">
                                                <button
                                                    onClick={cancelEditing}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                                >
                                                    <X size={14} /> Cancel
                                                </button>
                                                <button
                                                    onClick={() => saveEdit(req.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                >
                                                    <Save size={14} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-6 pl-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-bold tracking-wider uppercase px-2 py-1 rounded-md ${req.urgency === 'HIGH' ? 'text-red-500 bg-red-50' :
                                                            req.urgency === 'MEDIUM' ? 'text-orange-500 bg-orange-50' :
                                                                'text-blue-500 bg-blue-50'
                                                            }`}>
                                                            {req.urgency}
                                                        </span>
                                                        <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                                            <Clock size={12} /> {req.createdAt ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{req.userName}</h3>
                                                    <div className="flex items-center text-gray-500 text-sm gap-1 mt-1">
                                                        <MapPin size={14} />
                                                        {req.userAddress}
                                                    </div>
                                                </div>

                                                {/* Prominent Blood Group - Assuming itemName holds blood group for now or we need a field */}
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 font-black text-3xl shadow-inner border border-red-100 group-hover:scale-110 transition-transform">
                                                        {req.itemName}
                                                    </div>
                                                    {/* <span className="text-xs font-medium text-gray-400 mt-1">{req.units} Units</span> */}
                                                </div>
                                            </div>

                                            {/* Conditions Section */}
                                            {req.description && (
                                                <div className="bg-gray-50 rounded-xl p-4 mb-6 pl-4 border border-gray-100">
                                                    <div className="flex items-start gap-3">
                                                        <Info size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">Note:</p>
                                                            <p className="text-sm text-gray-900 font-semibold">{req.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3 pl-4">
                                                <a href={`tel:${req.userContact}`} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                                                    <Phone size={18} />
                                                    Connect
                                                </a>
                                                <button className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                                                    <Share2 size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))
                        )
                    ) : (
                        CAMPAIGNS.map((camp) => (
                            <motion.div
                                key={camp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-teal-100 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 group-hover:w-2 transition-all"></div>

                                <div className="flex justify-between items-start mb-6 pl-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl mb-1">{camp.title}</h3>
                                        <p className="text-teal-600 font-medium text-sm">{camp.organizer}</p>
                                    </div>
                                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-center border border-teal-100">
                                        <span className="block text-xs font-bold uppercase tracking-wider">Dec</span>
                                        <span className="block text-2xl font-black">{camp.date.split(' ')[1].replace(',', '')}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 text-sm leading-relaxed pl-4">
                                    {camp.description}
                                </p>

                                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500 pl-4">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <Clock size={16} className="text-teal-500" />
                                        {camp.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <MapPin size={16} className="text-teal-500" />
                                        {camp.location}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 pl-4 mt-auto">
                                    <span className="text-sm text-gray-500">
                                        <strong className="text-gray-900">{camp.registered}</strong> registered
                                    </span>
                                    <button className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100">
                                        Register Now
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
