import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Skeleton } from '../components/ui/Components';
import { useAuth } from '../App';
import { Send, Search, MoreVertical, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const CONTACTS = [
  { id: 1, name: 'Support', role: 'Customer Service', status: 'online', avatar: 'CS' },
  { id: 2, name: 'Manager (Dhuku)', role: 'Venue Manager', status: 'offline', avatar: 'MD' },
  { id: 3, name: 'Suman K.', role: 'Teammate', status: 'online', avatar: 'SK' },
];

const INITIAL_MESSAGES = [
  { id: 1, senderId: 1, text: 'Namaste! How can we help you with your booking?', time: '10:00 AM' },
  { id: 2, senderId: 'me', text: 'Hi! Is the parking space available at Dhuku Futsal?', time: '10:05 AM' },
];

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      senderId: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Mock response
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            senderId: selectedContact.id,
            text: "Yes, we have ample parking space for bikes and cars.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6">
      {/* Contacts Sidebar */}
      <Card className="w-1/3 p-0 flex flex-col overflow-hidden hidden md:flex border-neutral-800">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              className="w-full bg-black border border-neutral-700 p-2 pl-9 text-sm text-white focus:outline-none focus:border-primary"
              placeholder="Search people..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            // Skeleton for Contacts
            [1, 2, 3].map(i => (
              <div key={i} className="p-4 border-b border-neutral-800 flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-800 w-24 rounded" />
                  <div className="h-2 bg-neutral-800 w-16 rounded" />
                </div>
              </div>
            ))
          ) : (
            CONTACTS.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-neutral-800 flex items-center space-x-3 cursor-pointer transition-colors hover:bg-neutral-800 ${selectedContact.id === contact.id ? 'bg-neutral-800/80 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center font-bold text-xs">
                    {contact.avatar}
                  </div>
                  {contact.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{contact.name}</h4>
                  <p className="text-xs text-gray-500">{contact.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 p-0 flex flex-col overflow-hidden border-neutral-800 relative">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <div className="flex items-center space-x-3">
             {isLoading ? (
                 <Skeleton className="w-32 h-6" />
             ) : (
                <>
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center font-bold text-xs md:hidden">
                        {selectedContact.avatar}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{selectedContact.name}</h3>
                        <div className="flex items-center text-xs text-green-500">
                            <Circle size={8} fill="currentColor" className="mr-1" /> Online
                        </div>
                    </div>
                </>
             )}
          </div>
          <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
            {isLoading ? (
                 // Chat Skeletons
                 [1, 2, 3].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`w-1/2 h-16 bg-neutral-800 rounded-none animate-pulse ${i % 2 === 0 ? 'opacity-50' : 'opacity-30'}`} />
                    </div>
                 ))
            ) : (
                messages.map((msg) => (
                    <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[80%] p-4 text-sm relative
                            ${msg.senderId === 'me' 
                                ? 'bg-primary text-black font-medium' 
                                : 'bg-neutral-800 text-white'}
                        `}>
                            <p>{msg.text}</p>
                            <span className={`text-[10px] absolute bottom-1 right-2 ${msg.senderId === 'me' ? 'text-black/60' : 'text-gray-500'}`}>
                                {msg.time}
                            </span>
                        </div>
                    </motion.div>
                ))
            )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-800 bg-surface">
            <form onSubmit={handleSend} className="flex space-x-2">
                <input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-neutral-900 border border-neutral-700 p-3 text-sm text-white focus:outline-none focus:border-primary placeholder:text-gray-600"
                />
                <Button type="submit" disabled={isLoading} className="w-12 px-0">
                    <Send size={18} />
                </Button>
            </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
