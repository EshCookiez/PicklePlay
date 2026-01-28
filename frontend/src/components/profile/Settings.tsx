
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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Notifications */}
        <Card className="lg:row-span-2">
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              Notification Channels
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Communication Methods</h4>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                    <p className="text-xs text-slate-500">Updates sent to your primary email.</p>
                  </div>
                </div>
                <Switch checked={prefs.notifications.email} onChange={() => handleToggle('notifications', 'email')} />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                    <p className="text-xs text-slate-500">Real-time alerts on your device.</p>
                  </div>
                </div>
                <Switch checked={prefs.notifications.push} onChange={() => handleToggle('notifications', 'push')} />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">SMS Notifications</p>
                    <p className="text-xs text-slate-500">Urgent updates via text message.</p>
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

            <div className="pt-4 border-t border-slate-50 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subscription Topics</h4>
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
        <Card>
          <div className="p-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Privacy & Discovery
            </h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Profile Visibility</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'public', label: 'Public', desc: 'Visible to everyone on PicklePlay' },
                  { id: 'friends_only', label: 'Friends Only', desc: 'Only visible to connected players' },
                  { id: 'private', label: 'Private', desc: 'Hidden from search results' }
                ].map((level) => (
                  <label key={level.id} className={`flex items-start p-2 rounded-lg border cursor-pointer transition-all ${prefs.privacyLevel === level.id ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="privacy" 
                      className="mt-0.5"
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
        <Card>
          <div className="p-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              Regional & Formats
            </h3>
          </div>
          <div className="p-3 space-y-2">
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
      
      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
        <Button variant="ghost" className="text-xs">Reset to Default</Button>
        <Button onClick={() => alert("Settings saved!")} className="text-xs">Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
