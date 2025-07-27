### core row model

The Core Row Model is the most basic representation of your table's rows.

Think of it as the first step TanStack Table takes to understand your data:

You provide raw data (an array of objects).
You provide columns definitions (how to access and display data for each column).
The getCoreRowModel() function (or rather, the function it returns) takes these two inputs and processes them into a fundamental structure of rows and cells. This "core row model" knows:

How many rows there are based on your input data.
What cells each row contains, based on your column definitions.
The original index of each row from your input data.
It's "core" because it's the foundation before any other features like filtering, sorting, pagination, or grouping are applied. These other features will then take the core row model and transform it further to produce the final set of rows you see.

- a row model is transformed from your raw data. it is the generated rows that has functions for filtering, sorting etc

### getRowModel

Imagine your table data goes through a series of processing steps before it's ready to be shown on the screen:

1.  **Start:** You have your raw `data` and `columns`.
2.  **Step 1: Core Processing (`getCoreRowModel`)**
    - The table first figures out the basic structure of rows and cells from your raw data. This is the "core row model."
3.  **Step 2: Filtering (`getFilteredRowModel`)**
    - If you have a filter (like your search bar), the table takes the rows from Step 1 and removes any rows that don't match the filter. This results in a "filtered row model."
4.  **Step 3: Sorting (`getSortedRowModel` - if you were using it)**
    - If sorting is enabled, the table would take the rows from Step 2 and reorder them. This would be a "sorted row model."
5.  **Step 4: Pagination (`getPaginationRowModel` - which you'll add)**
    - If pagination is active, the table takes the rows from Step 3 (or Step 2 if no sorting) and figures out which specific "page" of rows to display (e.g., rows 1-5). This is a "paginated row model."
6.  **And so on...** for any other features like grouping.

**`table.getRowModel()` is the End Result of All These Steps.**

- When the documentation says, **"This is the main row model that you should use for rendering your table rows markup,"** it means that after all the enabled features (filtering, sorting, pagination, etc.) have done their job, `table.getRowModel()` gives you the _final, processed set of rows_ that are actually ready to be displayed on the current page, in the correct order, and matching any active filters.

- When it says, **"It will use all of the other row models to generate the final row model,"** it's highlighting this pipeline. `table.getRowModel()` doesn't do the filtering or sorting itself directly. Instead, it relies on the outputs of `getFilteredRowModel`, `getSortedRowModel`, `getPaginationRowModel`, etc., and presents you with the combined outcome.

**Think of it like an assembly line:**

- `getCoreRowModel` builds the basic product.
- `getFilteredRowModel` inspects and removes faulty products.
- `getPaginationRowModel` packages the products into boxes of 5.
- `table.getRowModel().rows` is what you grab from the end of the assembly line – the boxes of finished products ready to be shown to the customer (rendered in your `<tbody>`).

So, in your code:

```tsx
// ...existing code...
<tbody>
  {table.getRowModel().rows.map(
    (
      row, // You're asking for the final, display-ready rows
    ) => (
      <tr key={row.id}>
        {row.getVisibleCells().map(
          (
            cell, // For each of those rows, get its visible cells
          ) => (
            <td key={cell.id} className="border p-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ),
        )}
      </tr>
    ),
  )}
</tbody>
// ...existing code...
```

You are correctly using `table.getRowModel().rows` to iterate over the rows that should currently be visible to the user, after considering the `globalFilter` (because you've included `getFilteredRowModel`). When you add pagination, `table.getRowModel().rows` will then _also_ reflect only the rows for the current page.
