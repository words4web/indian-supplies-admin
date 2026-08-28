import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addressService } from "./address.service";
import { AddressPayload } from "@/types/address.types";

const PROFILE_QUERY_KEY = ["profile"];

export const useCreateAddress = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => addressService.create(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Address added successfully.");
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add address.");
    },
  });
};

export const useUpdateAddress = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AddressPayload>;
    }) => addressService.update(id, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Address updated successfully.");
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update address.");
    },
  });
};

export const useDeleteAddress = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.delete(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Address removed successfully.");
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove address.");
    },
  });
};
