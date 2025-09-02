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
            // points to users.id
            $table->foreignId('user_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->string('status', 20)->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->string('currency', 3)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('notes')->nullable();
            $table->string('billing_address_id')->nullable();
            $table->string('order_number')->nullable()->after('order_number');
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
