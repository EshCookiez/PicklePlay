"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wallet, CreditCard, History, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function WalletPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF] mb-4">
              Wallet & Billing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your payments, subscriptions, and transaction history
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#1E40AF] to-[#0066ff] rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                <h2 className="text-2xl font-black">Current Balance</h2>
              </div>
              <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Funds
              </button>
            </div>
            <div className="text-5xl font-black mb-2">₱0.00</div>
            <p className="text-white/80">Available to spend</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-[#1E40AF] mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                Payment Methods
              </h2>
              <div className="space-y-4">
                <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#1E40AF] hover:bg-blue-50 transition-all group">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#1E40AF] mx-auto mb-2" />
                  <p className="text-gray-600 group-hover:text-[#1E40AF] font-semibold">Add Payment Method</p>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-[#1E40AF] mb-6">Monthly Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <ArrowDownLeft className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Income</p>
                      <p className="text-xl font-black text-green-600">₱0.00</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Expenses</p>
                      <p className="text-xl font-black text-red-600">₱0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-black text-[#1E40AF] mb-6 flex items-center gap-3">
              <History className="w-6 h-6" />
              Transaction History
            </h2>
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
              <p className="text-sm text-gray-500 mt-2">Your transaction history will appear here</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
