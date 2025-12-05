<?php

use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\ProductCategories\ProductCategoriesController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Orders\OrderController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\Returns\ReturnController;
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

        // index
        Route::get('/', function () {
            return Inertia::render('products/index');
        })->name('products.index');

        // create form
        Route::get('/create', function () {
            return Inertia::render('products/create');
        })->name('products.create');

        // dynamic routes (keep LAST)
        Route::get('/{id}', function ($id) {
            return Inertia::render('products/show', ['id' => $id]);
        })->name('products.show');

        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('products/edit', ['id' => $id]);
        })->name('products.edit');
    });

    // product categories
    Route::prefix('categories')->group(function () {


        Route::get('/create', function () {
            return Inertia::render('categories/create');
        })->name('categories.create');


        Route::get('/', function () {
            return Inertia::render('categories/index');
        })->name('categories.index');

        // import
        Route::post('/categories/import', [ProductCategoriesController::class, 'import'])
            ->name('categories.import');
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

    // returns
    Route::prefix('returns')->group(function () {

        Route::get('/create', function () {
            return Inertia::render('returns/create');
        })->name('returns.create');
        Route::get('/', function () {
            return Inertia::render('returns/index');
        })->name('returns.index');
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('returns/edit', ['id' => $id]);
        })->name('returns.edit');
        Route::post('/import', [ReturnController::class, 'import'])
            ->name('returns.import');
        Route::get('/export', [ReturnController::class, 'export'])->name('returns.export');
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
