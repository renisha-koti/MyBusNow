import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

import ChatInterface from '../components/chatbot/ChatInterface';

export default function Chatbot() {
  const navigate = useNavigate();

  const { data: routes } = useQuery({
    queryKey: ['routes'],
    queryFn: () => base44.entities.BusRoute.list(),
    initialData: [],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 p-4 md:p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Button
          onClick={() => navigate(createPageUrl('Home'))}
          className="mb-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white transform hover:scale-105 transition-all duration-200 rounded-2xl h-12 px-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Map
        </Button>

        <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-140px)]">
          <ChatInterface routes={routes} />
        </div>
      </motion.div>
    </div>
  );
}
