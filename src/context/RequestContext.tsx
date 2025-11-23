"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    orderBy,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';

export type UserType = 'USER' | 'PROVIDER';

export interface Request {
    id: string;
    type: 'MEDIC' | 'BLOOD';
    itemName: string;
    description?: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    userId: string;
    userName: string;
    userContact: string;
    userAddress: string;
    responses?: Array<{
        providerId: string;
        name: string;
        contact: string;
        address: string;
        timestamp: any;
    }>;
    createdAt: any; // Firestore Timestamp
}

interface RequestContextType {
    currentUserType: UserType;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (role: UserType) => void; // Kept for compatibility, but mainly handled by Auth
    logout: () => void;
    requests: Request[];
    addRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt' | 'responses'>) => Promise<void>;
    respondToRequest: (requestId: string, providerDetails: { name: string; contact: string; address: string }) => Promise<void>;
    dismissRequest: (requestId: string) => Promise<void>; // Changed to return Promise<void>
    updateRequestStatus: (requestId: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FULFILLED' | 'CLOSED') => Promise<void>;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
    const [currentUserType, setCurrentUserType] = useState<UserType>('USER');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    // Listen for Auth Changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    setIsLoggedIn(true);

                    // Admin Check
                    const adminEmails = ['admin@healthseva.com', 'sarojkum822@gmail.com'];
                    if (user.email && adminEmails.includes(user.email)) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }

                    // Fetch user profile to get role
                    const userDocRef = doc(db, 'users', user.uid);

                    try {
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setCurrentUserType(userData.role as UserType);
                        } else {
                            setCurrentUserType('USER');
                        }
                    } catch (firestoreError) {
                        console.error("Error fetching user profile:", firestoreError);
                        // Fallback to default role if DB fails, but keep logged in so they can logout
                        setCurrentUserType('USER');
                    }
                } else {
                    setIsLoggedIn(false);
                    setIsAdmin(false);
                    setCurrentUserType('USER');
                }
            } catch (error) {
                console.error("Auth state change error:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Debugging Admin Status
    useEffect(() => {
        if (isLoggedIn) {
            console.log("Current User Email:", auth.currentUser?.email);
            console.log("Is Admin:", isAdmin);
        }
    }, [isLoggedIn, isAdmin]);

    // Listen for Requests (Real-time)
    useEffect(() => {
        const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Request[];
            setRequests(reqs);
        }, (error) => {
            console.error("Error fetching requests:", error);
            setRequests([]);
        });

        return () => unsubscribe();
    }, []);

    const login = (role: UserType) => {
        // This is now mainly a client-side state update helper if needed immediately after login
        // The actual auth listener handles the source of truth
        setCurrentUserType(role);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const addRequest = async (newRequest: Omit<Request, 'id' | 'status' | 'createdAt' | 'responses'>) => {
        try {
            await addDoc(collection(db, 'requests'), {
                ...newRequest,
                status: 'PENDING',
                responses: [],
                createdAt: serverTimestamp(), // Use server timestamp
            });
        } catch (error) {
            console.error("Error adding request: ", error);
        }
    };

    const respondToRequest = async (requestId: string, providerDetails: { name: string; contact: string; address: string }) => {
        try {
            const reqRef = doc(db, 'requests', requestId);
            const response = {
                providerId: auth.currentUser?.uid || 'unknown',
                ...providerDetails,
                timestamp: new Date() // Client side date for now, or could use serverTimestamp if inside object
            };

            await updateDoc(reqRef, {
                status: 'ACCEPTED', // Status remains accepted if at least one person accepts
                responses: arrayUnion(response)
            });
        } catch (error) {
            console.error("Error responding to request: ", error);
        }
    };

    const dismissRequest = async (requestId: string) => {
        // Remove from local state
        setRequests(prev => prev.filter(r => r.id !== requestId));
        // In a real app, you might also update Firestore to mark it as dismissed by the current provider
        // For example:
        // const reqRef = doc(db, 'requests', requestId);
        // await updateDoc(reqRef, {
        //     dismissedBy: arrayUnion(auth.currentUser?.uid || 'unknown')
        // });
    };

    const updateRequestStatus = async (requestId: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FULFILLED' | 'CLOSED') => {
        try {
            await updateDoc(doc(db, 'requests', requestId), {
                status: status
            });
        } catch (error) {
            console.error("Error updating request status:", error);
            throw error;
        }
    };

    return (
        <RequestContext.Provider value={{
            currentUserType,
            isLoggedIn,
            isAdmin,
            login,
            logout,
            requests,
            addRequest,
            respondToRequest,
            dismissRequest,
            updateRequestStatus
        }}>
            {!loading && children}
        </RequestContext.Provider>
    );
}

export function useRequest() {
    const context = useContext(RequestContext);
    if (context === undefined) {
        throw new Error('useRequest must be used within a RequestProvider');
    }
    return context;
}
