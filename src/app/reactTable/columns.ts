import { createColumnHelper } from '@tanstack/react-table';

type Person = {
    id: number;
    name: string;
    age: number;
    job: string;
};

// columnHelper when fed with type helps with creating the column of the entire table
const columnHelper = createColumnHelper<Person>();

// ColumnDef is an object that tells TanStack Table everything it needs to know about a single column in your table.

export const columns = [ // This is an array of ColumnDef objects
    columnHelper.accessor('id', { // first argument of .accessor needs to match key value of data
        header: 'ID', // display ID in the colummn header
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('age', {
        header: 'Age',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('job', {
        header: 'Job',
        cell: info => info.getValue(),
    }),
];
