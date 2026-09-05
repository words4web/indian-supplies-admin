export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CATEGORIES: "/categories",
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PRODUCTS: "/products",
  USERS: "/users",
  SETTINGS: "/settings",
};

export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.CATEGORIES,
  ROUTES.ORDERS,
  ROUTES.PRODUCTS,
  ROUTES.USERS,
  ROUTES.SETTINGS,
];

export const GUEST_ROUTES = [ROUTES.LOGIN];
