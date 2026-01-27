
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
                    <h1 className="text-xl font-black text-slate-800 tracking-tight text-shadow-sm">System Analytics</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time platform performance overview</p>
                </div>
                <Button variant="outline">
                    <Download size={16} />
                    <span>Export Report</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                    <Card key={i} className="p-5 border-l-4 border-l-[#0056b3]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
                            <div className={`flex items-center gap-0.5 text-[10px] font-black ${metric.isUp ? 'text-green-500' : 'text-rose-500'}`}>
                                {metric.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {metric.trend}
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{metric.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Growth Projection</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Bookings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#ccff00]" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Users</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-2 border-l border-b border-slate-100 p-4">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative flex flex-col justify-end">
                                <div
                                    className="w-full bg-blue-500/20 rounded-t-sm group-hover:bg-blue-500/40 transition-all"
                                    style={{ height: `${h * 0.7}%` }}
                                />
                                <div
                                    className="w-full bg-[#ccff00] rounded-t-sm group-hover:scale-y-110 transition-transform origin-bottom"
                                    style={{ height: `${h * 0.4}%` }}
                                />
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded pointer-events-none">
                                    Day {i + 1}: {h}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        <span>Jan 2024</span>
                        <span>Dec 2024</span>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-6">User Demographics</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Active Players', value: 78, color: 'bg-blue-500' },
                                { label: 'Coaches', value: 12, color: 'bg-[#ccff00]' },
                                { label: 'Court Owners', value: 7, color: 'bg-amber-400' },
                                { label: 'Admins', value: 3, color: 'bg-purple-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="text-slate-800">{item.value}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 bg-[#ccff00] border-none">
                        <TrendingUp className="text-[#0056b3] mb-4" size={24} />
                        <h3 className="text-sm font-black text-[#0056b3] tracking-tight leading-tight mb-2">Platform Goal Reached!</h3>
                        <p className="text-[10px] font-bold text-[#0056b3]/70 uppercase tracking-widest leading-relaxed">
                            We've reached our 10,000 matches milestone ahead of schedule.
                        </p>
                        <button className="mt-4 text-[10px] font-black uppercase text-[#0056b3] border-b-2 border-[#0056b3] pb-0.5">
                            Read Report
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
