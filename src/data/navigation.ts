import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Users,
  Settings,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  { name: "Overview", href: ROUTES.HOME, icon: LayoutDashboard },
  { name: "Categories", href: ROUTES.CATEGORIES, icon: Tag },
  { name: "Products", href: ROUTES.PRODUCTS, icon: Package },
  { name: "Orders", href: ROUTES.ORDERS, icon: ShoppingBag },
  // { name: "Users", href: ROUTES.USERS, icon: Users },
  // { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];
