import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from && to) {
      onSearch({ from, to });
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-white rounded-3xl shadow-xl p-6 backdrop-blur-lg bg-opacity-95"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
          <Input
            type="text"
            placeholder="From (e.g., Secunderabad)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="relative">
          <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
          <Input
            type="text"
            placeholder="To (e.g., Jubilee Hills)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-orange-500 transition-all"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Find Buses
        </Button>
      </form>
    </motion.div>
  );
}
