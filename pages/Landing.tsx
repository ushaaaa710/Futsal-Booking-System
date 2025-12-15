import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Components';
import { Trophy, Calendar, Zap, Users, MessageSquare, Star, BarChart3, Clock, MapPin, Phone, Mail, Instagram, Facebook, Search, Check, MousePointer2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading for the Bento Grid effect
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-neutral-800 p-6 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Trophy className="text-primary w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter uppercase">Court<span className="text-primary">Sync</span></span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/auth/login')}>Log In</Button>
          <Button onClick={() => navigate('/auth/login')}>Book Now</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl relative z-10"
        >
          <div className="inline-block px-4 py-1.5 mb-6 border border-primary/30 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
            🇳🇵 Nepal's #1 Futsal Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            PLAY YOUR GAME, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">NOT THE BOOKING.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Find and book top futsal courts in Kathmandu, Lalitpur, and Bhaktapur instantly. No phone calls, just play.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto h-14 text-lg" onClick={() => navigate('/auth/login')}>
              Start Booking
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-14 text-lg"
              onClick={() => navigate('/auth/login', { state: { message: "Log in required to explore courts." } })}
            >
              Explore Courts
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold uppercase tracking-tight mb-8 text-center md:text-left">Why Players Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[600px]">
          
          {/* Feature 1: Real-Time Booking (Large 2x2) */}
          <BentoItem 
            className="md:col-span-2 md:row-span-2" 
            title="Live Availability" 
            desc="See which courts are free in real-time. No double bookings."
            icon={<Clock className="w-12 h-12 text-primary" />}
            isLoading={isLoading}
            delay={0}
          >
             <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-20 bg-gradient-to-t from-primary/50 to-transparent" />
             <div className="mt-4 space-y-2 opacity-60">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1 font-mono">
                   <span>Dhuku Futsal</span> <span className="text-green-400">AVAILABLE</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1 font-mono">
                   <span>Sankhamul Futsal</span> <span className="text-red-400">BOOKED</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1 font-mono">
                   <span>Velocity Arena</span> <span className="text-green-400">AVAILABLE</span>
                </div>
             </div>
          </BentoItem>

          {/* Feature 2: Instant Chat (1x1) */}
          <BentoItem 
             className="md:col-span-1 md:row-span-1" 
             title="Team Chat"
             desc="Coordinate with your squad."
             icon={<MessageSquare className="w-8 h-8 text-accent" />}
             isLoading={isLoading}
             delay={0.1}
          />

          {/* Feature 3: Smart Stats (1x1) */}
          <BentoItem 
             className="md:col-span-1 md:row-span-1" 
             title="Track Expenses"
             desc="Manage your game budget."
             icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
             isLoading={isLoading}
             delay={0.2}
          />

          {/* Feature 4: Community Reviews (1x1) */}
          <BentoItem 
             className="md:col-span-1 md:row-span-1" 
             title="Verified Courts"
             desc="Reviews you can trust."
             icon={<Star className="w-8 h-8 text-yellow-400" />}
             isLoading={isLoading}
             delay={0.3}
          />

          {/* Feature 5: Admin Tools (1x1) */}
          <BentoItem 
             className="md:col-span-1 md:row-span-1" 
             title="Easy Pay"
             desc="Integration with eSewa (Soon)."
             icon={<Zap className="w-8 h-8 text-white" />}
             isLoading={isLoading}
             delay={0.4}
          />

          {/* Feature 6: Performance (Wide 2x1) */}
          <BentoItem 
             className="md:col-span-2 md:row-span-1" 
             title="Made for Nepal" 
             desc="Optimized for local networks and devices."
             icon={<MapPin className="w-10 h-10 text-orange-500" />}
             isLoading={isLoading}
             delay={0.5}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-neutral-900/30 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-400">Booking your next match is as easy as 1-2-3.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Find */}
            <StepCard number="01" title="Find Arena" desc="Search top courts in Kathmandu.">
              <div className="h-40 w-full bg-surface border border-neutral-800 p-3 relative overflow-hidden">
                {/* Search Bar Skeleton */}
                <div className="h-8 bg-neutral-800 mb-3 flex items-center px-2">
                   <Search size={14} className="text-gray-500 mr-2" />
                   <div className="h-2 w-20 bg-neutral-700 rounded-full" />
                </div>
                {/* List Items */}
                <div className="space-y-2">
                   {[1, 2, 3].map(i => (
                     <motion.div 
                        key={i}
                        className="h-8 w-full bg-neutral-800/50 flex items-center px-2 border border-transparent"
                        animate={i === 2 ? { 
                           backgroundColor: ["rgba(38,38,38,0.5)", "rgba(0, 212, 255, 0.2)", "rgba(38,38,38,0.5)"],
                           borderColor: ["transparent", "rgba(0, 212, 255, 0.5)", "transparent"],
                           scale: [1, 1.02, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: i * 0.5 }}
                     >
                        <div className="h-2 w-16 bg-neutral-700 rounded-full" />
                     </motion.div>
                   ))}
                </div>
                {/* Cursor Animation */}
                <motion.div 
                   className="absolute top-0 left-0 text-white z-10 drop-shadow-lg"
                   animate={{ x: [100, 150, 150, 100], y: [80, 80, 80, 80], opacity: [0, 1, 1, 0] }}
                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                   <MousePointer2 size={24} fill="white" className="text-black" />
                </motion.div>
              </div>
            </StepCard>

            {/* Step 2: Book */}
            <StepCard number="02" title="Pick Slot" desc="Select your preferred time.">
              <div className="h-40 w-full bg-surface border border-neutral-800 p-4 relative flex items-center justify-center">
                 <div className="grid grid-cols-3 gap-2 w-full">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                       <motion.div
                          key={i}
                          className="h-10 bg-neutral-800 border border-neutral-700 flex items-center justify-center"
                          animate={i === 5 ? {
                             backgroundColor: ["#262626", "#00d4ff", "#262626"],
                             color: ["#666", "#000", "#666"]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 1 }}
                       >
                          <div className={`h-1 w-8 ${i === 5 ? 'bg-current' : 'bg-neutral-600'} rounded-full`} />
                       </motion.div>
                    ))}
                 </div>
                  {/* Cursor Animation */}
                 <motion.div 
                   className="absolute top-0 left-0 text-white z-10 drop-shadow-lg"
                   animate={{ x: [50, 150, 150, 50], y: [100, 80, 80, 100], opacity: [0, 1, 1, 0] }}
                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.5 }}
                >
                   <MousePointer2 size={24} fill="white" className="text-black" />
                </motion.div>
              </div>
            </StepCard>

            {/* Step 3: Play */}
            <StepCard number="03" title="Game On" desc="Get instant confirmation.">
               <div className="h-40 w-full bg-surface border border-neutral-800 p-4 relative flex items-center justify-center flex-col">
                  <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
                     transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                     className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                  >
                     <Check size={32} className="text-black font-bold" strokeWidth={4} />
                  </motion.div>
                  <motion.div 
                     className="h-2 w-24 bg-neutral-700 rounded-full"
                     animate={{ width: [0, 96] }}
                     transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <motion.div 
                     className="h-2 w-16 bg-neutral-800 rounded-full mt-2"
                     animate={{ width: [0, 64] }}
                     transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.2 }}
                  />
               </div>
            </StepCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-surface/30 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">What Players Say</h2>
            <p className="text-gray-400">Join thousands of happy players across the valley.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Rabin Thapa" 
              role="Captain, Kathmandu Kings" 
              text="Finally an app that actually works! Booking Dhuku Futsal was super smooth. Love the dark mode."
              rating={5}
            />
            <TestimonialCard 
              name="Sita Gurung" 
              role="Regular Player" 
              text="No more calling 10 different places to find a slot. CourtSync shows me everything in one place. Highly recommended!"
              rating={5}
            />
            <TestimonialCard 
              name="Bibek Shrestha" 
              role="Tournament Organizer" 
              text="The dashboard helps me keep track of all my bookings. Essential for anyone playing regularly in Lalitpur."
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Trophy className="text-primary w-6 h-6" />
              <span className="text-xl font-bold tracking-tighter uppercase">Court<span className="text-primary">Sync</span></span>
            </div>
            <p className="text-gray-500 text-sm">
              Simplifying sports booking in Nepal. Play more, worry less.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary">Find Courts</a></li>
              <li><a href="#" className="hover:text-primary">Tournaments</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">Partner with us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center"><MapPin size={16} className="mr-2 text-primary" /> New Baneshwor, Kathmandu</li>
              <li className="flex items-center"><Phone size={16} className="mr-2 text-primary" /> +977 980-0000000</li>
              <li className="flex items-center"><Mail size={16} className="mr-2 text-primary" /> support@courtsync.np</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} CourtSync Nepal Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// --- Components ---

