import { OrdersTable } from '@/components/orders-table';
import { useOrders } from '@/hooks/use-orders';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


const Products = () => {
    const { orders, pagination, setPagination, pageCount } = useOrders();

    return (
        <AppLayout>
            <Head title="Orders" />
            <div className="w-full mx-auto py-2 px-3">
                <OrdersTable data={orders} pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount} showPagination={true}/>
            </div>
        </AppLayout>

    )
}

export default Products