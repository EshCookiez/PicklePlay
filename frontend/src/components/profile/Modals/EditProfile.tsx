
import React, { useState } from 'react';
import { UserProfile } from '@/types/profile';
import { Card, Button, Input } from '../ui/Common';
import { X, Camera } from 'lucide-react';

interface Props {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

const EditProfileModal: React.FC<Props> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    city: user.location.city,
    state: user.location.state,
    bio: user.bio,
    websiteUrl: user.websiteUrl || ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
          <h2 className="text-lg sm:text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 sm:space-y-8">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#a3e635]/30 shadow-lg object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-[#0f2e22] text-[#a3e635] rounded-full shadow-lg hover:bg-[#1a4332] transition-all active:scale-95">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Click to update your profile photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Input 
              label="Full Name" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <Input 
              label="Email Address" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Phone Number" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <Input 
              label="Website URL" 
              value={formData.websiteUrl} 
              onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
            />
            <Input 
              label="City" 
              value={formData.city} 
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
            <Input 
              label="State" 
              value={formData.state} 
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Bio</label>
            <textarea 
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-[#a3e635]/20 focus:border-[#0f2e22] transition-all h-28 sm:h-32 resize-none text-sm"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
            <span className="text-xs text-slate-400 text-right">{formData.bio.length} / 500 characters</span>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
