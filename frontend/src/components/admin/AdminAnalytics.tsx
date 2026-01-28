
import React from 'react';
import { Card, Badge, Button } from '@/components/profile/ui/Common';
import {
    BarChart3,
    Users,
    MapPin,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Download
} from 'lucide-react';

export default function AdminAnalytics() {
    const metrics = [
        { label: 'New Signups', value: '425', trend: '+14%', isUp: true },
        { label: 'Total Bookings', value: '1,892', trend: '+8%', isUp: true },
        { label: 'Churn Rate', value: '2.4%', trend: '-0.5%', isUp: false },
        { label: 'Avg. Revenue/User', value: '₱345', trend: '+12%', isUp: true },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#1E40AF] tracking-tight">System Analytics</h1>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-2">Real-time platform performance overview</p>
                </div>
                <Button variant="outline" className="border-[#1E40AF] text-[#1E40AF] hover:bg-blue-50">
                    <Download size={16} />
                    <span>Export Report</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                    <Card key={i} className="p-6 border-l-4 border-l-[#1E40AF] bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-[#1E40AF] uppercase tracking-widest">{metric.label}</span>
                            <div className={`flex items-center gap-0.5 text-[10px] font-black ${metric.isUp ? 'text-green-600' : 'text-rose-600'}`}>
                                {metric.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {metric.trend}
                            </div>
                        </div>
                        <p className="text-3xl font-black text-[#1E40AF]">{metric.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-8 h-[400px] flex flex-col bg-white shadow-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black text-[#1E40AF] uppercase tracking-widest">Growth Projection</h3>
                            <p className="text-xs text-slate-600 mt-1">12-month performance trend</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#1E40AF]" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Bookings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FDE047]" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Users</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-2 border-l-2 border-b-2 border-[#1E40AF]/20 p-4">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative flex flex-col justify-end">
                                <div
                                    className="w-full bg-[#1E40AF]/20 rounded-t-sm group-hover:bg-[#1E40AF]/40 transition-all"
                                    style={{ height: `${h * 0.7}%` }}
                                />
                                <div
                                    className="w-full bg-[#FDE047] rounded-t-sm group-hover:scale-y-110 transition-transform origin-bottom"
                                    style={{ height: `${h * 0.4}%` }}
                                />
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1E40AF] text-white text-[8px] px-2 py-1 rounded pointer-events-none">
                                    Day {i + 1}: {h}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Jan 2024</span>
                        <span>Dec 2024</span>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 bg-white shadow-lg border border-blue-100">
                        <h3 className="text-sm font-black text-[#1E40AF] uppercase tracking-widest mb-6">User Demographics</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Active Players', value: 78, color: 'bg-[#1E40AF]' },
                                { label: 'Coaches', value: 12, color: 'bg-[#FDE047]' },
                                { label: 'Court Owners', value: 7, color: 'bg-[#064e3b]' },
                                { label: 'Admins', value: 3, color: 'bg-amber-400' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="text-[#1E40AF] font-black">{item.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-[#FDE047] to-yellow-200 border-none shadow-lg">
                        <TrendingUp className="text-[#1E40AF] mb-4" size={24} />
                        <h3 className="text-base font-black text-[#1E40AF] tracking-tight leading-tight mb-2">Milestone Reached!</h3>
                        <p className="text-[10px] font-bold text-[#1E40AF]/80 uppercase tracking-widest leading-relaxed">
                            We've reached our 10,000 matches milestone ahead of schedule.
                        </p>
                        <button className="mt-4 text-[10px] font-black uppercase text-[#1E40AF] border-b-2 border-[#1E40AF] pb-1 hover:opacity-80 transition-opacity">
                            Read Report
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
