"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

const FAQ_DATA = [
    {
        category: "Blood Donation",
        questions: [
            {
                q: "Who can donate blood?",
                a: "Anyone between 18-65 years old, weighing at least 50kg, and in good health can donate blood. You must not have donated blood in the last 3 months."
            },
            {
                q: "How often can I donate blood?",
                a: "You can donate whole blood every 3 months (12 weeks). For platelet donation, you can donate every 2 weeks."
            },
            {
                q: "Is blood donation safe?",
                a: "Yes, blood donation is completely safe. Sterile, single-use needles are used for each donation, eliminating any risk of infection."
            }
        ]
    },
    {
        category: "Medicine Requests",
        questions: [
            {
                q: "How do I request medicine?",
                a: "Click on 'Community' in the navbar, then click 'Create Post'. Select 'Medicine' as the type and fill in the details."
            },
            {
                q: "Can I upload a prescription?",
                a: "Currently, you can describe your medicine requirement in the description field. Prescription upload feature is coming soon."
            },
            {
                q: "How long does it take to get a response?",
                a: "Response times vary, but most urgent requests get responses within 1-2 hours. Check your notifications regularly."
            }
        ]
    },
    {
        category: "Account & Privacy",
        questions: [
            {
                q: "Is my personal information safe?",
                a: "Yes, we take privacy seriously. Your data is encrypted and stored securely. We never share your personal information without your consent."
            },
            {
                q: "Can I delete my account?",
                a: "Yes, you can request account deletion by contacting our support team at support@healthseva.com"
            },
            {
                q: "How do I change my notification preferences?",
                a: "Go to your Profile page and click on the 'Settings' tab. You can customize your notification preferences there."
            }
        ]
    },
    {
        category: "Using the Platform",
        questions: [
            {
                q: "How do I search for specific requests?",
                a: "Use the global search (Cmd+K or Ctrl+K) to search across all requests. You can also use filters on the Blood Feed and Medic pages."
            },
            {
                q: "What is the verification badge?",
                a: "The blue checkmark indicates verified users, typically hospitals or registered medical stores. This helps build trust in the community."
            },
            {
                q: "How do I report inappropriate content?",
                a: "Click the three dots menu on any post and select 'Report'. Our moderation team will review it within 24 hours."
            }
        ]
    }
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredFAQ = FAQ_DATA.map(category => ({
        ...category,
        questions: category.questions.filter(
            q =>
                q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Find answers to common questions about Health Seva
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for questions..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                        />
                    </div>
                </motion.div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {filteredFAQ.map((category, categoryIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {category.category}
                            </h2>
                            <div className="space-y-3">
                                {category.questions.map((item, index) => {
                                    const itemId = `${category.category}-${index}`;
                                    const isOpen = openItems.includes(itemId);

                                    return (
                                        <div
                                            key={itemId}
                                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(itemId)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <span className="font-semibold text-gray-900 dark:text-gray-100 pr-4">
                                                    {item.q}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                                            {item.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredFAQ.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No questions found matching "{searchQuery}"
                    </div>
                )}

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 text-white text-center"
                >
                    <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-blue-100 mb-4">
                        Our support team is here to help you
                    </p>
                    <a
                        href="mailto:support@healthseva.com"
                        className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
