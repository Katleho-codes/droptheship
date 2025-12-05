import { TProductCategories } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from 'lucide-react';
import { Button } from "./ui/button";

const columns: ColumnDef<TProductCategories>[] = [
    {
        id: "actions",
        enableHiding: false,
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown />
                </Button>
            )
        },
        // cell: ({ row }) => <div className="font-medium">{row.getValue("order_number")}</div>

    },
    {
        accessorKey: "subcategory",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Subcategory
                    <ArrowUpDown />
                </Button>
            )
        },
        // cell: ({ row }) => <div className="font-medium">{row.getValue("order_number")}</div>

    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown />
                </Button>
            )
        },
        // cell: ({ row }) => <div className="font-medium">{row.getValue("created_at")}</div>
    },

]
export default columns;