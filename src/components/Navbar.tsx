"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Droplet, Pill, Home, MessageCircle, LogOut, LogIn, User, Moon, Sun } from "lucide-react";
import { useRequest } from "@/context/RequestContext";
import { useTheme } from "@/context/ThemeContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import GlobalSearch from "./GlobalSearch";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, currentUserType } = useRequest();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const navLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/feed", label: "Community", icon: MessageCircle },
        { href: "/medic", label: "Medic", icon: Pill },
        { href: "/blood", label: "Blood", icon: Droplet },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart className="text-white" size={20} fill="white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                            Health Seva
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <GlobalSearch />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/profile'
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                                        }`}
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <LogIn size={18} />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 border-t border-gray-100">
                                {isLoggedIn ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors mb-2 ${pathname === '/profile'
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <User size={20} />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                        >
                                            <LogOut size={20} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium justify-center"
                                    >
                                        <LogIn size={20} />
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
