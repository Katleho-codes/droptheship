import { useCustomer } from '@/hooks/use-customer';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs = [
  { title: "Customers", href: "/customers" },
  { title: "View Customer", href: "#" },
];

const Edit = () => {
  const { props } = usePage();
  const { id } = props;
  const { singleCustomer, fetchSingleCustomerLoading } = useCustomer(id);

  if (fetchSingleCustomerLoading) {
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
      <Head title={`${singleCustomer?.first_name ?? "View customer"}`} />


    </AppLayout>
  );
};

export default Edit;
