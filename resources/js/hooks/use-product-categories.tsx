
import { Customer, TProductCategories } from "@/types";
import {
    PaginationState,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";



export const useProductCategories = () => {
    const [productCategories, setProductCategories] = useState<TProductCategories[]>([])
    const [productCategoriesLoading, setProductCategoriesLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false)

    const fetchCategories = async (
        page: number
    ) => {
        try {
            setProductCategoriesLoading(true);

            const response = await axios.get(`http://localhost:8000/api/categories?page=${page}`);
            if (response?.data) {
                const { data, last_page, total } = response.data;
                setProductCategories(data);
                setPageCount(last_page);
                setTotalRecords(total);
            }
        } catch (error) {
            console.error("fetchCategories error", error);
        } finally {
            setProductCategoriesLoading(false);
        }
    };


    const deleteCategory = async (id: number | null) => {
        setDeleteCategoryLoading(true)
        try {
            const response = await axios.delete("http://localhost:8000/api/categories/" + id);
            const { data, status } = response.data;
            console.log("delete categories response", response);
        } catch (error) {
            console.log("delete categories error", error)
        } finally {
            setDeleteCategoryLoading(false)
        }
    }



    return {
        productCategories,
        productCategoriesLoading,
        pagination,
        setPagination,
        pageCount,
        totalRecords,
        deleteCategory,
        deleteCategoryLoading,
        fetchCategories
    };
};

