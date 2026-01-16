<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
        use HasFactory;
        protected $fillable = [
                'name',
                'description',
                'category',
                // 'slug',
                'sku',
                'barcode',
                'cost_price',
                'sale_price',
                'stock_quantity',
                'weight_grams',
                'supplier_id',
                'supplier_product_url',
                'main_image_url',
                'image_one',
                'image_two',
                'image_three',
                'status',
        ];

        protected static function boot()
        {
                parent::boot();

                static::creating(function ($product) {
                        $product->public_id = 'PID' . rand(10000000, 99999999);
                        $product->slug = Str::slug($product->name);
                });

                static::updating(function ($product) {
                        if ($product->isDirty('name')) {
                                $oldSlug = $product->getOriginal('slug');

                                // Save old slug
                                DB::table('product_slug_history')->insert([
                                        'product_id' => $product->id,
                                        'old_slug' => $oldSlug,
                                        'created_at' => now(),
                                        'updated_at' => now(),
                                ]);

                                $product->slug = Str::slug($product->name);
                        }
                });
        }


        protected static function generateUniqueSlug($name)
        {
                $slug = Str::slug($name);
                $count = static::where('slug', 'LIKE', "$slug%")->count();

                return $count ? "{$slug}-{$count}" : $slug;
        }
}
