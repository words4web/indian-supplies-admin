import { useQuery } from "@tanstack/react-query";
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
