<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InternalNotes>
 */
class InternalNotesFactory extends Factory
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
            'customer_id' => CustomerFactory::inRandomOrder()->first()->id,
            'order_id' => Order::inRandomOrder()->first()->id,
            'is_private' => $this->faker->boolean(),
            'pinned' => $this->faker->boolean(),
            'note' => $this->faker->sentence(),
            'attachment_url' => $this->faker->imageUrl(640, 480, 'products', true),
            'note_type' => $this->faker->randomElement(['email', 'note', 'followup', 'issue']), // for this dummy data we will assume every note is text, we will test the email later
        ];
    }
}
