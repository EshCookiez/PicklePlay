
import React from 'react';
import { Card, ProgressBar, Button } from './ui/Common';
import { CheckCircle2, Circle } from 'lucide-react';
import { UserProfile } from '@/types/profile';

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
    <Card className="p-4 bg-white border-none shadow-lg shadow-blue-900/5 relative overflow-hidden group mb-3">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-[#0056b3] uppercase tracking-wide">Profile Strength</h4>
            <span className="text-sm font-bold text-[#a8d600]">{progress}%</span>
          </div>
          <ProgressBar value={progress} className="mb-3" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center gap-1.5 text-xs font-medium ${task.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {task.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                {task.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-start border-l border-slate-100 pl-4 ml-2">
           <p className="text-xs font-medium text-slate-500 mb-2 max-w-[140px]">
             Complete your profile to rank higher.
           </p>
           <Button variant="secondary" className="text-xs px-3 py-1.5">Complete Now</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletion;
