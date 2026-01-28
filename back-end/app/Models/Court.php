<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Court extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'type',
        'surface',
        'address',
        'city',
        'state_province',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'number_of_courts',
        'amenities',
        'hours_of_operation',
        'is_free',
        'price_per_hour',
        'peak_hour_price',
        'pricing_details',
        'phone_number',
        'email',
        'website',
        'requires_booking',
        'booking_url',
        'images',
        'cover_image',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'rating',
        'total_reviews',
        'total_bookings',
        'view_count',
        'is_featured',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amenities' => 'array',
        'hours_of_operation' => 'array',
        'pricing_details' => 'array',
        'images' => 'array',
        'is_free' => 'boolean',
        'requires_booking' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'approved_at' => 'datetime',
        'price_per_hour' => 'decimal:2',
        'peak_hour_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    /**
     * Get the owner of the court.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the admin who approved the court.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope a query to only include pending courts.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved courts.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include active courts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured courts.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Approve the court.
     */
    public function approve($adminId)
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $adminId,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);
    }

    /**
     * Reject the court.
     */
    public function reject($reason = null)
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_by' => null,
            'approved_at' => null,
        ]);
    }

    /**
     * Suspend the court.
     */
    public function suspend($reason = null)
    {
        $this->update([
            'status' => 'suspended',
            'rejection_reason' => $reason,
            'is_active' => false,
        ]);
    }

    /**
     * Increment view count.
     */
    public function incrementViews()
    {
        $this->increment('view_count');
    }
}
