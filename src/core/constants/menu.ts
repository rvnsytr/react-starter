import { LinkProps } from "@tanstack/react-router";
import {
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LucideIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Route, RouteRole } from "../route";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toCase(label, "kebab")}`
  subMenu?: {
    label: string;
    href?: LinkProps["to"];
    variant?: "default" | "destructive";
    disabled?: boolean;
    role?: RouteRole;
  }[];
};

export type Menu = { section: string; content: MenuContent[] };

export const dashboardMenu: Menu[] = [
  {
    section: "Umum",
    content: [
      { route: "/dashboard", icon: LayoutDashboardIcon },
      { route: "/dashboard/users", icon: UsersRoundIcon },
    ],
  },
  {
    section: "Lainnya",
    content: [
      {
        route: "/dashboard/profile",
        icon: UserRoundIcon,
        subMenu: [{ label: "Informasi Pribadi" }],
      },
      {
        route: "/dashboard/settings",
        icon: SettingsIcon,
        subMenu: [
          { label: "Tema" },
          { label: "Layout" },
          { label: "Sesi Aktif" },
          { label: "Ubah Kata Sandi" },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (MenuContent & { label: string })[] = [
  { route: "/", label: "Beranda", icon: ExternalLinkIcon },
];
