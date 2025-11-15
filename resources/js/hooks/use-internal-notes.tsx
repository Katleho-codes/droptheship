type TInternalNotes = {
    id: number;
    created_at: string;
    order_id: number;
    customer_id: number;
    note: string;
    is_private: boolean;
    pinned: boolean;
    note_type: string;
    attachment_url?: string;
}

import axios from "axios";
import { useState } from "react";

export const useInternalNotes = () => {
    const [internalNotes, setInternalNotes] = useState<TInternalNotes[]>([])
    const [internalNotesLoading, setInternalNotesLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const fetchNotes = async (orderId: number | string, page: number) => {
        if (!orderId) return;
        try {
            setInternalNotesLoading(true);

            const response = await axios.get(
                `http://localhost:8000/api/notes/order/${orderId}?page=${page}`
            );


            if (response?.data) {
                const { data, last_page, total } = response.data;
                setInternalNotes(data);
                setPageCount(last_page);
                setTotalRecords(total);
            }
        } catch (error) {
            console.error("fetchNotes error", error);
        } finally {
            setInternalNotesLoading(false);
        }
    };

    return {
        internalNotes,
        internalNotesLoading,
        pagination,
        setPagination,
        pageCount,
        totalRecords,
        fetchNotes,
    };
}