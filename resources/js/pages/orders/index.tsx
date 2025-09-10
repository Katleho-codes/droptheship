import { OrdersTable } from '@/components/orders-table';
import { useOrders } from '@/hooks/use-orders';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        // href: '/dashboard',
    },
];

const Orders = () => {
    const { orders, pagination, setPagination, pageCount } = useOrders();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="w-full mx-auto py-2 px-3">
                <OrdersTable data={orders} pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount} showPagination={true}/>
            </div>
        </AppLayout>

    )
}

export default Orders