
import React from 'react';
import { Card } from '@/components/profile/ui/Common';
import {
    Users,
    MapPin,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Settings
} from 'lucide-react';

export default function AdminOverview() {
    const stats = [
        { label: 'Total Users', value: '1,280', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Courts', value: '45', change: '+5', icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Verifications', value: '18', change: '-3', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Monthly Revenue', value: '₱142K', change: '+18%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</h3>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#0056b3]">Recent System Activity</h2>
                        <button className="text-[10px] font-black uppercase text-slate-400 hover:text-[#0056b3] transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { text: 'New court application from "Metro Manila Sports"', time: '2 mins ago', icon: MapPin, color: 'text-blue-500' },
                            { text: 'User "Juan Dela Cruz" verified their ID', time: '15 mins ago', icon: CheckCircle2, color: 'text-green-500' },
                            { text: 'System backup completed successfully', time: '1 hour ago', icon: Clock, color: 'text-slate-500' },
                            { text: 'Role update: Coach verification pending', time: '3 hours ago', icon: AlertCircle, color: 'text-amber-500' },
                            { text: 'New support ticket: Payment issue', time: '5 hours ago', icon: AlertCircle, color: 'text-rose-500' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className={`mt-0.5 ${activity.color}`}>
                                    <activity.icon size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 leading-tight">{activity.text}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 bg-gradient-to-br from-[#1e3a5f] to-[#0a56a7] text-white">
                    <h2 className="text-xs font-black uppercase tracking-widest text-blue-200/60 mb-6">Administrative Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Invite Admin', icon: Users },
                            { label: 'Export Data', icon: TrendingUp },
                            { label: 'Site Maintenance', icon: Settings },
                            { label: 'System Logs', icon: Clock },
                        ].map((action, i) => (
                            <button
                                key={i}
                                className="flex flex-col items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl transition-all group"
                            >
                                <action.icon size={20} className="text-blue-200 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-black/20 rounded-2xl border border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-2">System Status</h3>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-bold">All services operational</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-[#ccff00]" />
                        </div>
                        <p className="text-[10px] font-bold text-blue-200/50 mt-2">SERVER LOAD: 24% | DISK SPACE: 92% FREE</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

