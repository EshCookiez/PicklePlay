
import React, { useState } from 'react';
import { Card, Badge, Input, Button } from '@/components/profile/ui/Common';
import {
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Mail,
    Shield,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'Marcelo Cagara', email: 'marcelo@pickleplay.ph', role: 'Super Admin', status: 'Active', joined: 'Jan 20, 2024' },
    { id: 2, name: 'Juan Dela Cruz', email: 'juan@gmail.com', role: 'Player', status: 'Active', joined: 'Jan 25, 2024' },
    { id: 3, name: 'Maria Santos', email: 'maria.s@outlook.com', role: 'Coach', status: 'Pending', joined: 'Feb 02, 2024' },
    { id: 4, name: 'Pedro Penduko', email: 'pedro@pickleball.com', role: 'Court Owner', status: 'Active', joined: 'Feb 10, 2024' },
    { id: 5, name: 'Elena Gilbert', email: 'elena@mystic.com', role: 'Player', status: 'Suspended', joined: 'Feb 12, 2024' },
];

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">User Management</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global user accounts and permissions</p>
                </div>
                <Button variant="primary" className="md:w-auto">
                    <UserPlus size={16} />
                    <span>Add New User</span>
                </Button>
            </div>

            <Card className="overflow-visible">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors">
                            <Filter size={16} />
                            <span>Filter</span>
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors">
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_USERS.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs border-2 border-white shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{user.name}</p>
                                                <p className="text-xs font-bold text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={
                                            user.role === 'Super Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                user.role === 'Coach' ? 'bg-[#ccff001a] text-[#a8d600] border-[#a8d60033]' :
                                                    user.role === 'Court Owner' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-blue-50 text-blue-600 border-blue-100'
                                        }>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' :
                                                user.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                                                }`} />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{user.joined}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                    <p className="uppercase tracking-widest">Showing 5 of 1,280 users</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
