"use client";

declare global {
  interface Window {
    google: any;
  }
}

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, MapPin } from "lucide-react";
import type { PCCafe } from "@/lib/types";

interface GoogleMapProps {
  cafes: PCCafe[];
  hoveredCafe: PCCafe | null;
  onHoverCafe: (cafe: PCCafe | null) => void;
}

// Ulaanbaatar center coordinates
const UB_CENTER = { lat: 47.9184, lng: 106.9177 };

export function GoogleMap({ cafes, hoveredCafe, onHoverCafe }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: UB_CENTER,
      zoom: 16,
      mapId: "gaming-cafe-map",
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0a0a12" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a12" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#00d4ff" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#1a1a2e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#1f2937" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0e1626" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#111827" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#0d1f0d" }],
        },
      ],
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
    });

    // 🔵 Хэрэглэгчийн marker
    const userMarker = new window.google.maps.Marker({
      position: UB_CENTER,
      map: mapInstance,
      title: "Your Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "blue",
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 2,
      },
    });

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          userMarker.setPosition(userPos);
          mapInstance.panTo(userPos);
        },
        (err) => {
          console.error("Failed to` get user location:", err);
        },
        { enableHighAccuracy: true }
      );
    }

    mapInstanceRef.current = mapInstance;
    createMarkers(mapInstance);
    setIsLoading(false);
  }, [cafes]);

  const createMarkers = (mapInstance: any) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (marker.setMap) marker.setMap(null);
    });
    markersRef.current = [];

    cafes.forEach((cafe) => {
      // Create container for marker and tooltip
      const container = document.createElement("div");
      container.style.cssText =
        "position: relative; display: flex; flex-direction: column; align-items: center;";

      // Create tooltip element
      const tooltip = document.createElement("div");
      tooltip.className = "cafe-tooltip";
      tooltip.style.cssText = `
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 18, 0.95);
        border: 1px solid ${cafe.isOpen ? "#00d4ff" : "#6b7280"};
        border-radius: 8px;
        padding: 8px 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 1000;
      `;
      tooltip.innerHTML = `
        <div style="font-weight: 600; font-size: 14px; color: #fff; margin-bottom: 4px;">${
          cafe.name
        }</div>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
          <span style="display: flex; align-items: center; gap: 4px; color: #fbbf24;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            ${cafe.rating}
          </span>
          <span style="color: ${cafe.isOpen ? "#22c55e" : "#ef4444"};">${
        cafe.isOpen ? "Open" : "Closed"
      }</span>
          <span style="color: #9ca3af;">${cafe.availableSeats}/${
        cafe.totalSeats
      } seats</span>
        </div>
        <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${
          cafe.isOpen ? "#00d4ff" : "#6b7280"
        };"></div>
      `;
      container.appendChild(tooltip);

      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "cafe-marker";
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: ${cafe.isOpen ? "#00d4ff" : "#6b7280"};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 ${
          cafe.isOpen
            ? "15px rgba(0, 212, 255, 0.5)"
            : "10px rgba(107, 114, 128, 0.3)"
        };
      `;
      markerElement.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      `;
      container.appendChild(markerElement);

      // Try to use AdvancedMarkerElement if available
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat: cafe.lat, lng: cafe.lng },
          content: container,
          title: cafe.name,
        });

        marker.addListener("click", () => {
          window.location.href = `/cafe/${cafe.id}`;
        });

        container.addEventListener("mouseenter", () => {
          onHoverCafe(cafe);
          markerElement.style.transform = "scale(1.2)";
          markerElement.style.boxShadow = "0 0 25px rgba(0, 212, 255, 0.8)";
          tooltip.style.opacity = "1";
          tooltip.style.visibility = "visible";
        });

        container.addEventListener("mouseleave", () => {
          onHoverCafe(null);
          markerElement.style.transform = "scale(1)";
          markerElement.style.boxShadow = cafe.isOpen
            ? "0 0 15px rgba(0, 212, 255, 0.5)"
            : "0 0 10px rgba(107, 114, 128, 0.3)";
          tooltip.style.opacity = "0";
          tooltip.style.visibility = "hidden";
        });

        markersRef.current.push({
          marker,
          element: markerElement,
          tooltip,
          cafe,
        });
      } else {
        // Fallback to regular marker with InfoWindow
        const marker = new window.google.maps.Marker({
          map: mapInstance,
          position: { lat: cafe.lat, lng: cafe.lng },
          title: cafe.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: cafe.isOpen ? "#00d4ff" : "#6b7280",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="background: #0a0a12; padding: 8px 12px; border-radius: 8px;">
              <div style="font-weight: 600; font-size: 14px; color: #fff; margin-bottom: 4px;">${
                cafe.name
              }</div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="color: #fbbf24;">★ ${cafe.rating}</span>
                <span style="color: ${cafe.isOpen ? "#22c55e" : "#ef4444"};">${
            cafe.isOpen ? "Open" : "Closed"
          }</span>
              </div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          window.location.href = `/cafe/${cafe.id}`;
        });

        marker.addListener("mouseover", () => {
          onHoverCafe(cafe);
          infoWindow.open(mapInstance, marker);
        });

        marker.addListener("mouseout", () => {
          onHoverCafe(null);
          infoWindow.close();
        });

        markersRef.current.push({ marker, cafe });
      }
    });
  };

  // Load Google Maps script
  useEffect(() => {
    const apiKey = "AIzaSyC7A-0P6Xc-wzZSJhlWHTyqKuncfTIbCGA";

    if (!apiKey) {
      setError("Google Maps API key is not configured");
      setIsLoading(false);
      return;
    }

    // Check if already loaded
    if (window.google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=beta`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    script.onerror = () => {
      setError("Failed to load Google Maps");
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      markersRef.current.forEach((item) => {
        if (item.marker?.setMap) item.marker.setMap(null);
      });
    };
  }, [initMap]);

  // Update marker styles and tooltip when hovered cafe changes (from sidebar)
  useEffect(() => {
    markersRef.current.forEach((item) => {
      const { element, tooltip, cafe } = item;
      if (element) {
        if (hoveredCafe?.id === cafe.id) {
          element.style.transform = "scale(1.3)";
          element.style.boxShadow = "0 0 30px rgba(0, 212, 255, 0.9)";
          if (tooltip) {
            tooltip.style.opacity = "1";
            tooltip.style.visibility = "visible";
          }
        } else {
          element.style.transform = "scale(1)";
          element.style.boxShadow = cafe.isOpen
            ? "0 0 15px rgba(0, 212, 255, 0.5)"
            : "0 0 10px rgba(107, 114, 128, 0.3)";
          if (tooltip) {
            tooltip.style.opacity = "0";
            tooltip.style.visibility = "hidden";
          }
        }
      }
    });
  }, [hoveredCafe]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-[#0a0a12] flex flex-col items-center justify-center">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-[#0a0a12] flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-card/90 backdrop-blur border border-border">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
            <span className="text-muted-foreground">Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-muted-foreground">Closed</span>
          </div>
        </div>
      </div>

      {/* Location indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-card/90 backdrop-blur border border-border">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm text-foreground">Ulaanbaatar, Mongolia</span>
      </div>
    </div>
  );
}
