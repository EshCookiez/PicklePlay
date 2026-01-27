<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * User role constants
     */
    const ROLE_USER = 'user';
    const ROLE_COACH = 'coach';
    const ROLE_ADMIN = 'admin';
    const ROLE_SUPER_ADMIN = 'super_admin';
    const ROLE_COURT_OWNER = 'court_owner';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'phone_number',
        'profile_picture',
        'status',
        'date_of_birth',
        'location',
        'phone_verified_at',
        'email_verification_token',
        'email_verification_token_expires_at',
        'last_login_at',
        'last_password_change_at',
        'login_count',
        'last_ip_address',
        'stripe_customer_id',
        'wallet_balance',
        'total_spent',
        'total_earnings',
        'two_factor_enabled',
        'two_factor_method',
        'two_factor_backup_codes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verification_token',
        'two_factor_backup_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'email_verification_token_expires_at' => 'datetime',
            'last_login_at' => 'datetime',
            'last_password_change_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'two_factor_enabled' => 'boolean',
            'wallet_balance' => 'decimal:2',
            'total_spent' => 'decimal:2',
            'total_earnings' => 'decimal:2',
            'login_count' => 'integer',
        ];
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is a customer
     */
    public function isUser(): bool
    {
        return $this->hasRole(self::ROLE_USER);
    }

    /**
     * Check if user is a coach
     */
    public function isCoach(): bool
    {
        return $this->hasRole(self::ROLE_COACH);
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    /**
     * Check if user is a super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole(self::ROLE_SUPER_ADMIN);
    }

    /**
     * Check if user is a court owner
     */
    public function isCourtOwner(): bool
    {
        return $this->hasRole(self::ROLE_COURT_OWNER);
    }

    /**
     * Check if user has admin privileges
     */
    public function hasAdminPrivileges(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN]);
    }

    /**
     * Get user's full name
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the player profile associated with the user
     */
    public function playerProfile()
    {
        return $this->hasOne(PlayerProfile::class);
    }

    /**
     * Get or create player profile
     */
    public function getOrCreatePlayerProfile()
    {
        if (!$this->playerProfile) {
            return $this->playerProfile()->create([
                'profile_status' => 'incomplete'
            ]);
        }
        return $this->playerProfile;
    }

    /**
     * Get the user profile associated with the user
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the user preferences associated with the user
     */
    public function preferences()
    {
        return $this->hasOne(UserPreference::class);
    }

    /**
     * Get the user statistics associated with the user
     */
    public function statistics()
    {
        return $this->hasOne(UserStatistic::class);
    }

    /**
     * Get or create user profile
     */
    public function getOrCreateProfile()
    {
        if (!$this->profile) {
            return $this->profile()->create([]);
        }
        return $this->profile;
    }

    /**
     * Get or create user preferences
     */
    public function getOrCreatePreferences()
    {
        if (!$this->preferences) {
            return $this->preferences()->create([]);
        }
        return $this->preferences;
    }

    /**
     * Get or create user statistics
     */
    public function getOrCreateStatistics()
    {
        if (!$this->statistics) {
            return $this->statistics()->create([]);
        }
        return $this->statistics;
    }

    /**
     * Check if user is 18 years or older
     */
    public function isAdult(): bool
    {
        if (!$this->date_of_birth) {
            return false;
        }
        return $this->date_of_birth->age >= 18;
    }

    /**
     * Update last login information
     */
    public function updateLastLogin(?string $ipAddress = null): void
    {
        $this->update([
            'last_login_at' => now(),
            'login_count' => $this->login_count + 1,
            'last_ip_address' => $ipAddress ?? request()->ip(),
        ]);
    }
}
