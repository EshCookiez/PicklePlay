
import React, { useState } from 'react';
import { Card, Button, Badge } from './ui/Common';
import { MOCK_USER } from '../constants';
import { ShieldAlert, Key, Smartphone, LogOut, History, Globe, Link, Info, CheckCircle2 } from 'lucide-react';
import ChangePasswordModal from './Modals/ChangePassword';
import DeleteAccountModal from './Modals/DeleteAccount';

const Security: React.FC = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const security = MOCK_USER.security;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Password Management */}
        <Card className="lg:col-span-1">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" />
              Password & Recovery
            </h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-900 mb-1">Last Changed</p>
              <p className="text-xs text-slate-500">
                {new Date(security.passwordInfo.lastChanged).toLocaleDateString()}
              </p>
              {security.passwordInfo.requiresChange && (
                 <p className="text-xs text-amber-600 font-bold mt-2">Update recommended (6+ months)</p>
              )}
            </div>
            <Button onClick={() => setIsPasswordModalOpen(true)} className="w-full mb-4">Change Password</Button>
            <div className="pt-4 border-t border-slate-50">
               <button className="text-xs text-[#0056b3] font-bold hover:underline w-full text-left mb-2">Manage Recovery Email</button>
               <button className="text-xs text-[#0056b3] font-bold hover:underline w-full text-left">Update Security Questions</button>
            </div>
          </div>
        </Card>

        {/* 2FA */}
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              Two-Factor Authentication
            </h3>
            <Badge className={security.twoFactorAuth.enabled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500"}>
              {security.twoFactorAuth.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Key className="w-6 h-6 text-[#0056b3]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">Authenticator App (Recommended)</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-3">Use apps like Google Authenticator or Authy to generate verification codes.</p>
                  {security.twoFactorAuth.method === 'authenticator_app' && (
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-xs py-1 px-3">View Backup Codes</Button>
                      <Button variant="outline" className="text-xs py-1 px-3">Regenerate Codes</Button>
                    </div>
                  )}
                </div>
                {security.twoFactorAuth.method === 'authenticator_app' && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                )}
              </div>

               <div className="flex items-start gap-4 opacity-60">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <Smartphone className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">SMS Verification</h4>
                  <p className="text-xs text-slate-500 mt-1">Receive codes via text message. Less secure than apps.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-end">
                {security.twoFactorAuth.enabled ? (
                  <Button variant="danger" className="bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-none border border-rose-100">Disable 2FA</Button>
                ) : (
                  <Button>Setup 2FA</Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Connected Apps */}
        <Card>
           <div className="p-6 border-b border-slate-50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Link className="w-5 h-5 text-emerald-600" />
              Connected Accounts
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {security.connectedApps.map(app => (
                <div key={app.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-500">
                      {app.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{app.name}</p>
                      <p className="text-[10px] text-slate-400">Connected {new Date(app.connectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-[10px] py-1 px-3 border-rose-100 text-rose-500 hover:bg-rose-50">Disconnect</Button>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 border border-dashed border-slate-200 rounded-xl">
                 <div className="flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-500">F</div>
                    <span className="text-sm font-bold text-slate-700">Facebook</span>
                 </div>
                 <Button variant="ghost" className="text-[10px]">Connect</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Login History */}
        <Card>
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Recent Login Activity
            </h3>
            <Button variant="ghost" className="text-xs text-slate-500">Sign out all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Device</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Loc</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {security.loginSessions.map((login) => (
                  <tr key={login.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{login.device}</span>
                        <span className="text-[10px] text-slate-400">{new Date(login.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {login.location}
                    </td>
                    <td className="px-4 py-3">
                      {login.isActive ? (
                        <span className="inline-flex w-2 h-2 bg-emerald-500 rounded-full"></span>
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

      <Card className="border-rose-100 bg-rose-50/30">
        <div className="p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-slate-900">Danger Zone</h4>
            <p className="text-sm text-slate-500">Deleting your account is permanent and cannot be undone.</p>
          </div>
          <Button variant="danger" className="shrink-0" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
        </div>
      </Card>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
};

export default Security;
