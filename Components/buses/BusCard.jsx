import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, Clock, Users, MapPin, IndianRupee } from 'lucide-react';

export default function BusCard({ bus, route, onClick }) {
  const occupancyColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const occupancyLabels = {
    low: 'Available',
    medium: 'Moderate',
    high: 'Crowded',
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onClick}
        className="p-5 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400 rounded-2xl bg-white"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">Bus {bus.bus_number}</h3>
              <p className="text-sm text-gray-600">Route {bus.route_number}</p>
            </div>
          </div>
          <Badge className={`${occupancyColors[bus.occupancy]} border text-sm px-3 py-1`}>
            <Users className="w-3 h-3 mr-1" />
            {occupancyLabels[bus.occupancy]}
          </Badge>
        </div>

        {route && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div>
                <span className="font-medium">{route.start_point}</span>
                <span className="text-gray-500 mx-2">→</span>
                <span className="font-medium">{route.end_point}</span>
              </div>
            </div>
            {route.route_name_telugu && (
              <p className="text-sm text-gray-600 pl-6">{route.route_name_telugu}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-blue-600 text-lg">{bus.eta_minutes} min</span>
          </div>
          {route && (
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <IndianRupee className="w-4 h-4" />
              <span>{route.fare}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
