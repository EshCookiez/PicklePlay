<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'preferred_language',
        'timezone',
        'privacy_level',
        'email_booking_confirmations',
        'email_lesson_reminders',
        'email_marketing',
        'email_frequency',
        'push_notifications_enabled',
        'sms_notifications_enabled',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_booking_confirmations' => 'boolean',
        'email_lesson_reminders' => 'boolean',
        'email_marketing' => 'boolean',
        'push_notifications_enabled' => 'boolean',
        'sms_notifications_enabled' => 'boolean',
    ];

    /**
     * Get the user that owns the preferences.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
