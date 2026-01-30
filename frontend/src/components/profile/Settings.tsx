
import React, { useState } from 'react';
import { Card, Switch, Button, Select } from './ui/Common';
import { Bell, Shield, Globe, Mail, Smartphone, MessageSquare, Eye, Calendar, DollarSign } from 'lucide-react';
import { MOCK_USER } from '@/lib/profile-constants';

const Settings: React.FC = () => {
  const [prefs, setPrefs] = useState(MOCK_USER.preferences);

  const handleToggle = (section: keyof typeof prefs, key: string) => {
    setPrefs(prev => {
      const newPrefs = { ...prev } as any;
      newPrefs[section] = {
        ...newPrefs[section],
        [key]: !newPrefs[section][key]
      };
      return newPrefs;
    });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Notifications */}
        <Card className="lg:row-span-2 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Notification Channels
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-xs font-bold text-[#0f2e22] uppercase tracking-wide">Communication Methods</h4>
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0f2e22]/5 flex items-center justify-center text-[#0f2e22] flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">Email Notifications</p>
                    <p className="text-xs text-slate-500 truncate">Updates sent to your primary email.</p>
                  </div>
                </div>
                <Switch checked={prefs.notifications.email} onChange={() => handleToggle('notifications', 'email')} />
              </div>
              
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#a3e635]/10 flex items-center justify-center text-[#0f2e22] flex-shrink-0">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">Push Notifications</p>
                    <p className="text-xs text-slate-500 truncate">Real-time alerts on your device.</p>
                  </div>
                </div>
                <Switch checked={prefs.notifications.push} onChange={() => handleToggle('notifications', 'push')} />
              </div>

              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FDE047]/20 flex items-center justify-center text-[#0f2e22] flex-shrink-0">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">SMS Notifications</p>
                    <p className="text-xs text-slate-500 truncate">Urgent updates via text message.</p>
                  </div>
                </div>
                <Switch checked={prefs.notifications.sms} onChange={() => handleToggle('notifications', 'sms')} />
              </div>

               <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Frequency</label>
                <Select 
                  options={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Summary' },
                    { value: 'monthly', label: 'Monthly Report' },
                  ]}
                  value={prefs.notifications.emailFrequency}
                  onChange={(e) => setPrefs({...prefs, notifications: {...prefs.notifications, emailFrequency: e.target.value as any}})}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-[#0f2e22] uppercase tracking-wide">Subscription Topics</h4>
               <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Booking Confirmations</span>
                <Switch checked={prefs.emailSubscriptions.bookingConfirmations} onChange={() => handleToggle('emailSubscriptions', 'bookingConfirmations')} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Lesson Reminders</span>
                <Switch checked={prefs.emailSubscriptions.lessonReminders} onChange={() => handleToggle('emailSubscriptions', 'lessonReminders')} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Tournament Updates</span>
                <Switch checked={prefs.emailSubscriptions.tournamentUpdates} onChange={() => handleToggle('emailSubscriptions', 'tournamentUpdates')} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Product News</span>
                <Switch checked={prefs.emailSubscriptions.productNews} onChange={() => handleToggle('emailSubscriptions', 'productNews')} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Marketing & Promos</span>
                <Switch checked={prefs.emailSubscriptions.marketingCommunications} onChange={() => handleToggle('emailSubscriptions', 'marketingCommunications')} />
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy & Discovery */}
        <Card className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#a3e635]" />
              Privacy & Discovery
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#0f2e22] uppercase mb-2">Profile Visibility</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'public', label: 'Public', desc: 'Visible to everyone on PicklePlay' },
                  { id: 'friends_only', label: 'Friends Only', desc: 'Only visible to connected players' },
                  { id: 'private', label: 'Private', desc: 'Hidden from search results' }
                ].map((level) => (
                  <label key={level.id} className={`flex items-start p-2 sm:p-3 rounded-xl border cursor-pointer transition-all ${prefs.privacyLevel === level.id ? 'bg-[#a3e635]/10 border-[#a3e635] ring-1 ring-[#a3e635]/20' : 'bg-white border-slate-200 hover:border-[#a3e635]/50'}`}>
                    <input 
                      type="radio" 
                      name="privacy" 
                      className="mt-0.5 accent-[#0f2e22]"
                      checked={prefs.privacyLevel === level.id}
                      onChange={() => setPrefs({...prefs, privacyLevel: level.id as any})}
                    />
                    <div className="ml-2">
                      <span className="block text-sm font-bold text-slate-900">{level.label}</span>
                      <span className="block text-xs text-slate-500">{level.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Regional & Format */}
        <Card className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#a3e635]" />
              Regional & Formats
            </h3>
          </div>
          <div className="p-3 sm:p-6 space-y-3">
            <Select 
              label="Language"
              options={[
                { value: 'en-US', label: 'English (US)' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
              ]}
              value={prefs.language}
              onChange={(e) => setPrefs({...prefs, language: e.target.value})}
            />
            <Select 
              label="Timezone"
              options={[
                { value: '(UTC+08:00) Philippine Standard Time', label: '(UTC+08:00) Philippine Standard Time' },
                { value: 'UTC', label: 'UTC' },
                { value: 'EST', label: 'Eastern Standard Time' },
              ]}
              value={prefs.timezone}
              onChange={(e) => setPrefs({...prefs, timezone: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select 
                label="Date Format"
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                ]}
                value={prefs.dateFormat}
                onChange={(e) => setPrefs({...prefs, dateFormat: e.target.value as any})}
              />
              <Select 
                label="Currency"
                options={[
                  { value: 'PHP', label: 'PHP (₱)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                ]}
                value={prefs.currencyDisplay}
                onChange={(e) => setPrefs({...prefs, currencyDisplay: e.target.value})}
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
        <Button variant="ghost" className="text-xs sm:text-sm">Reset to Default</Button>
        <Button onClick={() => alert("Settings saved!")} className="text-xs sm:text-sm bg-[#0f2e22] hover:bg-[#1a4332] text-white">Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
