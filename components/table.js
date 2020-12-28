import {
  useTable,
  useSortBy,
  useFilters,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        className="px-2 py-2 border-gray-400 shadow"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      className="w-3/4 px-2 py-1 border shadow-sm round-sm"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    state: { pageIndex, pageSize },
    // preGlobalFilteredRows,
    // setGlobalFilter,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    footerGroups,

    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        sortBy: [
          {
            id: "weekAvgTons",
            desc: true,
          },
          {
            id: "dueDate",
            desc: true,
          },
          {
            id: "totalSold",
            desc: true,
          },
          {
            id: "ticketDate",
            desc: true,
          },
          {
            id: "endDate",
            desc: true,
          },
        ],
        pageSize: 20,
      },
    },
    useFilters,
    //useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="pb-16">
      <div>
        {/* <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        /> */}
      </div>
      <table
        {...getTableProps()}
        className="bg-white text-gray-900 border shadow mt-8 w-full text-sm pb-16 prose-lg"
      >
        <thead className=" border-b-2 border-gray-400 ">
          <tr>
            {headers.map((column) => (
              <th
                className=" py-2 px-1"
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                <div className="flex justify-center items-center text-sm pl-2">
                  {column.render("Header")}
                  <div>
                    <span className="lg:text-xl text-base text-gray-700 ">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <IoMdArrowDropdownCircle />
                        ) : (
                          <IoMdArrowDropupCircle />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="" {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);

            return (
              <tr
                className="border-t border-b first:border-t-0 last:border-t-0 border-gray-400 border-l"
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      className="py-5 px-1 text-sm border-l border-r"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerGroups.map((group) => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map((column) => (
                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="py-6">
        <button
          className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white disabled:opacity-50 "
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white disabled:opacity-50 "
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white disabled:opacity-50 "
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white disabled:opacity-50 "
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            className="form-input"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          className="form-select"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50, 100, 200].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Table;
