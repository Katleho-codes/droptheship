
import { Customer } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

interface SearchCustomer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | number | null;
}

export const useCustomer = (id?: number | null | unknown, query?: string | null | unknown) => {
    const [customerSearchResults, setCustomerSearchResults] = useState<SearchCustomer[]>([]);
    const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
    const [singleCustomer, setSingleCustomer] = useState<Customer | null>(null)
    const [fetchSingleCustomerLoading, setFetchSingleCustomerLoading] = useState(false)
    const searchCustomer = async () => {
        if (!query) return;
        try {
            setCustomerSearchLoading(true);
            const response = await axios.get(`http://localhost:8000/api/customers/search?q=${encodeURIComponent(query)}`);
            if (response?.data) {
                console.log("search customer result", response.data)
                setCustomerSearchResults(response.data); // just the single product
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCustomerSearchLoading(false);
        }
    };

    const fetchCustomer = async () => {
        if (!id) return;
        try {
            setFetchSingleCustomerLoading(true);
            const response = await axios.get(`http://localhost:8000/api/customers/${id}`);
            if (response?.data) {
                setSingleCustomer(response.data); // just the single product
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFetchSingleCustomerLoading(false);
        }
    };


    // Fetch single product when ID is set
    useEffect(() => {
        if (query !== null) {
            const timeout = setTimeout(() => {
                searchCustomer();
            }, 300) // debounce
            return () => clearTimeout(timeout)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // Fetch single customer when ID is set
    useEffect(() => {
        if (id !== null) {
            fetchCustomer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    return {
        customerSearchResults,
        customerSearchLoading,
        singleCustomer,
        fetchSingleCustomerLoading
    };
};

