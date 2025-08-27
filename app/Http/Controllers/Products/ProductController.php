<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use App\Imports\ProductsImport;
use Maatwebsite\Excel\Facades\Excel;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return response()->json($products);

    }
    /**
     * Import a newly created resource in storage.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv,txt'
        ]);
        Excel::import(new ProductsImport, $request->file('file'));

        return back()->with('success', 'Data imported successfully!');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'barcode' => 'nullable|string|max:100',
            'cost_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'weight_grams' => 'nullable|integer|min:0',
            'status' => 'in:active,inactive,archived',
        ]);
        // Generate a unique SKU
        $validated['sku'] = 'SKU-' . strtoupper(Str::random(8));
        // Make sure SKU is unique (loop until it is)
        while (Product::where('sku', $validated['sku'])->exists()) {
            $validated['sku'] = 'SKU-' . strtoupper(Str::random(8));
        }
        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
            'success'=>true
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
            'barcode' => 'sometimes|string|max:100|nullable',
            'cost_price' => 'sometimes|numeric|min:0|nullable',
            'sale_price' => 'sometimes|numeric|min:0|nullable',
            'stock_quantity' => 'sometimes|integer|min:0|nullable',
            'weight_grams' => 'sometimes|integer|min:0|nullable',
            'status' => 'sometimes|in:active,inactive,archived|nullable',
        ]);
        $product->update($validated);
        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}
