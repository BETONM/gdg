'use client';

import { useEffect, useRef, useState } from 'react';
import { Mission, PlaceResult } from '@/types/mission';

interface Props {
  mission: Mission;
  onComplete: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initMap: () => void;
  }
}

const DEFAULT_LOCATION = { lat: 37.5665, lng: 126.9780 };

export default function MapView({ mission, onComplete }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(DEFAULT_LOCATION)
      );
    }
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapReady(true);
      return;
    }

    if (window.google?.maps) {
      setMapReady(true);
      return;
    }

    window.initMap = () => setMapReady(true);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => setLoadError(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || loadError) return;
    if (!window.google?.maps) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0f1319' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
      ],
    });

    new window.google.maps.Marker({
      position: userLocation,
      map: mapInstance.current,
      title: '현재 위치',
      icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#3b82f6', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
    });
  }, [mapReady, userLocation, loadError]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const params = new URLSearchParams({
        query: mission.placeSearchQuery,
        lat: String(userLocation.lat),
        lng: String(userLocation.lng),
      });
      const res = await fetch(`/api/places?${params}`);
      const data = await res.json();
      setPlaces(data.places ?? []);
    };
    fetchPlaces();
  }, [mission.placeSearchQuery, userLocation]);

  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps || places.length === 0) return;

    places.forEach((place, i) => {
      const marker = new window.google.maps.Marker({
        position: place.location,
        map: mapInstance.current,
        title: place.name,
        label: { text: String(i + 1), color: '#fff', fontWeight: 'bold' },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#8b5cf6',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });
      marker.addListener('click', () => setSelectedPlace(place));
    });
  }, [places]);

  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="app-badge">Google Maps</div>
        <h1 className="screen-title">{mission.title}</h1>
        <p className="screen-subtitle">주변 장소를 확인해보세요</p>
      </div>

      {loadError ? (
        <div className="map-error glass-card">
          <p>지도를 불러오지 못했습니다. 장소 목록으로 대신 확인하세요.</p>
        </div>
      ) : !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <div className="map-error glass-card">
          <p>Google Maps API 키가 설정되지 않았습니다. 아래 장소 목록을 참고하세요.</p>
        </div>
      ) : (
        <div ref={mapRef} className="map-container" />
      )}

      {selectedPlace && (
        <div className="selected-place glass-card">
          <strong>{selectedPlace.name}</strong>
          <span>{selectedPlace.vicinity}</span>
          {selectedPlace.rating && <span>⭐ {selectedPlace.rating}</span>}
        </div>
      )}

      {places.length > 0 && (
        <div className="places-section">
          <h2 className="section-title">주변 장소 ({places.length})</h2>
          <ul className="places-list">
            {places.map((p, i) => (
              <li
                key={p.placeId}
                className={`place-item glass-card ${selectedPlace?.placeId === p.placeId ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPlace(p);
                  if (mapInstance.current && window.google?.maps) {
                    mapInstance.current.panTo(p.location);
                    mapInstance.current.setZoom(16);
                  }
                }}
              >
                <span className="place-num">{i + 1}</span>
                <div className="place-info">
                  <strong>{p.name}</strong>
                  <span>{p.vicinity}</span>
                </div>
                {p.rating && <span className="place-rating">⭐ {p.rating}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-primary submit-btn" onClick={onComplete}>
        미션 완료했어요! 🎉
      </button>
    </div>
  );
}
