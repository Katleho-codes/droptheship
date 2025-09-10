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
            'product_id' => $row['product_id'],
            'status' => $row['status'] ?? 'pending',
            'total_amount' => $row['total_amount'],
            'quantity' => $row['quantity'],
            'discount' => $row['discount'],
            'shipping_cost' => $row['shipping_cost'] ?? 0.00,
            'color' => $row['color'],
            'cancel_order' => $row['cancel_order'] ?? false,
            'currency' => $row['currency'] ?? "ZAR",
            'payment_method' => $row['payment_method'],
            'payment_status' => $row['payment_status'],
            'address' => $row['address'],
            'state' => $row['state'],
            'postal_code' => $row['postal_code'],
            'country' => $row['country'] ?? "South Africa",
            'notes' => $row['notes'],
            'order_number' => $order_number,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.user_id' => 'required|exists:customers,id',
            '*.product_id' => 'required|exists:products,id',
            '*.status' => 'nullable|string|max:20',
            '*.total_amount' => 'required|numeric|min:0',
            '*.quantity' => 'required|numeric|min:1',
            '*.discount' => 'nullable|numeric|min:1',
            '*.shipping_cost' => 'required|numeric|min:0',
            '*.color' => 'nullable|string',
            '*.cancel_order' => 'required|boolean',
            '*.currency' => 'nullable|string|size:3',
            '*.payment_method' => 'nullable|string|max:50',
            '*.payment_status' => 'nullable|string|max:20',
            '*.address' => 'nullable|string|max:50',
            '*.state' => 'nullable|string|max:80',
            '*.postal_code' => 'nullable|string|max:6',
            '*.country' => 'nullable|string',
            '*.notes' => 'nullable|string',
        ];
    }
}
