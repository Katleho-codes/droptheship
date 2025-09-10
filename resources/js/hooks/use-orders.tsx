
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

  const fetchOrders = async (page: number) => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(`http://localhost:8000/api/orders?page=${page}`);
      if (response?.data) {
        const { data, last_page, total } = response.data;
        console.log("orders ", data)
        setOrders(data);
        setPageCount(last_page);
        setTotalRecords(total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    console.log(pagination.pageIndex + 1)
    fetchOrders(pagination.pageIndex + 1); // API pages are 1-based, TanStack pages are 0-based
  }, [pagination.pageIndex]);

  return {
    orders,
    ordersLoading,
    pagination,
    setPagination,
    pageCount,
    totalRecords,
  };
};

