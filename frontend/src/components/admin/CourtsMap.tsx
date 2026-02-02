'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Star, DollarSign, Phone, Globe, Calendar, Navigation, Search, ZoomIn, ZoomOut } from 'lucide-react';

interface Court {
    id: number;
    name: string;
    city: string;
    address: string;
    type: 'indoor' | 'outdoor' | 'both';
    latitude: number | null;
    longitude: number | null;
    rating: number;
    is_free: boolean;
    price_per_hour: number | null;
    phone_number: string | null;
    website: string | null;
    total_bookings: number;
    status: string;
}

interface CourtsMapProps {
    courts: Court[];
    center?: { lat: number; lng: number };
    zoom?: number;
    focusedCourtId?: number | null;
}

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '16px',
};

const defaultCenter = {
    lat: 10.3157, // Cebu City
    lng: 123.8854,
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: false, // We'll use custom zoom controls
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
    ],
};

type RegionType = 'all' | 'luzon' | 'visayas' | 'mindanao' | 'others';

export default function CourtsMap({ courts, center = defaultCenter, zoom = 12, focusedCourtId = null }: CourtsMapProps) {
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [map, setMap] = useState<any>(null); // Google Maps API type
    const [mapCenter, setMapCenter] = useState(center);
    const [zoomLevel, setZoomLevel] = useState(zoom);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<RegionType>('all');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);

    // Focus on a specific court when focusedCourtId changes
    useEffect(() => {
        if (focusedCourtId) {
            const courtToFocus = courts.find(c => c.id === focusedCourtId);
            if (courtToFocus && courtToFocus.latitude && courtToFocus.longitude) {
                setMapCenter({ lat: courtToFocus.latitude, lng: courtToFocus.longitude });
                setZoomLevel(16); // Zoom in close to the court
                setSelectedCourt(courtToFocus);
            }
        }
    }, [focusedCourtId, courts]);

    // Region grouping logic
    const regions = {
        all: { 
            name: 'All Philippines', 
            courts: courts 
        },
        luzon: { 
            name: 'Luzon', 
            courts: courts.filter(court => 
                ['Manila', 'Quezon City', 'Makati', 'Pasig', 'BGC', 'Baguio', 'Pampanga', 'Laguna', 'Cavite', 'Batangas'].some(
                    city => court.city?.toLowerCase().includes(city.toLowerCase())
                )
            )
        },
        visayas: { 
            name: 'Visayas', 
            courts: courts.filter(court => 
                ['Cebu', 'Iloilo', 'Bacolod', 'Tacloban', 'Dumaguete'].some(
                    city => court.city?.toLowerCase().includes(city.toLowerCase())
                )
            )
        },
        mindanao: { 
            name: 'Mindanao', 
            courts: courts.filter(court => 
                ['Davao', 'Cagayan de Oro', 'General Santos', 'Zamboanga', 'Butuan'].some(
                    city => court.city?.toLowerCase().includes(city.toLowerCase())
                )
            )
        },
        others: {
            name: 'Other Islands',
            courts: courts.filter(court => {
                const city = court.city?.toLowerCase() || '';
                const isLuzon = ['manila', 'quezon', 'makati', 'pasig', 'bgc', 'baguio', 'pampanga', 'laguna', 'cavite', 'batangas'].some(c => city.includes(c));
                const isVisayas = ['cebu', 'iloilo', 'bacolod', 'tacloban', 'dumaguete'].some(c => city.includes(c));
                const isMindanao = ['davao', 'cagayan', 'general santos', 'zamboanga', 'butuan'].some(c => city.includes(c));
                return !isLuzon && !isVisayas && !isMindanao;
            })
        }
    };

    // Filter courts based on search and region
    const filteredCourts = regions[selectedRegion].courts.filter(court => {
        const searchLower = searchQuery.toLowerCase();
        return (
            court.name.toLowerCase().includes(searchLower) ||
            court.address.toLowerCase().includes(searchLower) ||
            court.city.toLowerCase().includes(searchLower)
        );
    });

    // Update map center when zoom changes
    useEffect(() => {
        if (map) {
            map.setZoom(zoomLevel);
        }
    }, [zoomLevel, map]);

    useEffect(() => {
        if (map) {
            map.panTo(mapCenter);
        }
    }, [mapCenter, map]);

    const handleLocate = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(newLocation);
                setMapCenter(newLocation);
                setZoomLevel(12);
                setLocating(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please enable location services.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleRegionChange = (region: RegionType) => {
        setSelectedRegion(region);
        
        // Adjust center and zoom based on region
        switch(region) {
            case 'luzon':
                setMapCenter({ lat: 16.0, lng: 121.0 });
                setZoomLevel(7);
                break;
            case 'visayas':
                setMapCenter({ lat: 10.5, lng: 123.0 });
                setZoomLevel(8);
                break;
            case 'mindanao':
                setMapCenter({ lat: 7.5, lng: 125.0 });
                setZoomLevel(7);
                break;
            case 'others':
                setMapCenter({ lat: 11.0, lng: 124.0 });
                setZoomLevel(7);
                break;
            default:
                setMapCenter({ lat: 10.3157, lng: 123.8854 });
                setZoomLevel(6);
        }
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 1, 18));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 1, 2));
    };

    const onLoad = useCallback((map: any) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const getMarkerIcon = (court: Court) => {
        // Different colors based on court type and status
        let color = '#1E40AF'; // Blue default
        
        if (court.status !== 'approved') {
            color = '#9CA3AF'; // Gray for non-approved
        } else if (court.type === 'indoor') {
            color = '#1E40AF'; // Blue for indoor
        } else if (court.type === 'outdoor') {
            color = '#064e3b'; // Green for outdoor
        } else {
            color = '#FDE047'; // Yellow for both
        }

        return {
            path: (window as any).google?.maps?.SymbolPath?.CIRCLE || 0,
            fillColor: color,
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 12,
        };
    };

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return (
            <div className="w-full h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center p-8">
                    <MapPin className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Google Maps API Key Required</h3>
                    <p className="text-sm text-slate-600 max-w-md">
                        To display the map, please add your Google Maps API key to <code className="bg-slate-200 px-2 py-1 rounded">.env.local</code>
                    </p>
                    <p className="text-xs text-slate-500 mt-4">
                        <strong>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong> = your_key_here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Search and Filters Section */}
            <div className="mb-6 bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1E40AF]">Courts Map View</h2>
                        <p className="text-gray-600 mt-1">View all {courts.length} courts across the Philippines</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={locating}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E40AF] text-white font-semibold shadow-lg hover:bg-[#1E40AF]/90 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Navigation className="w-5 h-5" />
                            {locating ? 'Locating...' : 'Near me'}
                        </button>
                    </div>
                </div>

                {/* Search and Region Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search courts or addresses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/50 focus:border-[#1E40AF]"
                        />
                    </div>
                    <select
                        value={selectedRegion}
                        onChange={(e) => handleRegionChange(e.target.value as RegionType)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/50 focus:border-[#1E40AF]"
                    >
                        {Object.entries(regions).map(([key, region]) => (
                            <option key={key} value={key}>
                                {region.name} ({region.courts.length} courts)
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1E40AF]/10 rounded-xl">
                        <MapPin className="w-5 h-5 text-[#1E40AF]" />
                        <span className="text-[#1E40AF] font-semibold">{filteredCourts.length} Courts</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-semibold">Zoom: {zoomLevel}</span>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>Philippines Coverage:</strong> {regions.luzon.courts.length} Luzon • {regions.visayas.courts.length} Visayas • {regions.mindanao.courts.length} Mindanao • {regions.others.courts.length} Other Islands
                    </p>
                </div>
            </div>

            {/* Map Container */}
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={zoomLevel}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={mapOptions}
                >
                    {/* User location marker */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                path: (window as any).google?.maps?.SymbolPath?.CIRCLE || 0,
                                fillColor: '#3B82F6',
                                fillOpacity: 0.3,
                                strokeColor: '#3B82F6',
                                strokeWeight: 3,
                                scale: 15,
                            }}
                            title="Your Location"
                        />
                    )}

                    {/* Court markers */}
                    {filteredCourts
                        .filter((court): court is Court & { latitude: number; longitude: number } => 
                            court.latitude !== null && court.longitude !== null
                        )
                        .map((court) => (
                            <Marker
                                key={court.id}
                                position={{ lat: court.latitude, lng: court.longitude }}
                                onClick={() => setSelectedCourt(court)}
                                icon={getMarkerIcon(court)}
                                title={court.name}
                            />
                        ))}

                    {selectedCourt && selectedCourt.latitude !== null && selectedCourt.longitude !== null && (
                        <InfoWindow
                            position={{ lat: selectedCourt.latitude, lng: selectedCourt.longitude }}
                            onCloseClick={() => setSelectedCourt(null)}
                        >
                            <div className="p-3 max-w-xs">
                                <h3 className="font-bold text-[#1E40AF] text-lg mb-2">{selectedCourt.name}</h3>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={14} className="text-[#1E40AF]" />
                                        <span>{selectedCourt.address}, {selectedCourt.city}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                            selectedCourt.type === 'indoor' ? 'bg-blue-100 text-blue-700' :
                                            selectedCourt.type === 'outdoor' ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {selectedCourt.type.toUpperCase()}
                                        </div>
                                        {selectedCourt.rating > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-[#FDE047] fill-[#FDE047]" />
                                                <span className="font-semibold">{selectedCourt.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <DollarSign size={14} className="text-[#064e3b]" />
                                        <span className="font-semibold">
                                            {selectedCourt.is_free ? 'Free' : `₱${selectedCourt.price_per_hour}/hr`}
                                        </span>
                                    </div>

                                    {selectedCourt.total_bookings > 0 && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar size={14} className="text-[#1E40AF]" />
                                            <span>{selectedCourt.total_bookings} bookings</span>
                                        </div>
                                    )}

                                    {selectedCourt.phone_number && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Phone size={14} className="text-[#1E40AF]" />
                                            <a href={`tel:${selectedCourt.phone_number}`} className="hover:text-[#1E40AF]">
                                                {selectedCourt.phone_number}
                                            </a>
                                        </div>
                                    )}

                                    {selectedCourt.website && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Globe size={14} className="text-[#1E40AF]" />
                                            <a 
                                                href={selectedCourt.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="hover:text-[#1E40AF] underline"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.latitude},${selectedCourt.longitude}`, '_blank')}
                                    className="mt-3 w-full bg-[#1E40AF] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Get Directions
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Court Types</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#1E40AF]"></div>
                        <span className="text-xs text-slate-600">Indoor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#064e3b]"></div>
                        <span className="text-xs text-slate-600">Outdoor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FDE047]"></div>
                        <span className="text-xs text-slate-600">Both</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-xs text-slate-600">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
