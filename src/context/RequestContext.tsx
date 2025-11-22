"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    acceptedBy?: {
        id: string;
        name: string;
        contact: string;
        address: string;
    };
    createdAt: Date;
}

interface RequestContextType {
    currentUserType: UserType;
    isLoggedIn: boolean;
    login: (role: UserType) => void;
    logout: () => void;
    requests: Request[];
    addRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt' | 'acceptedBy'>) => void;
    respondToRequest: (requestId: string, providerDetails: { name: string; contact: string; address: string }) => void;
    dismissRequest: (requestId: string) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
    const [currentUserType, setCurrentUserType] = useState<UserType>('USER');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);

    const login = (role: UserType) => {
        setCurrentUserType(role);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurrentUserType('USER'); // Default back to user
    };

    // Deprecated: toggleUserType is replaced by login
    const toggleUserType = () => {
        console.warn("toggleUserType is deprecated. Use login() instead.");
    };

    const addRequest = (newRequest: Omit<Request, 'id' | 'status' | 'createdAt' | 'acceptedBy'>) => {
        const request: Request = {
            ...newRequest,
            id: Math.random().toString(36).substr(2, 9),
            status: 'PENDING',
            createdAt: new Date(),
        };
        setRequests(prev => [request, ...prev]);
    };

    const respondToRequest = (requestId: string, providerDetails: { name: string; contact: string; address: string }) => {
        setRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    status: 'ACCEPTED',
                    acceptedBy: {
                        id: 'provider-1', // Mock ID
                        ...providerDetails
                    }
                };
            }
            return req;
        }));
    };

    const dismissRequest = (requestId: string) => {
        // In a real app, this might hide it for this specific provider
        // For this demo, we'll just leave it as pending but maybe mark it as "seen" locally
        // Or we could implement a "REJECTED" status if that's the intent
        // For now, let's just keep it simple
        console.log(`Request ${requestId} dismissed by provider`);
    };

    return (
        <RequestContext.Provider value={{
            currentUserType,
            isLoggedIn,
            login,
            logout,
            requests,
            addRequest,
            respondToRequest,
            dismissRequest
        }}>
            {children}
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
