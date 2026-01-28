
import React from 'react';
import { Card, Button, Badge } from './ui/Common';
import { MOCK_USER } from '@/lib/profile-constants';
import { CreditCard, DollarSign, Download, Plus, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const PaymentInfo: React.FC = () => {
  const financials = MOCK_USER.financials;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-[#0056b3] to-[#004494] text-white border-none">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet className="w-5 h-5 text-[#ccff00]" />
            </div>
            <Badge className="bg-[#ccff00] text-[#0056b3] border-none text-xs">Active</Badge>
          </div>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Wallet Balance</p>
          <h3 className="text-2xl font-black mt-0.5">${financials.walletBalance.toLocaleString()}</h3>
          <div className="mt-2 pt-2 border-t border-white/10 flex gap-2">
            <Button variant="secondary" className="w-full text-xs h-7">Top Up</Button>
            <Button variant="outline" className="w-full text-xs h-7 border-white/20 text-white hover:bg-white/10">Withdraw</Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-emerald-50 rounded text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-500">Total Earned</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">${financials.totalEarned.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Lifetime earnings from coaching.</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-rose-50 rounded text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-500">Total Spent</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">${financials.totalSpent.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Bookings and platform fees.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Payment Methods */}
        <Card>
          <div className="p-4 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Payment Methods
            </h3>
            <Button variant="ghost" className="text-xs"><Plus className="w-3 h-3 mr-0.5"/> Add</Button>
          </div>
          <div className="p-4 space-y-2">
            {financials.paymentMethods.map(pm => (
              <div key={pm.id} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-slate-100 rounded flex items-center justify-center">
                    {pm.type === 'card' ? (
                       <span className="font-black text-xs text-slate-400 uppercase">{pm.brand}</span>
                    ) : (
                       <span className="font-black text-xs text-slate-400 uppercase">PayPal</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {pm.type === 'card' ? `•••• ${pm.last4}` : 'PayPal Account'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {pm.type === 'card' ? `Expires ${pm.expiry}` : 'Connected'}
                    </p>
                  </div>
                </div>
                {pm.isDefault && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs">Default</Badge>}
              </div>
            ))}
          </div>
        </Card>

        {/* Billing Info */}
        <Card>
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Billing Details
            </h3>
          </div>
          <div className="p-4 space-y-3">
             <div>
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Stripe Customer ID</label>
                <div className="flex items-center gap-1 mt-0.5">
                  <code className="bg-slate-50 px-2 py-1 rounded text-xs text-slate-600 font-mono">cus_****5678</code>
                  <Button variant="ghost" className="h-6 px-2 text-xs">Copy</Button>
                </div>
             </div>
             <div>
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Billing Address</label>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {MOCK_USER.address.street}, {MOCK_USER.address.city}, {MOCK_USER.address.state} {MOCK_USER.address.postalCode}
                </p>
                <Button variant="outline" className="mt-2 text-xs h-7">Edit Address</Button>
             </div>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
             Recent Transactions
          </h3>
          <Button variant="ghost" className="text-xs">
            <Download className="w-3 h-3 mr-0.5" /> CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Description</th>
                <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Date</th>
                <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Amount</th>
                <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-sm font-bold text-slate-700">{tx.description}</td>
                  <td className="px-3 py-2 text-xs text-slate-500 font-medium">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className={`px-3 py-2 text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-xs">{tx.status}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    <button className="text-xs text-[#0056b3] font-bold hover:underline">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PaymentInfo;
