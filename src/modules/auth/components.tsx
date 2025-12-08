import { authClient } from "@/core/auth";
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
import { GithubIcon } from "@/core/components/ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import { PasswordInput } from "@/core/components/ui/password-input";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { appMeta, messages } from "@/core/constants";
import { cn } from "@/core/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  LogIn,
  LogOut,
  Mail,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Role, rolesMeta, Session } from "./constants";
import { userSchema } from "./schemas";

const sharedText = {
  signIn: "Berhasil masuk - Selamat datang!",
  signOn: (social: string) => `Lanjutkan dengan ${social}`,
  lastUsed: "Terakhir digunakan",

  passwordNotMatch: messages.thingNotMatch("Kata sandi Anda"),
  revokeSession: "Cabut Sesi",
};

// #region SIGN

export function SignOutButton() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="outline_destructive"
      className="text-destructive hover:text-destructive"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Berhasil keluar - Sampai jumpa!");
              navigate({ to: "/sign-in" });
            },
            onError: ({ error }) => {
              setIsLoading(false);
              toast.error(error.message);
            },
          },
        });
      }}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOut /> }} /> Keluar
    </SidebarMenuButton>
  );
}

export function SignOnGithubButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const wasLastUsed = authClient.isLastUsedLoginMethod("github");

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      className="relative"
      onClick={() => {
        setIsLoading(true);
        authClient.signIn.social(
          {
            provider: "github",
            callbackURL: "/dashboard",
            errorCallbackURL: "/sign-in",
          },
          {
            onSuccess: () => {
              toast.success(sharedText.signIn);
            },
            onError: ({ error }) => {
              setIsLoading(false);
              toast.error(error.message);
            },
          },
        );
      }}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <GithubIcon /> }} />
      {sharedText.signOn("Github")}
      {/* {wasLastUsed && (
        <Badge
          variant="outline"
          className="bg-card absolute -top-3 right-1 shadow"
        >
          {sharedText.lastUsed}
        </Badge>
      )} */}
    </Button>
  );
}

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const wasLastUsed = authClient.isLastUsedLoginMethod("email");

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ email: true, password: true })
    .extend({ rememberMe: z.boolean() });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = (formData: FormSchema) => {
    setIsLoading(true);
    authClient.signIn.email(
      { ...formData, callbackURL: "/dashboard" },
      {
        onSuccess: () => {
          toast.success(sharedText.signIn);
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
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
            <PasswordInput
              id={field.name}
              aria-invalid={!!fieldState.error}
              placeholder="Masukan kata sandi anda"
              required
              {...field}
            />
          </FieldWrapper>
        )}
      />

      <Controller
        name="rememberMe"
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
            <Label htmlFor={field.name}>Ingat Saya</Label>
          </Field>
        )}
      />

      <Button type="submit" className="relative" disabled={isLoading}>
        <LoadingSpinner loading={isLoading} icon={{ base: <LogIn /> }} />
        Masuk ke Dashboard
        {/* {wasLastUsed && (
          <Badge className="bg-primary absolute -top-3 right-1 border border-transparent shadow">
            {sharedText.lastUsed}
          </Badge>
        )} */}
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ name: true, email: true, newPassword: true, confirmPassword: true })
    .extend({
      agreement: z.boolean().refine((v) => v, {
        error:
          "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
      }),
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formHandler = ({ newPassword: password, ...rest }: FormSchema) => {
    setIsLoading(true);
    authClient.signUp.email(
      { password, ...rest },
      {
        onSuccess: () => {
          setIsLoading(false);
          form.reset();
          toast.success(
            "Akun berhasil dibuat. Silakan masuk untuk melanjutkan.",
          );
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
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
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Kata sandi"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <PasswordInput
              id={field.name}
              aria-invalid={!!fieldState.error}
              placeholder="Masukan kata sandi anda"
              required
              withList
              {...field}
            />
          </FieldWrapper>
        )}
      />

      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Konfirmasi kata sandi"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <PasswordInput
              id={field.name}
              aria-invalid={!!fieldState.error}
              placeholder="Konfirmasi kata sandi anda"
              required
              {...field}
            />
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
                <span className="text-foreground">
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

// #endregion

// #region USER

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

export function UserVerifiedBadge({
  withoutText = false,
  className,
  classNames,
}: {
  withoutText?: boolean;
  className?: string;
  classNames?: { badge?: string; icon?: string; content?: string };
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {withoutText ? (
          <BadgeCheck
            className={cn("text-rvns size-4 shrink-0", classNames?.icon)}
          />
        ) : (
          <Badge
            variant="outline_rvns"
            className={cn("capitalize", classNames?.badge)}
          >
            <BadgeCheck className={classNames?.icon} /> Terverifikasi
          </Badge>
        )}
      </TooltipTrigger>
      <TooltipContent className={classNames?.content}>
        Pengguna ini telah memverifikasi email mereka.
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

// #endregion
