"use client";

import {
  ColumnDef as ColumnDefType,
  ColumnFiltersState,
  ColumnPinningState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import { ActionResponse, ActionSuccess, Override } from "../types";
import { useDebounce } from "./use-debounce";

export type DataControllerState = {
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>[];

export type AllDataControllerState = DataControllerState & {
  columnPinning: ColumnPinningState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
};

export type DataControllerQueryConfig<TData> = Override<
  SWRConfiguration,
  { fallbackData?: ActionSuccess<TData[]> }
>;

export type DataControllerResult<TData> = SWRResponse<ActionSuccess<TData[]>>;

export type DataControllerOptions<TData> = Pick<
  TableOptions<TData>,
  "getRowId" | "enableRowSelection"
> & {
  mode?: "auto" | "manual";
  columns:
    | ColumnDef<TData>
    | ((result?: DataControllerResult<TData>) => ColumnDef<TData>);
  query: {
    key: string;
    fetcher: (state: DataControllerState) => Promise<ActionResponse<TData[]>>;
    config?: DataControllerQueryConfig<TData>;
    immutable?: boolean;
  };
  defaultState?: Partial<AllDataControllerState>;
};

type StatelessDataControllerOptions<TData> = DataControllerOptions<TData> & {
  state: {
    [K in keyof AllDataControllerState]: [
      AllDataControllerState[K],
      OnChangeFn<AllDataControllerState[K]>,
    ];
  };
};

export type DataControllerResponse<TData> = {
  result: DataControllerResult<TData>;
  table: Table<TData>;
  columns: ColumnDef<TData>;
};

export const pageSizes = [5, 10, 20, 30, 40, 50, 100];
export const defaultPageSize = pageSizes[1];

export const mutateControlledData = (key: string) =>
  mutate((arg) => Array.isArray(arg) && arg[0] === key);

export function useStatelessDataController<TData>({
  mode,
  columns,
  query,

  state: {
    globalFilter: [globalFilter, setGlobalFilter],
    pagination: [pagination, setPagination],
    sorting: [sorting, setSorting],
    columnFilters: [columnFilters, setColumnFilters],
    columnPinning: [columnPinning, setColumnPinning],
    columnVisibility: [columnVisibility, setColumnVisibility],
    rowSelection: [rowSelection, setRowSelection],
  },

  getRowId,
  enableRowSelection,
}: StatelessDataControllerOptions<TData>): DataControllerResponse<TData> {
  const debouncedSearch = useDebounce(globalFilter);

  const state: DataControllerState = useMemo(
    () => ({
      globalFilter: debouncedSearch,
      pagination: pagination,
      sorting: sorting,
      columnFilters: columnFilters,
    }),
    [debouncedSearch, pagination, sorting, columnFilters],
  );

  const result = useSWR<ActionSuccess<TData[]>>(
    mode === "manual" ? [query.key, state] : [query.key],
    async () => {
      const res = await query.fetcher(state);
      if (!res.success) throw res;
      return res;
    },
    {
      ...query.config,
      revalidateIfStale:
        query.config?.revalidateIfStale ?? (query.immutable ? false : true),
      revalidateOnFocus:
        query.config?.revalidateOnFocus ?? (query.immutable ? false : true),
      revalidateOnReconnect:
        query.config?.revalidateOnReconnect ?? (query.immutable ? false : true),
    },
  );

  const resolvedColumns = useMemo(() => {
    if (typeof columns !== "function") return columns;
    return columns(result);
  }, [columns, result]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data: result.data?.data ?? [],

    state: {
      globalFilter,
      pagination,
      sorting,
      columnFilters,
      columnPinning,
      columnVisibility,
      rowSelection,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: mode === "auto" ? getFilteredRowModel() : undefined,

    // * Global Searching
    manualFiltering: mode === "manual",
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    // * Pagination
    manualPagination: mode === "manual",
    rowCount: mode === "manual" ? (result.data?.count?.total ?? 0) : undefined,
    onPaginationChange: setPagination,
    getPaginationRowModel:
      mode === "auto" ? getPaginationRowModel() : undefined,

    // * Column Sorting
    manualSorting: mode === "manual",
    onSortingChange: setSorting,
    getSortedRowModel: mode === "auto" ? getSortedRowModel() : undefined,

    // * Column Filtering
    onColumnFiltersChange: setColumnFilters,

    // ? Column Faceting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // ? Column Pinning
    onColumnPinningChange: setColumnPinning,

    // ? Column Visibility
    onColumnVisibilityChange: setColumnVisibility,

    // ? Row Selection
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
  });

  return { result, table, columns: resolvedColumns };
}

export function useDataController<TData>({
  defaultState,
  ...props
}: DataControllerOptions<TData>) {
  const globalFilter = useState<string>(defaultState?.globalFilter ?? "");

  const pagination = useState<DataControllerState["pagination"]>({
    pageIndex: defaultState?.pagination?.pageIndex ?? 0,
    pageSize: defaultState?.pagination?.pageSize ?? defaultPageSize,
  });

  const sorting = useState<DataControllerState["sorting"]>(
    defaultState?.sorting ?? [],
  );

  const columnFilters = useState<DataControllerState["columnFilters"]>(
    defaultState?.columnFilters ?? [],
  );

  const columnPinning = useState<ColumnPinningState>({
    left: defaultState?.columnPinning?.left ?? [],
    right: defaultState?.columnPinning?.right ?? [],
  });

  const columnVisibility = useState<VisibilityState>(
    defaultState?.columnVisibility ?? {},
  );

  const rowSelection = useState<RowSelectionState>(
    defaultState?.rowSelection ?? {},
  );

  return useStatelessDataController({
    ...props,
    state: {
      globalFilter,
      pagination,
      sorting,
      columnFilters,
      columnPinning,
      columnVisibility,
      rowSelection,
    },
  });
}
