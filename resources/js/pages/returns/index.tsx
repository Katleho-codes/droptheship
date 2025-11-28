import { ReturnsTable } from '@/components/returns-table';
import { useReturns } from '@/hooks/use-returns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Returns',
        href: '/returns',
    },
];


export default function Returns() {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [customerEmailFilter, setCustomerEmailFilter] = useState<string>("");


    const { returns, pagination, setPagination, pageCount, fetchReturns, exportReturns } = useReturns();
    const date_range = dateFrom && dateTo ? `${dateFrom}:${dateTo}` : "";

    const exportFilteredReturns = () => {
        exportReturns({
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
        fetchReturns(pagination.pageIndex + 1, {
            status: statusFilter || undefined,
            customer_email: customerEmailFilter || undefined,
            date_range: date_range || undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, statusFilter, customerEmailFilter, date_range]);



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Returns" />

            <div className="w-full mx-auto py-2 px-3 space-y-4">
                <ReturnsTable
                    setStatusFilter={(value) => setStatusFilter(value)}
                    data={returns}
                    pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount}
                    showPagination={true}
                    exportFilteredReturns={exportFilteredReturns}
                />
            </div>
        </AppLayout>
    );
}
