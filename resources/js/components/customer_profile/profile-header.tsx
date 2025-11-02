import React from "react";
import { Pencil, CircleUser } from "lucide-react";
import { Customer } from "@/types";

type TProfileHeader = {
    customer: Customer,
    onEdit?: () => void;
}

const ProfileHeader = ({ customer, onEdit }: TProfileHeader) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">

            <CircleUser className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-200" />

            <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {customer?.first_name} {customer?.last_name}
                        </h1>
                        <p className="text-gray-500">{customer?.email}</p>
                        <p className="text-gray-500">{customer?.phone}</p>
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-sm text-gray-500">{customer?.address}</p>
                        </div>
                    </div>

                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
