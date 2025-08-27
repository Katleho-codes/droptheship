
import { GetProduct } from "@/types";
import {
  PaginationState,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<GetProduct[]>([])
  const [productsLoading, setProductsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchProducts = async (page: number) => {
    try {
      setProductsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/products?page=${page}`);
      if (response?.data) {
        const { data, last_page, total } = response.data;
        setProducts(data);
        setPageCount(last_page);
        setTotalRecords(total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProductsLoading(false);
    }
  };


  useEffect(() => {
    console.log(pagination.pageIndex + 1)
    fetchProducts(pagination.pageIndex + 1); // API pages are 1-based, TanStack pages are 0-based
  }, [pagination.pageIndex]);



  return {
    products,
    productsLoading,
    pagination,
    setPagination,
    pageCount,
    totalRecords
  };
};

