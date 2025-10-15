
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapIcon, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

import MapView from '../components/map/MapView';
import SearchBar from '../components/search/SearchBar';
import BusCard from '../components/buses/BusCard';
import NearbyStops from '../components/buses/NearbyStops';

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapCenter, setMapCenter] = useState([16.5062, 80.6480]); // Vijayawada
  const [mapZoom, setMapZoom] = useState(12);

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => base44.entities.BusRoute.list(),
    initialData: [],
  });

  const { data: buses, isLoading: busesLoading, refetch: refetchBuses } = useQuery({
    queryKey: ['buses'],
    queryFn: () => base44.entities.Bus.list(),
    initialData: [],
  });

  const handleSearch = ({ from, to }) => {
    const matchingRoutes = routes.filter(route => {
      const hasFrom = route.stops?.some(stop => 
        stop.name.toLowerCase().includes(from.toLowerCase())
      );
      const hasTo = route.stops?.some(stop => 
        stop.name.toLowerCase().includes(to.toLowerCase())
      );
      return hasFrom && hasTo;
    });

    if (matchingRoutes.length > 0) {
      const firstRoute = matchingRoutes[0];
      setSelectedRoute(firstRoute);
      
      const firstStop = firstRoute.stops?.[0];
      if (firstStop) {
        setMapCenter([firstStop.lat, firstStop.lng]);
        setMapZoom(14);
      }

      const matchingBuses = buses.filter(bus => 
        matchingRoutes.some(route => route.route_number === bus.route_number)
      );
      
      setSearchResults({
        routes: matchingRoutes,
        buses: matchingBuses,
      });
    } else {
      setSearchResults({ routes: [], buses: [] });
    }
  };

  const handleBusClick = (bus) => {
    setMapCenter([bus.current_lat, bus.current_lng]);
    setMapZoom(15);
  };

  const handleStopClick = (stop) => {
    setMapCenter([stop.lat, stop.lng]);
    setMapZoom(16);
  };

  const nearbyStops = selectedRoute?.stops?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-xl"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">MyBusNow</h1>
              <p className="text-sm text-blue-100">Travelling made easy</p>
            </div>
          </div>
          <Link to={createPageUrl('Chatbot')}>
            <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white transform hover:scale-105 transition-all duration-200 rounded-2xl h-12 px-6">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Ask Assistant</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Search Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl p-4 h-[500px] md:h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-900">Live Bus Tracking</h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetchBuses()}
                  className="rounded-full hover:bg-blue-50 transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-[calc(100%-60px)]">
                <MapView
                  buses={buses}
                  routes={routes}
                  selectedRoute={selectedRoute}
                  center={mapCenter}
                  zoom={mapZoom}
                />
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {searchResults ? (
              <>
                {searchResults.buses.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-900">
                      Available Buses ({searchResults.buses.length})
                    </h3>
                    {searchResults.buses.map((bus) => {
                      const route = routes.find(r => r.route_number === bus.route_number);
                      return (
                        <BusCard
                          key={bus.id}
                          bus={bus}
                          route={route}
                          onClick={() => handleBusClick(bus)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <MapIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">No buses found for this route</p>
                    <p className="text-gray-500 text-sm mt-2">Try searching for a different route</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <NearbyStops 
                  stops={nearbyStops} 
                  onStopClick={handleStopClick}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
