import { useOrders } from '@/hooks/use-orders';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Returns',
        href: '/returns',
    },
];


export default function Returns() {

    const { orders, pagination, setPagination, pageCount } = useOrders();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Returns" />

        </AppLayout>
    );
}
