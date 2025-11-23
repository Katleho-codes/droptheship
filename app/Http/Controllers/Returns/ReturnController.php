<?php

namespace App\Http\Controllers\Returns;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $return_requests = DB::table('return_requests')
            ->join('customers', 'return_requests.customer_id', '=', 'customers.id')
            ->join('orders', 'return_requests.order_id', '=', 'orders.id')
            ->select(
                'return_requests.reason as reason',
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
}
