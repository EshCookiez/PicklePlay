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
        Schema::create('courts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            
            // Basic Information
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['indoor', 'outdoor', 'both'])->default('outdoor');
            $table->enum('surface', ['concrete', 'asphalt', 'sport_court', 'wood', 'other'])->default('concrete');
            
            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state_province')->nullable();
            $table->string('country')->default('Philippines');
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            
            // Court Details
            $table->integer('number_of_courts')->default(1);
            $table->json('amenities')->nullable(); // ['parking', 'restrooms', 'lighting', 'water', 'seating']
            $table->json('hours_of_operation')->nullable(); // {monday: {open: '06:00', close: '22:00'}}
            
            // Pricing
            $table->boolean('is_free')->default(false);
            $table->decimal('price_per_hour', 10, 2)->nullable();
            $table->decimal('peak_hour_price', 10, 2)->nullable();
            $table->json('pricing_details')->nullable();
            
            // Contact & Booking
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->boolean('requires_booking')->default(false);
            $table->string('booking_url')->nullable();
            
            // Media
            $table->json('images')->nullable();
            $table->string('cover_image')->nullable();
            
            // Verification & Moderation
            $table->enum('status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            
            // Ratings & Stats
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_bookings')->default(0);
            $table->integer('view_count')->default(0);
            
            // Features
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('owner_id');
            $table->index('status');
            $table->index('city');
            $table->index('type');
            $table->index(['latitude', 'longitude']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courts');
    }
};
