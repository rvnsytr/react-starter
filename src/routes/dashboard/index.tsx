import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/core/components/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer>
      <PageHeader className="border-b">
        <PageTitle>Dashboard</PageTitle>
        <PageDescription>
          Welcome to the dashboard! Here you can find an overview of your
          account and access various features.
        </PageDescription>
      </PageHeader>

      <p>Hello World</p>
    </PageContainer>
  );
}
