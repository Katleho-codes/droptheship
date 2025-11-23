<?php

namespace App\Http\Controllers\Notes;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Mail\InternalNoteMail;
use App\Models\Customer;
use App\Models\Order;
use App\Models\InternalNotes;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class InternalNotesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function findTicketNotes($orderId)
    {
        $notes = DB::table('internal_notes')
            ->where('order_id', $orderId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($notes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'customer_id' => 'required|integer|exists:customers,id',
            'note' => 'required|string|max:255',
            'attachment_url' => 'nullable|string|max:255',
            'is_private' => 'nullable|boolean',
            'pinned' => 'nullable|boolean',
            'note_type' => 'nullable|string|max:80',
        ]);

        // Create the note
        $note = InternalNotes::create($validated);


        // If note is NOT private → send customer email
        if (!$validated['is_private']) {
            $customer = Customer::findOrFail($validated['customer_id']);
            $order = Order::findOrFail($validated['order_id']);

            Mail::to($customer->email)
                ->send(new InternalNoteMail(
                    note: $validated['note'],
                    customer: $customer->first_name . " " .  $customer->last_name,
                    order_id: $order->order_number,
                ));
        }

        return response()->json([
            'message' => 'Note created successfully',
            'note' => $note
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
