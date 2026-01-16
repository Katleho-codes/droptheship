<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
        use HasFactory;
    use SoftDeletes;

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
