<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InternalNotes extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_at',
        'order_id',
        'customer_id',
        'note',
        'attachment_url',
        'is_private',
        'pinned',
        'note_type',
    ];
}
