
import { Return, GetReturn } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    PaginationState,
} from "@tanstack/react-table";

export const useReturns = () => {
    const [returns, setReturns] = useState<GetReturn[]>([])
    const [returnsLoading, setReturnsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [deleteReturnLoading, setDeleteReturnLoading] = useState(false)

    const fetchReturns = async (
        page: number,
        filters: {
            status?: string;
            date_range?: string;
            customer_email?: string;
        } = {}
    ) => {
        try {
            setReturnsLoading(true);

            const params = new URLSearchParams({
                page: String(page),
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.date_range ? { date_range: filters.date_range } : {}),
                ...(filters.customer_email ? { customer_email: filters.customer_email } : {}),
            });

            const hasFilters = Object.values(filters).some(Boolean);
            const url = hasFilters
                ? `http://localhost:8000/api/returns/search?${params.toString()}`
                : `http://localhost:8000/api/returns?page=${page}`;

            const response = await axios.get(url);

            if (response?.data) {
                const { data, last_page, total } = response.data;
                setReturns(data);
                setPageCount(last_page);
                setTotalRecords(total);
            }
        } catch (error) {
            console.error("fetchReturns error", error);
        } finally {
            setReturnsLoading(false);
        }
    };


    const deleteReturn = async (id: number | null) => {
        setDeleteReturnLoading(true)
        try {
            const response = await axios.delete("http://localhost:8000/api/returns/" + id);
            const { data, status } = response.data;
            console.log("delete return response", response);
        } catch (error) {
            console.log("delete return error", error)
        } finally {
            setDeleteReturnLoading(false)
        }
    }

    const exportReturns = async (filters: {
        status?: string;
        date_range?: string;
        customer_email?: string;
    } = {}) => {
        try {
            const params = new URLSearchParams({
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.date_range ? { date_range: filters.date_range } : {}),
                ...(filters.customer_email ? { customer_email: filters.customer_email } : {}),
            });

            const response = await axios.get(
                `http://localhost:8000/returns/export?${params.toString()}`,
                { responseType: "blob" } // 👈 Excel needs blob
            );

            console.log("export returns response", response);
            // Try to read filename from Content-Disposition
            let fileName = "returns.xlsx";
            const disposition = response.headers["content-disposition"];
            if (disposition && disposition.includes("filename=")) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) {
                    fileName = match[1];
                }
            }

            const blob = new Blob([response.data], {
                type: response.headers["content-type"],
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } catch (error) {
            console.error("Export error:", error);
        }
    };

    return {
        returns,
        returnsLoading,
        pagination,
        setPagination,
        pageCount,
        totalRecords,
        deleteReturn,
        deleteReturnLoading,
        fetchReturns,
        exportReturns
    };
};

