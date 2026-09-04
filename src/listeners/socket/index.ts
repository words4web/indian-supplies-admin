import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { registerToastListener } from "./toast.listener";
import { registerOrderListener } from "./order.listener";
import { registerProductListener } from "./product.listener";

export function registerAllSocketListeners(
  socket: Socket,
  queryClient: QueryClient,
) {
  registerToastListener(socket);
  registerOrderListener(socket, queryClient);
  registerProductListener(socket, queryClient);
}
