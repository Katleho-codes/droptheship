
import { GetProduct } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useProduct = (id: number | null | unknown) => {
    const [product, setProduct] = useState<GetProduct | null>(null)
    const [productLoading, setProductLoading] = useState(false);

    const fetchProduct = async () => {
        if (!id) return;
        try {
            setProductLoading(true);
            const response = await axios.get(`http://localhost:8000/api/products/${id}`);
            if (response?.data) {
                setProduct(response.data); // just the single product
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProductLoading(false);
        }
    };


    // Fetch single product when ID is set
    useEffect(() => {
        if (id !== null) {
            fetchProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        product,
        productLoading,
    };
};

