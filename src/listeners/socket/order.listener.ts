import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function registerOrderListener(
  socket: Socket,
  queryClient: QueryClient,
) {
  socket.on(
    "order:created",
    (data: {
      orderId?: string;
      totalAmount?: number;
      customerName?: string;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      const customer = data?.customerName ? ` by ${data.customerName}` : "";
      toast.success(`New order placed${customer}! Table updated.`);
    },
  );
}
