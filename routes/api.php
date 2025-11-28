<?php

use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Orders\OrderController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Suppliers\SupplierController;
use App\Http\Controllers\Notes\InternalNotesController;
use App\Http\Controllers\Returns\ReturnController;

// custom search routes first
Route::get('/orders/search', [OrderController::class, 'search']);
Route::get('/customers/search', [CustomerController::class, 'search']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/returns/search', [ReturnController::class, 'search']);

// then your apiResource routes
Route::apiResource('orders', OrderController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('returns', ReturnController::class);
Route::get('/customer-prev-orders/{customerId}', [OrderController::class, 'findPrevCustomerOrders']);
Route::apiResource('notes', InternalNotesController::class);

// custom extra notes endpoint
Route::get('notes/order/{orderId}', [InternalNotesController::class, 'findTicketNotes']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
