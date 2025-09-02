
import { GetProduct } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useOrder = (id: number | null | unknown) => {
    const [order, setOrder] = useState<GetProduct | null>(null)
    const [orderLoading, setOrderLoading] = useState(false);

    const fetchOrder = async () => {
        if (!id) return;
        try {
            setOrderLoading(true);
            const response = await axios.get(`http://localhost:8000/api/orders/${id}`);
            if (response?.data) {
                setOrder(response.data); // just the single product
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setOrderLoading(false);
        }
    };


    // Fetch single product when ID is set
    useEffect(() => {
        if (id !== null) {
            fetchOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        order,
        orderLoading,
    };
};

