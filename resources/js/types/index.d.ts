import { PaginationState } from '@tanstack/react-table';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

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
    status: 'active' | 'inactive' | 'archived';
    barcode?: string;
    weight_grams?: number;
    supplier_id?: number;
    supplier_product_url?: string;
    main_image_url?: string;
    additional_images?: string;
}

export interface GetProduct {
    id: number;
    name: string;
    name: string;
    description: string;
    cost_price: number;
    sale_price: number;
    total_amount: number;
    quantity: number;
    discount: number;
    status: string;
    color: string;
    cancel_order: string;
    currency: string;
    payment_method: string;
    payment_status: string;
    address: string;
    state: string;
    postal_code: string;
    notes: string;
    order_number?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    product_name?: string;
    product_description?: string;
    price?: string;
    product_image?: string;
    country?: string;
    created_at?: string;
    discount?: string;
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
    status?: 'active' | 'inactive' | 'archived';
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
    payment_method?: string;
    status?: string;
    payment_status?: string;
    currency?: number;
    shipping_address_id?: string;
    billing_address_id?: string;
    notes?: string;
    user_email?: string;
}
export interface Supplier {
    id: number;
    name: string;
    email: string;
    address: string;
    phone?: string;
}
export interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    order_number?: number;
    order_created_at?: string;
    order_status?: string;

    // recent_orders?: Array<{ id: string; order_number: string; total_amount: string; status: string; created_at: string }> | any[];
}
export interface CustomerRecentOrders {
    id: string;
    order_number: string;
    total_amount: string;
    status: string;
    created_at: string;
}

export type ProductsTableProps = {
    data: Product[];
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    pageCount: number;
    showPagination?: boolean; // optional if you want to show a spinner
};
