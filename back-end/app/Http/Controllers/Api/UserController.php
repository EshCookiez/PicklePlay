<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Get all users (Admin only)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Check if user is admin
        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        // Get pagination parameters
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');

        // Optimized query - only select needed fields, no eager loading
        $query = User::select([
            'id',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'role',
            'email_verified_at',
            'created_at',
            'updated_at',
            'location'
        ]);

        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if ($role) {
            $query->where('role', $role);
        }

        // Apply status filter (active/suspended based on email verification and other factors)
        if ($status === 'active') {
            $query->whereNotNull('email_verified_at');
        } elseif ($status === 'pending') {
            $query->whereNull('email_verified_at');
        }

        // Get users with pagination
        $users = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Transform users data
        $transformedUsers = $users->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->first_name . ' ' . $u->last_name,
                'email' => $u->email,
                'phone' => $u->phone_number,
                'role' => ucwords(str_replace('_', ' ', $u->role)),
                'status' => $u->email_verified_at ? 'Active' : 'Pending',
                'joined' => $u->created_at->format('M d, Y'),
                'lastActive' => $u->updated_at->diffForHumans(),
                'avatar' => $u->profile_photo_path ?? null,
                'email_verified' => $u->email_verified_at !== null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $transformedUsers,
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                    'last_page' => $users->lastPage(),
                ]
            ]
        ], 200);
    }

    /**
     * Get user statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $stats = [
            'total_users' => User::count(),
            'active_users' => User::whereNotNull('email_verified_at')->count(),
            'pending_users' => User::whereNull('email_verified_at')->count(),
            'users_by_role' => [
                'customers' => User::where('role', 'customer')->count(),
                'coaches' => User::where('role', 'coach')->count(),
                'court_owners' => User::where('role', 'court_owner')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'super_admins' => User::where('role', 'super_admin')->count(),
            ],
            'recent_signups' => User::where('created_at', '>=', now()->subDays(7))->count(),
            'recent_logins' => User::where('updated_at', '>=', now()->subDays(1))->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ], 200);
    }

    /**
     * Get a specific user (Admin only)
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $targetUser = User::with(['profile', 'preferences', 'statistics'])->find($id);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $targetUser
            ]
        ], 200);
    }

    /**
     * Create a new user (Admin only)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::min(8)->mixedCase()->numbers()->symbols()],
            'role' => ['required', 'in:customer,coach,court_owner,admin,super_admin'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Only super_admin can create admin or super_admin users
            if (in_array($request->role, ['admin', 'super_admin']) && $user->role !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only super admins can create admin users'
                ], 403);
            }

            $newUser = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'phone_number' => $request->phone_number,
                'location' => $request->location,
                'date_of_birth' => $request->date_of_birth,
                'email_verified_at' => now(), // Auto-verify admin-created accounts
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => [
                    'user' => $newUser
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a user (Admin only)
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'role' => ['sometimes', 'in:customer,coach,court_owner,admin,super_admin'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Prevent demoting or modifying super_admin unless you are super_admin
            if ($targetUser->role === 'super_admin' && $user->role !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only super admins can modify super admin accounts'
                ], 403);
            }

            // Only super_admin can assign admin or super_admin role
            if ($request->has('role') && in_array($request->role, ['admin', 'super_admin']) && $user->role !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only super admins can assign admin roles'
                ], 403);
            }

            $targetUser->update($request->only([
                'first_name',
                'last_name',
                'email',
                'role',
                'phone_number',
                'location',
                'date_of_birth'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => [
                    'user' => $targetUser->fresh()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a user (Admin only)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Prevent deleting super_admin unless you are super_admin
        if ($targetUser->role === 'super_admin' && $user->role !== 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only super admins can delete super admin accounts'
            ], 403);
        }

        // Prevent self-deletion
        if ($targetUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account through this endpoint'
            ], 403);
        }

        try {
            $targetUser->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user role (Admin only)
     */
    public function updateRole(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'role' => ['required', 'in:customer,coach,court_owner,admin,super_admin'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Only super_admin can assign admin or super_admin role
        if (in_array($request->role, ['admin', 'super_admin']) && $user->role !== 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only super admins can assign admin roles'
            ], 403);
        }

        try {
            $targetUser->role = $request->role;
            $targetUser->save();

            return response()->json([
                'success' => true,
                'message' => 'User role updated successfully',
                'data' => [
                    'user' => $targetUser->fresh()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suspend/Unsuspend user (Admin only)
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Prevent suspending super_admin unless you are super_admin
        if ($targetUser->role === 'super_admin' && $user->role !== 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only super admins can suspend super admin accounts'
            ], 403);
        }

        try {
            // Toggle email verification as suspension mechanism
            if ($targetUser->email_verified_at) {
                $targetUser->email_verified_at = null;
                $message = 'User suspended successfully';
            } else {
                $targetUser->email_verified_at = now();
                $message = 'User activated successfully';
            }
            $targetUser->save();

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'user' => $targetUser->fresh()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
