<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
// use App\Imports\CustomersImport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::latest()->paginate(10);
        return response()->json($customers);
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
                //     ->orWhere('last_name', 'like', "%{$q}%")
                //     ->orWhere('email', 'like', "%{$q}%")
                //     ->orWhere('phone', 'like', "%{$q}%")
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
