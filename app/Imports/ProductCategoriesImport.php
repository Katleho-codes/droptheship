<?php

namespace App\Imports;

use App\Models\ProductCategories;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductCategoriesImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

        return new ProductCategories([
            'category'           => $row['category'],
            'subcategory'    => $row['subcategory'],

        ]);
    }
    /**
     * Validation rules for each row
     */
    public function rules(): array
    {
        return [
            '*.category' => 'required|string|max:100',
            '*.subcategory' => 'nullable|string|max:100'
        ];
    }
}
