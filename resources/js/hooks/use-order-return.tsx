
import { GetReturn } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useOrderReturn = (id: number | null | unknown) => {
    const [orderReturn, setReturn] = useState<GetReturn | null>(null)
    const [orderReturnLoading, setReturnLoading] = useState(false);

    const fetchReturn = async () => {
        if (!id) return;
        try {
            setReturnLoading(true);
            const response = await axios.get(`http://localhost:8000/api/returns/${id}`);
            if (response?.data) {
                setReturn(response.data); // just the single product
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setReturnLoading(false);
        }
    };


    // Fetch single product when ID is set
    useEffect(() => {
        if (id !== null) {
            fetchReturn();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        orderReturn,
        orderReturnLoading,
    };
};

