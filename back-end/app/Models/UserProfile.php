<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'profile_photo',
        'bio',
        'gender',
        'cover_photo',
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
        'certifications',
        'billing_street_address',
        'billing_city',
        'billing_state_province',
        'billing_country',
        'billing_postal_code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'certifications' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'years_in_sport' => 'integer',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get full address
     */
    public function getFullAddressAttribute(): ?string
    {
        $parts = array_filter([
            $this->street_address,
            $this->city,
            $this->state_province,
            $this->country,
            $this->postal_code,
        ]);

        return !empty($parts) ? implode(', ', $parts) : null;
    }

    /**
     * Get full billing address
     */
    public function getFullBillingAddressAttribute(): ?string
    {
        $parts = array_filter([
            $this->billing_street_address,
            $this->billing_city,
            $this->billing_state_province,
            $this->billing_country,
            $this->billing_postal_code,
        ]);

        return !empty($parts) ? implode(', ', $parts) : null;
    }
}
