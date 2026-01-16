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
        try {
            Excel::import(new ProductsImport, $request->file('file'));


            return response()->json([
                'message' => 'Products imported successfully.',
            ], 201);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();

            return response()->json([
                'success' => false,
                'message' => 'Validation errors occurred.',
                'errors'  => collect($failures)->map(function ($failure) {
                    return [
                        'row'    => $failure->row(), // row that went wrong
                        'attr'   => $failure->attribute(), // column name
                        'errors' => $failure->errors(),   // actual error messages
                        'value'  => $failure->values(),   // full row data
                    ];
                }),
            ], 422);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'barcode' => 'nullable|string|max:100',
            // cost_price must be <= sale_price
            'cost_price' => 'required|numeric|min:0|lte:sale_price',

            // sale_price must be >= cost_price
            'sale_price' => 'required|numeric|min:0|gte:cost_price',
            'stock_quantity' => 'nullable|integer|min:0',
            'weight_grams' => 'nullable|integer|min:0',
            'main_image_url' => 'nullable|string',
            'image_one' => 'nullable|string',
            'image_two' => 'nullable|string',
            'image_three' => 'nullable|string',
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
            'success' => true
        ], 201);
    }

    public function search(Request $request)
    {
        $q = $request->string('q');

        $product = Product::query()
            ->when(
                $q,
                fn($builder) =>
                $builder->where('name', 'like', "%{$q}%")
            )
            ->limit(10)
            ->get(['id', 'name', 'description', 'sku', 'barcode', 'cost_price', 'sale_price', 'stock_quantity', 'weight_grams', 'status']);

        return response()->json($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product;
    }

    public function showPublic($slug, $publicId)
    {
        $product = Product::where('public_id', $publicId)
            ->with('variants')
            ->firstOrFail();

        // SEO redirect if slug changed
        if ($slug !== $product->slug) {
            return redirect()->route('product.public', [
                'slug' => $product->slug,
                'publicId' => $product->public_id
            ], 301);
        }

        return inertia('storefront/product-show', [
            'product' => $product
        ]);
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
            'main_image_url' => 'sometimes|string|max:100|nullable',
            'image_one' => 'sometimes|string|max:100|nullable',
            'image_two' => 'sometimes|string|max:100|nullable',
            'image_three' => 'sometimes|string|max:100|nullable',
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
