import React, { useState, useEffect } from 'react';
import { COURTS, INITIAL_BOOKINGS } from '../services/mockData';
import { Court, TimeSlot } from '../types';
import { Button, Card, Badge, Modal } from '../components/ui/Components';
import { Check, ChevronRight, Info, AlertCircle, FileText, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components ---

const DateSelector = ({ selectedDate, onSelect }: { selectedDate: string, onSelect: (d: string) => void }) => {
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
      {dates.map((date) => {
        const dateStr = date.toISOString().split('T')[0];
        const isSelected = dateStr === selectedDate;
        return (
          <button
            key={dateStr}
            onClick={() => onSelect(dateStr)}
            className={`
              flex flex-col items-center justify-center min-w-[80px] h-20 border transition-all shrink-0
              ${isSelected 
                ? 'bg-primary border-primary text-black' 
                : 'bg-surface border-neutral-700 text-gray-400 hover:border-primary/50 hover:text-white'}
            `}
          >
            <span className="text-xs uppercase font-bold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className="text-xl font-bold">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate slots for the day (6am to 10pm for Nepal context)
  const generateSlots = (): TimeSlot[] => {
    return Array.from({ length: 16 }, (_, i) => {
      const hour = 6 + i;
      const timeStr = `${hour < 10 ? '0' + hour : hour}:00`;
      
      // Check availability against mock bookings
      const isBooked = INITIAL_BOOKINGS.some(
        b => b.courtId === selectedCourt?.id && b.date === selectedDate && b.slots.includes(timeStr)
      );

      return {
        id: `${selectedDate}-${hour}`,
        startTime: timeStr,
        endTime: `${hour + 1}:00`,
        isAvailable: !isBooked,
        price: selectedCourt ? selectedCourt.hourlyRate : 0
      };
    });
  };

  const slots = selectedCourt ? generateSlots() : [];

  const handleSlotToggle = (startTime: string) => {
    if (selectedSlots.includes(startTime)) {
      setSelectedSlots(selectedSlots.filter(s => s !== startTime));
    } else {
      setSelectedSlots([...selectedSlots, startTime].sort());
    }
  };

  const calculateTotal = () => {
    if (!selectedCourt) return 0;
    return selectedSlots.length * selectedCourt.hourlyRate;
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
  };

  const resetBooking = () => {
    setShowSuccess(false);
    setStep(1);
    setSelectedCourt(null);
    setSelectedSlots([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Book a Court</h1>

      {/* Progress Stepper */}
      <div className="flex items-center mb-8 text-sm text-gray-500 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
        <span className={step >= 1 ? 'text-primary' : ''}>01 Choose Arena</span>
        <ChevronRight size={16} className="mx-2" />
        <span className={step >= 2 ? 'text-primary' : ''}>02 Select Time</span>
        <ChevronRight size={16} className="mx-2" />
        <span className={step >= 3 ? 'text-primary' : ''}>03 Payment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Selection Area */}
        <div className="lg:col-span-2 space-y-8">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {COURTS.map(court => (
                  <div 
                    key={court.id}
                    onClick={() => { setSelectedCourt(court); setStep(2); }}
                    className="group relative h-64 border border-neutral-700 bg-surface cursor-pointer overflow-hidden"
                  >
                    <img src={court.image} alt={court.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-50 group-hover:opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="flex justify-between items-end">
                        <div>
                          <Badge className="mb-2 bg-primary text-black border-none font-bold">{court.type}</Badge>
                          <h3 className="text-xl font-bold uppercase text-white group-hover:text-primary transition-colors">{court.name}</h3>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                             <MapPin size={12} className="mr-1" /> Kathmandu
                          </div>
                        </div>
                        <span className="text-xl font-bold text-white">Rs. {court.hourlyRate}<span className="text-xs text-gray-400 font-normal">/hr</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Select Date & Time</h2>
                  <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white uppercase">Change Court</button>
                </div>

                <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />

                <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      onClick={() => handleSlotToggle(slot.startTime)}
                      className={`
                        p-3 md:p-4 border text-center transition-all relative overflow-hidden group
                        ${!slot.isAvailable 
                          ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed' 
                          : selectedSlots.includes(slot.startTime)
                            ? 'bg-primary border-primary text-black'
                            : 'bg-surface border-neutral-700 hover:border-primary text-white'}
                      `}
                    >
                      <span className="block text-lg font-bold">{slot.startTime}</span>
                      <span className="text-xs uppercase opacity-70">
                        {slot.isAvailable ? (selectedSlots.includes(slot.startTime) ? 'Selected' : 'Available') : 'Booked'}
                      </span>
                      {selectedSlots.includes(slot.startTime) && (
                        <motion.div layoutId="outline" className="absolute inset-0 border-2 border-white pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-primary/20">
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-neutral-800 pb-2">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Court</span>
                <span className="text-white font-medium text-right">{selectedCourt?.name || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date</span>
                <span className="text-white font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Slots</span>
                <div className="text-right">
                  {selectedSlots.length > 0 ? (
                    selectedSlots.map(s => <Badge key={s} className="ml-1 mb-1">{s}</Badge>)
                  ) : '-'}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">Total Amount</span>
                <span className="text-3xl font-bold text-primary">Rs. {calculateTotal()}</span>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg" 
              disabled={step === 1 || selectedSlots.length === 0 || isProcessing}
              onClick={handleConfirm}
              isLoading={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Confirm Payment`}
            </Button>
            
            <p className="mt-4 text-xs text-center text-gray-500">
              Payment via Wallet, eSewa, or Khalti accepted.
            </p>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={resetBooking} title="Booking Confirmed!">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">You're all set!</h3>
          <p className="text-gray-400 mb-8">
            Your booking for <span className="text-primary font-bold">{selectedCourt?.name}</span> on {selectedDate} is confirmed.
          </p>
          <div className="bg-neutral-900 p-4 mb-6 text-left border border-neutral-800">
             <p className="text-xs text-gray-500 uppercase">Booking ID</p>
             <p className="text-lg font-mono tracking-widest text-white">#CS-KTM-{Math.floor(Math.random() * 10000)}</p>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => alert("Downloading PDF Receipt...")}>
              <FileText className="mr-2" size={18} /> Download Receipt
            </Button>
            <Button onClick={resetBooking} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingPage;
