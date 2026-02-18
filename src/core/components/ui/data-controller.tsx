// * Headless state controller for managing tabular data.

import { ApiResponse } from "@/core/api";
import { allFilterOperators } from "@/core/data-filter";
import { useDebounce } from "@/core/hooks/use-debounce";
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
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  Table as TableType,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { isValid } from "date-fns";
import { ReactNode, useEffect, useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import z from "zod";
import { ErrorFallback } from "./fallback";

export const columnFiltersSchema = z.object({
  id: z.string(),
  value: z.object({
    operator: z.enum(allFilterOperators),
    values: z.union([z.string(), z.number(), z.coerce.date()]).array(),
  }),
});

export const dataQueryStateSchema = z.object({
  hidden: z.string().optional().catch(""),

  left: z.string().optional().catch(""),
  right: z.string().optional().catch(""),

  selected: z.string().optional().catch(""),

  search: z.string().optional().catch(""),
  columnFilters: z.string().optional().catch(""),
  sorting: z.string().optional().catch(""),

  page: z.coerce.number().min(1).optional().catch(0),
  size: z.coerce.number().min(1).optional().catch(10),
});

export type DataQueryState = z.infer<typeof dataQueryStateSchema>;

export type DataQueryStateProps = {
  defaultState?: DataQueryState;
  onStateChange?: (state: DataQueryState) => void;
};

export type DataState = {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  pagination: PaginationState;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>[];

export type DataControllerProps<TData> = DataQueryStateProps &
  Pick<TableOptions<TData>, "getRowId" | "enableRowSelection"> & {
    mode?: "auto" | "manual";
    query: {
      key: string;
      fetcher: (state: DataState) => Promise<ApiResponse<TData[]>>;
      config?: SWRConfiguration;
    };

    columns:
      | ColumnDef<TData>
      | ((response?: ApiResponse<TData[]>) => ColumnDef<TData>);

    render: (context: {
      result: SWRResponse<ApiResponse<TData[]>>;
      table: TableType<TData>;
      columns: ColumnDef<TData>;
    }) => ReactNode;
  };

// #region Query State Parser

const arrayParser = {
  parse: (value?: string) => {
    if (!value) return [];
    return decodeURIComponent(value).split(",");
  },
  serialize: (value?: string[]) => {
    if (!value?.length) return undefined;
    return encodeURIComponent(value.join(","));
  },
};

const getRecordParser = (parseValue: boolean) => ({
  parse: (value?: string) => {
    if (!value) return {};
    const entries = decodeURIComponent(value)
      .split(",")
      .map((v) => [v, parseValue]);
    return Object.fromEntries(entries);
  },
  serialize: (value: Record<string, boolean>) => {
    const entries = Object.entries(value);
    if (!entries.length) return undefined;
    const str = entries
      .map(([k, v]) => (v === parseValue ? k : null))
      .filter((v) => !!v)
      .join(",");
    if (!str) return undefined;
    return encodeURIComponent(str);
  },
});

const sortingParser = {
  parse: (value?: string) => {
    if (!value) return [];
    return decodeURIComponent(value)
      .split(";")
      .map((part) => {
        const [id, rawDir] = part.split(":");
        const parsed = z.enum(["asc", "desc"]).safeParse(rawDir);
        if (!id || !parsed.success) return null;
        return { id, desc: parsed.data === "desc" };
      })
      .filter((v) => !!v);
  },
  serialize: (value: SortingState) => {
    if (!value.length) return undefined;
    const str = value
      .map((v) => `${v.id}:${v.desc ? "desc" : "asc"}`)
      .join(";");
    return encodeURIComponent(str);
  },
};

function columnFiltersParser<TData>() {
  return {
    parse: (
      columns: ColumnDef<TData> | (() => ColumnDef<TData>),
      value?: string,
    ) => {
      if (!value) return [];
      return decodeURIComponent(value)
        .split(";")
        .map((part) => {
          const [id, operator, rawValues = ""] = part.split(":");
          if (!id || !operator || !rawValues) return null;

          const resolvedColumns =
            typeof columns === "function" ? columns() : columns;
          const column = resolvedColumns.find((c) => c.id === id);
          if (!column) return null;

          const values = rawValues
            ? rawValues
                .split(",")
                .map((v) => {
                  if (column.meta?.type === "date") {
                    const d = new Date(Number(v));
                    if (isValid(d)) return d;
                    else return null;
                  }

                  if (column.meta?.type === "number") {
                    const n = Number(v);
                    if (!Number.isNaN(n)) return n;
                    else return null;
                  }

                  return v;
                })
                .filter((v) => !!v)
            : [];

          if (!values.length) return null;
          return { id, value: { operator, values } };
        })
        .filter((v) => !!v);
    },
    serialize: (value: ColumnFiltersState) => {
      if (!value?.length) return undefined;

      const str = value
        .map(({ id, value: rawValue }) => {
          const parsed = columnFiltersSchema.shape.value.safeParse(rawValue);
          if (!parsed.success) return null;

          const { operator, values } = parsed.data;
          const serializedValues = values.map((v) =>
            v instanceof Date ? v.getTime() : String(v),
          );

          return `${id}:${operator}:${serializedValues.join(",")}`;
        })
        .filter((v) => !!v)
        .join(";");

      return encodeURIComponent(str);
    },
  };
}

// #endregion

export const dataSizes = [5, 10, 20, 30, 40, 50, 100];
export const defaultDataSize = dataSizes[1];

export const mutateData = (key: string) =>
  mutate((a) => !!a && typeof a === "object" && "key" in a && a.key === key);

export function DataController<TData>({
  mode = "auto",
  query,
  columns,

  defaultState,
  onStateChange,

  render,

  getRowId,
  enableRowSelection,
}: DataControllerProps<TData>) {
  const isManual = mode === "manual";

  // #region Query State

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getRecordParser(false).parse(defaultState?.hidden),
  );

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: arrayParser.parse(defaultState?.left),
    right: arrayParser.parse(defaultState?.right),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    getRecordParser(true).parse(defaultState?.selected),
  );

  const [globalFilter, setGlobalFilter] = useState<string>(
    defaultState?.search ?? "",
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    columnFiltersParser<TData>().parse(columns, defaultState?.columnFilters),
  );

  const [sorting, setSorting] = useState<SortingState>(
    sortingParser.parse(defaultState?.sorting),
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: defaultState?.page ? defaultState.page - 1 : 0,
    pageSize: defaultState?.size ?? defaultDataSize,
  });

  const debouncedGlobalFilter = useDebounce(globalFilter);

  const dataState: DataState = useMemo(
    () => ({
      globalFilter: debouncedGlobalFilter,
      columnFilters,
      sorting,
      pagination,
    }),
    [debouncedGlobalFilter, columnFilters, sorting, pagination],
  );

  useEffect(() => {
    onStateChange?.({
      hidden: getRecordParser(false).serialize(columnVisibility),

      left: arrayParser.serialize(columnPinning.left),
      right: arrayParser.serialize(columnPinning.right),

      selected: getRecordParser(true).serialize(rowSelection),

      search: !!debouncedGlobalFilter ? debouncedGlobalFilter : undefined,
      columnFilters: columnFiltersParser().serialize(columnFilters),
      sorting: sortingParser.serialize(sorting),

      page: pagination.pageIndex > 0 ? pagination.pageIndex + 1 : undefined,
      size:
        pagination.pageSize !== defaultDataSize
          ? pagination.pageSize
          : undefined,
    } satisfies DataQueryState);
  }, [
    onStateChange,
    columnVisibility,
    columnPinning,
    rowSelection,
    debouncedGlobalFilter,
    columnFilters,
    sorting,
    pagination,
  ]);

  // #endregion

  const baseSWRKey = { key: query.key };
  const { data, isLoading, error, ...rest } = useSWR(
    isManual ? { ...baseSWRKey, ...dataState } : baseSWRKey,
    async () => await query.fetcher(dataState),
    query.config,
  );

  const resolvedColumns = useMemo(
    () =>
      typeof columns === "function"
        ? data?.success
          ? columns(data)
          : columns()
        : columns,
    [data, columns],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data: data?.success ? data.data : [],

    state: {
      globalFilter,
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
      rowSelection,
      columnPinning,
    },

    getCoreRowModel: getCoreRowModel(),

    // ? Column Faceting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // ? Column Pinning
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,

    // ? Row Selection
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,

    // * Global Searching
    manualFiltering: isManual,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    // * Column Filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: !isManual ? getFilteredRowModel() : undefined,

    // * Column Sorting
    manualSorting: isManual,
    onSortingChange: setSorting,
    getSortedRowModel: !isManual ? getSortedRowModel() : undefined,

    // * Pagination
    manualPagination: isManual,
    rowCount: data?.count?.total ?? 0,
    onPaginationChange: setPagination,
    getPaginationRowModel: !isManual ? getPaginationRowModel() : undefined,
  });

  if (error) return <ErrorFallback error={error} />;
  if (!isLoading && !data?.success)
    return <ErrorFallback error={data?.error} />;

  return render({
    result: { data, isLoading, error, ...rest },
    table,
    columns: resolvedColumns,
  });
}
