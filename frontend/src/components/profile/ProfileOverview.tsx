
import React, { useState } from 'react';
import { UserProfile, AccountStatus } from '@/types/profile';
import { Card, Badge, Button } from './ui/Common';
import { 
  CheckCircle, MapPin, Globe, Instagram, Twitter, Linkedin, 
  ChevronDown, ChevronUp, ExternalLink 
} from 'lucide-react';

interface Props {
  user: UserProfile;
  onEdit: () => void;
}

const ProfileOverview: React.FC<Props> = ({ user, onEdit }) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const bioLimit = 150;
  const isBioLong = user.bio.length > bioLimit;
  const displayBio = bioExpanded ? user.bio : user.bio.slice(0, bioLimit) + (isBioLong ? '...' : '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <Card className="lg:col-span-2">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-[#0056b3] uppercase tracking-tight">Identity & Contact</h3>
            <Button variant="ghost" className="text-xs font-bold uppercase tracking-wide" onClick={onEdit}>
              Edit Info
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Member Name</label>
                <p className="text-[#0056b3] font-bold text-sm">{user.fullName}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Email Access</label>
                <div className="flex items-center gap-1.5">
                  <p className="text-slate-700 font-medium text-sm">{user.email}</p>
                  {user.isEmailVerified && <Badge className="bg-[#ccff001a] text-[#a8d600] border-[#a8d60022] text-[10px] px-1.5 py-0.5"><CheckCircle className="w-2.5 h-2.5 mr-0.5"/> Verified</Badge>}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Mobile Number</label>
                <div className="flex items-center gap-1.5">
                  <p className="text-slate-700 font-medium text-sm">{user.phone || 'Not provided'}</p>
                  {user.isPhoneVerified && <Badge className="bg-[#ccff001a] text-[#a8d600] border-[#a8d60022] text-[10px] px-1.5 py-0.5"><CheckCircle className="w-2.5 h-2.5 mr-0.5"/> Verified</Badge>}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Primary Location</label>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user.location.city}, {user.location.country}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Account State</label>
                <div>
                  <Badge className={
                    user.status === AccountStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    user.status === AccountStatus.SUSPENDED ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Player Tenure</label>
                <p className="text-slate-700 font-bold uppercase tracking-tight text-sm">Joined {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-8">
        <Card className="p-8">
          <h3 className="text-lg font-black text-[#0056b3] uppercase italic tracking-tighter mb-4">Player Bio</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {displayBio}
          </p>
          {isBioLong && (
            <button 
              onClick={() => setBioExpanded(!bioExpanded)}
              className="text-[#0056b3] text-[10px] font-black uppercase tracking-widest mt-4 hover:underline inline-flex items-center gap-1 transition-all"
            >
              {bioExpanded ? (
                <>Collapse <ChevronUp className="w-4 h-4"/></>
              ) : (
                <>Expand Bio <ChevronDown className="w-4 h-4"/></>
              )}
            </button>
          )}
        </Card>

        <Card className="p-8">
          <h3 className="text-lg font-black text-[#0056b3] uppercase italic tracking-tighter mb-6">Social Network</h3>
          <div className="space-y-4">
            {user.websiteUrl && (
              <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-500 hover:text-[#0056b3] transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 text-slate-400 group-hover:text-[#0056b3] transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Web Portfolio</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
              </a>
            )}
            {user.socialLinks.instagram && (
              <a href={user.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-500 hover:text-[#0056b3] transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 text-slate-400 group-hover:text-[#0056b3] transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Instagram</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
              </a>
            )}
            {user.socialLinks.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-500 hover:text-[#0056b3] transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 text-slate-400 group-hover:text-[#0056b3] transition-colors">
                  <Twitter className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Twitter / X</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOverview;
