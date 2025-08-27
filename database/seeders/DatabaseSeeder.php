<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Supplier;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user
        User::factory()->create([
       'name' => Str::random(10),
            'email' => Str::random(10).'@example.com',
        ]);

        // Create 10 random users
        $users = User::factory(100)->create();

        // Create 50 products
        Product::factory(100)->create();
        // Create 50 products
        Supplier::factory(100)->create();

        // Create 20 orders linked to random users
        Order::factory(100)->create([
            'user_id' => $users->random()->id,
        ]);
    }
}
