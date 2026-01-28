
import React from 'react';
import { UserRole, RoleApplication, ApplicationStatus } from '../types';
import { Card, Badge, Button } from './ui/Common';
import { ROLE_COLORS } from '../constants';
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Active Role */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none text-white">
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-emerald-100 font-medium uppercase tracking-widest text-xs">Currently Viewing As</p>
            <h2 className="text-3xl font-extrabold flex items-center gap-3 justify-center md:justify-start">
              <Briefcase className="w-8 h-8" />
              {activeRole}
            </h2>
            <p className="text-emerald-50 max-w-md">
              You have access to features related to your {activeRole.toLowerCase()} profile, including specialized statistics and dashboards.
            </p>
          </div>
          <Button variant="secondary" onClick={onSwitchRole} className="shadow-lg hover:scale-105 active:scale-95 transition-all">
            Switch Role <ArrowRight className="w-4 h-4"/>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending & History */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 px-1">Applications Status</h3>
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ROLE_COLORS[app.role]}`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.role}</h4>
                      <p className="text-xs text-slate-500">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={
                    app.status === ApplicationStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    app.status === ApplicationStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }>
                    <span className="flex items-center gap-1.5 capitalize">
                      {app.status === ApplicationStatus.PENDING && <Clock className="w-3 h-3" />}
                      {app.status === ApplicationStatus.APPROVED && <CheckCircle2 className="w-3 h-3" />}
                      {app.status === ApplicationStatus.REJECTED && <XCircle className="w-3 h-3" />}
                      {app.status.toLowerCase()}
                    </span>
                  </Badge>
                </div>
                {app.status === ApplicationStatus.REJECTED && app.rejectionReason && (
                  <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs">
                    <p className="font-semibold mb-1">Rejection Reason:</p>
                    {app.rejectionReason}
                    <button className="block mt-2 font-bold underline">Re-apply</button>
                  </div>
                )}
                {app.status === ApplicationStatus.PENDING && (
                  <p className="mt-3 text-sm text-slate-600 italic">Expected response in 2-3 business days.</p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Available Roles */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 px-1">Explore New Roles</h3>
          <div className="grid grid-cols-1 gap-4">
            {availableRoles.map((r) => (
              <Card key={r.role} className="p-5 hover:border-emerald-300 transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <div className={`px-3 py-1 rounded-lg text-sm font-bold ${ROLE_COLORS[r.role]}`}>
                    {r.role}
                  </div>
                  <Info className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 cursor-help" />
                </div>
                <p className="text-sm text-slate-600 mb-4">{r.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-400 italic">Reqs: {r.reqs}</span>
                  <Button variant="outline" className="text-xs py-1" onClick={() => onApplyRole(r.role)}>
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
            {availableRoles.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400">You've applied for all available roles!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RolesManagement;
