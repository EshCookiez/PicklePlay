
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${className}`}>
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
    primary: 'bg-[#0f2e22] text-white hover:bg-[#1a4332] shadow-lg shadow-green-900/20',
    secondary: 'bg-[#a3e635] text-[#0f2e22] hover:bg-[#84cc16] shadow-lg shadow-[#a3e635]/20',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20',
    ghost: 'bg-transparent text-[#0f2e22] hover:bg-[#0f2e22]/5',
    outline: 'bg-transparent text-[#0f2e22] border-2 border-[#0f2e22]/20 hover:border-[#a3e635] hover:bg-[#a3e635]/10',
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
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
  <div className={`flex flex-col gap-1.5 sm:gap-2 ${className}`}>
    {label && <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider px-1">{label}</label>}
    <input 
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-[#a3e635]/20 focus:border-[#0f2e22] transition-all text-sm font-medium ${type === 'password' ? 'font-sans tracking-widest' : ''} ${error ? 'border-rose-500' : 'border-slate-200 text-slate-700'} ${readOnly ? 'bg-slate-50 text-slate-500' : ''}`}
      autoComplete={type === 'password' ? 'new-password' : undefined}
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
  <div className={`flex flex-col gap-1.5 sm:gap-2 ${className}`}>
    {label && <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider px-1">{label}</label>}
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#a3e635]/20 focus:border-[#0f2e22] transition-all appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
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
  <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => onChange(!checked)}>
    <button
      type="button"
      className={`relative inline-flex h-6 sm:h-7 w-10 sm:w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${checked ? 'bg-[#0f2e22]' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 sm:h-5 w-4 sm:w-5 transform rounded-full bg-white shadow-lg transition-transform ${checked ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`} />
    </button>
    {label && <span className="text-xs font-bold text-slate-600 uppercase tracking-wide select-none">{label}</span>}
  </div>
);

export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
}> = ({ value, max = 100, className = "", colorClass = "bg-gradient-to-r from-[#a3e635] to-[#84cc16]" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
