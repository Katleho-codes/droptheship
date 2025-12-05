<?php

namespace App\Http\Controllers\ProductCategories;

use App\Http\Controllers\Controller;
use App\Models\ProductCategories;
use Illuminate\Http\Request;
use App\Imports\ProductCategoriesImport;
use Maatwebsite\Excel\Facades\Excel;

class ProductCategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productcateg = ProductCategories::latest()->paginate(10);
        return response()->json($productcateg);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100'
        ]);
        $productcat = ProductCategories::create($validated);

        return response()->json([
            'message' => 'Product category created successfully.',
            'product' => $productcat,
            'success' => true
        ], 201);
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
            Excel::import(new ProductCategoriesImport, $request->file('file'));


            return response()->json([
                'message' => 'Products categories imported successfully.',
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleted = ProductCategories::where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(null, 204);
    }
}
