"use client";

import { useState } from "react";
import { MapPin, Save, Loader2 } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddHospitalForm({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    const handleLocateMe = () => {
        setLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocating(false);
                    // Optional: Reverse geocoding could go here to auto-fill address
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please allow location access.");
                    setLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLocating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) {
            alert("You must be logged in to add a hospital.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "hospitals"), {
                name,
                address,
                contact,
                description,
                location, // { lat, lng } or null
                providerId: auth.currentUser.uid,
                createdAt: serverTimestamp(),
            });

            // Reset form
            setName("");
            setAddress("");
            setContact("");
            setDescription("");
            setLocation(null);

            alert("Hospital/Shop added successfully!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error adding hospital:", error);
            alert("Failed to add hospital. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Save className="text-blue-600" />
                Register Your Medical Shop / Hospital
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. City Care Pharmacy"
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                            type="tel"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 234 567 890"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Coordinates</label>
                        <button
                            type="button"
                            onClick={handleLocateMe}
                            disabled={locating}
                            className={`w-full px-3 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${location
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {locating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                            {location
                                ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                                : "Locate Me (Current Position)"}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Full street address"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description / Services</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 24/7 Emergency, Home Delivery available..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Saving...
                        </>
                    ) : (
                        "Register Hospital/Shop"
                    )}
                </button>
            </form>
        </div>
    );
}
