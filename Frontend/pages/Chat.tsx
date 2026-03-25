import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components/ui/Components';
import { useAuth } from '../App';
import { chatApi, userApi, ApiMessage, ApiUser } from '../services/api';
import { Send, Search, MoreVertical, MessageSquare, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedContactRef = useRef<Contact | null>(null);

  // Keep a ref in sync so socket handler always has latest selectedContact
  useEffect(() => { selectedContactRef.current = selectedContact; }, [selectedContact]);

  // ── Load contacts: all users + last messages from conversations ──
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingContacts(true);
      try {
        const [allUsers, conversations] = await Promise.all([
          userApi.getAll().catch(() => [] as ApiUser[]),
          chatApi.getConversations().catch(() => [] as ApiMessage[]),
        ]);

        const lastMsgMap = new Map<string, ApiMessage>();
        for (const msg of conversations) {
          const contactId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
          if (!lastMsgMap.has(contactId)) lastMsgMap.set(contactId, msg);
        }

        const list: Contact[] = allUsers
          .filter((u) => u._id !== user.id)
          .map((u) => {
            const lastMsg = lastMsgMap.get(u._id);
            return {
              id: u._id,
              name: u.name,
              email: u.email,
              avatar: u.name.charAt(0).toUpperCase(),
              lastMessage: lastMsg?.content,
              lastMessageTime: lastMsg
                ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
              unread: lastMsg ? !lastMsg.isRead && lastMsg.receiverId === user.id : false,
            };
          });

        list.sort((a, b) => {
          if (a.lastMessage && !b.lastMessage) return -1;
          if (!a.lastMessage && b.lastMessage) return 1;
          return a.name.localeCompare(b.name);
        });

        setContacts(list);
      } catch {
        setContacts([]);
      } finally {
        setLoadingContacts(false);
      }
    };
    load();
  }, [user]);

  // ── Socket.io connection ──
  useEffect(() => {
    if (!user) return;
    const socket = io(window.location.origin, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => { socket.emit('join', user.id); });

    socket.on('newMessage', (msg: ApiMessage) => {
      const current = selectedContactRef.current;
      const isRelevant =
        current &&
        ((msg.senderId === current.id && msg.receiverId === user.id) ||
         (msg.senderId === user.id && msg.receiverId === current.id));

      if (isRelevant) {
        setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      }

      const contactId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      setContacts((prev) =>
        prev.map((c) =>
          c.id !== contactId
            ? c
            : {
                ...c,
                lastMessage: msg.content,
                lastMessageTime: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: msg.receiverId === user.id && (!current || current.id !== contactId),
              },
        ),
      );
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [user]);

  // ── Load messages for selected contact ──
  useEffect(() => {
    if (!selectedContact) return;
    const load = async () => {
      setLoadingMessages(true);
      try {
        const msgs = await chatApi.getMessages(selectedContact.id);
        setMessages(msgs.reverse());
      } catch {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    load();
  }, [selectedContact]);

  // ── Auto-scroll ──
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // ── Send message ──
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact || !user) return;
    const content = message.trim();
    setMessage('');
    try {
      await chatApi.send({ receiverId: selectedContact.id, content });
    } catch {
      // Optimistic fallback
      setMessages((prev) => [
        ...prev,
        {
          _id: `temp-${Date.now()}`,
          senderId: user.id,
          receiverId: selectedContact.id,
          content,
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingContacts ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-neutral-800 flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-800 w-24 rounded" />
                  <div className="h-2 bg-neutral-800 w-16 rounded" />
                </div>
              </div>
            ))
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              <MessageSquare className="mx-auto mb-2 w-8 h-8 opacity-50" />
              No contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-neutral-800 flex items-center space-x-3 cursor-pointer transition-colors hover:bg-neutral-800 ${
                  selectedContact?.id === contact.id ? 'bg-neutral-800/80 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center font-bold text-xs">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                    {contact.lastMessageTime && (
                      <span className="text-[10px] text-gray-500 ml-2 shrink-0">{contact.lastMessageTime}</span>
                    )}
                  </div>
                  {contact.lastMessage ? (
                    <p className={`text-xs truncate ${contact.unread ? 'text-white font-semibold' : 'text-gray-500'}`}>
                      {contact.lastMessage}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600 italic">No messages yet</p>
                  )}
                </div>
                {contact.unread && <div className="w-2 h-2 bg-primary rounded-full shrink-0" />}
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
            {selectedContact ? (
              <>
                <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center font-bold text-xs">
                  {selectedContact.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedContact.name}</h3>
                  <p className="text-xs text-gray-500">{selectedContact.email}</p>
                </div>
              </>
            ) : (
              <h3 className="font-bold text-lg text-gray-500">Select a conversation</h3>
            )}
          </div>
          {selectedContact && (
            <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
          {!selectedContact ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-semibold">No conversation selected</p>
              <p className="text-sm">Pick a contact to start chatting</p>
            </div>
          ) : loadingMessages ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 text-sm relative ${isMe ? 'bg-primary text-black font-medium' : 'bg-neutral-800 text-white'}`}>
                    <p>{msg.content}</p>
                    <span className={`text-[10px] absolute bottom-1 right-2 ${isMe ? 'text-black/60' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-800 bg-surface">
          <form onSubmit={handleSend} className="flex space-x-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedContact ? 'Type a message...' : 'Select a contact first'}
              disabled={!selectedContact}
              className="flex-1 bg-neutral-900 border border-neutral-700 p-3 text-sm text-white focus:outline-none focus:border-primary placeholder:text-gray-600 disabled:opacity-50"
            />
            <Button type="submit" disabled={!selectedContact || !message.trim()} className="w-12 px-0">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
