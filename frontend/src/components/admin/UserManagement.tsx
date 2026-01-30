
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Input, Button } from '@/components/profile/ui/Common';
import {
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Mail,
    Shield,
    CheckCircle2,
    XCircle,
    Settings,
    Eye,
    EyeOff,
    GripVertical,
    RefreshCw,
    Trash2,
    Edit,
    Ban,
    CheckCircle
} from 'lucide-react';
import adminService, { User, UserFilters, UserStatistics } from '@/services/adminService';

interface FieldConfig {
    key: string;
    label: string;
    type: 'text' | 'email' | 'badge' | 'status' | 'date' | 'avatar' | 'actions';
    visible: boolean;
    sortable?: boolean;
    width?: string;
    render?: (value: any, user: any) => React.ReactNode;
}

const DEFAULT_FIELD_CONFIG: FieldConfig[] = [
    { key: 'user', label: 'User', type: 'avatar', visible: true, sortable: true, width: 'auto' },
    { key: 'phone', label: 'Phone', type: 'text', visible: false, sortable: false, width: 'auto' },
    { key: 'role', label: 'Role', type: 'badge', visible: true, sortable: true, width: 'auto' },
    { key: 'status', label: 'Status', type: 'status', visible: true, sortable: true, width: 'auto' },
    { key: 'joined', label: 'Joined', type: 'date', visible: true, sortable: true, width: 'auto' },
    { key: 'lastActive', label: 'Last Active', type: 'text', visible: false, sortable: true, width: 'auto' },
    { key: 'actions', label: 'Actions', type: 'actions', visible: true, sortable: false, width: 'auto' },
];

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [fieldConfig, setFieldConfig] = useState<FieldConfig[]>(DEFAULT_FIELD_CONFIG);
    const [showFieldSettings, setShowFieldSettings] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [statistics, setStatistics] = useState<UserStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [perPage, setPerPage] = useState(15);
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const visibleFields = useMemo(() => fieldConfig.filter(f => f.visible), [fieldConfig]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const filters: UserFilters = {
                page: currentPage,
                per_page: perPage,
            };
            
            if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
            if (roleFilter) filters.role = roleFilter;
            if (statusFilter) filters.status = statusFilter.toLowerCase();
            
            const response = await adminService.getUsers(filters);
            
            if (response.success) {
                setUsers(response.data.users);
                setTotalPages(response.data.pagination.last_page);
                setTotalUsers(response.data.pagination.total);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            const stats = await adminService.getUserStatistics();
            setStatistics(stats);
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    // Load data on mount and when filters change
    useEffect(() => {
        fetchUsers();
    }, [currentPage, perPage, debouncedSearchTerm, roleFilter, statusFilter]);

    useEffect(() => {
        fetchStatistics();
    }, []);

    // Handle user actions
    const handleToggleStatus = async (userId: string) => {
        try {
            await adminService.toggleUserStatus(userId);
            fetchUsers(); // Refresh list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to toggle user status');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await adminService.deleteUser(userId);
            fetchUsers(); // Refresh list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const clearFilters = () => {
        setRoleFilter('');
        setStatusFilter('');
        setSearchTerm('');
        setCurrentPage(1); // Reset to first page when clearing filters
    };

    const hasActiveFilters = roleFilter || statusFilter || debouncedSearchTerm;

    const toggleFieldVisibility = (fieldKey: string) => {
        setFieldConfig(prev => prev.map(field =>
            field.key === fieldKey ? { ...field, visible: !field.visible } : field
        ));
    };

    const renderCellContent = (field: FieldConfig, user: any) => {
        const value = field.key === 'user' ? user : user[field.key];

        if (field.render) {
            return field.render(value, user);
        }

        switch (field.type) {
            case 'avatar':
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f2e22] to-green-600 flex items-center justify-center text-white font-black text-xs border-2 border-white shadow-md">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-black text-[#0f2e22]">{user.name}</p>
                            <p className="text-xs font-medium text-slate-500">{user.email}</p>
                        </div>
                    </div>
                );
            
            case 'email':
                return (
                    <a href={`mailto:${value}`} className="text-sm font-medium text-[#0f2e22] hover:underline">
                        {value}
                    </a>
                );
            
            case 'badge':
                return (
                    <Badge className={
                        value === 'Super Admin' ? 'bg-purple-50 text-purple-600 border-purple-100 font-black' :
                        value === 'Coach' ? 'bg-lime-100/20 text-amber-700 border-lime-200 font-black' :
                        value === 'Court Owner' ? 'bg-green-50 text-[#0f2e22] border-green-100 font-black' :
                        'bg-green-50 text-[#0f2e22] border-green-200 font-black'
                    }>
                        {value}
                    </Badge>
                );
            
            case 'status':
                return (
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            value === 'Active' ? 'bg-green-500' :
                            value === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-700 uppercase">{value}</span>
                    </div>
                );
            
            case 'actions':
                return (
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                            title={user.status === 'Active' ? 'Suspend user' : 'Activate user'}
                        >
                            {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete user"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                );
            
            case 'date':
            case 'text':
            default:
                return <span className="text-xs font-bold text-slate-600">{value}</span>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0f2e22] tracking-tight">User Management</h1>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-2">Manage global user accounts and permissions</p>
                </div>
                <Button variant="primary" className="md:w-auto bg-[#0f2e22] hover:bg-black text-white">
                    <UserPlus size={16} />
                    <span>Add New Admin</span>
                </Button>
            </div>

            <Card className="overflow-visible shadow-lg border border-blue-100 bg-white">
                <div className="p-6 border-b border-blue-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E40AF]" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/50 focus:border-[#1E40AF] transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black uppercase transition-colors ${
                                showFilters || hasActiveFilters
                                    ? 'bg-[#1E40AF] text-white border-[#1E40AF]' 
                                    : 'border-blue-200 bg-white text-[#1E40AF] hover:bg-blue-50'
                            }`}
                        >
                            <Filter size={16} />
                            <span>Filter</span>debouncedS
                            {hasActiveFilters && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-[#1E40AF] text-[10px]">{[roleFilter, statusFilter, searchTerm].filter(Boolean).length}</span>}
                        </button>
                        <button 
                            onClick={() => setShowFieldSettings(!showFieldSettings)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black uppercase transition-colors ${
                                showFieldSettings 
                                    ? 'bg-[#1E40AF] text-white border-[#1E40AF]' 
                                    : 'border-blue-200 bg-white text-[#1E40AF] hover:bg-blue-50'
                            }`}
                        >
                            <Settings size={16} />
                            <span>Fields</span>
                        </button>
                        <button 
                            onClick={fetchUsers}
                            disabled={loading}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-blue-200 bg-white text-xs font-black uppercase text-[#1E40AF] hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="p-6 border-b border-blue-100 bg-blue-50/50 animate-in slide-in-from-top-2 duration-300">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-[#1E40AF] uppercase tracking-wider mb-1">
                                    Filter Users
                                </h3>
                                <p className="text-xs text-slate-600 font-medium">
                                    Narrow down results by role and status
                                </p>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-black text-rose-600 hover:text-rose-700 uppercase tracking-wider"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Role Filter */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                                    Role
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setRoleFilter('')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            roleFilter === ''
                                                ? 'bg-[#1E40AF] text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-[#1E40AF]'
                                        }`}
                                    >
                                        All Roles
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter('customer')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            roleFilter === 'customer'
                                                ? 'bg-[#1E40AF] text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-[#1E40AF]'
                                        }`}
                                    >
                                        User
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter('coach')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            roleFilter === 'coach'
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-amber-500'
                                        }`}
                                    >
                                        Coach
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter('court_owner')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            roleFilter === 'court_owner'
                                                ? 'bg-emerald-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-emerald-600'
                                        }`}
                                    >
                                        Court Owner
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter('admin')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            roleFilter === 'admin'
                                                ? 'bg-purple-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-purple-600'
                                        }`}
                                    >
                                        Admin
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter('super_admin')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            roleFilter === 'super_admin'
                                                ? 'bg-purple-800 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-purple-800'
                                        }`}
                                    >
                                        Super Admin
                                    </button>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                                    Status
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setStatusFilter('')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            statusFilter === ''
                                                ? 'bg-[#1E40AF] text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-[#1E40AF]'
                                        }`}
                                    >
                                        All Status
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('active')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            statusFilter === 'active'
                                                ? 'bg-green-500 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-green-500'
                                        }`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('pending')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            statusFilter === 'pending'
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-blue-200 hover:border-amber-500'
                                        }`}
                                    >
                                        Pending
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fi      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-blue-200 bg-white text-xs font-black uppercase text-[#1E40AF] hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Field Settings Panel */}
                {showFieldSettings && (
                    <div className="p-6 border-b border-blue-100 bg-blue-50/50 animate-in slide-in-from-top-2 duration-300">
                        <div className="mb-4">
                            <h3 className="text-sm font-black text-[#1E40AF] uppercase tracking-wider mb-1">
                                Customize Table Columns
                            </h3>
                            <p className="text-xs text-slate-600 font-medium">
                                Toggle column visibility to customize your view
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {fieldConfig.map((field) => (
                                <button
                                    key={field.key}
                                    onClick={() => toggleFieldVisibility(field.key)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                        field.visible
                                            ? 'bg-[#1E40AF] border-[#1E40AF] text-white shadow-md'
                                            : 'bg-white border-blue-200 text-slate-600 hover:border-[#1E40AF]'
                                    }`}
                                >
                                    {field.visible ? (
                                        <Eye size={16} className="flex-shrink-0" />
                                    ) : (
                                        <EyeOff size={16} className="flex-shrink-0" />
                                    )}
                                    <span className="text-xs font-black uppercase truncate">
                                        {field.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="animate-spin text-[#1E40AF]" size={32} />
                            <span className="ml-3 text-sm font-bold text-slate-600">Loading users...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <XCircle className="text-rose-500" size={48} />
                            <p className="mt-3 text-sm font-bold text-slate-600">{error}</p>
                            <button 
                                onClick={fetchUsers}
                                className="mt-4 px-6 py-2 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm font-bold text-slate-600">No users found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-50/50 border-b border-blue-100">
                                    {visibleFields.map((field) => (
                                        <th 
                                            key={field.key} 
                                            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1E40AF] ${
                                                field.type === 'actions' ? 'text-right' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {field.label}
                                                {field.sortable && (
                                                    <button className="opacity-50 hover:opacity-100 transition-opacity">
                                                        <GripVertical size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50 transition-colors group border-b border-slate-100">
                                        {visibleFields.map((field) => (
                                            <td 
                                                key={`${user.id}-${field.key}`} 
                                                className={`px-6 py-4 ${field.type === 'actions' ? 'text-right' : ''}`}
                                            >
                                                {renderCellContent(field, user)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-blue-100 flex items-center justify-between text-xs font-bold text-slate-600 bg-blue-50/30">
                    <p className="uppercase tracking-widest">
                        Showing {users.length > 0 ? ((currentPage - 1) * perPage) + 1 : 0} - {Math.min(currentPage * perPage, totalUsers)} of {totalUsers.toLocaleString()} users
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="px-4 py-2 rounded-lg border border-blue-200 hover:bg-white hover:text-[#1E40AF] disabled:opacity-50 transition-colors font-black" 
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </button>
                        <span className="px-3 py-2 text-xs font-black text-[#1E40AF]">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-4 py-2 rounded-lg border border-blue-200 hover:bg-white hover:text-[#1E40AF] disabled:opacity-50 transition-colors font-black"
                            disabled={currentPage === totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
