import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";

import { AddressPayload } from "@/types/address.types";

export const addressService = {
  create: async (payload: AddressPayload) => {
    const response = await axiosInstance.post(API_ROUTES.ADDRESSES, payload);
    return response?.data;
  },

  update: async (id: string, payload: Partial<AddressPayload>) => {
    const response = await axiosInstance.put(
      `${API_ROUTES.ADDRESSES}/${id}`,
      payload,
    );
    return response?.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(
      `${API_ROUTES.ADDRESSES}/${id}`,
    );
    return response?.data;
  },
};
