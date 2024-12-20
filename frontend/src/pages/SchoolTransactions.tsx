import React from 'react';
import { useTable, usePagination, useSortBy } from '@tanstack/react-table';
import { format } from 'date-fns';

interface Transaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  created_at: string;
}

interface TransactionTableProps {
  data: Transaction[];
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  pageCount,
  currentPage,
  onPageChange,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Collect ID',
        accessor: 'collect_id',
      },
      {
        Header: 'School ID',
        accessor: 'school_id',
      },
      {
        Header: 'Gateway',
        accessor: 'gateway',
      },
      {
        Header: 'Order Amount',
        accessor: 'order_amount',
        Cell: ({ value }: { value: number }) => `₹${value.toFixed(2)}`,
      },
      {
        Header: 'Transaction Amount',
        accessor: 'transaction_amount',
        Cell: ({ value }: { value: number }) => `₹${value.toFixed(2)}`,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              value === 'SUCCESS'
                ? 'bg-green-100 text-green-800'
                : value === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: 'Custom Order ID',
        accessor: 'custom_order_id',
      },
      {
        Header: 'Date',
        accessor: 'created_at',
        Cell: ({ value }: { value: string }) =>
          format(new Date(value), 'dd/MM/yyyy HH:mm'),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage },
      manualPagination: true,
      pageCount,
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead className="bg-gray-50 dark:bg-gray-800">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
              >
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{currentPage + 1}</span> of{' '}
              <span className="font-medium">{pageCount}</span>
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => onPageChange(0)}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                First
              </button>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
              <button
                onClick={() => onPageChange(pageCount - 1)}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;