<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
        use HasFactory;
protected $fillable = [
        'name',
        'description',
        'sku',
        'barcode',
        'cost_price',
        'sale_price',
        'stock_quantity',
        'weight_grams',
        'supplier_id',
        'supplier_product_url',
        'main_image_url',
        'additional_images',
        'status',
    ];
}
