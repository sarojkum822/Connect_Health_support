"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useRequest } from "@/context/RequestContext";

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultType?: 'MEDIC' | 'BLOOD';
}

export default function RequestModal({ isOpen, onClose, defaultType = 'MEDIC' }: RequestModalProps) {
    const { addRequest } = useRequest();
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>("MEDIUM");
    const [type, setType] = useState<'MEDIC' | 'BLOOD'>(defaultType);

    // Mock user details (in a real app, these would come from auth)
    const [userName, setUserName] = useState("");
    const [userContact, setUserContact] = useState("");
    const [userAddress, setUserAddress] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addRequest({
            itemName,
            description,
            urgency,
            type,
            userId: 'user-123', // Mock ID
            userName,
            userContact,
            userAddress
        });
        onClose();
        // Reset form
        setItemName("");
        setDescription("");
        setUserName("");
        setUserContact("");
        setUserAddress("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertCircle size={24} />
                        Post Request
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={type === 'MEDIC'}
                                    onChange={() => setType('MEDIC')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-900">Medicine</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={type === 'BLOOD'}
                                    onChange={() => setType('BLOOD')}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <span className="text-gray-900">Blood</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {type === 'MEDIC' ? 'Medicine Name' : 'Blood Group Needed'}
                        </label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder={type === 'MEDIC' ? "e.g., Paracetamol 500mg" : "e.g., O+ Positive"}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                        <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="LOW">Low - Can wait 24h</option>
                            <option value="MEDIUM">Medium - Needed today</option>
                            <option value="HIGH">High - Emergency</option>
                        </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Contact Details</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Your Name"
                                required
                            />
                            <input
                                type="tel"
                                value={userContact}
                                onChange={(e) => setUserContact(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Phone Number"
                                required
                            />
                            <textarea
                                value={userAddress}
                                onChange={(e) => setUserAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Delivery Address / Hospital Location"
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-colors ${type === 'MEDIC' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        Post Request
                    </button>
                </form>
            </div>
        </div>
    );
}
