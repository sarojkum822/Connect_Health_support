"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, HelpCircle, LogIn, LogOut, Stethoscope, Droplet, Bell, List } from "lucide-react";
import { useRequest } from "@/context/RequestContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUserType, isLoggedIn, logout, requests } = useRequest();

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-2xl text-blue-600">MERN Health</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors">
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <Link href="/medic" className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors">
                            <Stethoscope size={18} />
                            <span>Medic</span>
                        </Link>
                        <Link href="/blood" className="text-gray-700 hover:text-red-600 flex items-center gap-2 transition-colors">
                            <Droplet size={18} className="text-red-500" />
                            <span>Blood</span>
                        </Link>
                        <Link href="/help" className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors">
                            <HelpCircle size={18} />
                            <span>Help</span>
                        </Link>

                        {isLoggedIn && (
                            <Link href="/requests" className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors relative">
                                <List size={18} />
                                <span>Requests</span>
                                {currentUserType === 'PROVIDER' && pendingCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {isLoggedIn ? (
                            <button
                                onClick={logout}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout ({currentUserType})</span>
                            </button>
                        ) : (
                            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors">
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {isLoggedIn && currentUserType === 'PROVIDER' && (
                            <Link href="/requests" className="relative">
                                <Bell size={20} className="text-gray-600" />
                                {pendingCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" onClick={toggleMenu}>
                            <div className="flex items-center gap-2">
                                <Home size={18} />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link href="/medic" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" onClick={toggleMenu}>
                            <div className="flex items-center gap-2">
                                <Stethoscope size={18} />
                                <span>Medic</span>
                            </div>
                        </Link>
                        <Link href="/blood" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50" onClick={toggleMenu}>
                            <div className="flex items-center gap-2">
                                <Droplet size={18} className="text-red-500" />
                                <span>Blood</span>
                            </div>
                        </Link>
                        <Link href="/help" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" onClick={toggleMenu}>
                            <div className="flex items-center gap-2">
                                <HelpCircle size={18} />
                                <span>Help</span>
                            </div>
                        </Link>

                        {isLoggedIn && (
                            <Link href="/requests" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" onClick={toggleMenu}>
                                <div className="flex items-center gap-2">
                                    <List size={18} />
                                    <span>Requests</span>
                                    {currentUserType === 'PROVIDER' && pendingCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {pendingCount} New
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )}

                        {isLoggedIn ? (
                            <button
                                onClick={() => { logout(); toggleMenu(); }}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-2">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </div>
                            </button>
                        ) : (
                            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700" onClick={toggleMenu}>
                                <div className="flex items-center gap-2 justify-center">
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
