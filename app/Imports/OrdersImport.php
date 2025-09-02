<?php

namespace App\Imports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;


class OrdersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $order_number = 'ORD-' . strtoupper(Str::random(8));
        while (Order::where('order_number', $order_number)->exists()) {
            $order_number = 'ORD-' . strtoupper(Str::random(8));
        }

        return new Order([
            'user_id' => $row['user_id'],
            'status' => $row['status'] ?? 'pending',
            'total_amount' => $row['total_amount'],
            'currency' => $row['currency'] ?? "ZAR",
            'payment_method' => $row['payment_method'],
            'payment_status' => $row['payment_status'],
            'notes' => $row['notes'],
            'order_number' => $order_number,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.user_id' => 'required',
            '*.status' => 'nullable|string|max:20',
            '*.total_amount' => 'required|numeric|min:0',
            '*.currency' => 'nullable|string|size:3',
            '*.payment_method' => 'nullable|string|max:50',
            '*.payment_status' => 'nullable|string|max:20',
            '*.notes' => 'nullable|string',
        ];
    }
}
