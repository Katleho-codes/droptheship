import { OrdersTable } from '@/components/orders-table';
import { useOrders } from '@/hooks/use-orders';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders' }];

const Orders = () => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [customerEmailFilter, setCustomerEmailFilter] = useState<string>("");

    const { orders, fetchOrders, pagination, setPagination, pageCount, exportOrders } = useOrders();


    const date_range = dateFrom && dateTo ? `${dateFrom}:${dateTo}` : "";

    const exportFilteredOrders = () => {
        exportOrders({
            status: statusFilter || undefined,
            customer_email: customerEmailFilter || undefined,
            date_range: date_range || undefined,
        });
    }

    useEffect(() => {
        // Reset pagination to first page when filters change
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, customerEmailFilter, date_range]);

    useEffect(() => {
        fetchOrders(pagination.pageIndex + 1, {
            status: statusFilter || undefined,
            customer_email: customerEmailFilter || undefined,
            date_range: date_range || undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, statusFilter, customerEmailFilter, date_range]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="w-full mx-auto py-2 px-3 space-y-4">


                {/* Orders Table */}
                <OrdersTable
                    setStatusFilter={(value) => setStatusFilter(value)}
                    data={orders}
                    pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount}
                    showPagination={true}
                    exportFilteredOrders={exportFilteredOrders}
                />
            </div>
        </AppLayout>
    );
};

export default Orders;
