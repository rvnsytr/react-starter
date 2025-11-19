import { Button } from "@/core/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/core/components/ui/empty";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { LinkSpinner } from "../ui/spinner";

export function NotFound({ className }: { className?: string }) {
  return (
    <Empty className={className}>
      <EmptyHeader className="lg:max-w-2xl">
        <EmptyMedia>
          <img
            src="/404.png"
            alt="Not found"
            width={1400}
            height={800}
            loading="eager"
            className="animate-fade-down h-auto lg:max-w-md"
          />
        </EmptyMedia>
        <EmptyTitle className="text-muted-foreground animate-fade-up w-full text-4xl font-bold">
          Halaman yang dituju tidak ditemukan
        </EmptyTitle>
        <EmptyDescription className="animate-fade-up text-base delay-250">
          Mohon periksa kembali alamat url atau kembali ke halaman utama.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          size="lg"
          className="animate-fade-up rounded-full delay-500"
          asChild
        >
          <Link to="/">
            <LinkSpinner icon={{ base: <Home /> }} />
            Kembali ke Beranda
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
