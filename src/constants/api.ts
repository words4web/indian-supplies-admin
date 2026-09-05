export const API_ROUTES = {
  AUTH: {
    LOGIN: "/admin/auth/login",
    REFRESH_TOKEN: "/admin/auth/refresh-token",
    LOGOUT: "/admin/auth/logout",
  },
  PROFILE: "/admin/profile",
  CATEGORIES: {
    LIST: "/admin/categories",
    CREATE: "/admin/categories",
    DETAIL: (id: string) => `/admin/categories/${id}`,
    UPDATE: (id: string) => `/admin/categories/${id}`,
    DELETE: (id: string) => `/admin/categories/${id}`,
  },
  PRODUCTS: {
    LIST: "/admin/products",
    CREATE: "/admin/products",
    DETAIL: (id: string) => `/admin/products/${id}`,
    UPDATE: (id: string) => `/admin/products/${id}`,
    DELETE: (id: string) => `/admin/products/${id}`,
  },
  ORDERS: {
    LIST: "/admin/orders",
    DETAIL: (id: string) => `/admin/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/admin/orders/${id}/status`,
  },
};
