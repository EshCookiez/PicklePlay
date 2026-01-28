
import React from 'react';
import { Card, Badge, Button } from './ui/Common';
import { UserProfile } from '@/types/profile';
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
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-slate-900 text-white p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-0.5">Trust & Safety Level: <span className="text-emerald-500">Verified Plus</span></h3>
            <p className="text-slate-400 text-xs max-w-lg">
              All primary verification steps completed. This badge is displayed on your public profile.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => (
          <Card key={step.label} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${step.status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <Badge className={`text-[10px] ${step.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                <span className="flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  {step.status ? (
                    <><CheckCircle2 className="w-3 h-3" /> OK</>
                  ) : (
                    <><AlertCircle className="w-3 h-3" /> Needed</>
                  )}
                </span>
              </Badge>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{step.label}</h4>
            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{step.desc}</p>
            {!step.status && (
              <Button className="w-full text-xs py-1.5" variant="outline">{step.btn}</Button>
            )}
            {step.status && step.label === 'ID Verification' && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <span className="text-xs text-slate-400">Expires: Aug 2026</span>
                <button className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-0.5">
                  <FileText className="w-3 h-3" /> View
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
