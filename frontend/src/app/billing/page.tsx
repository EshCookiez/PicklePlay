"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Receipt, FileText, Download, Calendar } from "lucide-react";

export default function BillingPage() {
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
                <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-[#a3e635]" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Billing & Invoices</h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              View and download your billing statements and invoices
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 w-32 sm:w-64 h-32 sm:h-64 bg-[#a3e635] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Subscription Status Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Receipt className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Plan</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">Free</p>
              </div>
            </div>
            <button className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-[#0f2e22] font-bold py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all text-xs sm:text-sm font-bold">
              Upgrade Plan
            </button>
          </div>

          {/* Next Billing Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Next Billing</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">N/A</p>
              </div>
            </div>
          </div>

          {/* Total Invoices Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Total Invoices</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-900">
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#a3e635]" />
              Billing History
            </h2>
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium text-sm sm:text-base">No invoices yet</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">Your billing history will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
