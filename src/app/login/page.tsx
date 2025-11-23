"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, User, Stethoscope, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRequest } from "@/context/RequestContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useRequest();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'USER' | 'PROVIDER'>('USER');
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    name: user.displayName,
                    role: role,
                    createdAt: new Date()
                });
            } else {
                await setDoc(userDocRef, { role: role }, { merge: true });
            }

            login(role);
            router.push(role === 'PROVIDER' ? '/requests' : '/');
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Failed to login with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let user;
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                user = userCredential.user;

                // Create user profile
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    name: email.split('@')[0], // Default name from email
                    role: role,
                    createdAt: new Date()
                });
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                user = userCredential.user;

                // Fetch or update role
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    // Update local role based on DB if needed, or update DB with selected role
                    // For now, let's update DB to match selected intent
                    await setDoc(userDocRef, { role: role }, { merge: true });
                } else {
                    // Should not happen for existing users, but safe fallback
                    await setDoc(userDocRef, {
                        email: user.email,
                        name: email.split('@')[0],
                        role: role,
                        createdAt: new Date()
                    });
                }
            }

            login(role);
            router.push(role === 'PROVIDER' ? '/requests' : '/');
        } catch (err: any) {
            console.error("Auth error:", err);
            if (err.code === 'auth/invalid-credential') {
                setError("Invalid email or password. If you haven't created an account, please switch to 'Sign Up'.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please Sign In instead.");
            } else {
                setError(err.message || "Authentication failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {isSignUp ? "Sign up to get started" : "Please sign in to continue"}
                    </p>
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
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12.0003 20.45c-4.6667 0-8.45-3.7833-8.45-8.45 0-4.6667 3.7833-8.45 8.45-8.45 2.2833 0 4.35.8333 5.9667 2.2167l-2.4 2.4c-0.9333-0.9-2.1667-1.45-3.5667-1.45-2.7333 0-4.95 2.2167-4.95 4.95 0 2.7333 2.2167 4.95 4.95 4.95 2.5833 0 4.3667-1.75 4.6667-4.1167h-4.6667v-3.1666h7.9c0.1166 0.5833 0.1833 1.1833 0.1833 1.8333 0 4.8667-3.35 8.45-8.45 8.45z" fill="currentColor" />
                        </svg>
                        {loading ? "Processing..." : "Sign in with Google"}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
                            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                        >
                            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
