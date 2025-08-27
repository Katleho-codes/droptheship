<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
        use HasFactory;

     protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'total_amount',
        'currency',
        'payment_method',
        'payment_status',
        'shipping_address_id',
        'billing_address_id',
        'notes',
    ];
}
