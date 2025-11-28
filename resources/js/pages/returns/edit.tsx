import { Badge } from '@/components/ui/badge';
import { useOrderReturn } from '@/hooks/use-order-return';
import { useReturns } from '@/hooks/use-returns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
                        <p>
                            <span className="text-gray-400 mr-1">Status:</span>
                            <Badge> {orderReturn?.status.replace(/_/g, " ")}</Badge>

                        </p>
                        <p className="col-span-2"><span className="text-gray-400">Preferred Resolution:</span> {orderReturn?.preferred_resolution}</p>
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
