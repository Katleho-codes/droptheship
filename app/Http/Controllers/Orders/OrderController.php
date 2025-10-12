<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Customer;
use App\Imports\OrdersImport;
use App\Exports\OrdersExport;
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


    public function export(Request $request)
    {
        $status = $request->input('status');
        $dateRange = $request->input('date_range');
        $customerEmail = $request->input('customer_email');

        return Excel::download(
            new OrdersExport($status, $dateRange, $customerEmail),
            'orders_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }
    public function search(Request $request)
    {
        $status = $request->string('status');
        $dateRange = $request->string('date_range'); // format: 2025-09-01:2025-09-13
        $customerEmail = $request->string('customer_email');

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
                'products.main_image_url as product_image'
            )
            ->when($status, fn($q) => $q->where('orders.status', $status))
            ->when($dateRange, function ($q) use ($dateRange) {
                $parts = explode(':', $dateRange);

                if (count($parts) === 2) {
                    [$from, $to] = $parts;
                    $q->whereBetween('orders.created_at', [
                        $from . ' 00:00:00',
                        $to . ' 23:59:59',
                    ]);
                }
            })
            ->when(
                $customerEmail,
                fn($q) =>
                $q->where('customers.email', 'like', "%{$customerEmail}%")
            )
            ->latest('orders.created_at')
            ->paginate(15);

        return response()->json($orders);
    }

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
            'cancel_order' => ['boolean'],
            'currency' => 'nullable|string|size:3',
            'payment_method' => 'nullable|string|max:50',
            'payment_status' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:80',
            'postal_code' => 'nullable|string|max:6',
            'country' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Generate unique order_number before creating record
        do {
            $orderNumber = 'ORD-' . strtoupper(Str::random(8));
        } while (Order::where('order_number', $orderNumber)->exists());

        $validated['order_number'] = $orderNumber;

        $order = Order::create($validated);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order,
        ], 201);
    }



    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order = DB::table('orders')
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
                'products.main_image_url as product_image'
            )
            ->where('orders.id', $order->id) // use $order->id from model binding
            ->first();

        return $order;
    }
    // find customer

    // this will find the customer's previous orders
    public function findPrevCustomerOrders(Customer $customer)
    {
        $orders = DB::table('orders')
            ->join('customers', 'orders.user_id', '=', 'customers.id')
            // ->join('products', 'orders.product_id', '=', 'products.id')
            ->select(
                'orders.*',
                'customers.email as email',
                'customers.first_name as first_name',
                'customers.last_name as last_name',
                'customers.phone as phone',
                // 'products.name as product_name',
                // 'products.description as product_description',
                // 'products.sale_price as price',
                // 'products.main_image_url as product_image'
            )
            ->where('customers.id', $customer->id)
            ->orderByDesc('orders.created_at')
            ->get(); // fetch all

        return response()->json($orders);
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
