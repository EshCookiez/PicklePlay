
import React from 'react';
import { UserRole, RoleApplication, ApplicationStatus } from '@/types/profile';
import { Card, Badge, Button } from './ui/Common';
import { ROLE_COLORS } from '@/lib/profile-constants';
import { Briefcase, ArrowRight, Info, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  activeRole: UserRole;
  applications: RoleApplication[];
  onSwitchRole: () => void;
  onApplyRole: (role: UserRole) => void;
}

const RolesManagement: React.FC<Props> = ({ activeRole, applications, onSwitchRole, onApplyRole }) => {
  const availableRoles = [
    { role: UserRole.PLAYER, desc: 'Ranked competition, tournaments, and skill tracking.', reqs: 'Completion of 5 casual matches.' },
    { role: UserRole.COACH, desc: 'Train students, list lessons, and earn revenue.', reqs: 'Background check & skill certification.' },
    { role: UserRole.COURT_OWNER, desc: 'Manage facilities, bookings, and court schedules.', reqs: 'Business documentation & location proof.' },
  ].filter(r => !applications.some(app => app.role === r.role && app.status !== ApplicationStatus.REJECTED));

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Active Role */}
      <Card className="bg-gradient-to-br from-[#0f2e22] to-[#1a4332] border-none text-white rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[#a3e635] font-medium uppercase tracking-widest text-xs">Currently Viewing As</p>
            <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
              {activeRole}
            </h2>
            <p className="text-slate-300 max-w-md text-sm">
              Access to {activeRole.toLowerCase()} features and dashboards.
            </p>
          </div>
          <Button variant="secondary" onClick={onSwitchRole} className="shadow-lg hover:scale-105 active:scale-95 transition-all text-sm py-2 sm:py-3 px-4 sm:px-6 bg-[#a3e635] text-[#0f2e22] hover:bg-[#FDE047] rounded-xl font-bold">
            Switch Role <ArrowRight className="w-4 h-4"/>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Pending & History */}
        <section className="space-y-2 sm:space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 px-1">Applications Status</h3>
          <div className="space-y-2 sm:space-y-3">
            {applications.map((app) => (
              <Card key={app.id} className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[#0f2e22]/10`}>
                      <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f2e22]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{app.role}</h4>
                      <p className="text-xs sm:text-sm text-slate-500">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${
                    app.status === ApplicationStatus.PENDING ? 'bg-[#FDE047]/20 text-[#0f2e22] border-[#FDE047]/30' :
                    app.status === ApplicationStatus.APPROVED ? 'bg-[#a3e635]/20 text-[#0f2e22] border-[#a3e635]/30' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <span className="flex items-center gap-1 capitalize">
                      {app.status === ApplicationStatus.PENDING && <Clock className="w-3 h-3" />}
                      {app.status === ApplicationStatus.APPROVED && <CheckCircle2 className="w-3 h-3" />}
                      {app.status === ApplicationStatus.REJECTED && <XCircle className="w-3 h-3" />}
                      {app.status.toLowerCase()}
                    </span>
                  </Badge>
                </div>
                {app.status === ApplicationStatus.REJECTED && app.rejectionReason && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs sm:text-sm">
                    <p className="font-semibold mb-0.5">Reason: {app.rejectionReason}</p>
                    <button className="font-bold text-[#0f2e22] hover:text-[#a3e635] transition-colors">Re-apply</button>
                  </div>
                )}
                {app.status === ApplicationStatus.PENDING && (
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 italic">Response in 2-3 business days.</p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Available Roles */}
        <section className="space-y-2 sm:space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 px-1">Explore New Roles</h3>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {availableRoles.map((r) => (
              <Card key={r.role} className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm hover:border-[#a3e635]/50 transition-all group">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <div className={`px-3 py-1 rounded-xl text-sm font-bold bg-[#0f2e22] text-white`}>
                    {r.role}
                  </div>
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#a3e635] cursor-help transition-colors" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">{r.desc}</p>
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 italic">Reqs: {r.reqs}</span>
                  <Button variant="outline" className="text-xs py-1 px-3 border-[#0f2e22] text-[#0f2e22] hover:bg-[#0f2e22] hover:text-white rounded-lg transition-colors" onClick={() => onApplyRole(r.role)}>
                    Apply
                  </Button>
                </div>
              </Card>
            ))}
            {availableRoles.length === 0 && (
              <div className="p-6 text-center border-2 border-dashed border-[#a3e635]/30 rounded-2xl bg-[#a3e635]/5">
                <p className="text-[#0f2e22] text-sm font-medium">You've applied for all available roles!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RolesManagement;
