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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // 5. PREFERENCES & SETTINGS
            $table->string('preferred_language')->default('en'); // en, es, fr, etc.
            $table->string('timezone')->default('UTC');
            $table->enum('privacy_level', ['public', 'private', 'friends_only'])->default('public');
            
            // Email Notifications
            $table->boolean('email_booking_confirmations')->default(true);
            $table->boolean('email_lesson_reminders')->default(true);
            $table->boolean('email_marketing')->default(false);
            $table->enum('email_frequency', ['immediate', 'daily', 'weekly'])->default('immediate');
            
            // Push Notifications
            $table->boolean('push_notifications_enabled')->default(true);
            
            // SMS Notifications
            $table->boolean('sms_notifications_enabled')->default(false);
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
