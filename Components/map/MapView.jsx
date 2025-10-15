import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Bus, MapPin, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0iIzBFQTVFOSIvPjxwYXRoIGQ9Ik0xMCA5SDIyVjIwSDEwVjlaIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjEyIiB5PSIyMSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxOCIgeT0iMjEiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const stopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI0Y5NzMxNiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ buses, routes, selectedRoute, center = [17.385, 78.4867], zoom = 13 }) {
  const occupancyColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const occupancyLabels = {
    low: 'Available',
    medium: 'Moderate',
    high: 'Crowded',
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draw route lines */}
        {routes.map((route) => {
          const positions = route.stops?.map(stop => [stop.lat, stop.lng]) || [];
          return positions.length > 1 ? (
            <Polyline
              key={route.id}
              positions={positions}
              color={route.color || '#0EA5E9'}
              weight={4}
              opacity={selectedRoute && selectedRoute.id === route.id ? 1 : 0.5}
            />
          ) : null;
        })}

        {/* Bus stops */}
        {routes.flatMap(route => 
          route.stops?.map((stop, idx) => (
            <Marker
              key={`${route.id}-${idx}`}
              position={[stop.lat, stop.lng]}
              icon={stopIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <p className="font-semibold">{stop.name}</p>
                  </div>
                  {stop.name_telugu && (
                    <p className="text-sm text-gray-600 mb-2">{stop.name_telugu}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>{stop.arrival_time || 'Various times'}</span>
                  </div>
                  <Badge className="mt-2 bg-orange-500">
                    Route {route.route_number}
                  </Badge>
                </div>
              </Popup>
            </Marker>
          )) || []
        )}

        {/* Active buses */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.current_lat, bus.current_lng]}
            icon={busIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <Bus className="w-5 h-5 text-blue-500" />
                  <p className="font-bold text-lg">Bus {bus.bus_number}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Route</p>
                    <p className="font-semibold">{bus.route_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Stop</p>
                    <p className="font-semibold">{bus.next_stop}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-blue-600">
                      {bus.eta_minutes} min away
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <Badge className={occupancyColors[bus.occupancy]}>
                      {occupancyLabels[bus.occupancy]}
                    </Badge>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
