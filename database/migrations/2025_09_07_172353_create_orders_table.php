<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('status', 20)->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->integer('quantity');
            $table->integer('discount')->nullable();
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->string('color')->nullable();
            $table->boolean('cancel_order')->default(false);
            $table->string('currency', 3)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('address')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('South Africa');
            $table->string('notes')->nullable();
            $table->string('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
