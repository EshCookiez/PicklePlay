
import React, { useState } from 'react';
import { Card, Button, Badge } from './ui/Common';
import { MOCK_USER } from '@/lib/profile-constants';
import { ShieldAlert, Key, Smartphone, LogOut, History, Globe, Link, Info, CheckCircle2 } from 'lucide-react';
import ChangePasswordModal from './Modals/ChangePassword';
import DeleteAccountModal from './Modals/DeleteAccount';

const Security: React.FC = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const security = MOCK_USER.security;

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Password Management */}
        <Card className="lg:col-span-1 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Password & Recovery
            </h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="mb-3 sm:mb-4">
              <p className="text-sm font-bold text-slate-900 mb-0.5">Last Changed</p>
              <p className="text-xs sm:text-sm text-slate-500">
                {new Date(security.passwordInfo.lastChanged).toLocaleDateString()}
              </p>
              {security.passwordInfo.requiresChange && (
                 <p className="text-xs text-[#FDE047] font-bold mt-1 bg-[#0f2e22]/10 px-2 py-1 rounded-full inline-block">Update recommended (6+ months)</p>
              )}
            </div>
            <Button onClick={() => setIsPasswordModalOpen(true)} className="w-full mb-2 text-sm py-2 bg-[#0f2e22] hover:bg-[#1a4332] text-white rounded-xl">Change Password</Button>
            <div className="pt-2 border-t border-slate-100">
               <button className="text-xs sm:text-sm text-[#0f2e22] font-bold hover:text-[#a3e635] w-full text-left mb-1 transition-colors">Manage Recovery Email</button>
               <button className="text-xs sm:text-sm text-[#0f2e22] font-bold hover:text-[#a3e635] w-full text-left transition-colors">Update Security Questions</button>
            </div>
          </div>
        </Card>

        {/* 2FA */}
        <Card className="lg:col-span-2 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332] flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Two-Factor Authentication
            </h3>
            <Badge className={security.twoFactorAuth.enabled ? "bg-[#a3e635]/20 text-[#a3e635] border-[#a3e635]/30" : "bg-slate-100 text-slate-500"}>
              {security.twoFactorAuth.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-[#0f2e22]/10 rounded-xl">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f2e22]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">Authenticator App (Recommended)</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 mb-2">Use Google Authenticator or Authy for verification codes.</p>
                  {security.twoFactorAuth.method === 'authenticator_app' && (
                    <div className="flex gap-1.5 sm:gap-2">
                      <Button variant="outline" className="text-xs py-1 px-2 sm:px-3 border-[#0f2e22]/20 text-[#0f2e22] hover:bg-[#0f2e22]/5 rounded-lg">Backup Codes</Button>
                      <Button variant="outline" className="text-xs py-1 px-2 sm:px-3 border-[#0f2e22]/20 text-[#0f2e22] hover:bg-[#0f2e22]/5 rounded-lg">Regenerate</Button>
                    </div>
                  )}
                </div>
                {security.twoFactorAuth.method === 'authenticator_app' && (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
                )}
              </div>

               <div className="flex items-start gap-2 sm:gap-3 opacity-60">
                <div className="p-2 sm:p-2.5 bg-slate-100 rounded-xl">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">SMS Verification</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Receive codes via text. Less secure.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                {security.twoFactorAuth.enabled ? (
                  <Button variant="danger" className="bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-none border border-rose-100 text-xs py-1 rounded-lg">Disable 2FA</Button>
                ) : (
                  <Button className="text-xs py-1 bg-[#0f2e22] hover:bg-[#1a4332] text-white rounded-lg">Setup 2FA</Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
         {/* Connected Apps */}
        <Card className="rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-3 sm:p-4 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Link className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Connected Accounts
            </h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="space-y-2 sm:space-y-3">
              {security.connectedApps.map(app => (
                <div key={app.id} className="flex justify-between items-center p-2 sm:p-3 border border-slate-100 rounded-xl hover:border-[#a3e635]/30 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0f2e22]/10 rounded-xl flex items-center justify-center font-bold text-[#0f2e22] text-sm">
                      {app.name[0]}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-slate-900">{app.name}</p>
                      <p className="text-xs text-slate-400">Connected {new Date(app.connectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs py-1 px-2 sm:px-3 border-rose-100 text-rose-500 hover:bg-rose-50 rounded-lg">Disconnect</Button>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 sm:p-3 border border-dashed border-slate-200 rounded-xl hover:border-[#a3e635]/50 transition-colors">
                 <div className="flex items-center gap-2 sm:gap-3 opacity-60">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-sm">F</div>
                    <span className="text-sm font-bold text-slate-700">Facebook</span>
                 </div>
                 <Button variant="ghost" className="text-xs text-[#0f2e22] hover:text-[#a3e635]">Connect</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Login History */}
        <Card className="rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332] flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Recent Login Activity
            </h3>
            <Button variant="ghost" className="text-xs text-[#a3e635] hover:text-white">Sign out all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0f2e22]/5 border-b border-slate-100">
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-bold text-[#0f2e22] uppercase">Device</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-bold text-[#0f2e22] uppercase">Loc</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-bold text-[#0f2e22] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {security.loginSessions.map((login) => (
                  <tr key={login.id} className="hover:bg-[#0f2e22]/5 transition-colors">
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{login.device}</span>
                        <span className="text-xs text-slate-400">{new Date(login.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-slate-600">
                      {login.location}
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                      {login.isActive ? (
                        <span className="inline-flex w-2 h-2 bg-[#a3e635] rounded-full shadow-[0_0_6px_rgba(163,230,53,0.5)]"></span>
                      ) : (
                        <span className="inline-flex w-2 h-2 bg-slate-300 rounded-full"></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100/50 rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">Danger Zone</h4>
            <p className="text-xs sm:text-sm text-slate-500">Deleting your account is permanent and cannot be undone.</p>
          </div>
          <Button variant="danger" className="shrink-0 text-sm py-2 px-4 sm:px-6 bg-rose-500 hover:bg-rose-600 text-white rounded-xl" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
        </div>
      </Card>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
};

export default Security;
