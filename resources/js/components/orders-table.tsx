import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useState } from 'react';
import columns from './orders-table-columns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import axios from 'axios';

type OrdersTableProps = {
    data: Order[];
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    pageCount: number;
    showPagination?: boolean; // optional if you want to show a spinner
    setStatusFilter: (data: string) => void;
    exportFilteredOrders: () => void;
};


export const OrdersTable = ({
    data,
    pagination,
    setPagination,
    pageCount,
    showPagination,
    setStatusFilter, exportFilteredOrders
}: OrdersTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [selectedRowId, setSelectedRowId] = useState(null)
    const table = useReactTable({
        data,
        columns,
        pageCount,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
        onPaginationChange: setPagination, // Update the pagination state

        manualPagination: true, // we control pagination
    })
    const handleRowSelect = (row: any) => {
        setSelectedRowId(row.id)
    }
    const deleteSelected = async () => {
        const ids = table
            .getSelectedRowModel()
            .rows
            .map(row => row.original.id);
        console.log(ids)

        try {
            const response = await axios.delete("http://localhost:8000/api/orders/bulk-delete", {
                data: { ids },
            });
            console.log("bulk delete order response", response);
        } catch (error) {
            console.log("bulk delete order error", error)
            setRowSelection({});
        }
    }
    const selectedCount = table.getSelectedRowModel().rows.length;

    const { deleteOrder, deleteOrderLoading } = useOrders();

    return (
        <>
            <div className="flex justify-between items-center py-4">
                <div className="flex gap-4 items-center flex-col md:flex-row">
                    <Input
                        placeholder="Search orders"
                        value={(table.getColumn("order_number")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("order_number")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Select onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Statuses</SelectLabel>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* <Button className='cursor-pointer' onClick={() => setOpenAddOrderModal(true)}>Add orders</Button> */}
                <div className='flex items-center gap-4 flex-col-reverse md:flex-row'>
                    {selectedCount > 1 && (<Button className='cursor-pointer w-full lg:w-auto' onClick={deleteSelected}>Delete marked ({selectedCount})</Button>)}
                    <Button className='cursor-pointer w-full lg:w-auto' onClick={() => router.visit(route("orders.create"))}>Add order</Button>
                    <Button className='cursor-pointer' variant={"outline"} onClick={exportFilteredOrders}>Export orders</Button>
                </div>

            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (

                            <TableRow key={headerGroup.id}>
                                {/* // This will host the "actions" */}
                                <TableHead>

                                </TableHead>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className='text-start'
                                    onClick={() => handleRowSelect(row)}
                                >
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => router.visit(route("orders.edit", row.original.id))}
                                                //   onClick={() => navigator.clipboard.writeText(payment.id)}
                                                >
                                                    View order
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {/* Delete with confirmation */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        {/* // prevents menu from closing too soon */}
                                                        <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently
                                                                delete <span className="font-semibold">Order</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteOrder(row.original.id)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {
                showPagination ? <div className="flex items-center justify-end space-x-2 py-4">
                    <div className='flex flex-col flex-1 gap-2 md:flex md:flex-row md:justify-content-between align-items-center'>
                        <p className="text-muted-foreground md:flex-1 text-sm">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </p>
                        <p className="text-muted-foreground md:flex-1 text-sm">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </p>
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div> : null
            }

        </>
    )
}
