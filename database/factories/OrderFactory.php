<?php

namespace Database\Factories;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        // Random creation date in the last 365 days
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now');
        // Random update date between creation and now
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now');
        return [
           'user_id' => Customer::inRandomOrder()->first()->id ?? Customer::factory(),
        'product_id' => Product::inRandomOrder()->first()->id ?? Product::factory(),
            'status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'cancelled']),
            'total_amount' => $this->faker->randomFloat(2, 50, 5000), // 50 to 5000 currency units
            'quantity' => $this->faker->numberBetween(0, 100),
            'discount' => $this->faker->numberBetween(0, 100),
            'shipping_cost' => $this->faker->randomFloat(2, 50, 5000),
            'color' => $this->faker->safeColorName(),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'ZAR']),
            'cancel_order' => $this->faker->boolean(),
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']),
            'payment_status' => $this->faker->randomElement(['paid', 'unpaid', 'refunded']),
            'address' => $this->faker->streetAddress(),
            // 'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'postal_code' => $this->faker->postcode(),
            'country' => $this->faker->country() ?: 'South Africa',
            'notes' => $this->faker->optional()->sentence(),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
            'order_number' => 'ORD-' . strtoupper($this->faker->unique()->regexify('[A-Z0-9]{8}'))

        ];
    }
}
