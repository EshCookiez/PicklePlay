
import React, { useState } from 'react';
import { Button, Input } from '../ui/Common';
import { X, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [confirmText, setConfirmText] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border-t-8 border-rose-500">
        <div className="px-8 py-6 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Delete Account</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">This action is permanent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete your account? All of your data, including bookings, match history, and achievements will be permanently removed.
          </p>
          
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
            <label className="block text-xs font-bold text-rose-700 uppercase mb-2">Type "DELETE" to confirm</label>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-rose-200 focus:border-rose-500 focus:ring-rose-500/20"
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" disabled={confirmText !== 'DELETE'} onClick={() => alert("Account deleted")}>Permanently Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
