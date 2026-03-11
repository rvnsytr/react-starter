import {
  Page,
  PageAction,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/core/components/layout/page";
import { Button } from "@/core/components/ui/button";
import { CardAction } from "@/core/components/ui/card";
import { dataQueryStateSchema } from "@/core/components/ui/data-controller";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { CreateUserModal, UserDataTable } from "@/modules/auth/components";
import { createFileRoute } from "@tanstack/react-router";
import { EllipsisIcon } from "lucide-react";

// const t2Prefix = "t2-";

export const Route = createFileRoute("/dashboard/users")({
  // validateSearch: dataQueryStateSchema.extend(
  //   withSchemaPrefix(t2Prefix, dataQueryStateSchema).shape,
  // ),
  validateSearch: dataQueryStateSchema,
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/users") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const searchParam = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <Page>
      <PageHeader>
        <PageTitle>Manajemen Pengguna</PageTitle>
        <PageDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </PageDescription>

        <PageAction className="flex lg:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon-sm" variant="outline">
                <EllipsisIcon />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="grid gap-y-1 p-1">
              <CreateUserModal
                size="sm"
                variant="ghost"
                className="justify-start"
              />
            </PopoverContent>
          </Popover>
        </PageAction>

        <CardAction className="hidden lg:flex">
          <CreateUserModal />
        </CardAction>
      </PageHeader>

      <Separator />

      <UserDataTable
        defaultState={searchParam}
        onStateChange={(search) =>
          navigate({
            search: (prev) => ({ ...prev, ...search }),
            replace: true,
          })
        }
      />

      {/* <OtherDataTable
        defaultState={Object.fromEntries(
          Object.entries(searchParam)
            .filter(([k]) => k.startsWith(t2Prefix))
            .map(([k, v]) => [k.replace(t2Prefix, ""), v]),
        )}
        onStateChange={(state) =>
          navigate({
            search: (prev) => ({
              ...prev,
              ...Object.fromEntries(
                Object.entries(state).map(([k, v]) => [`t2-${k}`, v]),
              ),
            }),
            replace: true,
          })
        }
      /> */}
    </Page>
  );
}
