import { ProductCategoriesTable } from '@/components/product-categories-table'
import { useProductCategories } from '@/hooks/use-product-categories';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react'

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories' }];

const ProductCategory = () => {

    const {
        productCategories,
        productCategoriesLoading,
        pagination,
        setPagination,
        pageCount,
        totalRecords,
        deleteCategory,
        deleteCategoryLoading,
        fetchCategories
    } = useProductCategories()

    useEffect(() => {
        fetchCategories(pagination.pageIndex + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product categories" />

            <div className="w-full mx-auto py-2 px-3 space-y-4">


                {/* product Categories Table */}
                <ProductCategoriesTable
                    data={productCategories}
                    pagination={pagination}
                    setPagination={setPagination}
                    pageCount={pageCount}
                    showPagination={true}
                />
            </div>
        </AppLayout>
    )
}

export default ProductCategory