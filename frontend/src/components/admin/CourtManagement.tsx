'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Button } from '@/components/profile/ui/Common';
import CourtsMap from '@/components/admin/CourtsMap';
import { courtService } from '@/services/courtService';
import { useAuth } from '@/contexts/AuthContext';
import { Court as DbCourt } from '@/types/database';
import { globalCache } from '@/lib/cacheManager';
import { SkeletonTable } from '@/components/ui/skeleton';
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
    List,
    RefreshCw
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

function CourtManagement() {
    const { user } = useAuth();
    const [courts, setCourts] = useState<Court[]>([]);
    const [stats, setStats] = useState<CourtStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [useMock, setUseMock] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [focusedCourtId, setFocusedCourtId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    type NewCourtForm = {
        name: string;
        description: string;
        type: 'indoor' | 'outdoor' | 'both';
        surface: 'concrete' | 'asphalt' | 'sport_court' | 'wood' | 'other';
        address: string;
        city: string;
        state_province: string;
        country: string;
        postal_code: string;
        latitude?: string;
        longitude?: string;
        number_of_courts: number;
        amen_lights: boolean;
        amen_equipment: boolean;
        is_free: boolean;
        price_per_hour?: number | '';
        requires_booking: boolean;
        booking_url: string;
        phone_number: string;
        email: string;
        website: string;
        cover_image: string;
        open_time: string; // HH:mm
        close_time: string; // HH:mm
    };

    const [newCourt, setNewCourt] = useState<NewCourtForm>({
        name: '',
        description: '',
        type: 'indoor',
        surface: 'sport_court',
        address: '',
        city: '',
        state_province: '',
        country: 'Philippines',
        postal_code: '',
        latitude: '',
        longitude: '',
        number_of_courts: 1,
        amen_lights: false,
        amen_equipment: false,
        is_free: false,
        price_per_hour: 300,
        requires_booking: false,
        booking_url: '',
        phone_number: '',
        email: '',
        website: '',
        cover_image: '',
        open_time: '06:00',
        close_time: '22:00',
    });

    // UI helpers for consistent styling
    const inputCls =
        "w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2e22]/40 focus:border-[#0f2e22] text-sm";
    const labelCls = "text-[11px] font-black text-slate-600 uppercase tracking-widest";

    // Lightweight mock dataset for admin moderation views
    const mockCourtsAdmin: Court[] = [
        {
            id: 101,
            owner_id: 'mock-owner-1',
            owner: { id: 1, first_name: 'Maya', last_name: 'Santos', email: 'maya@example.com' },
            name: 'Mock Indoor Arena',
            description: 'Premium indoor courts for testing moderation.',
            type: 'indoor',
            surface: 'sport_court',
            address: '123 Mock St',
            city: 'Makati',
            state_province: 'NCR',
            country: 'PH',
            postal_code: '1200',
            latitude: 14.5547,
            longitude: 121.0244,
            number_of_courts: 4,
            amenities: ['lights', 'equipment'],
            hours_of_operation: { mon: { open: '06:00', close: '22:00' } },
            is_free: false,
            price_per_hour: 500,
            peak_hour_price: 700,
            pricing_details: null,
            phone_number: '+63 2 8888 1234',
            email: 'contact@mockindoor.test',
            website: 'mockindoor.test',
            requires_booking: true,
            booking_url: 'https://mockindoor.test/book',
            images: [],
            cover_image: null,
            status: 'pending',
            rejection_reason: null,
            approved_by: null,
            approved_at: null,
            rating: 4.6,
            total_reviews: 23,
            total_bookings: 120,
            view_count: 980,
            is_featured: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
        } as unknown as Court,
        {
            id: 102,
            owner_id: 'mock-owner-2',
            owner: { id: 2, first_name: 'Leo', last_name: 'Cruz', email: 'leo@example.com' },
            name: 'Mock Outdoor Courts',
            description: 'Sunny outdoor complex for QA.',
            type: 'outdoor',
            surface: 'concrete',
            address: '456 QA Ave',
            city: 'Taguig',
            state_province: 'NCR',
            country: 'PH',
            postal_code: '1630',
            latitude: 14.5213,
            longitude: 121.0537,
            number_of_courts: 6,
            amenities: ['lights'],
            hours_of_operation: { mon: { open: '05:00', close: '21:00' } },
            is_free: true,
            price_per_hour: null,
            peak_hour_price: null,
            pricing_details: null,
            phone_number: null,
            email: null,
            website: null,
            requires_booking: false,
            booking_url: null,
            images: [],
            cover_image: null,
            status: 'approved',
            rejection_reason: null,
            approved_by: 'admin-1',
            approved_at: new Date().toISOString(),
            rating: 4.2,
            total_reviews: 10,
            total_bookings: 45,
            view_count: 320,
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
        } as unknown as Court,
        {
            id: 103,
            owner_id: 'mock-owner-3',
            owner: { id: 3, first_name: 'Ara', last_name: 'Dizon', email: 'ara@example.com' },
            name: 'Mock Mixed Courts',
            description: 'Both indoor and outdoor sample venue.',
            type: 'both',
            surface: 'asphalt',
            address: '789 Sample Blvd',
            city: 'Quezon City',
            state_province: 'NCR',
            country: 'PH',
            postal_code: '1100',
            latitude: 14.6760,
            longitude: 121.0437,
            number_of_courts: 3,
            amenities: ['equipment'],
            hours_of_operation: { mon: { open: '07:00', close: '20:00' } },
            is_free: false,
            price_per_hour: 250,
            peak_hour_price: 350,
            pricing_details: null,
            phone_number: '+63 2 7777 5678',
            email: 'info@mockmixed.test',
            website: 'mockmixed.test',
            requires_booking: false,
            booking_url: null,
            images: [],
            cover_image: null,
            status: 'rejected',
            rejection_reason: 'Insufficient details provided',
            approved_by: null,
            approved_at: null,
            rating: 0,
            total_reviews: 0,
            total_bookings: 0,
            view_count: 12,
            is_featured: false,
            is_active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
        } as unknown as Court,
    ];

    const inflightRef = useRef(0);
    const lastFetchKeyRef = useRef<string | null>(null);
    const lastFetchAtRef = useRef<number>(0);
    const isVisibleRef = useRef(true);
    const initialLoadDone = useRef(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            isVisibleRef.current = document.visibilityState === 'visible';
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!isVisibleRef.current) return;

        const searchValue = debouncedSearchTerm.trim();
        const cacheKey = `courts_${statusFilter}_${typeFilter}_${searchValue}`;
        
        // Check if we have valid cached data
        const cachedCourts = globalCache.get<Court[]>(cacheKey);
        if (cachedCourts && initialLoadDone.current) {
            setCourts(cachedCourts);
            setLoading(false);
            setIsFiltering(false);
            return;
        }

        const fetchKey = JSON.stringify({ statusFilter, typeFilter, searchValue, useMock });
        const now = Date.now();
        const isDuplicate = fetchKey === lastFetchKeyRef.current && now - lastFetchAtRef.current < 3000;

        if (isDuplicate) return;

        lastFetchKeyRef.current = fetchKey;
        lastFetchAtRef.current = now;

        const requestId = ++inflightRef.current;
        fetchCourts(requestId, searchValue, cacheKey);
        fetchStats(requestId);
    }, [statusFilter, typeFilter, debouncedSearchTerm, useMock]);

    const fetchCourts = async (requestId: number, searchValue: string, cacheKey: string) => {
        try {
            if (requestId === inflightRef.current) {
                if (initialLoadDone.current) {
                    setIsFiltering(true);
                } else {
                    setLoading(true);
                }
            }
            if (useMock) {
                // Client-side filter on mock data
                let data = mockCourtsAdmin;
                if (statusFilter !== 'all') data = data.filter(c => c.status === statusFilter);
                if (typeFilter !== 'all') data = data.filter(c => c.type === (typeFilter as any));
                if (searchValue) {
                    const q = searchValue.toLowerCase();
                    data = data.filter(c =>
                        c.name.toLowerCase().includes(q) ||
                        c.city.toLowerCase().includes(q) ||
                        c.address.toLowerCase().includes(q)
                    );
                }
                if (requestId === inflightRef.current) {
                    setCourts(data);
                    globalCache.set(cacheKey, data); // Cache the result
                }
            } else {
                const result = await courtService.getCourts({
                    status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
                    type: typeFilter !== 'all' ? typeFilter : undefined,
                    search: searchValue || undefined,
                });
                if (requestId === inflightRef.current) {
                    setCourts(result.data as Court[]);
                    globalCache.set(cacheKey, result.data as Court[]); // Cache the result
                }
            }
        } catch (error) {
            console.error('Error fetching courts:', error);
        } finally {
            if (requestId === inflightRef.current) {
                setLoading(false);
                setIsFiltering(false);
                setIsRefreshing(false);
                setLastUpdated(new Date());
                initialLoadDone.current = true;
            }
        }
    };

    const fetchStats = async (requestId: number) => {
        try {
            if (useMock) {
                const dataset = mockCourtsAdmin;
                const summary: CourtStats = {
                    total: dataset.length,
                    pending: dataset.filter(c => c.status === 'pending').length,
                    approved: dataset.filter(c => c.status === 'approved').length,
                    rejected: dataset.filter(c => c.status === 'rejected').length,
                    suspended: dataset.filter(c => c.status === 'suspended').length,
                    active: dataset.filter(c => c.is_active).length,
                    featured: dataset.filter(c => c.is_featured).length,
                    average_rating: Number((dataset.reduce((s, c) => s + (c.rating || 0), 0) / Math.max(1, dataset.length)).toFixed(1)),
                    total_bookings: dataset.reduce((s, c) => s + (c.total_bookings || 0), 0),
                };
                if (requestId === inflightRef.current) {
                    setStats(summary);
                }
            } else {
                const data = await courtService.getStatistics();
                if (requestId === inflightRef.current) {
                    setStats({
                        ...data,
                        suspended: 0,
                        active: 0,
                        featured: 0,
                        average_rating: 0,
                        total_bookings: 0,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        lastFetchKeyRef.current = null;
        globalCache.clearAll(); // Clear all cache on manual refresh
        const cacheKey = `courts_${statusFilter}_${typeFilter}_${debouncedSearchTerm.trim()}`;
        const requestId = ++inflightRef.current;
        fetchCourts(requestId, debouncedSearchTerm.trim(), cacheKey);
        fetchStats(requestId);
    };

    const handleApprove = async (courtId: number) => {
        if (!confirm('Are you sure you want to approve this court?')) return;
        if (!user) return;
        if (useMock) {
            alert('Mock mode: action disabled');
            return;
        }

        try {
            setActionLoading(courtId);
            await courtService.approveCourt(courtId, user.id);
            lastFetchKeyRef.current = null;
            globalCache.clearAll();
            const cacheKey = `courts_${statusFilter}_${typeFilter}_${debouncedSearchTerm.trim()}`;
            const requestId = ++inflightRef.current;
            await fetchCourts(requestId, debouncedSearchTerm.trim(), cacheKey);
            await fetchStats(requestId);
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
        if (useMock) {
            alert('Mock mode: action disabled');
            return;
        }

        try {
            setActionLoading(selectedCourt.id);
            await courtService.rejectCourt(selectedCourt.id, rejectReason);
            lastFetchKeyRef.current = null;
            globalCache.clearAll();
            const cacheKey = `courts_${statusFilter}_${typeFilter}_${debouncedSearchTerm.trim()}`;
            const requestId = ++inflightRef.current;
            await fetchCourts(requestId, debouncedSearchTerm.trim(), cacheKey);
            await fetchStats(requestId);
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
        if (useMock) {
            alert('Mock mode: action disabled');
            return;
        }

        try {
            setActionLoading(courtId);
            await courtService.suspendCourt(courtId, reason);
            lastFetchKeyRef.current = null;
            globalCache.clearAll();
            const cacheKey = `courts_${statusFilter}_${typeFilter}_${debouncedSearchTerm.trim()}`;
            const requestId = ++inflightRef.current;
            await fetchCourts(requestId, debouncedSearchTerm.trim(), cacheKey);
            await fetchStats(requestId);
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
        if (useMock) {
            alert('Mock mode: action disabled');
            return;
        }

        try {
            setActionLoading(courtId);
            await courtService.deleteCourt(courtId);
            lastFetchKeyRef.current = null;
            globalCache.clearAll();
            const cacheKey = `courts_${statusFilter}_${typeFilter}_${debouncedSearchTerm.trim()}`;
            const requestId = ++inflightRef.current;
            await fetchCourts(requestId, debouncedSearchTerm.trim(), cacheKey);
            await fetchStats(requestId);
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
                        {lastUpdated && (
                            <span className="ml-3 text-slate-400 font-normal normal-case">
                                • Last updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Refresh Button */}
                    <button
                        onClick={handleManualRefresh}
                        disabled={isRefreshing || loading}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        title="Refresh data"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    
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

                    {/* Data Source Toggle */}
                    <button
                        onClick={() => setUseMock(v => !v)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors ${useMock ? 'border-amber-400 text-amber-700 hover:bg-amber-50' : 'border-emerald-500 text-emerald-700 hover:bg-emerald-50'}`}
                        title={useMock ? 'Currently showing mock admin courts' : 'Currently showing live admin courts'}
                    >
                        {useMock ? 'Use Live Data' : 'Use Mock Data'}
                    </button>

                    <Button 
                        variant="secondary" 
                        className="bg-[#a3e635] text-[#0f2e22] hover:bg-lime-400 font-black"
                        onClick={() => setShowCreateModal(true)}
                        disabled={useMock}
                    >
                        <Plus size={16} />
                        <span>{useMock ? 'New Court (Disabled in Mock)' : 'New Court Listing'}</span>
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
                                    {/* Create Court Modal */}
                                    {showCreateModal && (
                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden">
                                                {/* Modal Header */}
                                                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-white">
                                                    <div>
                                                        <h3 className="text-xl font-black text-[#0f2e22]">Create New Court Listing</h3>
                                                        <p className="text-xs text-slate-600 font-semibold">Fill in the details below. New listings are set to Pending.</p>
                                                    </div>
                                                    <button
                                                        className="px-3 py-1 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                                                        onClick={() => setShowCreateModal(false)}
                                                        disabled={creating}
                                                    >
                                                        Close
                                                    </button>
                                                </div>

                                                <div className="p-6 overflow-y-auto max-h-[80vh]">
                                                {createError && (
                                                    <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
                                                        {createError}
                                                    </div>
                                                )}

                                                <form
                                                    onSubmit={async (e) => {
                                                        e.preventDefault();
                                                        setCreateError(null);
                                                        if (useMock) {
                                                            setCreateError('Mock mode: creation is disabled');
                                                            return;
                                                        }
                                                        try {
                                                            // Basic validation
                                                            if (!newCourt.name.trim()) throw new Error('Name is required');
                                                            if (!newCourt.address.trim()) throw new Error('Address is required');
                                                            if (!newCourt.city.trim()) throw new Error('City is required');
                                                            if (!newCourt.country.trim()) throw new Error('Country is required');
                                                            if (newCourt.number_of_courts < 1) throw new Error('Number of courts must be at least 1');

                                                            setCreating(true);

                                                            const amenities: string[] = [];
                                                            if (newCourt.amen_lights) amenities.push('lights');
                                                            if (newCourt.amen_equipment) amenities.push('equipment');

                                                            const hours = {
                                                                mon: { open: newCourt.open_time, close: newCourt.close_time },
                                                                tue: { open: newCourt.open_time, close: newCourt.close_time },
                                                                wed: { open: newCourt.open_time, close: newCourt.close_time },
                                                                thu: { open: newCourt.open_time, close: newCourt.close_time },
                                                                fri: { open: newCourt.open_time, close: newCourt.close_time },
                                                                sat: { open: newCourt.open_time, close: newCourt.close_time },
                                                                sun: { open: newCourt.open_time, close: newCourt.close_time },
                                                            } as Record<string, { open: string; close: string }>;

                                                            // Build payload expected by POST /api/courts
                                                            const payload: any = {
                                                                name: newCourt.name,
                                                                description: newCourt.description || null,
                                                                type: newCourt.type,
                                                                surface: newCourt.surface,
                                                                address: newCourt.address,
                                                                city: newCourt.city,
                                                                state_province: newCourt.state_province || null,
                                                                country: newCourt.country,
                                                                postal_code: newCourt.postal_code || null,
                                                                latitude: newCourt.latitude ? Number(newCourt.latitude) : null,
                                                                longitude: newCourt.longitude ? Number(newCourt.longitude) : null,
                                                                number_of_courts: Number(newCourt.number_of_courts),
                                                                amenities,
                                                                hours_of_operation: hours,
                                                                is_free: newCourt.is_free,
                                                                price_per_hour: newCourt.is_free ? null : (newCourt.price_per_hour === '' ? null : Number(newCourt.price_per_hour)),
                                                                peak_hour_price: null,
                                                                pricing_details: null,
                                                                phone_number: newCourt.phone_number || null,
                                                                email: newCourt.email || null,
                                                                website: newCourt.website || null,
                                                                requires_booking: newCourt.requires_booking,
                                                                booking_url: newCourt.booking_url || null,
                                                                images: [],
                                                                cover_image: newCourt.cover_image || null,
                                                                is_featured: false,
                                                                is_active: true,
                                                            };

                                                            const res = await fetch('/api/courts', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify(payload),
                                                            });

                                                            const json = await res.json();
                                                            if (!res.ok || !json.success) {
                                                                throw new Error(json.error || 'Failed to create court');
                                                            }

                                                            setShowCreateModal(false);
                                                            // reset form
                                                            setNewCourt(prev => ({ ...prev, name: '', description: '', address: '', city: '', state_province: '', postal_code: '', latitude: '', longitude: '', phone_number: '', email: '', website: '', booking_url: '', cover_image: '' }));
                                                            lastFetchKeyRef.current = null;
                                                            globalCache.clearAll();
                                                            const cacheKey = `courts_${statusFilter}_${typeFilter}_${debouncedSearchTerm.trim()}`;
                                                            const requestId = ++inflightRef.current;
                                                            await fetchCourts(requestId, debouncedSearchTerm.trim(), cacheKey);
                                                            await fetchStats(requestId);
                                                            alert('Court created successfully. Pending moderation.');
                                                        } catch (err: any) {
                                                            setCreateError(err.message || 'Unexpected error');
                                                        } finally {
                                                            setCreating(false);
                                                        }
                                                    }}
                                                >
                                                    {/* Basic Info */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Name</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.name} onChange={e => setNewCourt({ ...newCourt, name: e.target.value })} required />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Type</label>
                                                            <select className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.type} onChange={e => setNewCourt({ ...newCourt, type: e.target.value as any })}>
                                                                <option value="indoor">Indoor</option>
                                                                <option value="outdoor">Outdoor</option>
                                                                <option value="both">Both</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-600">Description</label>
                                                            <textarea className="w-full mt-1 px-3 py-2 border rounded-lg" rows={3} value={newCourt.description} onChange={e => setNewCourt({ ...newCourt, description: e.target.value })} />
                                                        </div>
                                                    </div>

                                                    {/* Location */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-600">Address</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.address} onChange={e => setNewCourt({ ...newCourt, address: e.target.value })} required />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">City</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.city} onChange={e => setNewCourt({ ...newCourt, city: e.target.value })} required />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">State/Province</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.state_province} onChange={e => setNewCourt({ ...newCourt, state_province: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Country</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.country} onChange={e => setNewCourt({ ...newCourt, country: e.target.value })} required />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Postal Code</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.postal_code} onChange={e => setNewCourt({ ...newCourt, postal_code: e.target.value })} />
                                                        </div>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Surface</label>
                                                            <select className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.surface} onChange={e => setNewCourt({ ...newCourt, surface: e.target.value as any })}>
                                                                <option value="sport_court">Sport Court</option>
                                                                <option value="concrete">Concrete</option>
                                                                <option value="asphalt">Asphalt</option>
                                                                <option value="wood">Wood</option>
                                                                <option value="other">Other</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Number of Courts</label>
                                                            <input type="number" min={1} className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.number_of_courts} onChange={e => setNewCourt({ ...newCourt, number_of_courts: Number(e.target.value) })} required />
                                                        </div>
                                                        <div className="flex items-center gap-4 md:col-span-2">
                                                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newCourt.amen_lights} onChange={e => setNewCourt({ ...newCourt, amen_lights: e.target.checked })} /> Night Lights</label>
                                                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newCourt.amen_equipment} onChange={e => setNewCourt({ ...newCourt, amen_equipment: e.target.checked })} /> Equipment Rental</label>
                                                        </div>
                                                    </div>

                                                    {/* Hours */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Open Time</label>
                                                            <input type="time" className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.open_time} onChange={e => setNewCourt({ ...newCourt, open_time: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Close Time</label>
                                                            <input type="time" className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.close_time} onChange={e => setNewCourt({ ...newCourt, close_time: e.target.value })} />
                                                        </div>
                                                    </div>

                                                    {/* Pricing & Booking */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <input id="is_free" type="checkbox" checked={newCourt.is_free} onChange={e => setNewCourt({ ...newCourt, is_free: e.target.checked })} />
                                                            <label htmlFor="is_free" className="text-sm">Free to play</label>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Price per Hour (₱)</label>
                                                            <input type="number" min={0} disabled={newCourt.is_free} className="w-full mt-1 px-3 py-2 border rounded-lg" value={newCourt.is_free ? '' : newCourt.price_per_hour} onChange={e => setNewCourt({ ...newCourt, price_per_hour: e.target.value === '' ? '' : Number(e.target.value) })} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input id="requires_booking" type="checkbox" checked={newCourt.requires_booking} onChange={e => setNewCourt({ ...newCourt, requires_booking: e.target.checked })} />
                                                            <label htmlFor="requires_booking" className="text-sm">Requires booking</label>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-600">Booking URL</label>
                                                            <input className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="https://..." value={newCourt.booking_url} onChange={e => setNewCourt({ ...newCourt, booking_url: e.target.value })} />
                                                        </div>
                                                    </div>

                                                    {/* Contact & Media */}
                                                    <div className="mb-6">
                                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Contact & Media</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className={labelCls}>Phone</label>
                                                                <input className={inputCls} value={newCourt.phone_number} onChange={e => setNewCourt({ ...newCourt, phone_number: e.target.value })} />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Email</label>
                                                                <input type="email" className={inputCls} value={newCourt.email} onChange={e => setNewCourt({ ...newCourt, email: e.target.value })} />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Website</label>
                                                                <input className={inputCls} placeholder="example.com" value={newCourt.website} onChange={e => setNewCourt({ ...newCourt, website: e.target.value })} />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Cover Image URL</label>
                                                                <input className={inputCls} placeholder="https://..." value={newCourt.cover_image} onChange={e => setNewCourt({ ...newCourt, cover_image: e.target.value })} />
                                                                {newCourt.cover_image && (
                                                                    <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img src={newCourt.cover_image} alt="Cover preview" className="w-full h-full object-cover" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Coordinates */}
                                                    <div className="mb-6">
                                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Coordinates (optional)</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className={labelCls}>Latitude</label>
                                                                <input className={inputCls} value={newCourt.latitude} onChange={e => setNewCourt({ ...newCourt, latitude: e.target.value })} />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Longitude</label>
                                                                <input className={inputCls} value={newCourt.longitude} onChange={e => setNewCourt({ ...newCourt, longitude: e.target.value })} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 pt-2">
                                                        <button type="button" className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50" onClick={() => setShowCreateModal(false)} disabled={creating}>Cancel</button>
                                                        <button type="submit" className="flex-1 px-4 py-3 bg-[#0f2e22] text-white rounded-xl font-semibold hover:bg-[#0c241b] disabled:opacity-50" disabled={creating}>{creating ? 'Creating...' : 'Create Court'}</button>
                                                    </div>
                                                </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-2xl font-black text-[#0f2e22]">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Filters and Search */}
            <Card className="p-4 bg-white border border-slate-200 relative">
                {isFiltering && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-spin"></div>
                        Filtering...
                    </div>
                )}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, city, or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2e22] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full md:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f2e22] focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                            <option value="suspended">🚫 Suspended</option>
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div className="w-full md:w-48">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f2e22] focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="indoor">🏢 Indoor</option>
                            <option value="outdoor">🌳 Outdoor</option>
                            <option value="both">🏢🌳 Both</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setTypeFilter('all');
                            }}
                            className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors whitespace-nowrap"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Active Filters Display */}
                {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <Filter size={14} className="text-slate-500" />
                        <span className="text-slate-600 font-semibold">Active filters:</span>
                        {searchTerm && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                                Search: "{searchTerm}"
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-medium">
                                Status: {statusFilter}
                            </span>
                        )}
                        {typeFilter !== 'all' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-medium">
                                Type: {typeFilter}
                            </span>
                        )}
                    </div>
                )}
            </Card>

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {loading && !initialLoadDone.current ? (
                        <div className="space-y-3">
                            <SkeletonTable rows={4} cols={5} />
                        </div>
                    ) : courts.length === 0 ? (
                        <Card className="p-12 text-center border-2 border-dashed border-slate-200">
                            <MapPin size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-semibold">No courts found</p>
                        </Card>
                    ) : (
                        courts.map((court) => (
                            <Card key={court.id} className="p-6 border-l-4 hover:shadow-lg transition-shadow">
                                <div style={{
                                    borderLeft: `4px solid ${court.status === 'approved' ? '#10b981' : court.status === 'pending' ? '#f59e0b' : '#ef4444'}`
                                }} className="-mx-6 -my-6 px-6 py-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    {/* Left: Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{getTypeIcon(court.type)}</span>
                                            <div>
                                                <h3 className="text-lg font-black text-[#0f2e22]">{court.name}</h3>
                                                <p className="text-xs text-slate-500 font-semibold">{court.city}, {court.state_province}</p>
                                            </div>
                                        </div>
                                        {court.description && (
                                            <p className="text-sm text-slate-600">{court.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className={`border ${getStatusColor(court.status)}`}>{court.status.toUpperCase()}</Badge>
                                            {court.is_featured && <Badge className="border border-amber-200 bg-amber-50 text-amber-700">Featured</Badge>}
                                            {court.is_active && <Badge className="border border-green-200 bg-green-50 text-green-700">Active</Badge>}
                                        </div>

                                        {/* Location Info */}
                                        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                            <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest">Location</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div><span className="font-semibold text-slate-600">Address:</span> {court.address}</div>
                                                <div><span className="font-semibold text-slate-600">Country:</span> {court.country}</div>
                                                <div><span className="font-semibold text-slate-600">Postal Code:</span> {court.postal_code || 'N/A'}</div>
                                                {court.latitude && court.longitude && (
                                                    <div><span className="font-semibold text-slate-600">Coordinates:</span> {court.latitude}, {court.longitude}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details Info */}
                                        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                            <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest">Details</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-600">TYPE</p>
                                                    <p className="text-sm font-semibold text-[#0f2e22] capitalize">{court.type}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-600">SURFACE</p>
                                                    <p className="text-sm font-semibold text-[#0f2e22] capitalize">{court.surface}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-600">COURTS</p>
                                                    <p className="text-lg font-black text-[#0f2e22]">{court.number_of_courts}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-600">RATING</p>
                                                    <p className="text-lg font-black text-[#0f2e22]">{court.rating?.toFixed(1) || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hours & Pricing */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                                                <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest">Hours</h4>
                                                {court.hours_of_operation && court.hours_of_operation.mon ? (
                                                    <div className="text-sm space-y-1">
                                                        <div><span className="font-semibold">Mon-Sun:</span> {typeof court.hours_of_operation.mon === 'string' ? court.hours_of_operation.mon : `${court.hours_of_operation.mon.open} - ${court.hours_of_operation.mon.close}`}</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-600">Varies by day</div>
                                                )}
                                            </div>

                                            <div className="bg-green-50 rounded-lg p-4 space-y-2">
                                                <h4 className="text-xs font-black text-green-700 uppercase tracking-widest">Pricing</h4>
                                                <div className="text-sm space-y-1">
                                                    <div><span className="font-semibold">Status:</span> {court.is_free ? '🆓 Free' : `₱${court.price_per_hour || 0}/hr`}</div>
                                                    {court.requires_booking && (
                                                        <div><span className="font-semibold text-amber-700">🔖 Booking Required</span></div>
                                                    )}
                                                    {court.booking_url && (
                                                        <div className="text-xs"><a href={court.booking_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Booking URL</a></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        {court.amenities && court.amenities.length > 0 && (
                                            <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                                                <h4 className="text-xs font-black text-purple-700 uppercase tracking-widest">Amenities</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {court.amenities.map((amenity, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold capitalize">
                                                            {amenity === 'lights' ? '💡 Lights' : amenity === 'equipment' ? '🎾 Equipment' : amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact Info */}
                                        {(court.phone_number || court.email || court.website) && (
                                            <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                                                <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest">Contact</h4>
                                                <div className="text-sm space-y-1">
                                                    {court.phone_number && <div><span className="font-semibold">📱 Phone:</span> {court.phone_number}</div>}
                                                    {court.email && <div><span className="font-semibold">📧 Email:</span> {court.email}</div>}
                                                    {court.website && <div><span className="font-semibold">🌐 Website:</span> {court.website}</div>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cover Image */}
                                        {court.cover_image && (
                                            <div className="rounded-lg overflow-hidden border border-slate-200 h-48">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={court.cover_image} alt={court.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-3 text-xs">
                                            <div className="space-y-1 bg-indigo-50 rounded-lg p-3 text-center">
                                                <p className="font-bold text-indigo-600">BOOKINGS</p>
                                                <p className="text-lg font-black text-indigo-700">{court.total_bookings || 0}</p>
                                            </div>
                                            <div className="space-y-1 bg-cyan-50 rounded-lg p-3 text-center">
                                                <p className="font-bold text-cyan-600">VIEWS</p>
                                                <p className="text-lg font-black text-cyan-700">{court.view_count || 0}</p>
                                            </div>
                                            <div className="space-y-1 bg-rose-50 rounded-lg p-3 text-center">
                                                <p className="font-bold text-rose-600">REVIEWS</p>
                                                <p className="text-lg font-black text-rose-700">{court.total_reviews || 0}</p>
                                            </div>
                                        </div>

                                        {court.status === 'rejected' && court.rejection_reason && (
                                            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                                <p className="text-xs font-bold text-red-700 mb-1">REJECTION REASON:</p>
                                                <p className="text-sm text-red-700">{court.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col gap-2 md:min-w-fit">
                                        {court.status === 'pending' && !useMock && (
                                            <>
                                                <Button 
                                                    variant="secondary"
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                                    onClick={() => handleApprove(court.id)}
                                                    disabled={actionLoading === court.id}
                                                >
                                                    <CheckCircle2 size={14} />
                                                    {actionLoading === court.id ? 'Approving...' : 'Approve'}
                                                </Button>
                                                <Button 
                                                    variant="secondary"
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => {
                                                        setSelectedCourt(court);
                                                        setShowRejectModal(true);
                                                    }}
                                                >
                                                    <XCircle size={14} />
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {court.status === 'approved' && !useMock && (
                                            <Button 
                                                variant="secondary"
                                                className="bg-gray-500 hover:bg-gray-600 text-white"
                                                onClick={() => handleSuspend(court.id)}
                                                disabled={actionLoading === court.id}
                                            >
                                                <Ban size={14} />
                                                {actionLoading === court.id ? 'Suspending...' : 'Suspend'}
                                            </Button>
                                        )}
                                        <Button 
                                            variant="secondary"
                                            className="bg-blue-500 hover:bg-blue-600 text-white"
                                            onClick={() => {
                                                if (court.latitude && court.longitude) {
                                                    setFocusedCourtId(court.id);
                                                    setViewMode('map');
                                                } else {
                                                    alert('This court does not have location coordinates set.');
                                                }
                                            }}
                                        >
                                            <Eye size={14} />
                                            View on Map
                                        </Button>
                                        {!useMock && (
                                            <Button 
                                                variant="secondary"
                                                className="bg-slate-500 hover:bg-slate-600 text-white"
                                            >
                                                <Edit size={14} />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && <CourtsMap courts={courts} focusedCourtId={focusedCourtId} />}

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

export default React.memo(CourtManagement);