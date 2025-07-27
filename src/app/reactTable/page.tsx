'use client';

import React, { useState } from 'react';
import {
    useReactTable, // creates table instance
    getCoreRowModel, // Provides the default row structure before filtering or pagination
    getFilteredRowModel, // Enables filtering when a global filter is used.
    flexRender,
    getPaginationRowModel, // Used to render dynamic JSX for headers and cells safely
} from '@tanstack/react-table';

import { columns } from './columns';
import { data } from './mockData';

export default function ReactTablePage() {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5, // 5 results per page
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,

        // assign getCoreRowModel function to the options key
        getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel function helps filtering using the filter state provided by me
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    return (
        <div>
            <input
                type="text"
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="mb-2 p-1 border rounded"
            />

            {/* render table headers and body  */}
            <table className="table-auto border-collapse border w-full">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => ( // access headerGroup, a row of headers
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => ( // access header, a singular header cell from the row
                                <th key={header.id} className="border p-2">
                                    {header.isPlaceholder // placeholder cells are empty cells created to maintain the overall layout of the table
                                        ? null // access the current header cell's current colum's columnDef obj(refer to column.ts) 's header property value
                                        // .getContext returns a context obj that includes info abt table instance itself, column instance and head instance
                                        // we pass these 2 to flexRender so if 1st arg .header is a function and not a var like now, it will receive the context obj and do sth powerful(DKDC) 
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getPaginationRowModel().rows.map(row => ( // getRowModel uses all other row models to render the final row appearance wise
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border p-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex items-center gap-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
