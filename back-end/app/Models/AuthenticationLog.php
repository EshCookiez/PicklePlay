<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuthenticationLog extends Model
{
    const UPDATED_AT = null; // No updated_at column

    protected $fillable = [
        'user_id',
        'email',
        'action',
        'ip_address',
        'user_agent',
        'status',
        'details',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that owns the log
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log an authentication action
     */
    public static function log(
        string $action,
        ?int $userId = null,
        ?string $email = null,
        string $status = 'success',
        ?string $details = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'email' => $email,
            'action' => $action,
            'status' => $status,
            'details' => $details,
            'ip_address' => $ipAddress ?? request()->ip(),
            'user_agent' => $userAgent ?? request()->userAgent(),
        ]);
    }
}
