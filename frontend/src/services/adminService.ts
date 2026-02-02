import { userService } from './userService'; // Use the new Supabase service
import { User as DBUser, UserRole, UserStatus } from '@/types/database';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
  last_login_at?: string;
  email_verified_at?: string;
  date_of_birth?: string;
  location?: string;
  bio?: string;
  skill_level?: string;
  play_frequency?: string;
  website_url?: string;
  avatar_url?: string;
  profile_picture_url?: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
      per_page: number;
    };
  };
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  new_users_this_month: number;
  user_growth: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
}

// User Management API Functions (Adapted to use Supabase)
export const adminService = {
  // Get all users with filters
  async getUsers(filters?: UserFilters): Promise<UsersResponse> {
    const page = filters?.page || 1;
    const limit = filters?.per_page || 10;
    
    const { data, total, totalPages } = await userService.getUsers({
      role: filters?.role as UserRole,
      status: filters?.status as UserStatus,
      search: filters?.search,
      page,
      limit
    });

    // Map DBUser to admin User interface
    const users: User[] = data.map(u => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`.trim(),
      email: u.email,
      role: u.role,
      status: u.status,
      phone: u.phone_number || undefined,
      created_at: u.created_at,
      updated_at: u.updated_at,
      email_verified_at: u.email_verified_at || undefined,
      last_login_at: u.last_login_at || undefined,
      date_of_birth: u.date_of_birth || undefined,
      location: u.location || undefined,
      bio: u.bio || undefined,
      skill_level: u.skill_level || undefined,
      play_frequency: u.play_frequency || undefined,
      website_url: u.website_url || undefined,
      avatar_url: u.avatar_url || undefined,
      profile_picture_url: u.profile_picture_url || undefined,
    }));

    return {
      success: true,
      data: {
        users,
        pagination: {
          current_page: page,
          last_page: totalPages,
          total,
          per_page: limit
        }
      }
    };
  },

  // Get user statistics (Real implementation)
  async getUserStatistics(): Promise<UserStatistics> {
    const { total: total_users } = await userService.getUsers({ limit: 1 });
    const { total: active_users } = await userService.getUsers({ status: 'active', limit: 1 });
    
    // For growth/new users we'd need date math, keeping simple for now
    return {
      total_users,
      active_users,
      new_users_this_month: 0, 
      user_growth: 0 
    };
  },

  // Get a specific user
  async getUser(id: string) {
    const user = await userService.getUser(id);
    return {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at
    };
  },

  // Create a new user - Not supported properly via Client check auth
  async createUser(userData: CreateUserData) {
    throw new Error("Create user not fully supported in client-side admin due to auth restrictions. Use Supabase Dashboard invite.");
  },

  // Update a user
  async updateUser(id: string, userData: UpdateUserData) {
    const [firstName, ...lastNameParts] = (userData.name || '').split(' ');
    const updates: any = {};
    if (userData.name) {
      updates.first_name = firstName;
      updates.last_name = lastNameParts.join(' ');
    }
    if (userData.role) updates.role = userData.role as UserRole;
    if (userData.status) updates.status = userData.status as UserStatus;
    
    return userService.updateUser(id, updates);
  },

  // Delete a user
  async deleteUser(id: string) {
    return userService.deleteUser(id);
  },

  // Update user role
  async updateUserRole(id: string, role: string) {
    return userService.updateUserRole(id, role as UserRole);
  },

  // Toggle user status (suspend/activate)
  async toggleUserStatus(id: string) {
    // We need to know current status first. For now, let's just assume we want to suspend if active
    const user = await userService.getUser(id);
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    return userService.updateUserStatus(id, newStatus);
  },
};

export default adminService;
