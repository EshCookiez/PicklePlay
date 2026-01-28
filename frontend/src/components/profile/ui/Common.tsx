
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${className}`}>
    {children}
  </span>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, className = "", variant = 'primary', onClick, type = 'button', disabled = false }) => {
  const variants = {
    primary: 'bg-[#0056b3] text-white hover:bg-[#004494] shadow-lg shadow-blue-500/20',
    secondary: 'bg-[#ccff00] text-[#0056b3] hover:bg-[#b8e600] shadow-lg shadow-black/5',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20',
    ghost: 'bg-transparent text-[#0056b3] hover:bg-blue-50',
    outline: 'bg-transparent text-[#0056b3] border-2 border-[#0056b3]/20 hover:border-[#0056b3]/40 hover:bg-blue-50/50',
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<{
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  readOnly?: boolean;
}> = ({ label, type = 'text', value, onChange, placeholder, className = "", error, readOnly }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>}
    <input 
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] transition-all text-sm font-medium ${error ? 'border-rose-500' : 'border-slate-200 text-slate-700'} ${readOnly ? 'bg-slate-50 text-slate-500' : ''}`}
    />
    {error && <span className="text-[10px] font-bold text-rose-500 px-1">{error}</span>}
  </div>
);

export const Select: React.FC<{
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  className?: string;
}> = ({ label, value, onChange, options, className = "" }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>}
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] transition-all appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-4 cursor-pointer" onClick={() => onChange(!checked)}>
    <button
      type="button"
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${checked ? 'bg-[#0056b3]' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
    {label && <span className="text-xs font-bold text-slate-600 uppercase tracking-wide select-none">{label}</span>}
  </div>
);

export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
}> = ({ value, max = 100, className = "", colorClass = "bg-gradient-to-r from-[#ccff00] to-[#a8d600]" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full h-3 bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
