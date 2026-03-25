import React, { useState, useRef } from 'react';
import { useAuth } from '../App';
import { userApi } from '../services/api';
import { Card, Button, Input, Modal } from '../components/ui/Components';
import { User, Mail, Phone, Lock, Bell, Shield, Save, Camera, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Notification toggle state (persisted in localStorage)
  const [notifBooking, setNotifBooking] = useState(() => localStorage.getItem('notif_booking') !== 'false');
  const [notifPromo, setNotifPromo] = useState(() => localStorage.getItem('notif_promo') === 'true');
  
  // Local state for forms
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const updated = await userApi.updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone || undefined,
      });
      // Sync the updated data back into auth context + localStorage
      updateUser({
        name: updated.name,
        phone: updated.phone,
        avatar: updated.avatar,
        walletBalance: updated.walletBalance,
      });
      setShowSaveModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !user) return;
              setUploadingAvatar(true);
              try {
                // Convert to base64 data URL for avatar
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const avatarUrl = reader.result as string;
                  const updated = await userApi.updateProfile(user.id, { avatar: avatarUrl });
                  updateUser({ avatar: updated.avatar });
                  setUploadingAvatar(false);
                };
                reader.readAsDataURL(file);
              } catch (err: any) {
                setError(err.message || 'Avatar upload failed');
                setUploadingAvatar(false);
              }
            }}
          />
          <div className="w-20 h-20 bg-neutral-800 border-2 border-primary rounded-full overflow-hidden">
             <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0a0a0a&color=fff`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploadingAvatar ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Camera size={24} className="text-white" />}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">{user?.name}</h1>
          <div className="flex items-center text-gray-400 text-sm mt-1">
             <Shield size={14} className="mr-1 text-primary" />
             <span className="uppercase tracking-wide">{user?.role} Account</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Information */}
        <Card>
          <div className="flex items-center mb-6 border-b border-neutral-800 pb-4">
            <User className="text-primary mr-3" size={20} />
            <h2 className="text-lg font-bold uppercase">Personal Info</h2>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-2 bg-red-900/30 border border-red-700/50 text-red-400 text-xs font-bold uppercase">
                {error}
              </div>
            )}
            <Input 
              label="Full Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              icon={<User size={16} />} 
            />
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange}
              disabled // Email usually hard to change
              className="opacity-70 cursor-not-allowed"
            />
            <Input 
              label="Phone Number" 
              name="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="+977 980-0000000"
            />
            <div className="pt-4">
               <Button type="submit" isLoading={loading} className="w-full">
                 <Save size={18} className="mr-2" /> Save Changes
               </Button>
            </div>
          </form>
        </Card>

        {/* Security & Preferences */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center mb-6 border-b border-neutral-800 pb-4">
              <Lock className="text-accent mr-3" size={20} />
              <h2 className="text-lg font-bold uppercase">Security</h2>
            </div>
            <p className="text-sm text-gray-500">Password changes are handled via email reset. Contact support if you need to change your password.</p>
          </Card>

          <Card>
            <div className="flex items-center mb-6 border-b border-neutral-800 pb-4">
              <Bell className="text-warning mr-3" size={20} />
              <h2 className="text-lg font-bold uppercase">Notifications</h2>
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-2 hover:bg-neutral-800/50 transition-colors cursor-pointer" onClick={() => {
                 setNotifBooking(!notifBooking);
                 localStorage.setItem('notif_booking', String(!notifBooking));
               }}>
                  <span className="text-sm">Booking Confirmations</span>
                  <div className={`w-10 h-5 ${notifBooking ? 'bg-primary' : 'bg-neutral-700'} rounded-full relative transition-colors`}>
                     <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${notifBooking ? 'right-1 bg-black' : 'left-1 bg-white'}`} />
                  </div>
               </div>
               <div className="flex items-center justify-between p-2 hover:bg-neutral-800/50 transition-colors cursor-pointer" onClick={() => {
                 setNotifPromo(!notifPromo);
                 localStorage.setItem('notif_promo', String(!notifPromo));
               }}>
                  <span className="text-sm">Promotional Emails</span>
                  <div className={`w-10 h-5 ${notifPromo ? 'bg-primary' : 'bg-neutral-700'} rounded-full relative transition-colors`}>
                     <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${notifPromo ? 'right-1 bg-black' : 'left-1 bg-white'}`} />
                  </div>
               </div>
            </div>
          </Card>
        </div>

      </div>

      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Success">
         <div className="text-center py-6">
            <p className="text-lg mb-4">Your profile has been updated successfully.</p>
            <Button onClick={() => setShowSaveModal(false)} className="w-full">Close</Button>
         </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
