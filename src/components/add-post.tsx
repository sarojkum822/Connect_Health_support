"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Smile, X, MessageSquarePlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRequest } from "@/context/RequestContext";

export function AddPost() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUserType } = useRequest(); // Assuming we can get user info here, or we'll use a placeholder

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), {
                content: content,
                author: "Anonymous User", // Replace with actual user name if available
                role: currentUserType || "User",
                timestamp: serverTimestamp(),
                likes: 0,
                type: "feedback" // Default type
            });
            setContent("");
            setIsOpen(false);
        } catch (error) {
            console.error("Error adding post: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <MessageSquarePlus size={20} />
                    </div>
                    <span className="text-gray-500 text-lg group-hover:text-gray-700">Share your story or feedback...</span>
                </button>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex-shrink-0" />
                            <div className="flex-1">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your health story or ask for help..."
                                    className="w-full resize-none border-none focus:ring-0 text-lg placeholder-gray-400 min-h-[120px] p-0"
                                    autoFocus
                                />
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                    <div className="flex gap-2 text-blue-500">
                                        <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                                            <ImageIcon size={20} />
                                        </button>
                                        <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                                            <Smile size={20} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!content.trim() || isSubmitting}
                                    >
                                        <span>{isSubmitting ? "Posting..." : "Post"}</span>
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
