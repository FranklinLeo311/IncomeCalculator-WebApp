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
import { Pagination, PaginationProps, Select, Typography } from "antd";
import { RowClickedEvent } from "ag-grid-community";
import useWindowWidth from "../hooks/useWindowWidth";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

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

    // Calculate pagination info
    const paginationInfo = useMemo(() => {
      if (!pagination) return null;

      const startItem = (page - 1) * pageSize + 1;
      const endItem = Math.min(page * pageSize, filteredRowCount);

      return {
        startItem,
        endItem,
        total: filteredRowCount,
      };
    }, [page, pageSize, filteredRowCount, pagination]);

    const totalPages = useMemo(() => {
      return Math.ceil(filteredRowCount / pageSize);
    }, [filteredRowCount, pageSize]);

    const adjustHeaderHeight = useCallback(() => {
      const { api } = gridRef.current || {};
      if (!api) return;

      const elementList = document.querySelectorAll(
        ".ag-header-cell .ag-header-cell-text"
      );
      let max = 35;
      elementList.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const h = Math.ceil(rect.height) + 6;
        if (h > max) max = h;
      });

      max = max + 5;

      if (max !== headerHeight) setHeaderHeight(max);
    }, [headerHeight]);

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

    const handlePageChange = (newPage: number, newPageSize: number) => {
      setPage(newPage);
      setPageSize(newPageSize);
      gridRef.current?.api.paginationGoToPage(newPage - 1);
      setTimeout(() => {
        gridRef.current?.api.sizeColumnsToFit();
      }, 250);
    };

    const itemRender: PaginationProps["itemRender"] = (
      _,
      type,
      originalElement
    ) => {
      if (type === "prev") {
        return;
      }
      if (type === "next") {
        return;
      }
      return originalElement;
    };

    return (
      <div
        className={`rounded-md w-full h-full ${className} ${
          !pagination ? "no-pagination-table" : ""
        } ${isFilteredEmpty ? "ag-no-rows-table" : ""}`}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout={domLayout}
          quickFilterText={searchText}
          singleClickEdit={isEditable}
          loading={loading}
          onGridReady={onGridReady}
          onRowClicked={onRowClicked}
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
          overlayNoRowsTemplate={`<div class="flex items-center justify-center text-gray-500 text-sm h-full">
    No record found
  </div>`}
          {...gridProps}
          {...paginationProps}
          {...rest}
        />

        {pagination && filteredRowCount > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 rounded-b-md dark:bg-[var(--bg-secondary)] shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-sm">Items per page:</span>
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setPage(1);
                  gridRef.current?.api.paginationGoToPage(0);
                  setTimeout(() => {
                    gridRef.current?.api.sizeColumnsToFit();
                  }, 250);
                }}
                className="w-20"
                size="small"
              >
                {pageSizes.map((size) => (
                  <Option key={size} value={size} >
                    {size}
                  </Option>
                ))}
              </Select>

              {paginationInfo && (
                <span className="text-sm text-[#969696]">
                  {`${paginationInfo.startItem}-${paginationInfo.endItem} of ${paginationInfo.total} items`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 ">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={filteredRowCount}
                showSizeChanger={false}
                onChange={handlePageChange}
                className="pagination-custom"
                itemRender={itemRender}
              />

              <div className="h-8 border-l border-gray-300 dark:border-gray-600" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, page - 1), pageSize)
                  }
                  disabled={page === 1}
                  className="flex items-center justify-center w-8 h-8  rounded hover:border-blue-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-current transition-colors"
                  aria-label="Previous page"
                >
                  <LeftOutlined />
                </button>
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1), pageSize)
                  }
                  disabled={page >= totalPages}
                  className="flex items-center justify-center w-8 h-8 rounded hover:border-blue-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-current transition-colors"
                  aria-label="Next page"
                >
                  <RightOutlined />
                </button>
              </div>
            </div>
          </div>
        )}

        {pagination && filteredRowCount === 0 && (
          <div className="flex justify-center items-center mt-4 p-3 bg-gray-50 rounded-lg border">
            <Text type="secondary">No data available</Text>
          </div>
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
  resetTableUI?: any;
  [key: string]: any;
}

export interface DataTableRef {
  setPageNumber: (page: number, pageSize?: number) => void;
  handleResizeToFit: () => void;
  getPageSize: () => number;
  api: any;
}
