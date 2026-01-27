<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStatistic extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'total_bookings_made',
        'total_lessons_taken',
        'total_lessons_given',
        'average_rating_received',
        'total_review_count',
        'tournament_participations',
        'tournament_wins',
        'current_ranking',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'total_bookings_made' => 'integer',
        'total_lessons_taken' => 'integer',
        'total_lessons_given' => 'integer',
        'average_rating_received' => 'decimal:2',
        'total_review_count' => 'integer',
        'tournament_participations' => 'integer',
        'tournament_wins' => 'integer',
        'current_ranking' => 'integer',
    ];

    /**
     * Get the user that owns the statistics.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Increment bookings count
     */
    public function incrementBookings(): void
    {
        $this->increment('total_bookings_made');
    }

    /**
     * Increment lessons taken count
     */
    public function incrementLessonsTaken(): void
    {
        $this->increment('total_lessons_taken');
    }

    /**
     * Increment lessons given count
     */
    public function incrementLessonsGiven(): void
    {
        $this->increment('total_lessons_given');
    }

    /**
     * Update average rating
     */
    public function updateAverageRating(float $newRating): void
    {
        $totalReviews = $this->total_review_count;
        $currentAverage = $this->average_rating_received;
        
        $newAverage = (($currentAverage * $totalReviews) + $newRating) / ($totalReviews + 1);
        
        $this->update([
            'average_rating_received' => round($newAverage, 2),
            'total_review_count' => $totalReviews + 1,
        ]);
    }
}
