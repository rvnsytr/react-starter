"use client";

import { delay } from "@/core/utils";
import { useRouter } from "@tanstack/react-router";
import { RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../spinner";
import { Button, ButtonProps } from "./button";

export function RefreshButton({
  text = "Muat Ulang",
  disabled,
  onClick,
  ...props
}: Omit<ButtonProps, "children"> & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Button
      disabled={refreshing || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setRefreshing(true);
        await delay(0.5);
        router.invalidate();
        setRefreshing(false);
      }}
      {...props}
    >
      <LoadingSpinner
        variant="refresh"
        loading={refreshing}
        className="animate-reverse"
        icon={{ base: <RefreshCcwIcon /> }}
      />
      {text}
    </Button>
  );
}
