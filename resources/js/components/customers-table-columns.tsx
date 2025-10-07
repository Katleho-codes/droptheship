import { Customer } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from 'lucide-react';
import { Button } from "./ui/button";

const columns: ColumnDef<Customer>[] = [
     {
        id: "actions",
        enableHiding: false,
    },
    {
        accessorKey: "first_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("first_name")}</div>
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last name
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("last_name")}</div>
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
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Phone
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>
    },
]
export default columns;