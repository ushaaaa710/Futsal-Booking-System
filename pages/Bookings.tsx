import React, { useState } from 'react';
import { useAuth } from '../App';
import { INITIAL_BOOKINGS } from '../services/mockData';
import { Booking, BookingStatus } from '../types';
import { Card, Badge, Button, Modal, StarRating } from '../components/ui/Components';
import { Calendar, Clock, Banknote, Search, XCircle, FileText, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookingsPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'HISTORY' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Filter bookings based on user and selected filter
  const allBookings = INITIAL_BOOKINGS.filter(b => b.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = booking.courtName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const today = new Date().toISOString().split('T')[0];
    const isUpcoming = booking.date >= today && booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED;

    switch (filter) {
      case 'UPCOMING':
        return isUpcoming;
      case 'HISTORY':
        return booking.status === BookingStatus.COMPLETED || (!isUpcoming && booking.status !== BookingStatus.CANCELLED);
      case 'CANCELLED':
        return booking.status === BookingStatus.CANCELLED;
      default:
        return true;
    }
  });

  const handleOpenReview = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setRating(0);
    setReviewText('');
    setIsReviewModalOpen(true);
  };

  const submitReview = () => {
    // In a real app, this would make an API call
    console.log("Submitting review for", selectedBookingForReview?.id, { rating, reviewText });
    setIsReviewModalOpen(false);
    alert("Thanks! Your review helps other players.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">My Games</h1>
        <p className="text-gray-400">Manage your bookings and match history.</p>
      </div>

      {/* Controls */}
      <Card className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['ALL', 'UPCOMING', 'HISTORY', 'CANCELLED'] as const).map((f) => (
            <Button 
              key={f} 
              variant={filter === f ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilter(f)}
              className="whitespace-nowrap"
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search arena name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary placeholder:text-gray-600 rounded-none"
          />
        </div>
      </Card>

      {/* Booking List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-6 hover:border-primary/30 transition-colors group">
                  <div className="flex gap-4 items-start w-full md:w-auto">
                    <div className="bg-neutral-800 p-4 flex flex-col items-center justify-center min-w-[80px] border border-neutral-700">
                      <span className="text-xs uppercase text-gray-500 font-bold mb-1">
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {new Date(booking.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{booking.courtName}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                        <span className="flex items-center"><Clock size={14} className="mr-1" /> {booking.slots.join(', ')}</span>
                        <span className="flex items-center"><Banknote size={14} className="mr-1" /> Rs. {booking.totalPrice}</span>
                        <span className="font-mono text-xs opacity-50 hidden md:inline">#{booking.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-neutral-800 pt-4 md:border-0 md:pt-0">
                    <Badge variant={
                      booking.status === 'CONFIRMED' ? 'success' : 
                      booking.status === 'CANCELLED' ? 'danger' : 
                      booking.status === 'COMPLETED' ? 'default' : 'warning'
                    }>
                      {booking.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                       {booking.status === BookingStatus.COMPLETED && (
                          <>
                            <Button variant="ghost" size="sm" title="Download Receipt">
                               <FileText size={18} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleOpenReview(booking)} title="Write Review">
                                <Star size={16} className="mr-2" /> Rate
                            </Button>
                          </>
                       )}
                       {filter !== 'CANCELLED' && booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
                          <Button variant="danger" size="sm" title="Cancel Booking">
                             <XCircle size={18} />
                          </Button>
                       )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
             <div className="text-center py-12 bg-surface border border-neutral-800 border-dashed">
               <Calendar className="mx-auto w-12 h-12 text-gray-600 mb-4" />
               <h3 className="text-xl font-bold text-gray-400">No bookings found</h3>
               <p className="text-gray-500">Book a court to get started.</p>
             </div>
          )}
        </AnimatePresence>
      </div>

      {/* Review Modal */}
      <Modal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        title={`Review: ${selectedBookingForReview?.courtName}`}
      >
         <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
               <p className="text-gray-400 text-sm uppercase font-bold">Rate your experience</p>
               <StarRating rating={rating} setRating={setRating} />
            </div>
            
            <div>
               <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Comments</label>
               <textarea 
                 rows={4} 
                 className="w-full bg-neutral-900 border border-neutral-700 p-3 text-sm text-white focus:outline-none focus:border-primary resize-none"
                 placeholder="How was the turf? Was the lighting good?"
                 value={reviewText}
                 onChange={(e) => setReviewText(e.target.value)}
               />
            </div>

            <Button className="w-full" onClick={submitReview} disabled={rating === 0}>
               Submit Review
            </Button>
         </div>
      </Modal>
    </div>
  );
};

export default BookingsPage;
