
import React from 'react';
import { Card, Button, Badge } from './ui/Common';
import { MOCK_USER } from '@/lib/profile-constants';
import { CreditCard, DollarSign, Download, Plus, Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

const PaymentInfo: React.FC = () => {
  const financials = MOCK_USER.financials;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#0f2e22] via-[#1a4332] to-[#0f2e22] text-white border-none rounded-2xl sm:rounded-[2rem] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#a3e635] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-[#a3e635]" />
              </div>
              <Badge className="bg-[#a3e635] text-[#0f2e22] border-none text-xs font-bold px-2 py-1">Active</Badge>
            </div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Wallet Balance</p>
            <h3 className="text-2xl sm:text-3xl font-black mt-1">₱{financials.walletBalance.toLocaleString()}</h3>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 flex gap-2">
              <Button variant="secondary" className="w-full text-xs sm:text-sm h-8 sm:h-9 bg-[#a3e635] text-[#0f2e22] hover:bg-[#84cc16] font-bold rounded-xl">Top Up</Button>
              <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-9 border-white/20 text-white hover:bg-white/10 rounded-xl">Withdraw</Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-[#a3e635]/10 rounded-xl text-[#0f2e22]">
              <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm font-bold text-slate-500">Total Earned</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">₱{financials.totalEarned.toLocaleString()}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-[#0f2e22] flex items-center gap-1 bg-[#a3e635]/20 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
            <span className="text-xs text-slate-400">this month</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-[#FDE047]/20 rounded-xl text-[#0f2e22]">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm font-bold text-slate-500">Total Spent</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">₱{financials.totalSpent.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-2">Bookings and platform fees.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Payment Methods */}
        <Card className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Payment Methods
            </h3>
            <Button variant="ghost" className="text-xs sm:text-sm text-[#a3e635] hover:bg-white/10"><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Add</Button>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            {financials.paymentMethods.map(pm => (
              <div key={pm.id} className="flex items-center justify-between p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-[#a3e635]/50 hover:bg-[#a3e635]/5 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-7 sm:w-12 sm:h-8 bg-gradient-to-r from-[#0f2e22] to-[#1a4332] rounded-lg flex items-center justify-center flex-shrink-0">
                    {pm.type === 'card' ? (
                       <span className="font-black text-[10px] sm:text-xs text-[#a3e635] uppercase">{pm.brand}</span>
                    ) : (
                       <span className="font-black text-[10px] sm:text-xs text-[#a3e635] uppercase">PayPal</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {pm.type === 'card' ? `•••• ${pm.last4}` : 'PayPal Account'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {pm.type === 'card' ? `Expires ${pm.expiry}` : 'Connected'}
                    </p>
                  </div>
                </div>
                {pm.isDefault && <Badge className="bg-[#a3e635]/10 text-[#0f2e22] border-[#a3e635] text-xs font-bold flex-shrink-0">Default</Badge>}
              </div>
            ))}
          </div>
        </Card>

        {/* Billing Info */}
        <Card className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
              Billing Details
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
             <div>
                <label className="text-xs font-black uppercase text-[#0f2e22] tracking-widest">Customer ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-[#0f2e22]/5 px-3 py-2 rounded-lg text-xs sm:text-sm text-[#0f2e22] font-mono">cus_****5678</code>
                  <Button variant="ghost" className="h-8 px-3 text-xs font-bold text-[#0f2e22]">Copy</Button>
                </div>
             </div>
             <div>
                <label className="text-xs font-black uppercase text-[#0f2e22] tracking-widest">Billing Address</label>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  {MOCK_USER.address.street}, {MOCK_USER.address.city}, {MOCK_USER.address.state} {MOCK_USER.address.postalCode}
                </p>
                <Button variant="outline" className="mt-3 text-xs sm:text-sm h-8 sm:h-9 border-[#0f2e22] text-[#0f2e22] hover:bg-[#0f2e22]/5 rounded-xl">Edit Address</Button>
             </div>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-gradient-to-r from-[#0f2e22] to-[#1a4332]">
          <h3 className="text-sm sm:text-base font-bold text-white">
             Recent Transactions
          </h3>
          <Button variant="ghost" className="text-xs sm:text-sm text-[#a3e635] hover:bg-white/10 w-fit">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="bg-[#0f2e22]/5 border-b border-slate-100">
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-[#0f2e22] uppercase">Description</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-[#0f2e22] uppercase">Date</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-[#0f2e22] uppercase">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-[#0f2e22] uppercase">Status</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-[#0f2e22] uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#a3e635]/5 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold text-slate-700">{tx.description}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-500 font-medium">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold ${tx.amount > 0 ? 'text-[#0f2e22]' : 'text-slate-900'}`}>
                    {tx.amount > 0 ? '+' : ''}₱{Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <Badge className="bg-[#a3e635]/10 text-[#0f2e22] border-[#a3e635] uppercase text-xs font-bold">{tx.status}</Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <button className="text-xs sm:text-sm text-[#0f2e22] font-bold hover:text-[#a3e635] transition-colors">Download</button>
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
