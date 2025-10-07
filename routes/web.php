<?php

use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Products\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Orders\OrderController;
use App\Http\Controllers\ImportController;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');


// we will use the dashboard as sorta like a 'home'
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    // products

    Route::prefix('products')->group(function () {
        Route::get('/', function () {
            return Inertia::render('products/index');
        })->name('products.index');

        Route::post('/create', function () {
            return Inertia::render('products/create');
        })->name('products.create');



        Route::get('/{id}', function ($id) {
            return Inertia::render('products/show', ['id' => $id]);
        })->name('products.show');

        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('products/edit', ['id' => $id]);
        })->name('products.edit');

        // Import users/products via CSV/Excel
        Route::post('/import', [ProductController::class, 'import'])
            ->name('products.import');
    });

    // orders
    Route::prefix('orders')->group(function () {

        Route::get('/create', function () {
            return Inertia::render('orders/create');
        })->name('orders.create');
        Route::get('/', function () {
            return Inertia::render('orders/index');
        })->name('orders.index');
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('orders/edit', ['id' => $id]);
        })->name('orders.edit');
        // Import users/products via CSV/Excel
        Route::post('/import', [OrderController::class, 'import'])
            ->name('orders.import');
        Route::get('/export', [OrderController::class, 'export'])->name('orders.export');
    });

    // customers
    Route::prefix('customers')->group(function () {

        Route::get('/create', function () {
            return Inertia::render('customers/create');
        })->name('customers.create');
        Route::get('/', function () {
            return Inertia::render('customers/index');
        })->name('customers.index');
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('customers/edit', ['id' => $id]);
        })->name('customers.edit');
        Route::post('/import', [CustomerController::class, 'import'])
            ->name('customers.import');
        Route::get('/export', [CustomerController::class, 'export'])->name('customers.export');
    });

});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
