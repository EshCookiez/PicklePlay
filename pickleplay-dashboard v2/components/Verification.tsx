
import React from 'react';
import { Card, Badge, Button } from './ui/Common';
import { UserProfile } from '../types';
import { 
  ShieldCheck, CheckCircle2, AlertCircle, FileText, 
  Search, Phone, Mail, Fingerprint 
} from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Verification: React.FC<Props> = ({ user }) => {
  const steps = [
    { 
      label: 'Email Verification', 
      desc: 'Confirm your email address to receive important updates.',
      status: user.isEmailVerified,
      icon: Mail,
      btn: 'Resend Email'
    },
    { 
      label: 'Phone Verification', 
      desc: 'Required for secure booking transactions and SMS alerts.',
      status: user.isPhoneVerified,
      icon: Phone,
      btn: 'Verify Number'
    },
    { 
      label: 'ID Verification', 
      desc: 'Government ID verification builds trust within the community.',
      status: user.isIdVerified,
      icon: Fingerprint,
      btn: 'Upload ID'
    },
    { 
      label: 'Background Check', 
      desc: 'Mandatory for Coaches and Court Owners to ensure safety.',
      status: user.isBackgroundChecked,
      icon: Search,
      btn: 'Apply for Check'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-slate-900 text-white p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Trust & Safety Level: <span className="text-emerald-500">Verified Plus</span></h3>
            <p className="text-slate-400 max-w-lg">
              You've completed all primary verification steps. This badge is displayed on your public profile to build trust with players and students.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <Card key={step.label} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <Badge className={step.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  {step.status ? (
                    <><CheckCircle2 className="w-3 h-3" /> Verified</>
                  ) : (
                    <><AlertCircle className="w-3 h-3" /> Action Required</>
                  )}
                </span>
              </Badge>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{step.label}</h4>
            <p className="text-sm text-slate-500 mb-6">{step.desc}</p>
            {!step.status && (
              <Button className="w-full" variant="outline">{step.btn}</Button>
            )}
            {step.status && step.label === 'ID Verification' && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs text-slate-400">Expires: Aug 2026</span>
                <button className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
                  <FileText className="w-3 h-3" /> View Document
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Verification;
