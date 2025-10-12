
import { GetProduct } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
interface SearchProduct {
    id: number;
    name: string;
    last_name: string;
    description: string;
    barcode: string | null;
    sku: string;
    cost_price: number;
    sale_price: number;
    stock_quantity: number | null;
    weight_grams: number | null;
    status: 'active' | 'inactive' | 'archived';
}

export const useProduct = (id?: number | null | unknown, query?: string | null | unknown) => {
    const [product, setProduct] = useState<GetProduct | null>(null)
    const [productLoading, setProductLoading] = useState(false);
    const [productSearchResults, setProductSearchResults] = useState<SearchProduct[]>([]);
    const [productSearchLoading, setProductSearchLoading] = useState(false);
    const searchProduct = async () => {
        if (!query) return;
        try {
            setProductSearchLoading(true);
            const response = await axios.get(`http://localhost:8000/api/products/search?q=${encodeURIComponent(query)}`);
            if (response?.data) {
                console.log("search product result", response.data)
                setProductSearchResults(response.data); // just the single product
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProductSearchLoading(false);
        }
    };

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
        if (query !== null) {
            const timeout = setTimeout(() => {
                searchProduct();
            }, 300) // debounce
            return () => clearTimeout(timeout)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // Fetch single customer when ID is set
    useEffect(() => {
        if (id !== null) {
            fetchProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        product,
        productLoading,
        productSearchResults,
        productSearchLoading
    };
};

