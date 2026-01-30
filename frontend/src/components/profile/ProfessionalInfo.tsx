
import React from 'react';
import { Card, Badge, Button } from './ui/Common';
import { MOCK_USER } from '@/lib/profile-constants';
import { UserRole } from '@/types/profile';
import { Briefcase, Award, Clock, MapPin, Tag } from 'lucide-react';

const ProfessionalInfo: React.FC<{ role: UserRole }> = ({ role }) => {
  const pro = MOCK_USER.professional;
  if (!pro) return null;

  const isCoach = role === UserRole.COACH;

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="col-span-1 md:col-span-2 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0f2e22] uppercase italic tracking-tighter mb-1 sm:mb-2">
                {isCoach ? pro.title : pro.businessName}
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {isCoach ? (
                  <Badge className="bg-[#a3e635]/20 text-[#0f2e22] border-[#a3e635]/30 text-xs sm:text-sm">{pro.yearsExperience} Years Exp</Badge>
                ) : (
                  <Badge className="bg-[#FDE047]/20 text-[#0f2e22] border-[#FDE047]/30 text-xs sm:text-sm">{pro.businessType}</Badge>
                )}
                 <Badge className="bg-[#0f2e22]/10 text-[#0f2e22] border-[#0f2e22]/20 text-xs sm:text-sm">Verified Pro</Badge>
              </div>
            </div>
            <Button className="text-sm py-2 px-4 bg-[#0f2e22] hover:bg-[#1a4332] text-white rounded-xl">Edit</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div>
              <h4 className="text-xs font-black text-[#0f2e22]/60 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#a3e635]" /> Certifications
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {pro.certifications?.map((cert, i) => (
                  <li key={i} className="flex items-center justify-between p-2 sm:p-3 bg-[#0f2e22]/5 rounded-xl border border-[#0f2e22]/10">
                    <span className="text-sm sm:text-base font-bold text-slate-700">{cert.name}</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-400">{cert.year}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <h4 className="text-xs font-black text-[#0f2e22]/60 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#a3e635]" /> Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {pro.specializations?.map((spec, i) => (
                  <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#a3e635]/20 text-[#0f2e22] text-xs sm:text-sm font-bold rounded-lg border border-[#a3e635]/30">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-[#0f2e22] to-[#1a4332] text-white rounded-2xl sm:rounded-[2rem] border-0">
            <h4 className="text-xs font-black text-[#a3e635] uppercase tracking-widest mb-0.5 sm:mb-1">
              {isCoach ? 'Hourly Rate' : 'Base Court Rate'}
            </h4>
            <div className="flex items-end gap-0.5">
               <span className="text-2xl sm:text-3xl font-black">₱{pro.hourlyRate}</span>
               <span className="text-xs sm:text-sm font-medium text-[#a3e635]/80 mb-0.5 sm:mb-1">/ hr</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 sm:mt-3">
              {isCoach ? 'Includes court fees.' : 'Peak hours may vary.'}
            </p>
          </Card>

           <Card className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-[#0f2e22]/60 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#a3e635]" /> Availability
            </h4>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-600 font-medium">
              <div className="flex justify-between p-2 rounded-lg hover:bg-[#0f2e22]/5 transition-colors">
                <span>Mon - Fri</span>
                <span className="text-[#0f2e22] font-bold">4:00 PM - 9:00 PM</span>
              </div>
               <div className="flex justify-between p-2 rounded-lg hover:bg-[#0f2e22]/5 transition-colors">
                <span>Weekends</span>
                <span className="text-[#0f2e22] font-bold">8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
