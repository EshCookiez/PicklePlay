"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams ? searchParams.get("error") : null;
    const errorDescription = searchParams ? searchParams.get("error_description") : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
                <p className="text-gray-600 mb-6">
                    {errorDescription || "We encountered a problem while trying to sign you in. Please try again or use another method."}
                </p>

                {error && (
                    <div className="bg-red-50 rounded-lg p-4 mb-8 text-left">
                        <p className="text-xs font-mono text-red-800 break-all">
                            <strong>Error Code:</strong> {error}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        href="/auth"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#0a56a7] text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    If this persists, please ensure social login is enabled in your Supabase dashboard.
                </p>
            </div>
        </div>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a56a7]"></div>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}
