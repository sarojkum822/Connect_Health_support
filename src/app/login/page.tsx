"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, User, Stethoscope } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRequest } from "@/context/RequestContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useRequest(); // Helper to set local state if needed
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'USER' | 'PROVIDER'>('USER');
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user profile exists
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Create new user profile with selected role
                await setDoc(userDocRef, {
                    email: user.email,
                    name: user.displayName,
                    role: role,
                    createdAt: new Date()
                });
            } else {
                // If user exists, maybe update role if they want to switch? 
                // For now, let's respect existing role or update it if needed.
                // Let's update it to the selected role for this session intent
                await setDoc(userDocRef, { role: role }, { merge: true });
            }

            // Update context state (optional as listener handles it, but good for immediate feedback)
            login(role);

            router.push(role === 'PROVIDER' ? '/requests' : '/');
        } catch (err: any) {
            console.error("Login error:", err);
            if (err.code === 'auth/unauthorized-domain') {
                setError("Configuration Error: This domain (localhost) is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized Domains.");
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled.");
            } else {
                setError(err.message || "Failed to login with Google");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Email/Password auth implementation would go here
        // For this demo, we'll focus on Google Auth as requested/easier for setup
        console.log("Email login not fully implemented, use Google Login");
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Please sign in to continue</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('USER')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${role === 'USER'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 text-gray-600'
                                }`}
                        >
                            <User size={24} />
                            <span className="font-semibold">I need Help</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('PROVIDER')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${role === 'PROVIDER'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 text-gray-600'
                                }`}
                        >
                            <Stethoscope size={24} />
                            <span className="font-semibold">I am a Provider</span>
                        </button>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12.0003 20.45c-4.6667 0-8.45-3.7833-8.45-8.45 0-4.6667 3.7833-8.45 8.45-8.45 2.2833 0 4.35.8333 5.9667 2.2167l-2.4 2.4c-0.9333-0.9-2.1667-1.45-3.5667-1.45-2.7333 0-4.95 2.2167-4.95 4.95 0 2.7333 2.2167 4.95 4.95 4.95 2.5833 0 4.3667-1.75 4.6667-4.1167h-4.6667v-3.1666h7.9c0.1166 0.5833 0.1833 1.1833 0.1833 1.8333 0 4.8667-3.35 8.45-8.45 8.45z" fill="currentColor" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 opacity-50 pointer-events-none">
                        {/* Email/Pass form kept for UI but disabled for now */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                disabled
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                disabled
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled
                            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <LogIn size={18} />
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
