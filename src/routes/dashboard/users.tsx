import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/core/components/layout/page";
import { CardAction } from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { createFileRoute } from "@tanstack/react-router";

// const t2Prefix = "t2-";

export const Route = createFileRoute("/dashboard/users")({
  // validateSearch: dataQueryStateSchema.extend(
  //   withSchemaPrefix(t2Prefix, dataQueryStateSchema).shape,
  // ),
  // validateSearch: dataQueryStateSchema,
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/users") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  // const searchParam = Route.useSearch();
  // const navigate = Route.useNavigate();

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manajemen Pengguna</PageTitle>
        <PageDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </PageDescription>

        <CardAction>{/* <CreateUserModal /> */}</CardAction>
      </PageHeader>

      <Separator />

      {/* <UserDataTable
        defaultState={searchParam}
        onStateChange={(search) =>
          navigate({
            search: (prev) => ({ ...prev, ...search }),
            replace: true,
          })
        }
      /> */}

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
    </PageContainer>
  );
}
