"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Receipt, FileText, Download, Calendar } from "lucide-react";

export default function BillingPage() {
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
              Billing & Invoices
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View and download your billing statements and invoices
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Subscription Status */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Plan</p>
                  <p className="text-xl font-black text-[#1E40AF]">Free</p>
                </div>
              </div>
              <button className="w-full bg-[#FDE047] hover:bg-yellow-300 text-[#1E40AF] font-black py-2 rounded-lg transition-all">
                Upgrade Plan
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Next Billing</p>
                  <p className="text-xl font-black text-green-600">N/A</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Total Invoices</p>
                  <p className="text-xl font-black text-purple-600">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-black text-[#1E40AF] mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Billing History
            </h2>
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No invoices yet</p>
              <p className="text-sm text-gray-500 mt-2">Your billing history will appear here</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
