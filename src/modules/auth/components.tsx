import { apiFetcher } from "@/core/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { FieldWrapper } from "@/core/components/ui/field-wrapper";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { appMeta, messages } from "@/core/constants";
import { sharedSchemas } from "@/core/schemas";
import { cn } from "@/core/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IdCard,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import z from "zod";
import { Role, rolesMeta, Session } from "./constants";
import { userSchema } from "./schemas";

export function SignOutButton() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="outline_destructive"
      className="text-destructive hover:text-destructive"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        toast.promise(
          apiFetcher("/auth/logout", z.null(), { method: "DELETE" }),
          {
            loading: messages.loading,
            success: (res) => {
              setTimeout(() => (window.location.href = "/sign-in"), 1000);
              // navigate({ to: "/sign-in" });
              return res.message;
            },
            error: (e) => {
              setIsLoading(false);
              return e.message;
            },
          },
        );
      }}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOut /> }} /> Keluar
    </SidebarMenuButton>
  );
}

export function SignInForm() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema.pick({ email: true, password: true });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const formHandler = (formData: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      apiFetcher("/auth/login", z.any(), {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      }),
      {
        loading: messages.loading,
        success: (res) => {
          setTimeout(() => (window.location.href = "/dashboard"), 1000);
          // navigate({ to: "/dashboard" });
          return res.message;
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Alamat email"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <InputGroup>
              <InputGroupInput
                type="email"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan email anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
          </FieldWrapper>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Kata sandi"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <InputGroup>
              <InputGroupInput
                type="password"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan kata sandi anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
          </FieldWrapper>
        )}
      />

      <Button type="submit" className="mt-2" disabled={isLoading}>
        <LoadingSpinner loading={isLoading} icon={{ base: <LogIn /> }} />
        Masuk ke Dashboard
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ name: true, email: true, agreement: true })
    .extend({ no_peg: sharedSchemas.string("Nomor pegawai") });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", no_peg: "", agreement: false },
  });

  const formHandler = (formData: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      apiFetcher("/auth/register", z.any(), {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      }),
      {
        loading: messages.loading,
        success: (res) => {
          setIsLoading(false);
          form.reset();
          mutate("/users");
          return res.message;
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Nama"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <InputGroup>
              <InputGroupInput
                type="text"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan nama anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <UserRound />
              </InputGroupAddon>
            </InputGroup>
          </FieldWrapper>
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Alamat email"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <InputGroup>
              <InputGroupInput
                type="email"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan email anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
          </FieldWrapper>
        )}
      />

      <Controller
        name="no_peg"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Nomor Pegawai"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <InputGroup>
              <InputGroupInput
                type="text"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan nomor pegawai anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <IdCard />
              </InputGroupAddon>
            </InputGroup>
          </FieldWrapper>
        )}
      />

      <Controller
        name="agreement"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={!!fieldState.error}>
            <Checkbox
              id={field.name}
              name={field.name}
              aria-invalid={!!fieldState.error}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                Setujui syarat dan ketentuan
              </FieldLabel>
              <FieldDescription>
                Saya menyetujui{" "}
                <span className="text-foreground link-underline">
                  ketentuan layanan dan kebijakan privasi
                </span>{" "}
                {appMeta.name}.
              </FieldDescription>
              <FieldError errors={fieldState.error} />
            </FieldContent>
          </Field>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <LoadingSpinner
          loading={isLoading}
          icon={{ base: <UserRoundPlus /> }}
        />{" "}
        Daftar Sekarang
      </Button>
    </form>
  );
}

export function UserRoleBadge({
  value,
  className,
}: {
  value: Role;
  className?: string;
}) {
  const { displayName, desc, icon: Icon, color } = rolesMeta[value];
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <Badge
          variant="outline"
          style={{ "--badge-color": color } as React.CSSProperties}
          className={cn(
            "border-(--badge-color) text-(--badge-color) capitalize",
          )}
        >
          <Icon /> {displayName}
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        style={{ "--tooltip-color": color } as React.CSSProperties}
        className="bg-(--tooltip-color)"
        arrowClassName="bg-(--tooltip-color) fill-(--tooltip-color)"
      >
        {desc}
      </TooltipContent>
    </Tooltip>
  );
}

export function UserAvatar({
  image,
  name,
  className,
  classNames,
}: Pick<Session["user"], "image" | "name"> & {
  className?: string;
  classNames?: { image?: string; fallback?: string };
}) {
  return (
    <Avatar className={cn("rounded-lg", className)}>
      <AvatarImage
        src={image ?? undefined}
        className={cn("rounded-lg", classNames?.image)}
      />
      <AvatarFallback className={cn("rounded-lg", classNames?.fallback)}>
        {name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
