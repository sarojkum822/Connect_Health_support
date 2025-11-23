"use client";

import { useState, useEffect } from "react";

import { useRequest } from "@/context/RequestContext";
import RequestModal from "@/components/RequestModal";
import AddHospitalForm from "@/components/AddHospitalForm";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Plus, Navigation, Trash2, Pencil, Save, X } from "lucide-react";

interface Hospital {
    id: string;
    name: string;
    address: string;
    contact: string;
    description: string;
    location?: { lat: number; lng: number };
}

export default function MedicPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn, currentUserType, isAdmin } = useRequest();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Hospital>>({});

    // Fetch Hospitals Real-time
    useEffect(() => {
        const q = query(collection(db, "hospitals"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const hospitalList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Hospital[];
            setHospitals(hospitalList);
        }, (error) => {
            console.error("Error fetching hospitals:", error);
            // Gracefully handle permission error (e.g. if user not logged in and rules block read)
            setHospitals([]);
        });

        return () => unsubscribe();
    }, []);

    const startEditing = (hospital: Hospital) => {
        setEditingId(hospital.id);
        setEditForm({
            name: hospital.name,
            address: hospital.address,
            contact: hospital.contact,
            description: hospital.description
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = async (hospitalId: string) => {
        try {
            await updateDoc(doc(db, "hospitals", hospitalId), editForm);
            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error("Error updating hospital:", error);
            alert("Failed to update store");
        }
    };

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Medicines & Stores</h1>
                    <p className="text-gray-600">Search for medicines or post a request if you can't find what you need.</p>
                </div>

                <div className="flex gap-3">
                    {isLoggedIn && currentUserType === 'USER' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                        >
                            <Plus size={20} />
                            Post Medicine Request
                        </motion.button>
                    )}

                    {!isLoggedIn && (
                        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
                            <Plus size={20} />
                            Login to Post Request
                        </Link>
                    )}
                </div>
            </motion.div>

            {/* Provider: Add Hospital Form */}
            {isLoggedIn && currentUserType === 'PROVIDER' && (
                <AddHospitalForm />
            )}

            {/* Search Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-12"
            >
                <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        Search
                    </motion.button>
                </div>
            </motion.div>

            {/* Store Listings */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredHospitals.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full text-center py-12 text-gray-500"
                        >
                            No hospitals or shops found. Providers can add them above.
                        </motion.div>
                    ) : (
                        filteredHospitals.map((hospital) => (
                            <motion.div
                                key={hospital.id}
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow relative group"
                            >
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(hospital);
                                            }}
                                            className="p-2 bg-white text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors shadow-md border border-blue-100"
                                            title="Edit Store"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm("Are you sure you want to delete this store?")) {
                                                    deleteDoc(doc(db, "hospitals", hospital.id));
                                                }
                                            }}
                                            className="p-2 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors shadow-md border border-red-100"
                                            title="Delete Store"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                                <div className="h-48 bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                                        Store Image
                                    </div>
                                    {hospital.location && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.location.lat},${hospital.location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md text-blue-600 hover:bg-blue-50"
                                            title="View on Map"
                                        >
                                            <Navigation size={20} />
                                        </a>
                                    )}
                                </div>
                                <div className="p-5">
                                    {editingId === hospital.id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editForm.name || ""}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full p-2 border rounded text-lg font-bold"
                                                placeholder="Store Name"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.address || ""}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Address"
                                            />
                                            <textarea
                                                value={editForm.description || ""}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Description"
                                                rows={2}
                                            />
                                            <input
                                                type="text"
                                                value={editForm.contact || ""}
                                                onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                                                className="w-full p-2 border rounded text-sm font-medium"
                                                placeholder="Contact Number"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={cancelEditing}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                                >
                                                    <X size={14} /> Cancel
                                                </button>
                                                <button
                                                    onClick={() => saveEdit(hospital.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                >
                                                    <Save size={14} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
                                                <span className="flex items-center text-sm font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded">
                                                    <Star size={14} className="fill-current mr-1" />
                                                    New
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                                                <MapPin size={14} /> {hospital.address}
                                            </p>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                {hospital.description || "No description provided."}
                                            </p>
                                            <div className="flex gap-2 mb-4">
                                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">Open Now</span>
                                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">Delivery Available</span>
                                            </div>
                                            <a href={`tel:${hospital.contact}`} className="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                                                Call: {hospital.contact}
                                            </a>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType="MEDIC"
            />
        </div>
    );
}
