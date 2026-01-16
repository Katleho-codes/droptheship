<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 random users
        $customers = Customer::factory(10)->create();

        Order::factory(10)->create([
            'user_id' => $customers->random()->id,
            'product_id' => Product::factory(100)->create()->random()->id,
        ]);
    }
}
