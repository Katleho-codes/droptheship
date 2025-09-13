import { useOrder } from '@/hooks/use-order'
import React from 'react'
import { usePage,Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs = [
  { title: "Orders", href: "/orders" },
  { title: "View Order", href: "#" },
];

const Edit = () => {
  const { props } = usePage();
  const { id } = props;
  const { order, orderLoading } = useOrder(id);

  if (orderLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${order?.order_number ?? "View order"}`} />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white shadow rounded p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order?.order_number}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order?.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order?.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Order date: {order?.created_at}
          </p>
        </div>

        {/* Product Card */}
        <div className="bg-white shadow rounded overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <img
              src={order?.product_image}
              alt={order?.product_name}
              className="md:w-1/3 object-cover"
            />
            <div className="p-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {order?.product_name}
              </h2>
              <p className="text-gray-600 mb-4">{order?.product_description}</p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-bold text-indigo-600">
                  {order?.currency} {order?.price}
                </span>
                {order?.discount && (
                  <span className="text-sm text-red-500">
                    -{order?.discount}% off
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Quantity: {order?.quantity}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-gray-700">
                {order?.first_name} {order?.last_name}
              </p>
              <p className="text-gray-500">{order?.email}</p>
              <p className="text-gray-500">{order?.phone}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Shipping Address</p>
              <p className="text-gray-500">{order?.address}</p>
              <p className="text-gray-500">
                {order?.state}, {order?.postal_code}, {order?.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Edit;
