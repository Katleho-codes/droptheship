<?php

namespace Database\Factories;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;
    public function definition(): array
    {
        // Random creation date in the last 365 days
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now');
        $updatedAt = $this->faker->dateTimeBetween($createdAt, 'now');
        // First decide cost price
        $costPrice = $this->faker->randomFloat(2, 10, 500);
        // Sale price is cost price + profit margin (10%–100%)
        $salePrice = round($costPrice * $this->faker->randomFloat(2, 1.1, 2.0), 2);
        return [
            'name' => $this->faker->words(3, true), // e.g. "Wireless Bluetooth Speaker"
            'description' => $this->faker->paragraph(),
            'sku' => strtoupper($this->faker->unique()->bothify('SKU-#####')),
            'barcode' => $this->faker->optional()->ean13(),
            'cost_price' => $costPrice,
            'sale_price' => $salePrice,
            'stock_quantity' => $this->faker->numberBetween(0, 500),
            'weight_grams' => $this->faker->optional()->numberBetween(100, 10000), // 100g – 10kg
            'main_image_url' => $this->faker->imageUrl(640, 480, 'products', true),
            'additional_images' => json_encode([
                $this->faker->imageUrl(640, 480, 'products', true),
                $this->faker->imageUrl(640, 480, 'products', true)
            ]),
            'status' => $this->faker->randomElement(['active', 'inactive', 'archived']),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ];
    }
}
