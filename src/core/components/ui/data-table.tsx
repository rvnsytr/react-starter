import { messages } from "@/core/constants/messages";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { formatNumber } from "@/core/utils/formaters";
import { cn } from "@/core/utils/helpers";
import { flexRender, Row, Table as TableType } from "@tanstack/react-table";
import { ButtonGroup } from "./button-group";
import {
  DataController,
  DataControllerPageSize,
  DataControllerPaginationNav,
  DataControllerProps,
  DataControllerSearch,
  DataControllerVisibility,
} from "./data-controller";
import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  ResetFilters,
} from "./data-filter";
import { Label } from "./label";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export type DataTableProps<TData> = {
  caption?: string;
  placeholder?: {
    table?: string;
    search?: string;
  };

  className?: string;
  classNames?: {
    toolbox?: string;
    filterContainer?: string;
    tableContainer?: string;
    table?: string;
    footer?: string;
  };

  renderRowSelection?: (props: {
    rows: Row<TData>[];
    table: TableType<TData>;
  }) => React.ReactNode;
};

export function DataTable<TData>({
  caption,
  placeholder,

  className,
  classNames,

  renderRowSelection,
  ...props
}: Omit<DataControllerProps<TData>, "render"> & DataTableProps<TData>) {
  const isMobile = useIsMobile();
  return (
    <DataController
      {...props}
      render={({ result, table, columns }) => {
        const { data, isLoading } = result;

        const state = table.getState();
        const pageCount = table.getPageCount();

        const selectedRowsCount =
          Object.keys(state.rowSelection).length ??
          table.getFilteredSelectedRowModel().rows.length;
        const rowsCount =
          data?.count?.total ?? table.getFilteredRowModel().rows.length;

        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const isSelected = selectedRows.length > 0;

        return (
          <div className={cn("flex flex-col gap-y-4", className)}>
            <div
              className={cn(
                "flex w-full flex-col gap-2 lg:flex-row lg:justify-between",
                className,
              )}
            >
              <div
                className={cn(
                  "flex flex-col gap-2 lg:flex-row lg:items-center",
                )}
              >
                <ButtonGroup className="w-full lg:w-fit [&_button]:grow">
                  <FilterSelector table={table} disabled={isLoading} />

                  <DataControllerVisibility
                    table={table}
                    align={isMobile ? "start" : "center"}
                    disabled={isLoading}
                  />
                </ButtonGroup>

                {isSelected && !isMobile && (
                  <Separator orientation="vertical" className="h-4" />
                )}

                {isSelected &&
                  renderRowSelection?.({ table, rows: selectedRows })}
              </div>

              <div className="flex gap-x-2 *:grow">
                <ResetFilters table={table} disabled={isLoading} />

                <DataControllerSearch
                  table={table}
                  placeholder={placeholder?.search}
                  disabled={isLoading}
                />
              </div>
            </div>

            {state.columnFilters.length > 0 && (
              <ActiveFiltersContainer className={classNames?.filterContainer}>
                <ClearFilters table={table} />
                <Separator orientation="vertical" className="h-4" />
                <ActiveFilters table={table} />
              </ActiveFiltersContainer>
            )}

            <Table
              className={classNames?.table}
              containerClassName={cn(
                "rounded-lg border",
                classNames?.tableContainer,
              )}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(
                      ({ id, column, isPlaceholder, getContext }) => {
                        const columnPinned = column.getIsPinned();
                        return (
                          <TableHead
                            key={id}
                            className={cn(
                              "z-10 text-center",
                              columnPinned && "bg-background/90 sticky z-20",
                              columnPinned === "left" && "left-0",
                              columnPinned === "right" && "right-0",
                            )}
                            // style={{
                            //   left: column.getStart("left"),
                            //   right: column.getAfter("right"),
                            // }}
                          >
                            {!isPlaceholder &&
                              flexRender(column.columnDef.header, getContext())}
                          </TableHead>
                        );
                      },
                    )}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: state.pagination.pageSize }).map(
                    (_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={columns.length}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row
                        .getVisibleCells()
                        .map(({ id, column, getContext }) => {
                          const columnPinned = column.getIsPinned();
                          return (
                            <TableCell
                              key={id}
                              className={cn(
                                "z-10",
                                columnPinned && "bg-background/90 sticky z-20",
                                columnPinned === "left" && "left-0",
                                columnPinned === "right" && "right-0",
                              )}
                              // style={{
                              //   left: column.getStart("left"),
                              //   right: column.getAfter("right"),
                              // }}
                            >
                              {flexRender(column.columnDef.cell, getContext())}
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-muted-foreground py-4 text-center whitespace-pre-line"
                    >
                      {placeholder?.table ?? messages.empty}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div
              className={cn(
                "flex w-full flex-col items-center gap-4 text-center lg:flex-row",
                classNames?.footer,
              )}
            >
              <div className="order-4 flex shrink-0 items-center gap-x-2 lg:order-1">
                <Label>Baris per halaman</Label>
                <DataControllerPageSize table={table} disabled={isLoading} />
              </div>

              <small className="text-muted-foreground order-3 shrink-0 lg:order-2">
                {formatNumber(selectedRowsCount)} dari{" "}
                {isLoading ? "?" : formatNumber(rowsCount)} baris dipilih
              </small>

              <small className="text-muted-foreground order-1 mx-auto text-sm lg:order-3">
                {caption}
              </small>

              <small className="order-2 shrink-0 tabular-nums lg:order-4">
                Halaman{" "}
                {isLoading ? "?" : formatNumber(state.pagination.pageIndex + 1)}{" "}
                dari{" "}
                {isLoading ? "?" : formatNumber(pageCount > 0 ? pageCount : 1)}
              </small>

              <DataControllerPaginationNav
                table={table}
                size={isMobile ? "icon" : "icon-sm"}
                className="order-3 shrink-0 lg:order-5"
                disabled={isLoading}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