const StepCard = ({ number, title, desc, children }: { number: string, title: string, desc: string, children: React.ReactNode }) => (
   <div className="flex flex-col items-center text-center group">
      <div className="w-full mb-6 transform transition-transform duration-500 group-hover:scale-105">
         {children}
      </div>
      <span className="text-6xl font-black text-neutral-800 mb-[-20px] z-0">{number}</span>
      <h3 className="text-xl font-bold uppercase tracking-tight z-10">{title}</h3>
      <p className="text-gray-400 text-sm mt-2">{desc}</p>
   </div>
);

const TestimonialCard = ({ name, role, text, rating }: { name: string, role: string, text: string, rating: number }) => (
  <div className="bg-surface p-6 border border-neutral-800 hover:border-primary/50 transition-colors">
    <div className="flex space-x-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < rating ? "text-warning fill-warning" : "text-neutral-700"} />
      ))}
    </div>
    <p className="text-gray-300 mb-6 leading-relaxed">"{text}"</p>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-primary">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-sm text-white">{name}</h4>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

const BentoItem = ({ 
  className, 
  title, 
  desc, 
  icon, 
  children,
  isLoading,
  delay
}: { 
  className?: string, 
  title: string, 
  desc?: string, 
  icon?: React.ReactNode, 
  children?: React.ReactNode,
  isLoading: boolean,
  delay: number
}) => {
  return (
    <div className={`relative overflow-hidden border border-neutral-800 bg-surface/50 p-6 flex flex-col justify-between group ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-surface flex flex-col p-6"
          >
             {/* Micro-interaction: Skeleton glow on hover/auto */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
             
             <div className="w-12 h-12 bg-neutral-800 rounded-none mb-4 animate-pulse" />
             <div className="w-3/4 h-6 bg-neutral-800 rounded-none mb-2 animate-pulse" />
             <div className="w-1/2 h-4 bg-neutral-800 rounded-none animate-pulse" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="relative z-10 h-full flex flex-col justify-between"
          >
             <div>
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                  {icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{title}</h3>
                {desc && <p className="text-sm text-gray-400">{desc}</p>}
             </div>
             {children}
             
             {/* Hover Effect Background */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;