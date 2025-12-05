import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddProductCategoryForm from '@/components/add-product-category-form';
import AddProductCategoryFile from '@/components/add-product-category-file';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create product category',
    },
];
const CreateProductCategory = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create product category" />

            <div className="flex justify-center items-center absolute top-40 left-0 right-0">
                <Card className="w-[400px] lg:w-[600px]">
                    <CardHeader>
                        <CardTitle>New product category</CardTitle>
                        <CardDescription>
                            Complete the form to add a new product category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="form" className="w-full">
                            <TabsList>
                                <TabsTrigger value="form">Form</TabsTrigger>
                                <TabsTrigger value="import">Import</TabsTrigger>
                            </TabsList>
                            <TabsContent value="form">
                                <AddProductCategoryForm />
                            </TabsContent>
                            <TabsContent value="import">
                                <AddProductCategoryFile />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>


            </div>

        </AppLayout>
    )
}
export default CreateProductCategory;