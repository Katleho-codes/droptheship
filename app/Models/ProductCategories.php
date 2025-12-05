<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ProductCategories extends Model
{

    use HasFactory;

    protected $fillable = [
        'category',
        'subcategory'
    ];
}
