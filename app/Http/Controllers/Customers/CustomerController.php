<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Imports\CustomersImport;
use App\Exports\CustomersExport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $customers = Customer::latest()->paginate(10);
    //     return response()->json($customers);
    // }

    public function index()
    {
        $customers = Customer::latest()->paginate(10);

        // convert collection to array with formatted dates
        $customers->setCollection(
            $customers->getCollection()->transform(function ($customer) {
                $customer->created_at = $customer->created_at->format('Y-m-d H:i:s');
                $customer->updated_at = $customer->updated_at->format('Y-m-d H:i:s');
                return $customer;
            })
        );

        return response()->json($customers);
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
            Excel::import(new CustomersImport, $request->file('file'));


            return response()->json([
                'message' => 'Customers imported successfully.',
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
        $dateRange = $request->input('date_range');

        return Excel::download(
            new CustomersExport($dateRange),
            'customers_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|min:1|max:255',
            'last_name' => 'required|min:1|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'phone' => 'nullable|string|regex:/^\+?[0-9]{10,15}$/', // +27831234567 or 0831234567
            'address' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:80',
            'postal_code' => 'nullable|string|max:6',
            'country' => 'nullable|string',
        ]);

        // Step 1: create the order without order_number
        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => $customer
        ], 201);
    }
    // Search customer
    public function search(Request $request)
    {
        $q = $request->string('q');

        $customers = Customer::query()
            ->when(
                $q,
                fn($builder) =>
                $builder->where('email', 'like', "%{$q}%")
            )
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'email', 'phone']);

        return response()->json($customers);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $customer = DB::table('customers')
            ->join('orders', 'customers.id', '=', 'orders.user_id')
            ->select(
                'customers.*',
                'orders.order_number as order_number',
                'orders.total_amount as order_total_amount',
                'orders.created_at as order_created_at',
                'orders.status as order_status',
            )
            ->where('customers.id', $customer->id)
            ->first();
        return $customer;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|min:1|max:255',
            'last_name' => 'required|min:1|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'phone' => 'nullable|string|regex:/^\+?[0-9]{10,15}$/', // +27831234567 or 0831234567
            'address' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:80',
            'postal_code' => 'nullable|string|max:6',
            'country' => 'nullable|string',
        ]);
        $customer->update($validated);
        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $customer
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(null, 204);
    }
}
