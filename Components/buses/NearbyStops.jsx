import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function NearbyStops({ stops, onStopClick }) {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Nearby Stops</h3>
      {stops.map((stop, index) => (
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            onClick={() => onStopClick?.(stop)}
            className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-400 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{stop.name}</h4>
                {stop.name_telugu && (
                  <p className="text-sm text-gray-600 truncate">{stop.name_telugu}</p>
                )}
                {stop.arrival_time && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{stop.arrival_time}</span>
                  </div>
                )}
                <Badge className="mt-2 bg-orange-100 text-orange-800 border-orange-200">
                  {stop.distance || '0.5 km away'}
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
