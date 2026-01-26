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
        Schema::create('authentication_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('email')->nullable();
            $table->enum('action', [
                'register',
                'login',
                'logout',
                'password_change',
                'password_reset_request',
                'password_reset_complete',
                'email_verification_sent',
                'email_verified',
                'profile_update',
                'account_delete',
                'failed_login'
            ]);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->text('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('email');
            $table->index('action');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('authentication_logs');
    }
};
