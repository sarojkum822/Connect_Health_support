"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRequest } from "@/context/RequestContext";
import Link from "next/link";

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { requests } = useRequest();
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const searchQuery = query.toLowerCase();
        const filtered = requests.filter(req =>
            req.itemName?.toLowerCase().includes(searchQuery) ||
            req.description?.toLowerCase().includes(searchQuery) ||
            req.userName?.toLowerCase().includes(searchQuery) ||
            req.userAddress?.toLowerCase().includes(searchQuery)
        ).slice(0, 5);

        setResults(filtered);
    }, [query, requests]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <Search size={16} />
                <span>Search...</span>
                <kbd className="px-2 py-0.5 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">⌘K</kbd>
            </button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4"
                onClick={() => setIsOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                >
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search requests, hospitals, posts..."
                            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                            autoFocus
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto p-2">
                        {results.length === 0 && query.trim() !== "" && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No results found
                            </div>
                        )}
                        {results.length === 0 && query.trim() === "" && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                Start typing to search...
                            </div>
                        )}
                        {results.map((result) => (
                            <Link
                                key={result.id}
                                href={result.type === 'BLOOD' ? '/blood/feed' : '/feed'}
                                onClick={() => setIsOpen(false)}
                                className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${result.type === 'BLOOD'
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                        }`}>
                                        {result.type}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {result.itemName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {result.description}
                                        </div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {result.userAddress}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
