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
            // 2. PERSONAL INFORMATION (Extended)
            $table->date('date_of_birth')->nullable()->after('phone_number');
            $table->string('location')->nullable()->after('date_of_birth');
            
            // 6. VERIFICATION & STATUS (Extended)
            $table->timestamp('phone_verified_at')->nullable()->after('email_verified_at');
            $table->string('email_verification_token')->nullable()->after('phone_verified_at');
            $table->timestamp('email_verification_token_expires_at')->nullable()->after('email_verification_token');
            
            // 7. TIMESTAMPS & ACTIVITY
            $table->timestamp('last_login_at')->nullable()->after('updated_at');
            $table->timestamp('last_password_change_at')->nullable()->after('last_login_at');
            $table->integer('login_count')->default(0)->after('last_password_change_at');
            $table->string('last_ip_address', 45)->nullable()->after('login_count');
            
            // 10. PAYMENT & FINANCIAL
            $table->string('stripe_customer_id')->nullable()->after('last_ip_address');
            $table->decimal('wallet_balance', 10, 2)->default(0)->after('stripe_customer_id');
            $table->decimal('total_spent', 10, 2)->default(0)->after('wallet_balance');
            $table->decimal('total_earnings', 10, 2)->default(0)->after('total_spent');
            
            // 11. SECURITY
            $table->boolean('two_factor_enabled')->default(false)->after('total_earnings');
            $table->enum('two_factor_method', ['sms', 'email', 'authenticator'])->nullable()->after('two_factor_enabled');
            $table->text('two_factor_backup_codes')->nullable()->after('two_factor_method');
            
            // Add indexes for performance
            $table->index('date_of_birth');
            $table->index('location');
            $table->index('last_login_at');
            $table->index('stripe_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['date_of_birth']);
            $table->dropIndex(['location']);
            $table->dropIndex(['last_login_at']);
            $table->dropIndex(['stripe_customer_id']);
            
            $table->dropColumn([
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
            ]);
        });
    }
};
