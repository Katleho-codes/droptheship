import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '@/hooks/use-customers';
import { Customer } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import columns from './customers-table-columns';
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
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

type CustomersTableProps = {
    data: Customer[];
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    pageCount: number;
    showPagination?: boolean; // optional if you want to show a spinner
    exportFilteredCustomers: ()=>void;
    dateFrom:string, setDateFrom:(e:string|number)=>void;
    dateTo:string, setDateTo:(e:string|number)=>void;
};


export const CustomersTable = ({
    data,
    pagination,
    setPagination,
    pageCount,
    showPagination,exportFilteredCustomers,dateFrom,setDateFrom,dateTo,setDateTo
}: CustomersTableProps) => {
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

    const {deleteCustomer, deleteCustomerLoading}=useCustomers();

    return (
        <>
            <div className="flex justify-between items-center py-4">
               <div className="flex gap-4 items-center flex-col md:flex-row">
                 <Input
                    placeholder="Search customers"
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div>
                    <Input type='date' id='dateFrom' value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)}/>
                    <Input type='date' id='dateTo' value={dateTo} onChange={(e)=>setDateTo(e.target.value)}/>
                </div>
               </div>
           <div className='flex items-center gap-4 flex-col-reverse md:flex-row'>
                 <Button className='cursor-pointer w-full lg:w-auto' onClick={() => router.visit(route("customers.create"))}>Add customer</Button>
                <Button className='cursor-pointer' variant={"outline"} onClick={exportFilteredCustomers}>Export customers</Button>
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
                                                    onClick={() => router.visit(route("customers.edit", row.original.id))}
                                                //   onClick={() => navigator.clipboard.writeText(payment.id)}
                                                >
                                                    View customer
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
                                                                delete <span className="font-semibold">Customer</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteCustomer(row.original.id)}
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
