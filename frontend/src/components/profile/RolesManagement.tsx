
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
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Active Role */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none text-white">
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-emerald-100 font-medium uppercase tracking-widest text-xs">Currently Viewing As</p>
            <h2 className="text-xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
              <Briefcase className="w-5 h-5" />
              {activeRole}
            </h2>
            <p className="text-emerald-50 max-w-md text-sm">
              Access to {activeRole.toLowerCase()} features and dashboards.
            </p>
          </div>
          <Button variant="secondary" onClick={onSwitchRole} className="shadow-lg hover:scale-105 active:scale-95 transition-all text-sm py-2">
            Switch Role <ArrowRight className="w-4 h-4"/>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Pending & History */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 px-1">Applications Status</h3>
          <div className="space-y-2">
            {applications.map((app) => (
              <Card key={app.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ROLE_COLORS[app.role]}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.role}</h4>
                      <p className="text-xs text-slate-500">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${
                    app.status === ApplicationStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    app.status === ApplicationStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
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
                  <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs">
                    <p className="font-semibold mb-0.5">Reason: {app.rejectionReason}</p>
                    <button className="font-bold underline">Re-apply</button>
                  </div>
                )}
                {app.status === ApplicationStatus.PENDING && (
                  <p className="mt-2 text-xs text-slate-600 italic">Response in 2-3 business days.</p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Available Roles */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 px-1">Explore New Roles</h3>
          <div className="grid grid-cols-1 gap-2">
            {availableRoles.map((r) => (
              <Card key={r.role} className="p-4 hover:border-emerald-300 transition-all group">
                <div className="flex justify-between items-center mb-2">
                  <div className={`px-2 py-0.5 rounded-lg text-sm font-bold ${ROLE_COLORS[r.role]}`}>
                    {r.role}
                  </div>
                  <Info className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 cursor-help" />
                </div>
                <p className="text-xs text-slate-600 mb-2">{r.desc}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="text-xs text-slate-400 italic">Reqs: {r.reqs}</span>
                  <Button variant="outline" className="text-xs py-1" onClick={() => onApplyRole(r.role)}>
                    Apply
                  </Button>
                </div>
              </Card>
            ))}
            {availableRoles.length === 0 && (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400 text-sm">You've applied for all available roles!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RolesManagement;
