<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // 9. STATISTICAL DATA
            $table->integer('total_bookings_made')->default(0);
            $table->integer('total_lessons_taken')->default(0);
            $table->integer('total_lessons_given')->default(0); // For coaches
            $table->decimal('average_rating_received', 3, 2)->default(0); // Out of 5.00
            $table->integer('total_review_count')->default(0);
            $table->integer('tournament_participations')->default(0); // For players
            $table->integer('tournament_wins')->default(0); // For players
            $table->integer('current_ranking')->nullable(); // Player ranking number
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('average_rating_received');
            $table->index('current_ranking');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_statistics');
    }
};
