import React, { useEffect, useState } from 'react'
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useProducts } from '@/hooks/use-products';
import { ProductsTable } from '@/components/products-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        // href: '/dashboard',
    },
];
const Products = () => {
    const { products, pagination, setPagination, pageCount, fetchProducts } = useProducts();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="w-full mx-auto py-2 px-3">
                <ProductsTable data={products}
                    pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount} showPagination={true} />
            </div>
        </AppLayout>

    )
}

export default Products