<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Drop orphaned tables that were created by old migrations or manually
     * but are no longer used in the current application.
     */
    public function up(): void
    {
        // Drop role-based access control tables (not currently implemented)
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('role_applications');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
        
        // Drop security questions table (not currently implemented)
        Schema::dropIfExists('security_questions');
        
        // Drop payment tables (not currently implemented)
        Schema::dropIfExists('user_payment_methods');
        Schema::dropIfExists('user_payment_info');
    }

    /**
     * Reverse the migrations.
     * 
     * Recreate the tables if rollback is needed.
     * Note: This is a basic structure - adjust if you need to restore these tables.
     */
    public function down(): void
    {
        // Recreate permissions table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Recreate roles table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Recreate role_permissions table
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->foreignId('permission_id')->constrained('permissions')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['role_id', 'permission_id']);
        });

        // Recreate role_applications table
        Schema::create('role_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('reason')->nullable();
            $table->timestamp('applied_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Recreate user_roles table
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();
            $table->unique(['user_id', 'role_id']);
        });

        // Recreate security_questions table
        Schema::create('security_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('question');
            $table->string('answer_hash');
            $table->timestamps();
        });

        // Recreate user_payment_info table
        Schema::create('user_payment_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('stripe_customer_id')->nullable();
            $table->timestamps();
        });

        // Recreate user_payment_methods table
        Schema::create('user_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('payment_method_id');
            $table->string('type'); // card, bank_account, etc.
            $table->string('last4')->nullable();
            $table->string('brand')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }
};
