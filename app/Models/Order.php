<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
        use HasFactory;

     protected $fillable = [
        'user_id',
        'product_id',
        'order_number',
        'status',
        'total_amount',
        'quantity',
        'discount',
        'shipping_cost',
        'color',
        'cancel_order',
        'currency',
        'payment_method',
        'payment_status',
        'address',
        'state',
        'postal_code',
        'country',
        'notes',
    ];
}
