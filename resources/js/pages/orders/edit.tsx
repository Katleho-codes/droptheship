import { useOrder } from '@/hooks/use-order'
import React from 'react'
import { usePage } from '@inertiajs/react';

const Edit = () => {
      const { props } = usePage();
        const { id } = props;
    const { order,
        orderLoading } = useOrder(id)
    return (
        <div>Edit</div>
    )
}

export default Edit