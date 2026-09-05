export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CATEGORIES: "/categories",
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PRODUCTS: "/products",
  USERS: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
};

export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.CATEGORIES,
  ROUTES.ORDERS,
  ROUTES.PRODUCTS,
  ROUTES.USERS,
  ROUTES.SETTINGS,
  ROUTES.NOTIFICATIONS,
];

export const GUEST_ROUTES = [ROUTES.LOGIN];
