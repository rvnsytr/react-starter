import { messages } from "@/core/constants/messages";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { formatNumber } from "@/core/utils/formaters";
import { cn } from "@/core/utils/helpers";
import { flexRender, Row, Table as TableType } from "@tanstack/react-table";
import { ButtonGroup } from "./button-group";
import {
  DataController,
  DataControllerProps,
  dataSizes,
  defaultDataSize,
} from "./data-controller";
import {
  ActiveFilters,
  ActiveFiltersMobileContainer,
  FilterActions,
  FilterSelector,
} from "./data-table-filter";
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

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  RotateCcwSquareIcon,
  SearchIcon,
  ViewIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Kbd } from "./kbd";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

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
      render={({ table, columns, data, isLoading }) => {
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
                  <FilterSelector table={table} />
                  <View table={table} />
                </ButtonGroup>

                {isSelected && !isMobile && (
                  <Separator orientation="vertical" className="h-4" />
                )}

                {isSelected &&
                  renderRowSelection?.({ table, rows: selectedRows })}
              </div>

              <div className="flex gap-x-2 *:grow">
                <Reset table={table} />
                <Search
                  table={table}
                  placeholder={placeholder?.search ?? "Cari..."}
                  className="col-span-2"
                />
              </div>
            </div>

            {table.getState().columnFilters.length > 0 && (
              <ActiveFiltersMobileContainer
                className={classNames?.filterContainer}
              >
                <FilterActions table={table} />
                <Separator orientation="vertical" className="h-4" />
                <ActiveFilters table={table} />
              </ActiveFiltersMobileContainer>
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
              <RowsPerPage
                table={table}
                className="order-4 shrink-0 lg:order-1"
              />

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

              <Pagination
                table={table}
                className="order-3 shrink-0 lg:order-5"
              />
            </div>
          </div>
        );
      }}
    />
  );
}

function View<TData>({ table }: { table: TableType<TData> }) {
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ViewIcon /> Lihat
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={isMobile ? "end" : "center"}
        className="flex flex-col gap-y-1 p-0"
      >
        <Command>
          <CommandInput placeholder="Cari Kolom..." />
          <CommandList className="p-1">
            <CommandEmpty>{messages.empty}</CommandEmpty>

            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const cbId = `cb-${column.id}`;
                const isVisible = column.getIsVisible();
                const Icon = column.columnDef.meta?.icon;
                return (
                  <CommandItem key={cbId} className="justify-between" asChild>
                    <Label htmlFor={cbId}>
                      <div className="flex items-center gap-x-2">
                        {Icon && (
                          <Icon className="text-muted-foreground group-hover:text-primary transition-colors" />
                        )}

                        <small className="font-medium">
                          {column.columnDef.meta?.label ?? column.id}
                        </small>
                      </div>

                      <Checkbox
                        id={cbId}
                        checked={isVisible}
                        onCheckedChange={(v) => column.toggleVisibility(!!v)}
                      />
                    </Label>
                  </CommandItem>
                );
              })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function Reset<TData>({
  table,
  className,
}: {
  table: TableType<TData>;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => {
        table.reset();

        table.resetPagination();
        // table.resetPageIndex();
        // table.resetPageSize();

        table.resetColumnOrder();
        table.resetColumnSizing();
        table.resetColumnVisibility();
        table.resetColumnPinning();
        table.resetColumnFilters();

        table.resetRowPinning();
        table.resetRowSelection();

        // table.resetGlobalFilter();
        table.setGlobalFilter("");

        table.resetSorting();
        table.resetGrouping();
        table.resetExpanded();
        table.resetHeaderSizeInfo();
      }}
    >
      <RotateCcwSquareIcon /> {messages.actions.reset}
    </Button>
  );
}

function Search<TData>({
  table,
  placeholder = "Cari...",
  className,
}: {
  table: TableType<TData>;
  placeholder?: string;
  className?: string;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <InputGroup className={className}>
      <InputGroupInput
        ref={searchRef}
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        {/* <Kbd>⌘</Kbd> */}
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

function Pagination<TData>({
  table,
  className,
}: {
  table: TableType<TData>;
  className?: string;
}) {
  const isMobile = useIsMobile();

  const size = isMobile ? "icon" : "icon-sm";
  const variant = "outline";
  return (
    <ButtonGroup className={cn(className)}>
      <Button
        size={size}
        variant={variant}
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

function RowsPerPage<TData>({
  table,
  className,
}: {
  table: TableType<TData>;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Label>Baris per halaman</Label>
      <Select
        value={String(table.getState().pagination.pageSize ?? defaultDataSize)}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {dataSizes.map((v) => (
            <SelectItem
              key={v}
              value={String(v)}
              className={cn(v === defaultDataSize && "font-semibold")}
            >
              {formatNumber(v)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
