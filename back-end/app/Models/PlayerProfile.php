<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerProfile extends Model
{
    protected $fillable = [
        'user_id',
        // Basic Information
        'date_of_birth',
        'location_city',
        // Playing Profile
        'skill_level',
        'years_playing',
        'play_frequency',
        'primary_position',
        // Experience & Achievements
        'tournament_participation',
        'certifications',
        'tournament_results',
        'achievements',
        // Preferred Play Style
        'preferred_court_type',
        'preferred_match_format',
        'availability_days',
        'preferred_time_slots',
        // Profile Details
        'profile_photo',
        'bio',
        'favorite_courts',
        'social_links',
        // Agreements
        'agree_code_of_conduct',
        'agree_community_guidelines',
        'agree_ranking_rules',
        'agree_fair_play',
        // Optional
        'team_club_affiliation',
        'emergency_contact_name',
        'emergency_contact_phone',
        'medical_conditions',
        // Status
        'profile_status',
        'completed_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'years_playing' => 'integer',
        'availability_days' => 'array',
        'preferred_time_slots' => 'array',
        'favorite_courts' => 'array',
        'social_links' => 'json',
        'agree_code_of_conduct' => 'boolean',
        'agree_community_guidelines' => 'boolean',
        'agree_ranking_rules' => 'boolean',
        'agree_fair_play' => 'boolean',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if profile is complete
     */
    public function isComplete(): bool
    {
        return $this->profile_status === 'complete' || $this->profile_status === 'verified';
    }

    /**
     * Check if all agreements are accepted
     */
    public function hasAcceptedAllAgreements(): bool
    {
        return $this->agree_code_of_conduct
            && $this->agree_community_guidelines
            && $this->agree_ranking_rules
            && $this->agree_fair_play;
    }

    /**
     * Mark profile as complete
     */
    public function markAsComplete(): void
    {
        if ($this->hasAcceptedAllAgreements() && $this->hasRequiredFields()) {
            $this->update([
                'profile_status' => 'complete',
                'completed_at' => now(),
            ]);
        }
    }

    /**
     * Check if profile has required fields
     */
    public function hasRequiredFields(): bool
    {
        return !empty($this->date_of_birth)
            && !empty($this->location_city)
            && !empty($this->skill_level)
            && !empty($this->play_frequency);
    }

    /**
     * Get completion percentage
     */
    public function getCompletionPercentage(): int
    {
        $fields = [
            'date_of_birth',
            'location_city',
            'skill_level',
            'years_playing',
            'play_frequency',
            'primary_position',
            'tournament_participation',
            'preferred_court_type',
            'preferred_match_format',
            'bio',
        ];

        $filledFields = 0;
        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $filledFields++;
            }
        }

        $agreementFields = 4; // Number of agreement fields
        $filledAgreements = 0;
        if ($this->agree_code_of_conduct) $filledAgreements++;
        if ($this->agree_community_guidelines) $filledAgreements++;
        if ($this->agree_ranking_rules) $filledAgreements++;
        if ($this->agree_fair_play) $filledAgreements++;

        $totalFields = count($fields) + $agreementFields;
        $totalFilled = $filledFields + $filledAgreements;

        return (int) (($totalFilled / $totalFields) * 100);
    }
}
