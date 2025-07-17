import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building, Star, Plus, MapPin, AlertCircle, Search, X, Filter, MapIcon } from "lucide-react";

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 40.7128, // New York City as default
    lng: -74.0060
};

// Define libraries outside component to prevent re-renders
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

// Quick search suggestions (not restrictive)
const quickSearchSuggestions = [
    "Restaurants", "Bakeries", "Cafes", "Grocery Stores", "Clothing Stores", 
    "Pharmacies", "Gas Stations", "Banks", "Gyms", "Beauty Salons"
];

interface BusinessMarker {
    id: string;
    position: {
        lat: number;
        lng: number;
    };
    name: string;
    category: string;
    address: string;
    phone?: string;
    email?: string;
    rating?: number;
    website?: string;
}

interface GoogleMapsProps {
    searchLocation?: string;
    searchCategory?: string;
    searchKeywords?: string;
    onAddLead?: (business: BusinessMarker) => void;
}

export default function GoogleMaps({ 
    searchLocation: propSearchLocation, 
    searchCategory: propSearchCategory, 
    searchKeywords: propSearchKeywords,
    onAddLead 
}: GoogleMapsProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<BusinessMarker[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<BusinessMarker | null>(null);
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState<string | null>(null);
    
    // Compact search state
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(true);
    const [showQuickSuggestions, setShowQuickSuggestions] = useState(false);

    // Get Google Maps API key from environment variables
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Combine prop values with local values
    const effectiveSearchLocation = locationQuery || propSearchLocation || '';
    const effectiveSearchQuery = searchQuery || propSearchCategory || propSearchKeywords || '';

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Error getting location:', error);
                    setUserLocation(defaultCenter);
                }
            );
        } else {
            setUserLocation(defaultCenter);
        }
    }, []);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
        
        if (window.google && window.google.maps && window.google.maps.places) {
            const service = new window.google.maps.places.PlacesService(map);
            setPlacesService(service);
        }
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
        setPlacesService(null);
    }, []);

    const onScriptLoad = useCallback(() => {
        setIsScriptLoaded(true);
        setScriptError(null);
    }, []);

    const onScriptError = useCallback(() => {
        setScriptError('Failed to load Google Maps script. Please check your API key and internet connection.');
        setIsScriptLoaded(false);
    }, []);

    // Search for places based on query
    const searchPlaces = useCallback((customQuery?: string, customLocation?: string) => {
        if (!placesService || !map || !window.google) {
            console.log('Places service, map, or Google not available yet');
            return;
        }

        const query = customQuery !== undefined ? customQuery : effectiveSearchQuery;
        const location = customLocation !== undefined ? customLocation : effectiveSearchLocation;

        if (!query.trim()) {
            console.log('No search query provided');
            return;
        }

        setIsLoading(true);
        setMarkers([]);

        // Determine search location
        let searchCenter = userLocation || defaultCenter;
        
        if (location && window.google.maps.Geocoder) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: location }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    searchCenter = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    map.setCenter(searchCenter);
                    performPlacesSearch(searchCenter, query);
                } else {
                    performPlacesSearch(searchCenter, query);
                }
            });
        } else {
            performPlacesSearch(searchCenter, query);
        }
    }, [placesService, map, effectiveSearchQuery, effectiveSearchLocation, userLocation]);

    const performPlacesSearch = (center: {lat: number, lng: number}, query: string) => {
        if (!placesService || !window.google) return;

        const request: google.maps.places.TextSearchRequest = {
            query: query.trim(),
            location: new window.google.maps.LatLng(center.lat, center.lng),
            radius: 5000, // 5km radius
        };

        placesService.textSearch(request, (results, status) => {
            setIsLoading(false);
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                const newMarkers: BusinessMarker[] = results.slice(0, 20).map((place, index) => ({
                    id: place.place_id || index.toString(),
                    position: {
                        lat: place.geometry?.location?.lat() || 0,
                        lng: place.geometry?.location?.lng() || 0
                    },
                    name: place.name || 'Unknown Business',
                    category: place.types?.[0]?.replace(/_/g, ' ') || 'Business',
                    address: place.formatted_address || 'Address not available',
                    rating: place.rating,
                }));
                
                setMarkers(newMarkers);
            } else {
                console.log('Places search failed:', status);
            }
        });
    };

    const getPlaceDetails = (placeId: string, marker: BusinessMarker) => {
        if (!placesService || !window.google) return;

        const request = {
            placeId: placeId,
            fields: ['name', 'formatted_phone_number', 'website', 'rating', 'formatted_address']
        };

        placesService.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                const updatedMarker = {
                    ...marker,
                    phone: place.formatted_phone_number,
                    website: place.website,
                    rating: place.rating
                };
                setSelectedMarker(updatedMarker);
            }
        });
    };

    const handleMarkerClick = (marker: BusinessMarker) => {
        setSelectedMarker(marker);
        if (marker.id && window.google) {
            getPlaceDetails(marker.id, marker);
        }
    };

    const handleAddLead = (business: BusinessMarker) => {
        if (onAddLead) {
            onAddLead(business);
        }
        setSelectedMarker(null);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchPlaces();
            setShowQuickSuggestions(false);
        }
    };

    const handleQuickSearch = (suggestion: string) => {
        setSearchQuery(suggestion);
        searchPlaces(suggestion, effectiveSearchLocation);
        setShowQuickSuggestions(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setLocationQuery('');
        setMarkers([]);
        setShowQuickSuggestions(false);
    };

    // Auto-search when props change
    useEffect(() => {
        if (isScriptLoaded && placesService && (propSearchLocation || propSearchCategory || propSearchKeywords)) {
            const timeoutId = setTimeout(() => {
                searchPlaces();
            }, 500);
            
            return () => clearTimeout(timeoutId);
        }
    }, [searchPlaces, propSearchLocation, propSearchCategory, propSearchKeywords, isScriptLoaded]);

    // Check if API key is available
    if (!googleMapsApiKey) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Google Maps API key not configured</p>
                    <p className="text-sm text-gray-500">
                        Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Show error if script failed to load
    if (scriptError) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Failed to load Google Maps</p>
                    <p className="text-sm text-gray-500">{scriptError}</p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                        variant="outline"
                    >
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="relative">
            <LoadScript
                googleMapsApiKey={googleMapsApiKey}
                libraries={libraries}
                onLoad={onScriptLoad}
                onError={onScriptError}
                loadingElement={
                    <Card>
                        <CardContent className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading Google Maps...</p>
                        </CardContent>
                    </Card>
                }
            >
                {isScriptLoaded && (
                    <div className="relative">
                        {/* Compact Search Bar */}
                        {showSearchBar && (
                            <div className="absolute top-3 left-3 right-3 z-20">
                                <Card className="shadow-lg">
                                    <CardContent className="p-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 flex space-x-2">
                                                <Input
                                                    placeholder="Search businesses (e.g., pizza, dentist, bakery)"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                    onFocus={() => setShowQuickSuggestions(true)}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    placeholder="Location (optional)"
                                                    value={locationQuery}
                                                    onChange={(e) => setLocationQuery(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                    className="w-40"
                                                />
                                            </div>
                                            <Button
                                                onClick={handleSearch}
                                                disabled={isLoading || !searchQuery.trim()}
                                                size="sm"
                                            >
                                                <Search className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={clearSearch}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => setShowSearchBar(false)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        {/* Quick Suggestions */}
                                        {showQuickSuggestions && (
                                            <div className="mt-2 pt-2 border-t">
                                                <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {quickSearchSuggestions.map((suggestion) => (
                                                        <Button
                                                            key={suggestion}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-6 px-2 text-xs"
                                                            onClick={() => handleQuickSearch(suggestion)}
                                                        >
                                                            {suggestion}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={userLocation || defaultCenter}
                            zoom={12}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: true,
                            }}
                        >
                            {/* User location marker */}
                            {userLocation && window.google && (
                                <Marker
                                    position={userLocation}
                                    icon={{
                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                                                <circle cx="10" cy="10" r="3" fill="white"/>
                                            </svg>
                                        `),
                                        scaledSize: new window.google.maps.Size(20, 20),
                                    }}
                                    title="Your Location"
                                />
                            )}

                            {/* Business markers */}
                            {markers.map((marker) => (
                                <Marker
                                    key={marker.id}
                                    position={marker.position}
                                    onClick={() => handleMarkerClick(marker)}
                                    icon={window.google ? {
                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444" stroke="white" stroke-width="1"/>
                                                <circle cx="12" cy="9" r="2.5" fill="white"/>
                                            </svg>
                                        `),
                                        scaledSize: new window.google.maps.Size(24, 24),
                                    } : undefined}
                                />
                            ))}

                            {/* Info Window */}
                            {selectedMarker && (
                                <InfoWindow
                                    position={selectedMarker.position}
                                    onCloseClick={() => setSelectedMarker(null)}
                                >
                                    <div className="p-2 max-w-xs">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                                    {selectedMarker.name}
                                                </h3>
                                                <p className="text-xs text-gray-600 capitalize">
                                                    {selectedMarker.category}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {selectedMarker.address}
                                                </p>
                                                
                                                {selectedMarker.rating && (
                                                    <div className="flex items-center mt-1">
                                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                        <span className="text-xs text-gray-600 ml-1">
                                                            {selectedMarker.rating}
                                                        </span>
                                                    </div>
                                                )}

                                                {selectedMarker.phone && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        📞 {selectedMarker.phone}
                                                    </p>
                                                )}

                                                <div className="mt-3">
                                                    <Button 
                                                        size="sm" 
                                                        className="w-full text-xs"
                                                        onClick={() => handleAddLead(selectedMarker)}
                                                    >
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Add as Lead
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                )}
            </LoadScript>

            {/* Show Search Button when search bar is hidden */}
            {!showSearchBar && (
                <div className="absolute top-3 left-3 z-20">
                    <Button
                        onClick={() => setShowSearchBar(true)}
                        size="sm"
                        className="shadow-lg"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Searching for businesses...</p>
                    </div>
                </div>
            )}

            {/* Results summary */}
            {markers.length > 0 && (
                <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-lg p-2 z-10">
                    <Badge variant="secondary">
                        {markers.length} businesses found
                    </Badge>
                </div>
            )}
        </div>
    );
}