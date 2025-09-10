<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Imports\OrdersImport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = DB::table('orders')
            ->join('customers', 'orders.user_id', '=', 'customers.id')
            ->join('products', 'orders.product_id', '=', 'products.id')
            ->select(
                'orders.*',
                'customers.email as email',
                'customers.first_name as first_name',
                'customers.last_name as last_name',
                'customers.phone as phone',
                'products.name as product_name',
                'products.description as product_description',
                'products.sale_price as price',
                'products.name as product_name',
                'products.main_image_url as product_image'
            )
            ->latest('orders.created_at')
            ->paginate(10);

        return response()->json($orders);
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
            Excel::import(new OrdersImport, $request->file('file'));


            return response()->json([
                'message' => 'Orders imported successfully.',
            ], 201);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();

            return response()->json([
                'success' => false,
                'message' => 'Validation errors occurred.',
                'errors' => collect($failures)->map(function ($failure) {
                    return [
                        'row' => $failure->row(), // row that went wrong
                        'attr' => $failure->attribute(), // column name
                        'errors' => $failure->errors(),   // actual error messages
                        'value' => $failure->values(),   // full row data
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
            'user_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'status' => 'nullable|string|max:20',
            'total_amount' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:1',
            'discount' => 'nullable|numeric|min:1',
            'shipping_cost' => 'required|numeric|min:0',
            'color' => 'nullable|string',
            'cancel_order' => 'required|boolean',
            'currency' => 'nullable|string|size:3',
            'payment_method' => 'nullable|string|max:50',
            'payment_status' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:80',
            'postal_code' => 'nullable|string|max:6',
            'country' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Step 1: create the order without order_number
        $order = Order::create($validated);

        // Step 2: generate order number using the assigned ID
        // $order->order_number = 'ORD-' . str_pad($order->id, 5, '0', STR_PAD_LEFT);
        $order->order_number = 'ORD-' . strtoupper(Str::random(8));
        while (Order::where('order_number', $order->order_number)->exists()) {
            $order->order_number = 'ORD-' . strtoupper(Str::random(8));
        }
        $order->save();
        // ORD-9F2D4A1B

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return $order;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|max:20',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'payment_method' => 'nullable|string|max:50',
            'payment_status' => 'nullable|string|max:20',
            'shipping_address_id' => 'nullable|exists:addresses,id',
            'billing_address_id' => 'nullable|exists:addresses,id',
            'notes' => 'nullable|string',
        ]);
        $order->update($validated);
        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}
