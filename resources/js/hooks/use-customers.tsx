
import { Customer } from "@/types";
import {
  PaginationState,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [deleteCustomerLoading, setDeleteCustomerLoading] = useState(false)

  const fetchCustomers = async (
    page: number,
    filters: {
      email?: string;
    } = {}
  ) => {
    try {
      setCustomersLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        ...(filters.email ? { customer_email: filters.email } : {}),
      });

      const hasFilters = Object.values(filters).some(Boolean);
      const url = hasFilters
        ? `http://localhost:8000/api/customers/search?${params.toString()}`
        : `http://localhost:8000/api/customers?page=${page}`;

      const response = await axios.get(url);

      if (response?.data) {
        const { data, last_page, total } = response.data;
        setCustomers(data);
        setPageCount(last_page);
        setTotalRecords(total);
      }
    } catch (error) {
      console.error("fetchCustomers error", error);
    } finally {
      setCustomersLoading(false);
    }
  };


  const deleteCustomer = async (id: number | null) => {
    setDeleteCustomerLoading(true)
    try {
      const response = await axios.delete("http://localhost:8000/api/customers/" + id);
      const { data, status } = response.data;
      console.log("delete customer response", response);
    } catch (error) {
      console.log("delete customer error", error)
    } finally {
      setDeleteCustomerLoading(false)
    }
  }

  const exportCustomers = async (filters: {
    date_range?: string;
  } = {}) => {
    try {
      const params = new URLSearchParams({
        ...(filters.date_range ? { date_range: filters.date_range } : {}),
      });

      const response = await axios.get(
        `http://localhost:8000/customers/export?${params.toString()}`,
        { responseType: "blob" } // 👈 Excel needs blob
      );

      console.log("export customers response", response);
      // Try to read filename from Content-Disposition
      let fileName = "customers.xlsx";
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
    customers,
    customersLoading,
    pagination,
    setPagination,
    pageCount,
    totalRecords,
    deleteCustomer,
    deleteCustomerLoading,
    fetchCustomers,
    exportCustomers
  };
};

