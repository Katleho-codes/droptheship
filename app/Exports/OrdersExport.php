<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class OrdersExport implements FromQuery, WithHeadings, WithMapping
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
    return DB::table('orders')
        ->join('customers', 'orders.user_id', '=', 'customers.id')
        ->join('products', 'orders.product_id', '=', 'products.id')
        ->select(
            'orders.id',
            'orders.order_number',
            'orders.status',
            'orders.created_at',
            'customers.email',
            'customers.first_name',
            'customers.last_name',
            'products.name as product_name',
            'products.sale_price as price'
        )
        ->when($this->status, fn($q) => $q->where('orders.status', $this->status))
        ->when($this->dateRange, function ($q) {
            $parts = explode(':', $this->dateRange);
            if (count($parts) === 2) {
                [$from, $to] = $parts;
                $q->whereBetween('orders.created_at', [
                    $from . ' 00:00:00',
                    $to . ' 23:59:59',
                ]);
            }
        })
        ->when($this->customerEmail, fn($q) =>
            $q->where('customers.email', 'like', "%{$this->customerEmail}%")
        )
        ->latest('orders.created_at');
}

  public function headings(): array
{
    return [
        'ID',
        'Order Number',
        'Status',
        'Created At',
        'Customer Email',
        'Customer First Name',
        'Customer Last Name',
        'Product Name',
        'Price',
    ];
}

public function map($row): array
{
    return [
        $row->id,
        $row->order_number,
        $row->status,
        $row->created_at,
        $row->email,
        $row->first_name,
        $row->last_name,
        $row->product_name,
        $row->price,
    ];
}

}
