
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
    <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-gradient-to-r from-[#0f2e22] to-[#1a4332] text-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#a3e635]/20 border-2 border-[#a3e635] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#a3e635]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-0.5">Trust & Safety Level: <span className="text-[#a3e635]">Verified Plus</span></h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
              All primary verification steps completed. This badge is displayed on your public profile.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {steps.map((step) => (
          <Card key={step.label} className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${step.status ? 'bg-[#0f2e22]/10 text-[#0f2e22]' : 'bg-slate-100 text-slate-400'}`}>
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <Badge className={`text-[10px] sm:text-xs ${step.status ? 'bg-[#a3e635]/20 text-[#0f2e22] border-[#a3e635]/30' : 'bg-[#FDE047]/20 text-[#0f2e22] border-[#FDE047]/30'}`}>
                <span className="flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  {step.status ? (
                    <><CheckCircle2 className="w-3 h-3" /> OK</>
                  ) : (
                    <><AlertCircle className="w-3 h-3" /> Needed</>
                  )}
                </span>
              </Badge>
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{step.label}</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3 line-clamp-2">{step.desc}</p>
            {!step.status && (
              <Button className="w-full text-xs sm:text-sm py-1.5 sm:py-2 bg-[#0f2e22] hover:bg-[#1a4332] text-white rounded-xl" variant="outline">{step.btn}</Button>
            )}
            {step.status && step.label === 'ID Verification' && (
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">Expires: Aug 2026</span>
                <button className="text-xs font-bold text-[#0f2e22] hover:text-[#a3e635] inline-flex items-center gap-0.5 transition-colors">
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
