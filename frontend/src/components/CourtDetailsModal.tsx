"use client";

import { X, MapPin, Clock, Star, Navigation, ExternalLink } from "lucide-react";
import type { Court } from "./MapView";

type CourtDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  court: Court & { distance?: number | null };
  userLocation: [number, number] | null;
};

export default function CourtDetailsModal({ isOpen, onClose, court, userLocation }: CourtDetailsModalProps) {
  if (!isOpen) return null;

  const handleGetDirections = () => {
    const destination = `${court.lat},${court.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    
    if (userLocation) {
      const origin = `${userLocation[0]},${userLocation[1]}`;
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, '_blank');
    } else {
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${court.lat},${court.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#0a56a7] to-[#0a56a7]/90 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <img src="/images/PinMarker.png" alt="Pickleball" className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{court.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{court.city}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8</span>
                </div>
                {court.distance !== null && court.distance !== undefined && (
                  <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                    <Navigation className="w-3 h-3" />
                    <span>{court.distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0a56a7]" />
              Location Details
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium text-gray-900">{court.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p className="font-medium text-gray-900">{court.city}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Coordinates</p>
                <p className="font-mono text-sm text-gray-900">
                  {court.lat.toFixed(6)}, {court.lng.toFixed(6)}
                </p>
              </div>
              
              {court.distance !== null && court.distance !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Distance from you</p>
                  <p className="font-medium text-[#0a56a7]">{court.distance.toFixed(1)} km</p>
                </div>
              )}
            </div>
          </div>

          {/* Court Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0a56a7]" />
              Court Information
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Open Now
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8 (127 reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Court Type</span>
                <span className="text-sm font-medium">Outdoor</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Surface</span>
                <span className="text-sm font-medium">Hard Court</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Operating Hours</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-medium">6:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saturday - Sunday</span>
                <span className="font-medium">6:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleGetDirections}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0a56a7] text-white font-semibold rounded-xl hover:bg-[#0a56a7]/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
            <button
              onClick={handleOpenInMaps}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#0a56a7] text-[#0a56a7] font-semibold rounded-xl hover:bg-[#0a56a7]/10 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-5 h-5" />
              Open in Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
