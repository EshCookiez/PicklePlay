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
        Schema::table('users', function (Blueprint $table) {
            // Add indexes for faster queries
            $table->index('role');
            $table->index('email_verified_at');
            $table->index('created_at');
            $table->index(['role', 'email_verified_at']); // Composite index for filtering
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['email_verified_at']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['role', 'email_verified_at']);
        });
    }
};
