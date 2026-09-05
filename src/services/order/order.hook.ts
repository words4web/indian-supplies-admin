import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderService } from "./order.service";

export const useAdminOrdersQuery = () => {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => orderService.list(),
  });
};

export const useAdminOrderDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: () => orderService.detail(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatusMutation = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Order status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders", variables.id],
      });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update order status.",
      );
    },
  });
};
