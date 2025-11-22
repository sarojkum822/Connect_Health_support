"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, User, Stethoscope } from "lucide-react";
import { useRequest } from "@/context/RequestContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useRequest();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'USER' | 'PROVIDER'>('USER');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login attempt:", { email, password, role });
        login(role);
        router.push(role === 'PROVIDER' ? '/requests' : '/');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <LogIn size={18} />
                        Sign In as {role === 'USER' ? 'User' : 'Provider'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
