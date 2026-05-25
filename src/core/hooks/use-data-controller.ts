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
import { isValid } from "date-fns";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import z from "zod";
import { ActionResponse, ActionSuccess, Override } from "../types";
import {
  allDataFilterType,
  allFilterOperators,
  formatLocalizedDate,
  parseLocalizedDate,
} from "../utils";
import { useDebounce } from "./use-debounce";

const columnFiltersSchema = z.object({
  id: z.string(),
  value: z.object({
    operator: z.enum(allFilterOperators),
    values: z
      .union([
        z.string(),
        z.number(),
        z.coerce.date(),
        z.union([z.string(), z.number(), z.coerce.date()]).array(),
      ])
      .array(),
    columnMeta: z.object({
      label: z.string().exactOptional(),
      type: z.enum(allDataFilterType),
    }),
  }),
});

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

  const state: DataControllerState = useMemo(() => {
    const parsed = columnFiltersSchema.array().safeParse(columnFilters);
    return {
      globalFilter: debouncedSearch,
      pagination: pagination,
      sorting: sorting,
      columnFilters: parsed.success ? parsed.data : [],
    };
  }, [debouncedSearch, pagination, sorting, columnFilters]);

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

// #region Query Parsers

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

const sortingParser = {
  parse: (value?: string) => {
    if (!value) return [];
    return decodeURIComponent(value)
      .split(";")
      .map((part) => {
        const idx = part.indexOf(":");
        if (idx === -1) return null;

        const id = part.slice(0, idx).trim();
        const rawDir = part.slice(idx + 1).trim();

        if (!id || !rawDir) return null;

        const parsed = z.enum(["asc", "desc"]).safeParse(rawDir);
        if (!id || !parsed.success) return null;
        return { id, desc: parsed.data === "desc" };
      })
      .filter((v) => v !== null);
  },
  serialize: (value: DataControllerState["sorting"]) => {
    if (!value?.length) return undefined;
    const str = value
      .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
      .join(";");
    return encodeURIComponent(str);
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

const columnFiltersParser = {
  parse: (value?: string) => {
    if (!value) return [];
    return decodeURIComponent(value)
      .split(";")
      .map((part) => {
        /**
         * format:
         * type:id:operator:values
         *
         * example:
         * date:createdAt:is:20250101T0000
         */

        const first = part.indexOf(":");
        const second = part.indexOf(":", first + 1);
        const third = part.indexOf(":", second + 1);

        if (first === -1 || second === -1 || third === -1) return null;

        const rawType = part.slice(0, first);
        const id = part.slice(first + 1, second);
        const rawOperator = part.slice(second + 1, third);
        const rawValues = part.slice(third + 1);

        if (!rawType || !id || !rawOperator || !rawValues) return null;

        const parsedType = z.enum(allDataFilterType).safeParse(rawType);
        if (!parsedType.success) return null;

        const parsedOperator = z
          .enum(allFilterOperators)
          .safeParse(rawOperator);
        if (!parsedOperator.success) return null;

        const type = parsedType.data;
        const operator = parsedOperator.data;

        const values = rawValues
          .split(",")
          .map((v) => {
            switch (type) {
              case "date": {
                const d = parseLocalizedDate(v, "yyyyMMdd'T'HHmm");
                return isValid(d) ? d : null;
              }

              case "number": {
                const n = Number(v);
                return Number.isNaN(n) ? null : n;
              }

              default:
                return v;
            }
          })
          .filter((v) => !!v);

        if (!values.length) return null;

        return { id, value: { operator, values, columnMeta: { type } } };
      })
      .filter((v) => v !== null);
  },
  serialize: (value: DataControllerState["columnFilters"]) => {
    if (!value?.length) return undefined;

    const query = value
      .map(({ id, value: rawValue }) => {
        const parsed = columnFiltersSchema.shape.value.safeParse(rawValue);
        if (!parsed.success) return "";

        const { operator, values, columnMeta } = parsed.data;

        const serializedValues = values.map((v) =>
          v instanceof Date
            ? formatLocalizedDate(v, "yyyyMMdd'T'HHmm")
            : String(v),
        );

        return [columnMeta.type, id, operator, serializedValues.join(",")].join(
          ":",
        );
      })
      .filter(Boolean);

    if (!query.length) return undefined;
    return encodeURIComponent(query.join(";"));
  },
};

// #endregion

export const dataControllerQueryStateSchema = z.object({
  search: z.string().optional().catch(""),

  page: z.coerce.number().min(1).optional().catch(0),
  size: z.coerce.number().min(1).optional().catch(defaultPageSize),

  sorting: z.string().optional().catch(""),

  filter: z.string().optional().catch(""),

  left: z.string().optional().catch(""),
  right: z.string().optional().catch(""),

  hidden: z.string().optional().catch(""),

  selected: z.string().optional().catch(""),
});

export type DataControllerQueryState = z.infer<
  typeof dataControllerQueryStateSchema
>;

export type BaseQueryDataControllerOptions = {
  defaultState?: Partial<DataControllerQueryState>;
  onStateChange: (queryState: DataControllerQueryState) => void;
};

export type QueryDataControllerOptions<TData> = Override<
  DataControllerOptions<TData>,
  BaseQueryDataControllerOptions
>;

export function useQueryDataController<TData>({
  defaultState,
  onStateChange,
  ...props
}: QueryDataControllerOptions<TData>) {
  const [globalFilter, setGlobalFilter] = useState<string>(
    defaultState?.search ?? "",
  );

  const [pagination, setPagination] = useState<
    DataControllerState["pagination"]
  >({
    pageIndex: defaultState?.page ? defaultState.page - 1 : 0,
    pageSize: defaultState?.size ?? defaultPageSize,
  });

  const [sorting, setSorting] = useState<DataControllerState["sorting"]>(
    sortingParser.parse(defaultState?.sorting),
  );

  const [columnFilters, setColumnFilters] = useState<
    DataControllerState["columnFilters"]
  >(columnFiltersParser.parse(defaultState?.filter));

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: arrayParser.parse(defaultState?.left),
    right: arrayParser.parse(defaultState?.right),
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getRecordParser(false).parse(defaultState?.hidden),
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    getRecordParser(true).parse(defaultState?.selected),
  );

  const debouncedGlobalFilter = useDebounce(globalFilter);

  const onStateChangeEvent = useEffectEvent(() => {
    onStateChange({
      search: !!debouncedGlobalFilter ? debouncedGlobalFilter : undefined,

      page: pagination.pageIndex > 0 ? pagination.pageIndex + 1 : undefined,
      size:
        pagination.pageSize !== defaultPageSize
          ? pagination.pageSize
          : undefined,

      sorting: sortingParser.serialize(sorting),

      filter: columnFiltersParser.serialize(columnFilters),

      left: arrayParser.serialize(columnPinning.left),
      right: arrayParser.serialize(columnPinning.right),

      hidden: getRecordParser(false).serialize(columnVisibility),

      selected: getRecordParser(true).serialize(rowSelection),
    });
  });

  useEffect(
    () => onStateChangeEvent(),
    [
      debouncedGlobalFilter,
      pagination,
      sorting,
      columnPinning,
      columnVisibility,
      rowSelection,
      columnFilters,
    ],
  );

  return useStatelessDataController({
    ...props,
    state: {
      globalFilter: [globalFilter, setGlobalFilter],
      pagination: [pagination, setPagination],
      sorting: [sorting, setSorting],
      columnFilters: [columnFilters, setColumnFilters],
      columnPinning: [columnPinning, setColumnPinning],
      columnVisibility: [columnVisibility, setColumnVisibility],
      rowSelection: [rowSelection, setRowSelection],
    },
  });
}
