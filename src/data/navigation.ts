import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Users,
  Bell,
  Settings,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  { name: "Overview", href: ROUTES.HOME, icon: LayoutDashboard },
  { name: "Categories", href: ROUTES.CATEGORIES.ROOT, icon: Tag },
  { name: "Products", href: ROUTES.PRODUCTS.ROOT, icon: Package },
  { name: "Orders", href: ROUTES.ORDERS.ROOT, icon: ShoppingBag },
  { name: "Notifications", href: ROUTES.NOTIFICATIONS, icon: Bell },
  { name: "Users", href: ROUTES.USERS.ROOT, icon: Users },
];

export const BOTTOM_NAVIGATION_ITEMS = [
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];
