'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Location {
    lat: number;
    lng: number;
}

interface LocationContextType {
    location: Location | null;
    error: string | null;
    loading: boolean;
}

const LocationContext = createContext<LocationContextType>({
    location: null,
    error: null,
    loading: true,
});

export const useLocation = () => useContext(LocationContext);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    // Strict blocking: if no location, show error screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                <div className="text-center text-white p-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Getting your location...</h2>
                    <p className="text-sm opacity-90">This is required to show you local news</p>
                </div>
            </div>
        );
    }

    if (error || !location) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500">
                <div className="text-center text-white p-8 max-w-md">
                    <svg
                        className="w-24 h-24 mx-auto mb-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <h1 className="text-3xl font-bold mb-4">Location Access Required</h1>
                    <p className="text-lg mb-6">
                        This app requires your location to show you hyper-local news within your 10km radius.
                    </p>
                    <p className="text-sm opacity-90 mb-6">
                        Please enable location permissions in your browser settings and refresh the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <LocationContext.Provider value={{ location, error, loading }}>
            {children}
        </LocationContext.Provider>
    );
}
