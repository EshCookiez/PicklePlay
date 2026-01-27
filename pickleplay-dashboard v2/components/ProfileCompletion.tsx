
import React from 'react';
import { Card, ProgressBar, Button } from './ui/Common';
import { CheckCircle2, Circle } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
}

const ProfileCompletion: React.FC<Props> = ({ user }) => {
  const tasks = [
    { id: 'photo', label: 'Upload Profile Photo', completed: !!user.avatarUrl },
    { id: 'bio', label: 'Add Bio', completed: !!user.bio && user.bio.length > 20 },
    { id: 'phone', label: 'Verify Phone Number', completed: user.isPhoneVerified },
    { id: 'address', label: 'Complete Address', completed: !!user.address.postalCode },
    { id: 'social', label: 'Link Social Accounts', completed: !!user.socialLinks.instagram || !!user.socialLinks.linkedin },
  ];

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  if (progress === 100) return null;

  return (
    <Card className="p-6 bg-white border-none shadow-xl shadow-blue-900/5 relative overflow-hidden group mb-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-black text-[#0056b3] uppercase tracking-widest">Profile Strength</h4>
            <span className="text-sm font-black text-[#a8d600]">{progress}%</span>
          </div>
          <ProgressBar value={progress} className="mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center gap-2 text-xs font-bold ${task.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                {task.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-start border-l border-slate-100 pl-8 ml-4">
           <p className="text-xs font-bold text-slate-500 mb-3 max-w-[150px]">
             Complete your profile to rank higher in player search.
           </p>
           <Button variant="secondary" className="text-[10px]">Complete Now</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletion;
