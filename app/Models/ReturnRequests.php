<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReturnRequests extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'order_number',
        'reason',
        'status',
        'preferred_resolution',
        'return_tracking_number',
        'refund_amount',
        'refund_method',
        'gateway_refund_id',
        'payment_id'
    ];
}
