<?php

namespace App\Imports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;


class OrderReturnsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

        return new Order([
            'customer_id' => $row['customer_id'],
            'reason' => $row['reason'],
            'status' => $row['status'] ?? 'pending_review',
            'preferred_resolution' => $row['preferred_resolution'] ?? 'refund',
            'return_tracking_number' => $row['return_tracking_number'],
            'refund_amount' => $row['refund_amount'],
            'refund_method' => $row['refund_method'] ?? 'EFT',
            'gateway_refund_id' => $row['gateway_refund_id'] ?? '-',
            'payment_id' => $row['payment_id'] ?? '-',
            'order_number' => $row['order_number'],
        ]);
    }

    public function rules(): array
    {
        return [
            '*.customer_id' => 'required|exists:customers,id',
            '*.reason' => 'required|string',
            '*.status' => 'required|string|max:20',
            '*.preferred_resolution' => 'required|string|max:20',
            '*.return_tracking_number' => 'nullable|string',
            '*.refund_amount' => 'required|numeric|min:0',
            '*.refund_method' => 'required|string|max:20',
            '*.gateway_refund_id' => 'required|string|max:20',
            '*.payment_id' => 'required|string|max:20',
        ];
    }
}
