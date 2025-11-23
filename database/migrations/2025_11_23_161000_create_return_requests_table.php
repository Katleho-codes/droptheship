<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('return_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('reason');
            $table->enum('status', ['pending_review', 'awaiting_item', 'item_received', 'approved_for_refund', 'refunded', 'rejected'])->default('pending_review');
            $table->enum('preferred_resolution', ['refund', 'replacement'])->default('refund');
            $table->string('return_tracking_number')->nullable();
            $table->decimal('refund_amount', 10, 2);
            $table->string('refund_method');
            $table->string('gateway_refund_id'); // Refund reference from payment gateway
            $table->string('payment_id'); //  transaction id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_requests');
    }
};
