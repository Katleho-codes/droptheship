import { CustomersTable } from '@/components/customers-table';
import { useCustomers } from '@/hooks/use-customers';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Customers' }];

const Customers = () => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [customer_email, setCustomerEmail] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [customerEmailFilter, setCustomerEmailFilter] = useState<string>("");

    const {  customers,
    customersLoading,
    pagination,
    setPagination,
    pageCount,
    totalRecords,
    deleteCustomer,
    deleteCustomerLoading,
    fetchCustomers,
    exportCustomers } = useCustomers();


    const date_range = dateFrom && dateTo ? `${dateFrom}:${dateTo}` : "";

    const exportFilteredCustomers = () => {
        exportCustomers({
            date_range: date_range || undefined,
        });
    }

    useEffect(() => {
        // Reset pagination to first page when filters change
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, customerEmailFilter, date_range]);

    useEffect(() => {
        fetchCustomers(pagination.pageIndex + 1, {
            email: customer_email || undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, statusFilter, customerEmailFilter, date_range]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="w-full mx-auto py-2 px-3 space-y-4">


                {/* Orders Table */}
                <CustomersTable
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    data={customers}
                    pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount}
                    showPagination={true}
                    exportFilteredCustomers={exportFilteredCustomers}
                />
            </div>
        </AppLayout>
    );
};

export default Customers;
