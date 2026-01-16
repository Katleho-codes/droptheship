
import { Order } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  PaginationState,
} from "@tanstack/react-table";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false)

  const fetchOrders = async (
    page: number,
    filters: {
      status?: string;
      date_range?: string;
      customer_email?: string;
    } = {}
  ) => {
    try {
      setOrdersLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.date_range ? { date_range: filters.date_range } : {}),
        ...(filters.customer_email ? { customer_email: filters.customer_email } : {}),
      });

      const hasFilters = Object.values(filters).some(Boolean);
      const url = hasFilters
        ? `http://localhost:8000/api/orders/search?${params.toString()}`
        : `http://localhost:8000/api/orders?page=${page}`;

      const response = await axios.get(url);

      if (response?.data) {
        const { data, last_page, total } = response.data;
        setOrders(data);
        setPageCount(last_page);
        setTotalRecords(total);
      }
    } catch (error) {
      console.error("fetchOrders error", error);
    } finally {
      setOrdersLoading(false);
    }
  };


  const deleteOrder = async (id: number | null) => {
    setDeleteOrderLoading(true)
    try {
      const response = await axios.delete("http://localhost:8000/api/orders/" + id);
      const { data, status } = response.data;
      console.log("delete order response", response);
    } catch (error) {
      console.log("delete order error", error)
    } finally {
      setDeleteOrderLoading(false)
    }
  }

 

  const exportOrders = async (filters: {
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
        `http://localhost:8000/orders/export?${params.toString()}`,
        { responseType: "blob" } // 👈 Excel needs blob
      );

      console.log("export orders response", response);
      // Try to read filename from Content-Disposition
      let fileName = "orders.xlsx";
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

  // useEffect(() => {
  //   fetchOrders(pagination.pageIndex + 1); // API pages are 1-based, TanStack pages are 0-based
  // }, [pagination.pageIndex]);

  return {
    orders,
    ordersLoading,
    pagination,
    setPagination,
    pageCount,
    totalRecords,
    deleteOrder,
    deleteOrderLoading,
    fetchOrders,
    exportOrders
  };
};

