<?php

namespace Database\Seeders;

use App\Models\InternalNotes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InternalNotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InternalNotes::factory(100)->create();
    }
}
