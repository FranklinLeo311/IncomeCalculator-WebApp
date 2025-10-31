
// how to use -- refer to DataTable.stories.tsx
{/* <DataTable
            domLayout="autoHeight"
            data={filteredSummaryLoanData}
            column={columnDef}
            loading={processingStatus === "pageOnLoad"}
            pagination
            className="border-t-[0]"
            ref={dashboardGridRef}
            searchText={filterDataDetails["searchText"] || ""}
            defaultColDef={{
              wrapText: true,
              autoHeight: true,
            }}
            defaultPageSize={20}
          /> */}


import "ag-grid-community/styles/ag-theme-alpine.min.css";
import "../../styles/ag-grid-custom.css";
import { AgGridReact } from "ag-grid-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { Pagination } from "@carbon/react";
import { RowClickedEvent } from "ag-grid-community";
import useWindowWidth from "../hooks/useWindowWidth";

export const DataTable = forwardRef<DataTableRef, DataTableProps>(
  (props, parentGridRef) => {
    const {
      data,
      loading,
      column,
      isEditable = false,
      pagination = false,
      searchable = false,
      header = "",
      dColDef = {},
      onRowClicked,
      domLayout = "autoHeight",
      className = "overflow-hidden",
      resetTableUI,
      searchText = "",
      defaultPageSize = 10,
      ...rest
    } = props;

    const [pageSize, setPageSize] = useState<number>(defaultPageSize || 10),
      [rowData, setRowData] = useState<any[]>([...data]),
      pageSizes = useMemo(() => [10, 20, 50, 100], []);
    const [filteredRowCount, setFilteredRowCount] = useState<number>(
        rowData.length
      ),
      [headerHeight, setHeaderHeight] = useState(35),
      [page, setPage] = useState(1);

    const gridRef = useRef<AgGridReact>(null);
    useEffect(() => {
      if (pagination && gridRef.current?.api) {
        setPageSize(defaultPageSize);
        // setPage(1);
        // gridRef.current.api.paginationGoToFirstPage();
      }
    }, [rowData, pagination, defaultPageSize]);

    useEffect(() => {
      setRowData([...data]);
    }, [data]);

    const defaultColDef = useMemo(() => {
      return {
        wrapHeaderText: true,
        autoHeaderHeight: true,
        suppressMovable: true,
        editable: isEditable,
        cellClass: "p-2",
        ...dColDef,
      };
    }, [isEditable]);

    const { screenWidth } = useWindowWidth();

    // Props for pagination
    const paginationProps = useMemo(() => {
      return {
        pagination,
        paginationPageSize: pageSize,
        paginationPageSizeSelector: pageSizes,
      };
    }, [pagination, pageSize]);

    // Props for Grid layout
    const gridProps = useMemo(() => {
      return {
        animateRows: true,
        rowHeight: 30,
        headerHeight,
        suppressDragLeaveHidesColumns: true,

        getRowHeight: () => null,
      };
    }, [headerHeight]);

    const onGridReady = (params: any) => {
      try {
        params.api.sizeColumnsToFit();
        params.api.resetRowHeights();

        if (gridRef.current) {
          gridRef.current.api = params.api;
        }
        setTimeout(() => {
          params.api.sizeColumnsToFit();
          params.api.resetRowHeights();
        }, 1000);
        setTimeout(() => {
          adjustHeaderHeight();
        }, 0);
      } catch (error) {}
    };

    useEffect(() => {
      window.addEventListener("resize", onGridReady);
      return () => {
        window.removeEventListener("resize", onGridReady);
      };
    }, []);

    const adjustHeaderHeight = useCallback(() => {
      const { api } = gridRef.current || {};
      if (!api) return;

      const elementList = document.querySelectorAll(
        ".ag-header-cell .ag-header-cell-text"
      );
      let max = 35;
      elementList.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const h = Math.ceil(rect.height) + 6; // little padding
        if (h > max) max = h;
      });

      max = max + 5;

      if (max !== headerHeight) setHeaderHeight(max);
    }, []);

    const handleResizeToFit = () => {
      if (gridRef.current) {
        gridRef.current?.api?.sizeColumnsToFit();
        gridRef.current?.api?.resetRowHeights();
      }
    };

    useEffect(() => {
      handleResizeToFit();
    }, [screenWidth, resetTableUI]);

    const columnDefs = useMemo(() => {
      return column.map((column: any) => {
        const { valueFormatter = null, getQuickFilterText = null } = column;
        return getQuickFilterText || valueFormatter
          ? {
              ...column,
              getQuickFilterText: getQuickFilterText || valueFormatter,
            }
          : column;
      });
    }, [column, rowData]);

    useImperativeHandle(parentGridRef, () => ({
      setPageNumber: (page: number, size?: number) => {
        if (gridRef.current) {
          if (size) {
            setPageSize(size);
          }
          gridRef.current.api.paginationGoToPage(page);
          setPage(page + 1);
          setTimeout(() => {
            gridRef?.current?.api?.sizeColumnsToFit();
          }, 250);
        }
      },
      handleResizeToFit,
      getPageSize: () => pageSize,
      api: gridRef.current?.api,
    }));

    useEffect(() => {
      const api = gridRef.current?.api;
      if (!api) return;
      const count = api.getDisplayedRowCount();
      setFilteredRowCount(count);

      if (count === 0) {
        api.showNoRowsOverlay();
      } else {
        api.hideOverlay();
      }

      handleResizeToFit();
    }, [searchText, rowData]);

    const isFilteredEmpty = useMemo(() => {
      return filteredRowCount === 0;
    }, [filteredRowCount]);

    // useEffect(() => {
    //   const intervalId = setInterval(handleResizeToFit, 1500);

    //   return () => clearInterval(intervalId);
    // }, []);
    return (
      <div
        className={`!rounded-md ${className} ${
          !pagination ? "no-pagination-table" : ""
        } ${isFilteredEmpty ? "ag-no-rows-table" : ""}`}
        style={{ width: "100%", height: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout={domLayout}
          quickFilterText={searchText}
          singleClickEdit={isEditable}
          overlayLoadingTemplate={`<div class="flex items-center justify-center text-[12px]">
  <div role="status" aria-label="Loading" class="w-[12px] h-[12px] mr-2 animate-spin text-blue-600">
    <svg class="w-full h-full" viewBox="0 0 100 100">
      <circle class="text-gray-300" cx="50" cy="50" r="44" stroke="currentColor" stroke-width="8" fill="none"></circle>
      <circle class="text-blue-600" cx="50" cy="50" r="44" stroke="currentColor" stroke-width="8" fill="none"
        stroke-dasharray="283" stroke-dashoffset="75" stroke-linecap="round"></circle>
    </svg>
  </div>
  <div>Loading...</div>
</div>`}
          loading={loading}
          onGridReady={onGridReady}
          onRowClicked={onRowClicked}
          overlayNoRowsTemplate={`<div class="flex items-center justify-center text-gray-500 text-sm h-full">
    No record found
  </div>`}
          {...gridProps}
          {...paginationProps}
          {...rest}
        />

        {pagination && (
          <Pagination
            totalItems={filteredRowCount}
            pageSize={pageSize}
            pageSizes={pageSizes}
            page={page}
            onChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
              gridRef.current?.api.paginationGoToPage(page - 1);
              setTimeout(() => {
                gridRef.current?.api.sizeColumnsToFit();
              }, 250);
            }}
          />
        )}
      </div>
    );
  }
);

interface DataTableProps {
  data: any[];
  loading?: boolean;
  column: any[];
  isEditable?: boolean;
  pagination?: boolean;
  defaultPageSize?: number;
  searchable?: boolean;
  header?: string;
  dColDef?: any;
  searchText?: string;
  domLayout?: "autoHeight" | "normal";
  className?: string;
  onRowClicked?: (event: RowClickedEvent<any, any>) => any;
  [key: string]: any;
}
export interface DataTableRef {
  setPageNumber: (page: number, pageSize?: number) => void;
  handleResizeToFit: () => void;
  getPageSize: () => number;
  api: any;
}
