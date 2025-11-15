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
        Schema::create('internal_notes', function (Blueprint $table) {
            $table->id();
            $table->timestamps(); // 👈 This adds created_at and updated_at
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->text('note');
            $table->text('attachment_url'); // this has to be null
            $table->boolean('is_private')->default(true);
            $table->boolean('pinned')->default(false);
            $table->enum('note_type', ['email', 'note', 'followup', 'issue'])->default('note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internal_notes');
    }
};
