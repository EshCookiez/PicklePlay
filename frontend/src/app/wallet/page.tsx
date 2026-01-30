"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, CreditCard, History, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function WalletPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] pt-6 sm:pt-8 pb-24 lg:pb-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-[#0f2e22] to-[#1a4332] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-[#a3e635]/20 rounded-2xl">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-[#a3e635]" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Wallet & Billing</h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Manage your payments, subscriptions, and transaction history
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 w-32 sm:w-64 h-32 sm:h-64 bg-[#a3e635] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-gradient-to-br from-[#0f2e22] to-[#1a4332] rounded-2xl sm:rounded-[2rem] shadow-lg p-6 sm:p-8 text-white relative overflow-hidden border border-[#a3e635]/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-[#a3e635]" />
                <h2 className="text-xl sm:text-2xl font-black">Current Balance</h2>
              </div>
              <button className="bg-[#a3e635] hover:bg-[#84cc16] text-[#0f2e22] font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 transition-all text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Funds
              </button>
            </div>
            <div className="text-4xl sm:text-5xl font-black mb-2">₱0.00</div>
            <p className="text-slate-300 text-sm sm:text-base">Available to spend</p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#a3e635] opacity-5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Payment Methods */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-900">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all h-full">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#a3e635]" />
                Payment Methods
              </h2>
              <div className="space-y-4">
                <button className="w-full border-2 border-dashed border-slate-300 hover:border-[#a3e635] rounded-xl sm:rounded-2xl p-6 hover:bg-[#a3e635]/5 transition-all group">
                  <Plus className="w-8 h-8 text-slate-400 group-hover:text-[#a3e635] mx-auto mb-2" />
                  <p className="text-slate-600 group-hover:text-[#a3e635] font-bold text-sm sm:text-base">Add Payment Method</p>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats - Monthly Overview */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-900" style={{ animationDelay: "100ms" }}>
            <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all h-full">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6">Monthly Overview</h2>
              <div className="space-y-4">
                {/* Income */}
                <div className="flex items-center justify-between p-4 sm:p-5 bg-[#a3e635]/10 rounded-xl sm:rounded-2xl border border-[#a3e635]/20 hover:border-[#a3e635] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a3e635] rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f2e22]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Income</p>
                      <p className="text-lg sm:text-xl font-black text-[#65a30d] mt-0.5">₱0.00</p>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div className="flex items-center justify-between p-4 sm:p-5 bg-rose-50 rounded-xl sm:rounded-2xl border border-rose-200 hover:border-rose-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Expenses</p>
                      <p className="text-lg sm:text-xl font-black text-rose-600 mt-0.5">₱0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-900" style={{ animationDelay: "200ms" }}>
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <History className="w-5 h-5 text-[#a3e635]" />
              Transaction History
            </h2>
            <div className="text-center py-12">
              <History className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium text-sm sm:text-base">No transactions yet</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">Your transaction history will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
