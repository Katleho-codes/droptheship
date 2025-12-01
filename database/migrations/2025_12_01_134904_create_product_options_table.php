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
        Schema::create('product_options', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('material', length: 100)->nullable();
            $table->string('gender')->nullable();
            $table->decimal('inches', 4, 2)->nullable();;
            $table->decimal('centimeters', 6, 2)->nullable();
            $table->string('colour', length: 100)->nullable();
            $table->string('type_of_fit')->nullable(); // 'slim', 'regular', 'baggy'
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_options');
    }
};
