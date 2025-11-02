import { Customer } from "@/types";
import React from "react";

const CustomerDetails = (customer: Customer) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Customer Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="font-medium">{customer?.id}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{customer?.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{customer?.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
