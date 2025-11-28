<?php

namespace Database\Factories;

use App\Models\ReturnRequests;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ReturnRequestsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Random creation date in the last 365 days
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now');
        // Random update date between creation and now
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now');
        return [
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
            'customer_id' => Customer::inRandomOrder()->first()->id,
            'order_number' => Order::inRandomOrder()->first()->order_number,
            'reason' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['pending_review', 'awaiting_item', 'item_received', 'approved_for_refund', 'refunded', 'rejected']),
            'preferred_resolution' => $this->faker->randomElement(['refund', 'replacement']),
            'refund_amount' => $this->faker->randomFloat(2, 50, 5000), // 50 to 5000 currency units
            'refund_method' => 'EFT',
            'gateway_refund_id' =>  $this->faker->uuid(),
            'payment_id' =>  $this->faker->uuid(),
        ];
    }
}
