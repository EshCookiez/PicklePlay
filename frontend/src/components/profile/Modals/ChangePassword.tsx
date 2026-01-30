
import React, { useState } from 'react';
import { Card, Button, Input } from '../ui/Common';
import { X, Lock, Check, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checks = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(newPassword) },
    { label: 'Contains special char', valid: /[!@#$%^&*]/.test(newPassword) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#a3e635]" /> Change Password
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 space-y-4">
          <Input 
            label="Current Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            label="New Password" 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          
          <div className="space-y-2 p-4 bg-[#0f2e22]/5 rounded-xl border border-[#0f2e22]/10">
            {checks.map((check, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs font-bold ${check.valid ? 'text-[#0f2e22]' : 'text-slate-400'}`}>
                {check.valid ? <Check className="w-3 h-3 text-[#a3e635]" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                {check.label}
              </div>
            ))}
          </div>

          <Input 
            label="Confirm New Password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && confirmPassword !== newPassword ? "Passwords do not match" : undefined}
          />
        </div>

        <div className="px-6 sm:px-8 py-4 sm:py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} disabled={!checks.every(c => c.valid) || newPassword !== confirmPassword}>Update Password</Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
