<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlayerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PlayerProfileController extends Controller
{
    /**
     * Get authenticated user's player profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $profile = $user->playerProfile;

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => $profile,
                'completion_percentage' => $profile->getCompletionPercentage(),
                'is_complete' => $profile->isComplete(),
            ]
        ], 200);
    }

    /**
     * Create or update player profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validation rules
        $validator = Validator::make($request->all(), [
            // Basic Information
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'location_city' => ['nullable', 'string', 'max:255'],
            
            // Playing Profile
            'skill_level' => ['nullable', 'in:beginner,intermediate,advanced,professional'],
            'years_playing' => ['nullable', 'integer', 'min:0', 'max:100'],
            'play_frequency' => ['nullable', 'in:casual,regular_1_2,frequent_3_4,competitive'],
            'primary_position' => ['nullable', 'in:none_mix,dinking_net,aggressive_baseline,both'],
            
            // Experience & Achievements
            'tournament_participation' => ['nullable', 'in:never,local,regional,national'],
            'certifications' => ['nullable', 'string'],
            'tournament_results' => ['nullable', 'string'],
            'achievements' => ['nullable', 'string'],
            
            // Preferred Play Style
            'preferred_court_type' => ['nullable', 'in:indoor,outdoor,either'],
            'preferred_match_format' => ['nullable', 'in:singles,doubles,both'],
            'availability_days' => ['nullable', 'array'],
            'availability_days.*' => ['string', 'in:weekdays,weekends,flexible'],
            'preferred_time_slots' => ['nullable', 'array'],
            'preferred_time_slots.*' => ['string', 'in:morning,afternoon,evening,night'],
            
            // Profile Details
            'bio' => ['nullable', 'string', 'max:1000'],
            'favorite_courts' => ['nullable', 'array'],
            'social_links' => ['nullable', 'array'],
            
            // Agreements
            'agree_code_of_conduct' => ['nullable', 'boolean'],
            'agree_community_guidelines' => ['nullable', 'boolean'],
            'agree_ranking_rules' => ['nullable', 'boolean'],
            'agree_fair_play' => ['nullable', 'boolean'],
            
            // Optional
            'team_club_affiliation' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'medical_conditions' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get or create profile
            $profile = $user->playerProfile ?? $user->playerProfile()->create([
                'profile_status' => 'incomplete'
            ]);

            // Update profile
            $profile->update($request->only([
                'date_of_birth',
                'location_city',
                'skill_level',
                'years_playing',
                'play_frequency',
                'primary_position',
                'tournament_participation',
                'certifications',
                'tournament_results',
                'achievements',
                'preferred_court_type',
                'preferred_match_format',
                'availability_days',
                'preferred_time_slots',
                'bio',
                'favorite_courts',
                'social_links',
                'agree_code_of_conduct',
                'agree_community_guidelines',
                'agree_ranking_rules',
                'agree_fair_play',
                'team_club_affiliation',
                'emergency_contact_name',
                'emergency_contact_phone',
                'medical_conditions',
            ]));

            // Check if profile should be marked as complete
            $profile->markAsComplete();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'profile' => $profile->fresh(),
                    'completion_percentage' => $profile->getCompletionPercentage(),
                    'is_complete' => $profile->isComplete(),
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
     * Upload profile photo
     */
    public function uploadPhoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $profile = $user->playerProfile ?? $user->playerProfile()->create([
                'profile_status' => 'incomplete'
            ]);

            // Delete old photo if exists
            if ($profile->profile_photo) {
                Storage::disk('public')->delete($profile->profile_photo);
            }

            // Store new photo
            $path = $request->file('photo')->store('profile-photos', 'public');

            // Update profile
            $profile->update(['profile_photo' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Photo uploaded successfully',
                'data' => [
                    'photo_url' => Storage::url($path),
                    'photo_path' => $path
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
     * Get profile completion status
     */
    public function getCompletion(Request $request)
    {
        $user = $request->user();
        $profile = $user->playerProfile;

        if (!$profile) {
            return response()->json([
                'success' => true,
                'data' => [
                    'completion_percentage' => 0,
                    'profile_status' => 'incomplete',
                    'has_profile' => false,
                    'missing_required_fields' => [
                        'date_of_birth',
                        'location_city',
                        'skill_level',
                        'play_frequency',
                        'all_agreements'
                    ]
                ]
            ], 200);
        }

        $missingRequired = [];
        if (!$profile->date_of_birth) $missingRequired[] = 'date_of_birth';
        if (!$profile->location_city) $missingRequired[] = 'location_city';
        if (!$profile->skill_level) $missingRequired[] = 'skill_level';
        if (!$profile->play_frequency) $missingRequired[] = 'play_frequency';
        if (!$profile->hasAcceptedAllAgreements()) $missingRequired[] = 'all_agreements';

        $missingOptional = [];
        if (!$profile->years_playing) $missingOptional[] = 'years_playing';
        if (!$profile->bio) $missingOptional[] = 'bio';
        if (!$profile->profile_photo) $missingOptional[] = 'profile_photo';

        return response()->json([
            'success' => true,
            'data' => [
                'completion_percentage' => $profile->getCompletionPercentage(),
                'profile_status' => $profile->profile_status,
                'has_profile' => true,
                'is_complete' => $profile->isComplete(),
                'missing_required_fields' => $missingRequired,
                'missing_optional_fields' => $missingOptional,
            ]
        ], 200);
    }

    /**
     * Delete player profile
     */
    public function deleteProfile(Request $request)
    {
        $user = $request->user();
        $profile = $user->playerProfile;

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        try {
            // Delete profile photo if exists
            if ($profile->profile_photo) {
                Storage::disk('public')->delete($profile->profile_photo);
            }

            $profile->delete();

            return response()->json([
                'success' => true,
                'message' => 'Profile deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Profile deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
