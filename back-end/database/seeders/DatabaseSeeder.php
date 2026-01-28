<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Super Admin Account (Full Access)
        User::factory()->create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@pickleplay.ph',
            'password' => bcrypt('password123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        // Default Admin Account (Restricted Access)
        User::factory()->create([
            'first_name' => 'Staff',
            'last_name' => 'Admin',
            'email' => 'admin@pickleplay.ph',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Regular Test User
        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'status' => 'active',
        ]);
    }
}
