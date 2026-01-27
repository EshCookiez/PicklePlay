
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
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="col-span-2 p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-black text-[#0056b3] uppercase italic tracking-tighter mb-1">
                {isCoach ? pro.title : pro.businessName}
              </h2>
              <div className="flex gap-1.5">
                {isCoach ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs">{pro.yearsExperience} Years Exp</Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-xs">{pro.businessType}</Badge>
                )}
                 <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs">Verified Pro</Badge>
              </div>
            </div>
            <Button className="text-sm py-2">Edit</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Award className="w-4 h-4" /> Certifications
              </h4>
              <ul className="space-y-2">
                {pro.certifications?.map((cert, i) => (
                  <li key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">{cert.name}</span>
                    <span className="text-xs font-medium text-slate-400">{cert.year}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4" /> Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {pro.specializations?.map((spec, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-50 text-[#0056b3] text-xs font-bold rounded border border-blue-100">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4 bg-gradient-to-br from-[#0056b3] to-[#004494] text-white">
            <h4 className="text-xs font-black text-blue-200 uppercase tracking-widest mb-0.5">
              {isCoach ? 'Hourly Rate' : 'Base Court Rate'}
            </h4>
            <div className="flex items-end gap-0.5">
               <span className="text-2xl font-black">₱{pro.hourlyRate}</span>
               <span className="text-xs font-medium text-blue-200 mb-0.5">/ hr</span>
            </div>
            <p className="text-xs text-blue-200/80 mt-2">
              {isCoach ? 'Includes court fees.' : 'Peak hours may vary.'}
            </p>
          </Card>

           <Card className="p-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" /> Availability
            </h4>
            <div className="space-y-2 text-sm text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Mon - Fri</span>
                <span>4:00 PM - 9:00 PM</span>
              </div>
               <div className="flex justify-between">
                <span>Weekends</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
