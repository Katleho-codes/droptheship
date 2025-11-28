import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrderReturn } from '@/hooks/use-order-return';
import { useReturns } from '@/hooks/use-returns';
import AppLayout from '@/layouts/app-layout';
import { returnOrderStatuses } from '@/lib/status';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Returns',
        href: '/returns',
    },
];


export default function EditReturn() {
    const { props } = usePage();
    const { id } = props;
    const {
        orderReturn,
        orderReturnLoading,
    } = useOrderReturn(id)
    const { returns, pagination, setPagination, pageCount } = useReturns();
    const [newStatus, setNewStatus] = useState("");
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleOrderReturnUpdate = async (value: string) => {
        setNewStatus(value);
    };

    const submitUpdate = async () => {
        const fields = {
            "status": newStatus
        }
        try {
            setUpdating(true);
            const response = await axios.put("http://localhost:8000/api/returns/" + id, fields)
            console.log("response", response)
            setIsEditingStatus(!isEditingStatus);
        } catch (err) {
            console.error("error updating order return", err)
        } finally {
            setUpdating(false);
        }
    }
    if (orderReturnLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                </div>
            </AppLayout>
        );
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${orderReturn?.order_number ?? "View order return"}`} />
            <div className="w-full max-w-5xl mx-auto p-6 space-y-8 border">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-semibold">Return Request #{orderReturn?.order_number}</h1>
                </div>


                {/* Customer Information */}
                <section className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10 space-y-3">
                    <h2 className="text-xl font-semibold mb-3">Customer Information</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><span className="text-gray-400">Name:</span> {orderReturn?.first_name} {orderReturn?.last_name}</p>
                        <p><span className="text-gray-400">Email:</span> {orderReturn?.email}</p>
                        <p><span className="text-gray-400">Requested On:</span> {orderReturn?.created_at}</p>
                        <p className="col-span-2"><span className="text-gray-400">Preferred Resolution:</span> {orderReturn?.preferred_resolution}</p>

                        {/* <p>
                            <span className="text-gray-400 mr-1">Status:</span>
                            <Badge> {orderReturn?.status.replace(/_/g, " ")}</Badge>
                        </p> */}
                        {/* {!isEditingStatus ? <span className="text-sm text-gray-500">Status</span> : <span className="text-sm text-gray-500">Edit status</span>} */}
                        {!isEditingStatus ? <div className='flex justify-between items-center'>
                            <div>
                                <span className="text-sm text-gray-500 mr-1">Status</span>
                                <Badge> {orderReturn?.status.replace(/_/g, " ")}</Badge>
                            </div>
                            <Button onClick={() => setIsEditingStatus(!isEditingStatus)}>Edit status</Button>
                        </div>
                            : <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Select
                                        defaultValue={orderReturn?.status}
                                        onValueChange={handleOrderReturnUpdate}
                                        disabled={updating}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                returnOrderStatuses?.map((x) => (

                                                    <SelectItem key={x?.id} value={x?.name}>{x?.title}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={submitUpdate} disabled={updating}>{updating ? 'Updating...' : 'Send'}</Button>
                                    <Button onClick={() => setIsEditingStatus(!isEditingStatus)}>Cancel</Button>
                                </div>


                            </div>}

                    </div>

                </section>


                {/* Return Summary */}
                <section className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10 space-y-3">
                    <h2 className="text-xl font-semibold mb-3">Return Summary</h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Reason:</span> {orderReturn?.reason}</p>
                        <p><span className="text-gray-400">Refund Amount:</span> R {orderReturn?.refund_amount}</p>
                        <p><span className="text-gray-400">Refund Method:</span> {orderReturn?.refund_method}</p>
                    </div>
                </section>


                {/* Timeline */}
                {/* <section className="bg-white/5 backdrop-blur p-5 rounded-2xl border border-white/10">
                    <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
                    <ol className="space-y-3">
                        {statusSteps.map((step, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <div
                                    className={`w-3 h-3 rounded-full border ${index < currentStepIndex
                                        ? "bg-green-500 border-green-500"
                                        : index === currentStepIndex
                                            ? "bg-yellow-500 border-yellow-500"
                                            : "border-gray-600"
                                        }`}
                                ></div>
                                <span
                                    className={`${index === currentStepIndex
                                        ? "text-yellow-300"
                                        : index < currentStepIndex
                                            ? "text-green-300"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section> */}
            </div>
        </AppLayout>
    );
}
