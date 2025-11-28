<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class OrderReturnsExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    protected $status;
    protected $dateRange;
    protected $customerEmail;

    public function __construct($status = null, $dateRange = null, $customerEmail = null)
    {
        $this->status = $status;
        $this->dateRange = $dateRange;
        $this->customerEmail = $customerEmail;
    }


    public function query()
    {
        return DB::table('return_requests')
            ->join('customers', 'return_requests.customer_id', '=', 'customers.id')
            ->join('orders', 'return_requests.order_number', '=', 'orders.order_number')
            ->select(
                'return_requests.id as id',
                'orders.order_number as order_number',
                'return_requests.status as status',
                'return_requests.created_at as created_at',
                'return_requests.reason as reason',
                'customers.first_name as first_name',
                'customers.last_name as last_name',
                'customers.email as email',
                'return_requests.preferred_resolution as preferred_resolution',
                'return_requests.refund_amount as refund_amount',
                'return_requests.refund_method as refund_method',
            )
            ->when($this->status, fn($q) => $q->where('return_requests.status', $this->status))
            ->when($this->dateRange, function ($q) {
                $parts = explode(':', $this->dateRange);
                if (count($parts) === 2) {
                    [$from, $to] = $parts;
                    $q->whereBetween('return_requests.created_at', [
                        $from . ' 00:00:00',
                        $to . ' 23:59:59',
                    ]);
                }
            })
            ->when(
                $this->customerEmail,
                fn($q) =>
                $q->where('customers.email', 'like', "%{$this->customerEmail}%")
            )
            ->latest('return_requests.created_at');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Order Number',
            'Status',
            'Created At',
            'Reason',
            'Customer First Name',
            'Customer Last Name',
            'Customer Email',
            'Preferred solution',
            'Refund amount',
            'Refund method',
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->order_number,
            $row->status,
            $row->created_at,
            $row->reason,
            $row->first_name,
            $row->last_name,
            $row->email,
            $row->preferred_resolution,
            $row->refund_amount,
            $row->refund_method,
        ];
    }
}
