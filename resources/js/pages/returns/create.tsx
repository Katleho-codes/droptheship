import { useReturns } from '@/hooks/use-returns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddReturnForm } from '@/components/add-return-form';
import AddReturnFile from '@/components/add-return-file';

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
   <div className="flex justify-center items-center absolute top-40 left-0 right-0">
                <Card className="w-[400px] lg:w-[600px]">
                    <CardHeader>
                        <CardTitle>Place a return</CardTitle>
                        <CardDescription>
                            Complete the form to add a new return
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="form" className="w-full">
                            <TabsList>
                                <TabsTrigger value="form">Form</TabsTrigger>
                                <TabsTrigger value="import">Import</TabsTrigger>
                            </TabsList>
                            <TabsContent value="form">
                                <AddReturnForm />
                            </TabsContent>
                            <TabsContent value="import">
                                <AddReturnFile />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>


            </div>
        </AppLayout>
    );
}
