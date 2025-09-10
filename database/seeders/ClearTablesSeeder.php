<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClearTablesSeeder extends Seeder
{
    public function run(): void
    {
   // Clear dependent tables first
    DB::statement('TRUNCATE TABLE customers RESTART IDENTITY CASCADE;');
    DB::statement('TRUNCATE TABLE orders RESTART IDENTITY CASCADE;');
    DB::statement('TRUNCATE TABLE products RESTART IDENTITY CASCADE;');
    DB::statement('TRUNCATE TABLE suppliers RESTART IDENTITY CASCADE;');

    }
}
