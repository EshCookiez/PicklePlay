<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuthenticationLog;
use App\Mail\VerifyEmail;
use App\Mail\ResetPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', 'in:user,coach,admin,super_admin,court_owner'],
            'phone_number' => ['nullable', 'string', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'phone_number' => $request->phone_number,
                'status' => 'active',
            ]);

            // Create API token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Log registration
            AuthenticationLog::log(
                action: 'register',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'full_name' => $user->full_name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'phone_number' => $user->phone_number,
                        'status' => $user->status,
                        'created_at' => $user->created_at,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user
        $user = User::where('email', $request->email)->first();

        // Check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            // Log failed login attempt
            AuthenticationLog::log(
                action: 'failed_login',
                userId: $user?->id,
                email: $request->email,
                status: 'failed',
                details: 'Invalid credentials'
            );

            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Check if user is active
        if ($user->status !== 'active') {
            // Log failed login attempt (inactive account)
            AuthenticationLog::log(
                action: 'failed_login',
                userId: $user->id,
                email: $user->email,
                status: 'failed',
                details: 'Account is not active'
            );

            return response()->json([
                'success' => false,
                'message' => 'Account is not active'
            ], 403);
        }

        // Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Log successful login
        AuthenticationLog::log(
            action: 'login',
            userId: $user->id,
            email: $user->email,
            status: 'success'
        );

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone_number' => $user->phone_number,
                    'status' => $user->status,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        // Log logout
        AuthenticationLog::log(
            action: 'logout',
            userId: $user->id,
            email: $user->email,
            status: 'success'
        );

        // Revoke current token
        $user->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone_number' => $user->phone_number,
                    'profile_picture' => $user->profile_picture,
                    'status' => $user->status,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]
        ], 200);
    }

    /**
     * Update authenticated user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validate request
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update user
            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_number' => $request->phone_number,
            ]);

            // Log profile update
            AuthenticationLog::log(
                action: 'profile_update',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'full_name' => $user->full_name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'phone_number' => $user->phone_number,
                        'profile_picture' => $user->profile_picture,
                        'status' => $user->status,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Profile update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update authenticated user password
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        // Validate request
        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', Password::min(8), 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 401);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            // Log password change
            AuthenticationLog::log(
                action: 'password_change',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete authenticated user account
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        try {
            // Log account deletion before deleting
            AuthenticationLog::log(
                action: 'account_delete',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            // Revoke all tokens
            $user->tokens()->delete();
            
            // Delete user account
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Account deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Account deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send email verification link
     */
    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();

        // Check if already verified
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified'
            ], 400);
        }

        try {
            // Generate verification URL with signature
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $user->id, 'hash' => sha1($user->email)]
            );

            // Send email
            Mail::to($user->email)->send(new VerifyEmail($verificationUrl, $user->full_name));

            // Log email verification sent
            AuthenticationLog::log(
                action: 'email_verification_sent',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'Verification email sent successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        // Find user
        $user = User::findOrFail($id);

        // Verify hash matches
        if (!hash_equals($hash, sha1($user->email))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link'
            ], 400);
        }

        // Check if already verified
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified'
            ], 400);
        }

        // Mark as verified
        $user->email_verified_at = now();
        $user->save();

        // Log email verification
        AuthenticationLog::log(
            action: 'email_verified',
            userId: $user->id,
            email: $user->email,
            status: 'success'
        );

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully'
        ], 200);
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if email exists for security
            return response()->json([
                'success' => true,
                'message' => 'If that email exists, a password reset link has been sent'
            ], 200);
        }

        try {
            // Generate token
            $token = Str::random(64);

            // Delete old tokens
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            // Create new token
            DB::table('password_reset_tokens')->insert([
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now()
            ]);

            // Generate reset URL
            $resetUrl = config('app.frontend_url', 'http://localhost:3000') 
                . '/reset-password?token=' . $token 
                . '&email=' . urlencode($request->email);

            // Send email
            Mail::to($user->email)->send(new ResetPassword($resetUrl, $user->full_name));

            // Log password reset request
            AuthenticationLog::log(
                action: 'password_reset_request',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send password reset email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset password using token
     */
    public function resetPassword(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', Password::min(8), 'confirmed']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Find token record
            $tokenRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$tokenRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token'
                ], 400);
            }

            // Check if token is expired (60 minutes)
            if (Carbon::parse($tokenRecord->created_at)->addMinutes(60)->isPast()) {
                DB::table('password_reset_tokens')
                    ->where('email', $request->email)
                    ->delete();

                return response()->json([
                    'success' => false,
                    'message' => 'Reset token has expired'
                ], 400);
            }

            // Verify token
            if (!Hash::check($request->token, $tokenRecord->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reset token'
                ], 400);
            }

            // Find user and update password
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->password = Hash::make($request->password);
            $user->save();

            // Delete token
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            // Revoke all tokens for security
            $user->tokens()->delete();

            // Log password reset completion
            AuthenticationLog::log(
                action: 'password_reset_complete',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password reset failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authentication logs for current user
     */
    public function getAuthLogs(Request $request)
    {
        $user = $request->user();

        // Get logs for current user
        $logs = AuthenticationLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'logs' => $logs
            ]
        ], 200);
    }

    /**
     * Get all authentication logs (Admin only)
     */
    public function getAllAuthLogs(Request $request)
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
        $perPage = $request->input('per_page', 50);
        $page = $request->input('page', 1);

        // Filter parameters
        $action = $request->input('action');
        $status = $request->input('status');
        $email = $request->input('email');
        $userId = $request->input('user_id');

        $query = AuthenticationLog::with('user');

        // Apply filters
        if ($action) {
            $query->where('action', $action);
        }
        if ($status) {
            $query->where('status', $status);
        }
        if ($email) {
            $query->where('email', 'like', "%{$email}%");
        }
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Get logs with pagination
        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'logs' => $logs->items(),
                'pagination' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ]
            ]
        ], 200);
    }
}
