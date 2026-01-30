'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/profile/ui/Common';
import CourtsMap from '@/components/admin/CourtsMap';
import { courtService } from '@/services/courtService';
import { useAuth } from '@/contexts/AuthContext';
import { Court as DbCourt } from '@/types/database';
import {
    MapPin,
    Plus,
    Search,
    Star,
    Clock,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Ban,
    Eye,
    Edit,
    Trash2,
    Filter,
    DollarSign,
    Building2,
    Calendar,
    Phone,
    Mail,
    Globe,
    AlertCircle,
    TrendingUp,
    Map,
    List
} from 'lucide-react';

interface Court extends DbCourt {
    owner: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
}

interface CourtStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    active: number;
    featured: number;
    average_rating: number;
    total_bookings: number;
}

export default function CourtManagement() {
    const { user } = useAuth();
    const [courts, setCourts] = useState<Court[]>([]);
    const [stats, setStats] = useState<CourtStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    useEffect(() => {
        fetchCourts();
        fetchStats();
    }, [statusFilter, typeFilter, searchTerm]);

    const fetchCourts = async () => {
        try {
            setLoading(true);
            const result = await courtService.getCourts({
                status: statusFilter !== 'all' ? statusFilter as any : undefined,
                type: typeFilter !== 'all' ? typeFilter : undefined,
                search: searchTerm || undefined,
            });
            setCourts(result.data as Court[]);
        } catch (error) {
            console.error('Error fetching courts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await courtService.getStatistics();
            setStats({
                ...data,
                suspended: 0,
                active: 0,
                featured: 0,
                average_rating: 0,
                total_bookings: 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (courtId: number) => {
        if (!confirm('Are you sure you want to approve this court?')) return;
        if (!user) return;

        try {
            setActionLoading(courtId);
            await courtService.approveCourt(courtId, user.id);
            await fetchCourts();
            await fetchStats();
            alert('Court approved successfully!');
        } catch (error) {
            console.error('Error approving court:', error);
            alert('Failed to approve court');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!selectedCourt || !rejectReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            setActionLoading(selectedCourt.id);
            await courtService.rejectCourt(selectedCourt.id, rejectReason);
            await fetchCourts();
            await fetchStats();
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedCourt(null);
            alert('Court rejected successfully!');
        } catch (error) {
            console.error('Error rejecting court:', error);
            alert('Failed to reject court');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSuspend = async (courtId: number, reason: string = '') => {
        if (!confirm('Are you sure you want to suspend this court?')) return;

        try {
            setActionLoading(courtId);
            await courtService.suspendCourt(courtId, reason);
            await fetchCourts();
            await fetchStats();
            alert('Court suspended');
        } catch (error) {
            console.error('Error suspending court:', error);
            alert('Failed to suspend court');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (courtId: number) => {
        if (!confirm('Are you sure you want to delete this court? This action cannot be undone.')) return;

        try {
            setActionLoading(courtId);
            await courtService.deleteCourt(courtId);
            await fetchCourts();
            await fetchStats();
            alert('Court deleted successfully');
        } catch (error) {
            console.error('Error deleting court:', error);
            alert('Failed to delete court');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-50 text-[#0f2e22] border-green-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'suspended':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-green-50 text-[#0f2e22] border-green-200';
        }
    };

    const getTypeIcon = (type: string) => {
        if (type === 'indoor') return '🏢';
        if (type === 'outdoor') return '🌳';
        return '🏢🌳';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0f2e22] tracking-tight">Court Moderation</h1>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-2">
                        Manage court listings and verification status
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-white border border-green-200 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'list'
                                    ? 'bg-[#0f2e22] text-white'
                                    : 'text-slate-600 hover:text-[#0f2e22]'
                            }`}
                        >
                            <List size={16} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'map'
                                    ? 'bg-[#0f2e22] text-white'
                                    : 'text-slate-600 hover:text-[#0f2e22]'
                            }`}
                        >
                            <Map size={16} />
                            Map
                        </button>
                    </div>

                    <Button 
                        variant="secondary" 
                        className="bg-[#a3e635] text-[#0f2e22] hover:bg-lime-400 font-black"
                        onClick={() => alert('Add new court feature coming soon!')}
                    >
                        <Plus size={16} />
                        <span>New Court Listing</span>
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Listings', value: stats.total, icon: MapPin, color: 'from-blue-500 to-blue-600' },
                        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-amber-500 to-amber-600' },
                        { label: 'Verified Courts', value: stats.approved, icon: ShieldCheck, color: 'from-emerald-500 to-emerald-600' },
                        { label: 'Avg Rating', value: stats.average_rating || '0.0', icon: Star, color: 'from-yellow-500 to-yellow-600' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#0f2e22] uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-[#0f2e22]">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Filters */}
            <Card className="shadow-lg border border-blue-100 bg-white">
                <div className="p-6 border-b border-blue-100 flex flex-col md:flex-row md:items-center gap-4 bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0f2e22]" size={16} />
                        <input
                            type="text"
                            placeholder="Search courts by name, city, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-[#0f2e22]/50 focus:border-[#0f2e22] text-sm font-medium transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/50 text-sm font-semibold text-[#1E40AF]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/50 text-sm font-semibold text-[#1E40AF]"
                        >
                            <option value="all">All Types</option>
                            <option value="indoor">Indoor</option>
                            <option value="outdoor">Outdoor</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                </div>

                {/* Map View */}
                {viewMode === 'map' && !loading && (
                    <div className="p-6">
                        <CourtsMap 
                            courts={courts.filter(c => c.status === 'approved')} 
                            center={courts.length > 0 && courts[0].latitude && courts[0].longitude
                                ? { lat: courts[0].latitude, lng: courts[0].longitude }
                                : undefined
                            }
                        />
                        <p className="text-xs text-slate-500 mt-4 text-center">
                            Showing {courts.filter(c => c.status === 'approved' && c.latitude && c.longitude).length} approved courts with locations
                        </p>
                    </div>
                )}

                {/* Courts List */}
                {viewMode === 'list' && (
                    <div className="divide-y divide-blue-100">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0f2e22] border-t-transparent"></div>
                            <p className="mt-4 text-sm font-semibold text-slate-600">Loading courts...</p>
                        </div>
                    ) : courts.length === 0 ? (
                        <div className="p-12 text-center">
                            <MapPin className="mx-auto h-12 w-12 text-slate-300" />
                            <p className="mt-4 text-sm font-semibold text-slate-600">No courts found</p>
                        </div>
                    ) : (
                        courts.map((court) => (
                            <div key={court.id} className="p-6 hover:bg-blue-50 transition-colors group">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Court Image Placeholder */}
                                    <div className="w-full lg:w-40 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden flex-shrink-0 relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                            {getTypeIcon(court.type)}
                                        </div>
                                    </div>

                                    {/* Court Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-black text-[#0f2e22]">{court.name}</h3>
                                                    <Badge className={`${getStatusColor(court.status)} font-black capitalize`}>
                                                        {court.status}
                                                    </Badge>
                                                    {court.is_featured && (
                                                        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 font-black">
                                                            ⭐ Featured
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 line-clamp-2">{court.description}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <MapPin size={14} className="text-[#0f2e22]" />
                                                <span>{court.city}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Building2 size={14} className="text-[#1E40AF]" />
                                                <span className="capitalize">{court.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <ShieldCheck size={14} className="text-[#1E40AF]" />
                                                <span>{court.number_of_courts} Courts</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Star size={14} className="text-[#FDE047] fill-[#FDE047]" />
                                                <span className="text-[#1E40AF] font-black">
                                                    {court.rating > 0 ? court.rating.toFixed(1) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <DollarSign size={14} className="text-[#064e3b]" />
                                                <span>{court.is_free ? 'Free' : `₱${court.price_per_hour}/hr`}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Calendar size={14} className="text-[#1E40AF]" />
                                                <span>{court.total_bookings} Bookings</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Eye size={14} className="text-[#1E40AF]" />
                                                <span>{court.view_count} Views</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <TrendingUp size={14} className="text-[#064e3b]" />
                                                <span>{court.total_reviews} Reviews</span>
                                            </div>
                                        </div>

                                        {court.rejection_reason && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-red-900">Rejection Reason:</p>
                                                        <p className="text-xs text-red-700">{court.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Owner Info */}
                                        <div className="text-xs text-slate-500">
                                            Owner: <span className="font-semibold text-slate-700">
                                                {court.owner.first_name} {court.owner.last_name}
                                            </span> ({court.owner.email})
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col items-center gap-2 shrink-0">
                                        {court.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(court.id)}
                                                    disabled={actionLoading === court.id}
                                                    className="flex-1 lg:flex-none p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-lg transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCourt(court);
                                                        setShowRejectModal(true);
                                                    }}
                                                    disabled={actionLoading === court.id}
                                                    className="flex-1 lg:flex-none p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        
                                        {court.status === 'approved' && (
                                            <button
                                                onClick={() => handleSuspend(court.id)}
                                                disabled={actionLoading === court.id}
                                                className="flex-1 lg:flex-none p-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Suspend"
                                            >
                                                <Ban size={18} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(court.id)}
                                            disabled={actionLoading === court.id}
                                            className="flex-1 lg:flex-none p-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    </div>
                )}
            </Card>

            {/* Reject Modal */}
            {showRejectModal && selectedCourt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-black text-[#1E40AF] mb-4">Reject Court Listing</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            You are about to reject <strong>{selectedCourt.name}</strong>. Please provide a reason:
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full border border-blue-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/50 min-h-[100px]"
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedCourt(null);
                                    setRejectReason('');
                                }}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim() || actionLoading === selectedCourt.id}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === selectedCourt.id ? 'Rejecting...' : 'Reject Court'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}