<?php

use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Orders\OrderController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Suppliers\SupplierController;

// custom search routes first
Route::get('/orders/search', [OrderController::class, 'search']);
Route::get('/customers/search', [CustomerController::class, 'search']);

// then your apiResource routes
Route::apiResource('orders', OrderController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('customers', CustomerController::class);


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
