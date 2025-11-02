import CustomerOrdersTable from '@/components/customer_profile/customer-orders';
import ProfileHeader from '@/components/customer_profile/profile-header';
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
  const { singleCustomer, singleCustomerRecentOrders, fetchSingleCustomerLoading } = useCustomer(id);

  if (fetchSingleCustomerLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </AppLayout>
    );
  }
  const handleEditProfile = () => {
    alert("Edit Profile clicked!");
    // In a real app, open a modal or navigate to profile edit page
  };
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${singleCustomer?.first_name ?? "View customer"}`} />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <ProfileHeader customer={singleCustomer} onEdit={handleEditProfile} />
          <CustomerOrdersTable data={singleCustomerRecentOrders} />
        </div>
      </div>

    </AppLayout>
  );
};

export default Edit;
