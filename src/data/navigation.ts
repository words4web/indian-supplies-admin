import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Users,
  UserCheck,
  Bell,
  Settings,
  LucideIcon,
} from "lucide-react";
import { SalesmanPermission } from "@/types/salesman.types";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: SalesmanPermission;
  adminOnly?: boolean;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: "Overview", href: ROUTES.HOME, icon: LayoutDashboard },
  {
    name: "Categories",
    href: ROUTES.CATEGORIES.ROOT,
    icon: Tag,
    permission: "category_management",
  },
  {
    name: "Products",
    href: ROUTES.PRODUCTS.ROOT,
    icon: Package,
    permission: "product_management",
  },
  {
    name: "Orders",
    href: ROUTES.ORDERS.ROOT,
    icon: ShoppingBag,
    permission: "order_management",
  },
  {
    name: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
    adminOnly: true,
  },
  {
    name: "Salesmen",
    href: ROUTES.SALESMEN.ROOT,
    icon: UserCheck,
    adminOnly: true,
  },
  {
    name: "Users",
    href: ROUTES.USERS.ROOT,
    icon: Users,
    permission: "user_management",
  },
];

export const BOTTOM_NAVIGATION_ITEMS: NavItem[] = [
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];
