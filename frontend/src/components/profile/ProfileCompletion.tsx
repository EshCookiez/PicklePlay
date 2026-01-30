
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
    <Card className="p-4 sm:p-6 bg-white border border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] relative overflow-hidden group mb-3 sm:mb-4">
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#a3e635]/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#FDE047]/10 rounded-full -ml-6 -mb-6"></div>
      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#0f2e22] uppercase tracking-wide">Profile Strength</h4>
            <span className="text-sm sm:text-base font-bold text-[#a3e635]">{progress}%</span>
          </div>
          <ProgressBar value={progress} className="mb-3 sm:mb-4" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${task.completed ? 'text-[#0f2e22]' : 'text-slate-400'}`}>
                {task.completed ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3e635]" /> : <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {task.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-start border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 md:ml-2">
           <p className="text-xs sm:text-sm font-medium text-slate-500 mb-2 sm:mb-3 max-w-[160px]">
             Complete your profile to rank higher.
           </p>
           <Button variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0f2e22] text-white hover:bg-[#1a4332] rounded-xl font-bold">Complete Now</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletion;
