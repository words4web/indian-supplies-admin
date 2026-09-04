import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function registerProductListener(
  socket: Socket,
  queryClient: QueryClient,
) {
  socket.on(
    "stock:low",
    (data: { productId?: string; productName?: string }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.warning(
        `Low stock warning for ${data?.productName || "a product"}!`,
      );
    },
  );
}
