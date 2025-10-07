<?php

namespace App\Imports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class CustomersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

        return new Order([
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'email' => $row['email'],
            'phone' => $row['phone'] ?? '',
            'address' => $row['address'] ?? '',
            'city' => $row['city'] ?? '',
            'state' => $row['state'] ?? '',
            'postal_code' => $row['postal_code'] ?? '',
            'country' => $row['country'] ?? '',
        ]);
    }

    public function rules(): array
    {
        return [
            '*.first_name' => 'required|min:1|max:255',
            '*.last_name' => 'required|min:1|max:255',
            '*.email' => 'required|string|lowercase|email|max:255',
            '*.phone' => 'nullable|string|regex:/^\+?[0-9]{10,15}$/', // +27831234567 or 0831234567
            '*.address' => 'nullable|string|max:50',
            '*.city' => 'nullable|string|max:50',
            '*.state' => 'nullable|string|max:80',
            '*.postal_code' => 'nullable|string|max:6',
            '*.country' => 'nullable|string',
        ];
    }
}
