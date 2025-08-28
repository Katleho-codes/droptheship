<?php

namespace App\Imports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

         // Generate unique SKU
        $sku = 'SKU-' . strtoupper(Str::random(8));
        while (Product::where('sku', $sku)->exists()) {
            $sku = 'SKU-' . strtoupper(Str::random(8));
        }
        return new Product([
           'name'           => $row['name'],
            'description'    => $row['description'] ?? null,
            'barcode'        => $row['barcode'] ?? null,
            'cost_price'     => $row['cost_price'],
            'sale_price'     => $row['sale_price'],
            'stock_quantity' => $row['stock_quantity'] ?? 0,
            'weight_grams'   => $row['weight_grams'] ?? 0,
            'status'         => $row['status'] ?? 'active',
            'sku'            => $sku,
        ]);
    }
    /**
     * Validation rules for each row
     */
    public function rules(): array
    {
        return [
            '*.name' => 'required|string|max:255',
            '*.cost_price' => 'required|numeric|min:0',
            '*.sale_price' => 'required|numeric|min:0',
            '*.status' => 'nullable|in:active,inactive,archived',
        ];
    }
}
