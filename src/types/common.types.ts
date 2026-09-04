export interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pathname: string;
  user: any;
  handleSignOut: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export interface SocketToastPayload {
  message: string;
  type?: "info" | "success" | "warning" | "error";
}
