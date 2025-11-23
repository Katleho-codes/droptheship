import { useReturns } from '@/hooks/use-returns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Returns',
        href: '/returns',
    },
];


export default function CreateReturn() {

    const { returns, pagination, setPagination, pageCount } = useReturns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create return" />

        </AppLayout>
    );
}
