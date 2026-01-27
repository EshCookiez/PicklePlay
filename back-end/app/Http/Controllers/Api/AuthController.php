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
use Illuminate\Support\Facades\Storage;

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
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'date_of_birth' => ['required', 'date', 'before:-18 years'], // Must be 18+
            'phone_number' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create user with CUSTOMER role by default
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => User::ROLE_USER, // Always defaults to CUSTOMER role
                'phone_number' => $request->phone_number,
                'date_of_birth' => $request->date_of_birth,
                'location' => $request->location,
                'status' => 'active',
                'last_login_at' => now(),
                'login_count' => 1,
                'last_ip_address' => $request->ip(),
            ]);

            // Create related records
            $user->getOrCreateProfile();
            $user->getOrCreatePreferences();
            $user->getOrCreateStatistics();

            // Generate email verification token
            $verificationToken = Str::random(64);
            $user->update([
                'email_verification_token' => $verificationToken,
                'email_verification_token_expires_at' => now()->addHours(24),
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
                        'date_of_birth' => $user->date_of_birth,
                        'location' => $user->location,
                        'status' => $user->status,
                        'email_verified_at' => $user->email_verified_at,
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

        // Update last login information
        $user->updateLastLogin($request->ip());

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
                    'date_of_birth' => $user->date_of_birth,
                    'location' => $user->location,
                    'status' => $user->status,
                    'email_verified_at' => $user->email_verified_at,
                    'last_login_at' => $user->last_login_at,
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
        $user->load(['profile', 'preferences', 'statistics']);

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
                    'date_of_birth' => $user->date_of_birth,
                    'location' => $user->location,
                    'profile_picture' => $user->profile_picture,
                    'status' => $user->status,
                    'email_verified_at' => $user->email_verified_at,
                    'phone_verified_at' => $user->phone_verified_at,
                    'last_login_at' => $user->last_login_at,
                    'login_count' => $user->login_count,
                    'wallet_balance' => $user->wallet_balance,
                    'total_spent' => $user->total_spent,
                    'total_earnings' => $user->total_earnings,
                    'two_factor_enabled' => $user->two_factor_enabled,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'profile' => $user->profile,
                'preferences' => $user->preferences,
                'statistics' => $user->statistics,
            ]
        ], 200);
    }

    /**
     * Update authenticated user basic information
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validate request
        $validator = Validator::make($request->all(), [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['sometimes', 'date', 'before:-18 years'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update user basic info
            $user->update($request->only([
                'first_name',
                'last_name',
                'phone_number',
                'date_of_birth',
                'location',
            ]));

            // Log profile update
            AuthenticationLog::log(
                action: 'profile_update',
                userId: $user->id,
                email: $user->email,
                status: 'success'
            );

            $user->load(['profile', 'preferences', 'statistics']);

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
                        'date_of_birth' => $user->date_of_birth,
                        'location' => $user->location,
                        'profile_picture' => $user->profile_picture,
                        'status' => $user->status,
                        'email_verified_at' => $user->email_verified_at,
                        'phone_verified_at' => $user->phone_verified_at,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                    'profile' => $user->profile,
                    'preferences' => $user->preferences,
                    'statistics' => $user->statistics,
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
     * Update user extended profile
     */
    public function updateExtendedProfile(Request $request)
    {
        $user = $request->user();
        $profile = $user->getOrCreateProfile();

        // Validate request
        $validator = Validator::make($request->all(), [
            'bio' => ['nullable', 'string', 'max:500'],
            'gender' => ['nullable', 'in:male,female,non_binary,prefer_not_to_say'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state_province' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'title_occupation' => ['nullable', 'string', 'max:255'],
            'company_organization' => ['nullable', 'string', 'max:255'],
            'years_in_sport' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update profile
            $profile->update($request->only([
                'bio',
                'gender',
                'instagram_url',
                'linkedin_url',
                'twitter_url',
                'website_url',
                'street_address',
                'city',
                'state_province',
                'country',
                'postal_code',
                'latitude',
                'longitude',
                'title_occupation',
                'company_organization',
                'years_in_sport',
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Extended profile updated successfully',
                'data' => [
                    'profile' => $profile->fresh()
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Extended profile update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request)
    {
        $user = $request->user();
        $preferences = $user->getOrCreatePreferences();

        // Validate request
        $validator = Validator::make($request->all(), [
            'preferred_language' => ['sometimes', 'string', 'max:10'],
            'timezone' => ['sometimes', 'string', 'max:50'],
            'privacy_level' => ['sometimes', 'in:public,private,friends_only'],
            'email_booking_confirmations' => ['sometimes', 'boolean'],
            'email_lesson_reminders' => ['sometimes', 'boolean'],
            'email_marketing' => ['sometimes', 'boolean'],
            'email_frequency' => ['sometimes', 'in:immediate,daily,weekly'],
            'push_notifications_enabled' => ['sometimes', 'boolean'],
            'sms_notifications_enabled' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update preferences
            $preferences->update($request->only([
                'preferred_language',
                'timezone',
                'privacy_level',
                'email_booking_confirmations',
                'email_lesson_reminders',
                'email_marketing',
                'email_frequency',
                'push_notifications_enabled',
                'sms_notifications_enabled',
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Preferences updated successfully',
                'data' => [
                    'preferences' => $preferences->fresh()
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Preferences update failed',
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
            'new_password' => ['required', 'string', Password::min(8)->mixedCase()->numbers()->symbols(), 'confirmed'],
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
                'password' => Hash::make($request->new_password),
                'last_password_change_at' => now(),
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
     * Upload profile photo
     */
    public function uploadProfilePhoto(Request $request)
    {
        $user = $request->user();

        // Validate request
        $validator = Validator::make($request->all(), [
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'], // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old profile photo if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Store new photo
            $path = $request->file('photo')->store('profile-photos', 'public');

            // Update user
            $user->update([
                'profile_picture' => $path
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile photo uploaded successfully',
                'data' => [
                    'profile_picture' => $path,
                    'url' => Storage::disk('public')->url($path)
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Photo upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload cover photo
     */
    public function uploadCoverPhoto(Request $request)
    {
        $user = $request->user();
        $profile = $user->getOrCreateProfile();

        // Validate request
        $validator = Validator::make($request->all(), [
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'], // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old cover photo if exists
            if ($profile->cover_photo) {
                Storage::disk('public')->delete($profile->cover_photo);
            }

            // Store new photo
            $path = $request->file('photo')->store('cover-photos', 'public');

            // Update profile
            $profile->update([
                'cover_photo' => $path
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cover photo uploaded successfully',
                'data' => [
                    'cover_photo' => $path,
                    'url' => Storage::disk('public')->url($path)
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Photo upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
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
