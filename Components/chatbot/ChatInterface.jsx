import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface({ routes }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can help you with bus information. Ask me in English or Telugu! 🚌\nనమస్కారం! నేను బస్ సమాచారంతో మీకు సహాయం చేయగలను. ఇంగ్లీష్ లేదా తెలుగులో అడగండి! 🚌',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const routeInfo = routes.map(r => ({
        route_number: r.route_number,
        name: r.route_name,
        name_telugu: r.route_name_telugu,
        from: r.start_point,
        to: r.end_point,
        fare: r.fare,
        frequency: r.frequency,
        stops: r.stops?.map(s => s.name).join(', ') || ''
      }));

      const prompt = `You are a helpful bilingual bus assistant for MyBusNow app. 
User question: "${userMessage}"

Available bus routes data:
${JSON.stringify(routeInfo, null, 2)}

Respond naturally in ${language === 'telugu' ? 'Telugu (తెలుగు)' : 'English'} based on the user's question language.
If they ask in Telugu, respond in Telugu. If English, respond in English.
Be friendly, concise, and helpful. Include route numbers, fares, and timings when relevant.
If asking about routes between places, suggest the best route.`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bus Assistant</h2>
              <p className="text-sm text-blue-100">Always here to help!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'english' ? 'telugu' : 'english')}
            className="text-white hover:bg-white/20"
          >
            <Languages className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <Card
                  className={`p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none'
                      : 'bg-white border-2 border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <Card className="p-4 bg-white border-2 border-gray-100">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </Card>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white border-t-2 border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'telugu' ? 'మీ ప్రశ్న టైప్ చేయండి...' : 'Type your question...'}
            className="flex-1 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-blue-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
