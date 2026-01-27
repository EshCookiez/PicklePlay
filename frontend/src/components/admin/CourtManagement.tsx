
import React from 'react';
import { Card, Badge, Button } from '@/components/profile/ui/Common';
import {
    MapPin,
    Plus,
    Search,
    Star,
    Clock,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';

const MOCK_COURTS = [
    { id: 1, name: 'Downtown Arena', location: 'Cebu City', type: 'Indoor', status: 'Verified', rating: 4.9, activeBookings: 12 },
    { id: 2, name: 'Mountain View Courts', location: 'Busay', type: 'Outdoor', status: 'Pending', rating: 0, activeBookings: 0 },
    { id: 3, name: 'The Smash Club', location: 'Mandaue', type: 'Indoor', status: 'Verified', rating: 4.7, activeBookings: 8 },
    { id: 4, name: 'Seaside Pickleball', location: 'SRP', type: 'Outdoor', status: 'Verified', rating: 4.5, activeBookings: 5 },
];

export default function CourtManagement() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Court Moderation</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage court listings and verification status</p>
                </div>
                <Button variant="secondary">
                    <Plus size={16} />
                    <span>New Court Listing</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Listings', value: '45', icon: MapPin },
                    { label: 'Pending Review', value: '7', icon: Clock },
                    { label: 'Verified Courts', value: '38', icon: ShieldCheck },
                    { label: 'Avg Rating', value: '4.7', icon: Star },
                ].map((stat, i) => (
                    <Card key={i} className="p-4 bg-slate-50/50 border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-white shadow-sm text-[#0056b3]">
                                <stat.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-lg font-black text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter courts..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-white text-slate-400 normal-case font-bold">Sort by: Status</Badge>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {MOCK_COURTS.map((court) => (
                        <div key={court.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50 transition-colors">
                            <div className="w-full md:w-32 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative group">
                                <div className="absolute inset-0 bg-slate-200 animate-pulse group-hover:hidden" />
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <MapPin size={24} />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-base font-black text-slate-800 truncate">{court.name}</h3>
                                    <Badge className={court.status === 'Verified' ? 'bg-[#ccff001a] text-[#a8d600] border-[#a8d60033]' : 'bg-amber-50 text-amber-600 border-amber-100'}>
                                        {court.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {court.location}</span>
                                    <span className="flex items-center gap-1 active:text-[#0056b3] transition-colors"><ShieldCheck size={14} /> {court.type}</span>
                                    <span className="flex items-center gap-1 text-slate-800"><Star size={14} className="text-amber-400 fill-amber-400" /> {court.rating > 0 ? court.rating : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{court.activeBookings}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Bookings</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-white transition-all shadow-sm">
                                        <Clock size={18} />
                                    </button>
                                    <button className="flex-1 md:flex-none p-2.5 rounded-xl bg-slate-800 text-white hover:bg-black transition-all shadow-lg active:scale-95">
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

