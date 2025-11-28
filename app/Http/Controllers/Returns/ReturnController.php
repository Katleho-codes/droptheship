<?php

namespace App\Http\Controllers\Returns;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\OrderReturnsImport;
use App\Exports\OrderReturnsExport;
use App\Models\Order;
use App\Models\ReturnRequests;
use Illuminate\Support\Str;

class ReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $return_requests = DB::table('return_requests')
            ->join('customers', 'return_requests.customer_id', '=', 'customers.id')
            ->join('orders', 'return_requests.order_number', '=', 'orders.order_number')
            ->select(
                'return_requests.id as id',
                'return_requests.reason as reason',
                'return_requests.created_at as created_at',
                'return_requests.status as status',
                'return_requests.reason as reason',
                'return_requests.preferred_resolution as preferred_resolution',
                'return_requests.refund_amount as refund_amount',
                'return_requests.refund_method as refund_method',
                'orders.order_number as order_number',
                'customers.email as email',
                'customers.first_name as first_name',
                'customers.last_name as last_name',
            )
            ->latest('return_requests.created_at')
            ->paginate(10);

        return response()->json($return_requests);
    }
    public function search(Request $request)
    {
        $status = $request->string('status');
        $dateRange = $request->string('date_range'); // format: 2025-09-01:2025-09-13
        $customerEmail = $request->string('customer_email');

        $return_requests = DB::table('return_requests')
            ->join('customers', 'return_requests.customer_id', '=', 'customers.id')
            ->join('orders', 'return_requests.order_number', '=', 'orders.order_number')
            ->select(
                'return_requests.id as id',
                'return_requests.reason as reason',
                'return_requests.created_at as created_at',
                'return_requests.status as status',
                'return_requests.reason as reason',
                'return_requests.preferred_resolution as preferred_resolution',
                'return_requests.refund_amount as refund_amount',
                'return_requests.refund_method as refund_method',
                'orders.order_number as order_number',
                'customers.email as email',
                'customers.first_name as first_name',
                'customers.last_name as last_name',
            )
            ->when($status, fn($q) => $q->where('return_requests.status', $status))
            ->when($dateRange, function ($q) use ($dateRange) {
                $parts = explode(':', $dateRange);

                if (count($parts) === 2) {
                    [$from, $to] = $parts;
                    $q->whereBetween('return_requests.created_at', [
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
            ->latest('return_requests.created_at')
            ->paginate(15);

        return response()->json($return_requests);
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
            Excel::import(new OrderReturnsImport, $request->file('file'));


            return response()->json([
                'message' => 'Order returns imported successfully.',
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
    public function export(Request $request)
    {
        $status = $request->input('status');
        $dateRange = $request->input('date_range');
        $customerEmail = $request->input('customer_email');

        return Excel::download(
            new OrderReturnsExport($status, $dateRange, $customerEmail),
            'orders_returns_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReturnRequests $return)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:20'
        ]);
        $return->update($validated);
        return response()->json([
            'message' => 'Order return updated successfully',
            // 'updated_record' => $return
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'order_number' => 'required|exists:orders,order_number',
            'reason' => 'required|string',
            'status' => 'required|string|max:20',
            'preferred_resolution' => 'required|string|max:20',
            'return_tracking_number' => 'nullable|string',
            'refund_amount' => 'required|numeric|min:0',
            'refund_method' => 'required|string|max:20',
            'gateway_refund_id' => 'required|string|max:20',
            'payment_id' => 'required|string|max:20',
        ]);


        return response()->json([
            'message' => 'Order return created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $return_request = DB::table('return_requests')
            ->join('customers', 'return_requests.customer_id', '=', 'customers.id')
            ->join('orders', 'return_requests.order_number', '=', 'orders.order_number')
            ->select(
                'return_requests.id as id',
                'return_requests.reason as reason',
                'return_requests.created_at as created_at',
                'return_requests.status as status',
                'return_requests.reason as reason',
                'return_requests.preferred_resolution as preferred_resolution',
                'return_requests.refund_amount as refund_amount',
                'return_requests.refund_method as refund_method',
                'orders.order_number as order_number',
                'customers.email as email',
                'customers.first_name as first_name',
                'customers.last_name as last_name',
            )
            ->where('return_requests.id', $id)
            ->first();

        return $return_request;
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = ReturnRequests::where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(null, 204);
    }
}
