<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class CustomersExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;
    protected $dateRange;

public function __construct($dateRange = null)
{
    $this->dateRange = $dateRange;
}


public function query()
{
    return DB::table('orders')
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
        ->latest('orders.created_at');
}

  public function headings(): array
{
    return [
        'ID',
        'Customer First Name',
        'Customer Last Name',
        'Customer Email',
        'Customer Phone',
        'Customer Address',
        'Customer City',
        'Customer State',
        'Customer Postal Code',
        'Customer Country',
        'Created At',
    ];
}

public function map($row): array
{
    return [
        $row->id,
        $row->first_name,
        $row->last_name,
        $row->email,
        $row->phone,
        $row->address,
        $row->city,
        $row->state,
        $row->postal_code,
        $row->country,
        $row->created_at,
    ];
}

}
