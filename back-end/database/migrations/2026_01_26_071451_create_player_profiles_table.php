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
        Schema::create('player_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // 1. BASIC INFORMATION
            $table->date('date_of_birth')->nullable();
            $table->string('location_city')->nullable();
            
            // 2. PLAYING PROFILE
            $table->enum('skill_level', ['beginner', 'intermediate', 'advanced', 'professional'])->nullable();
            $table->integer('years_playing')->nullable();
            $table->enum('play_frequency', ['casual', 'regular_1_2', 'frequent_3_4', 'competitive'])->nullable();
            $table->enum('primary_position', ['none_mix', 'dinking_net', 'aggressive_baseline', 'both'])->nullable();
            
            // 3. EXPERIENCE & ACHIEVEMENTS
            $table->enum('tournament_participation', ['never', 'local', 'regional', 'national'])->nullable();
            $table->text('certifications')->nullable();
            $table->text('tournament_results')->nullable();
            $table->text('achievements')->nullable();
            
            // 4. PREFERRED PLAY STYLE
            $table->enum('preferred_court_type', ['indoor', 'outdoor', 'either'])->nullable();
            $table->enum('preferred_match_format', ['singles', 'doubles', 'both'])->nullable();
            $table->json('availability_days')->nullable(); // ['weekdays', 'weekends', 'flexible']
            $table->json('preferred_time_slots')->nullable(); // ['morning', 'afternoon', 'evening']
            
            // 5. PROFILE DETAILS
            $table->string('profile_photo')->nullable();
            $table->text('bio')->nullable();
            $table->json('favorite_courts')->nullable();
            $table->json('social_links')->nullable(); // {instagram, facebook, twitter, etc}
            
            // 6. AGREEMENTS
            $table->boolean('agree_code_of_conduct')->default(false);
            $table->boolean('agree_community_guidelines')->default(false);
            $table->boolean('agree_ranking_rules')->default(false);
            $table->boolean('agree_fair_play')->default(false);
            
            // OPTIONAL FIELDS
            $table->string('team_club_affiliation')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->text('medical_conditions')->nullable();
            
            // Status
            $table->enum('profile_status', ['incomplete', 'complete', 'verified'])->default('incomplete');
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('skill_level');
            $table->index('location_city');
            $table->index('profile_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_profiles');
    }
};
