"use client";

import React, { useEffect, useState } from 'react';
import { AddPost } from "@/components/add-post";
import { motion } from "motion/react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, Share2, Trash2, Pencil, Save, X } from "lucide-react";
import { useRequest } from "@/context/RequestContext";

interface Post {
    id: string;
    content: string;
    author: string;
    role: string;
    timestamp: any;
    likes: number;
    image?: string;
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useRequest();

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Post[];
            setPosts(newPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (postId: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteDoc(doc(db, "posts", postId));
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    const startEditing = (post: Post) => {
        setEditingId(post.id);
        setEditContent(post.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditContent("");
    };

    const saveEdit = async (postId: string) => {
        try {
            await updateDoc(doc(db, "posts", postId), {
                content: editContent
            });
            setEditingId(null);
            setEditContent("");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post");
        }
    };

    return (
        <main className="w-full min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Share your journey, find support, and connect with the Health Seva community.
                    </p>
                </div>

                <AddPost />

                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No posts yet. Be the first to share!</div>
                    ) : (
                        posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative group"
                            >
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => startEditing(post)}
                                            className="p-2 bg-white text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors shadow-md border border-blue-100"
                                            title="Edit Post"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors shadow-md border border-red-100"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-xl font-bold text-blue-600 flex-shrink-0">
                                        {post.author[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{post.author}</h3>
                                                <p className="text-sm text-gray-500">{post.role} • {post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'Just now'}</p>
                                            </div>
                                        </div>

                                        {editingId === post.id ? (
                                            <div className="mt-3">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                                />
                                                <div className="flex gap-2 mt-2 justify-end">
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => saveEdit(post.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                    >
                                                        <Save size={14} /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-800 mt-3 text-lg leading-relaxed whitespace-pre-wrap">
                                                {post.content}
                                            </p>
                                        )}

                                        {post.image && (
                                            <img src={post.image} alt="Post attachment" className="mt-4 rounded-xl w-full object-cover max-h-[400px]" />
                                        )}

                                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-50">
                                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                                                <Heart size={20} className="group-hover:scale-110 transition-transform" />
                                                <span>{post.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                                                <MessageCircle size={20} />
                                                <span>Comment</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors ml-auto">
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
