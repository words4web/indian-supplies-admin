import { useQuery } from "@tanstack/react-query";
import { userService, UserQueryParams } from "./user.service";

export const USER_QUERY_KEYS = {
  all: ["admin", "users"] as const,
  list: (params?: UserQueryParams) =>
    ["admin", "users", "list", params] as const,
  detail: (id: string) => ["admin", "users", "detail", id] as const,
};

export const useUsersQuery = (params?: UserQueryParams, enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => userService.getUsers(params),
    enabled,
  });
};

export const useUserDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: enabled && !!id,
  });
};
