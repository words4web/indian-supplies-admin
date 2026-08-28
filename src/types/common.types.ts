export interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
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
