import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface AddProduct {
    name: string;
    description: string;
    cost_price: number;
    sale_price: number;
    stock_quantity: number;
    status: "active"|"inactive"|"archived";
    barcode?: string;
    weight_grams?: number;
    supplier_id?: number;
    supplier_product_url?: string;
    main_image_url?: string;
    additional_images?: string;
}

export interface GetProduct {
    id:number;
    name: string;
    description: string;
    cost_price: number;
    sale_price: number;
    stock_quantity: number;
    status: "active"|"inactive"|"archived";
    barcode?: string;
    weight_grams?: number;
    supplier_id?: number;
    supplier_product_url?: string;
    main_image_url?: string;
    additional_images?: string;
}


export interface Product {
    id: number;
    description?: string;
    cost_price: number;
    sale_price: number;
    status: "active"|"inactive"|"archived";
    stock_quantity?: number;
    weight_grams?: number;
    supplier_id?: number;
    supplier_product_url?: string;
    main_image_url?: string;
    additional_images?: string;
}
export interface Order {
    id: number;
    total_amount: number;
    user_id: number;
    payment_method?:string;
    status?: string;
    payment_status?:string;
    currency?: number;
   shipping_address_id?: string;
   billing_address_id?: string;
   notes?: string;
   user_email?: string;
}
export interface Supplier {
    id: number;
    name:string;
    email:string;
    address:string;
    phone?:string; 
}
export interface GetCustomer {

}
export type ProductsTableProps = {
    data: Product[];
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    pageCount: number;
    showPagination?: boolean; // optional if you want to show a spinner
};
