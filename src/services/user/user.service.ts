import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userService = {
  getUsers: async (params?: UserQueryParams) => {
    const response = await axiosInstance.get(API_ROUTES.USERS.LIST, { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.USERS.DETAIL(id));
    return response.data;
  },
};
