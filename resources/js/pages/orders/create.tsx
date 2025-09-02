import React from 'react'
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddOrderFile from '@/components/add-order-file';
import AddOrderForm from '@/components/add-order-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create order',
    },
];


const CreateOrder = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create order" />

            <div className="flex justify-center items-center absolute top-40 left-0 right-0">
                <Card className="w-[400px] lg:w-[600px]">
                    <CardHeader>
                        <CardTitle>Place an order</CardTitle>
                        <CardDescription>
                            Complete the form to add a new order
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="form" className="w-full">
                            <TabsList>
                                <TabsTrigger value="form">Form</TabsTrigger>
                                <TabsTrigger value="import">Import</TabsTrigger>
                            </TabsList>
                            <TabsContent value="form">
                                <AddOrderForm />
                            </TabsContent>
                            <TabsContent value="import">
                                <AddOrderFile />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>


            </div>

        </AppLayout>
    )
}

export default CreateOrder