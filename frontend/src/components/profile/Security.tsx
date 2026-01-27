
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
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Password Management */}
        <Card className="lg:col-span-1">
          <div className="p-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-600" />
              Password & Recovery
            </h3>
          </div>
          <div className="p-4">
            <div className="mb-3">
              <p className="text-sm font-bold text-slate-900 mb-0.5">Last Changed</p>
              <p className="text-xs text-slate-500">
                {new Date(security.passwordInfo.lastChanged).toLocaleDateString()}
              </p>
              {security.passwordInfo.requiresChange && (
                 <p className="text-xs text-amber-600 font-bold mt-1">Update recommended (6+ months)</p>
              )}
            </div>
            <Button onClick={() => setIsPasswordModalOpen(true)} className="w-full mb-2 text-sm py-2">Change Password</Button>
            <div className="pt-2 border-t border-slate-50">
               <button className="text-xs text-[#0056b3] font-bold hover:underline w-full text-left mb-1">Manage Recovery Email</button>
               <button className="text-xs text-[#0056b3] font-bold hover:underline w-full text-left">Update Security Questions</button>
            </div>
          </div>
        </Card>

        {/* 2FA */}
        <Card className="lg:col-span-2">
          <div className="p-3 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Two-Factor Authentication
            </h3>
            <Badge className={security.twoFactorAuth.enabled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500"}>
              {security.twoFactorAuth.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Key className="w-4 h-4 text-[#0056b3]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">Authenticator App (Recommended)</h4>
                  <p className="text-xs text-slate-500 mt-0.5 mb-2">Use Google Authenticator or Authy for verification codes.</p>
                  {security.twoFactorAuth.method === 'authenticator_app' && (
                    <div className="flex gap-1.5">
                      <Button variant="outline" className="text-xs py-1 px-2">Backup Codes</Button>
                      <Button variant="outline" className="text-xs py-1 px-2">Regenerate</Button>
                    </div>
                  )}
                </div>
                {security.twoFactorAuth.method === 'authenticator_app' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>

               <div className="flex items-start gap-2 opacity-60">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">SMS Verification</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Receive codes via text. Less secure.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50 flex justify-end">
                {security.twoFactorAuth.enabled ? (
                  <Button variant="danger" className="bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-none border border-rose-100 text-xs py-1">Disable 2FA</Button>
                ) : (
                  <Button className="text-xs py-1">Setup 2FA</Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
         {/* Connected Apps */}
        <Card>
           <div className="p-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-emerald-600" />
              Connected Accounts
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {security.connectedApps.map(app => (
                <div key={app.id} className="flex justify-between items-center p-2 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center font-bold text-slate-500 text-sm">
                      {app.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{app.name}</p>
                      <p className="text-xs text-slate-400">Connected {new Date(app.connectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs py-1 px-2 border-rose-100 text-rose-500 hover:bg-rose-50">Disconnect</Button>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 border border-dashed border-slate-200 rounded-lg">
                 <div className="flex items-center gap-2 opacity-60">
                    <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center font-bold text-slate-500 text-sm">F</div>
                    <span className="text-sm font-bold text-slate-700">Facebook</span>
                 </div>
                 <Button variant="ghost" className="text-xs">Connect</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Login History */}
        <Card>
          <div className="p-3 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              Recent Login Activity
            </h3>
            <Button variant="ghost" className="text-xs text-slate-500">Sign out all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Device</th>
                  <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Loc</th>
                  <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {security.loginSessions.map((login) => (
                  <tr key={login.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{login.device}</span>
                        <span className="text-xs text-slate-400">{new Date(login.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-600">
                      {login.location}
                    </td>
                    <td className="px-2 py-1.5">
                      {login.isActive ? (
                        <span className="inline-flex w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      ) : (
                        <span className="inline-flex w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="border-rose-100 bg-rose-50/30">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">Danger Zone</h4>
            <p className="text-xs text-slate-500">Deleting your account is permanent.</p>
          </div>
          <Button variant="danger" className="shrink-0 text-sm py-2" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
        </div>
      </Card>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
};

export default Security;
