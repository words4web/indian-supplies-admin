"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthInitializer } from "@/providers/auth-initializer";
import { Sidebar } from "@/components/common/Sidebar";
import { ROUTES } from "@/constants/routes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  };

  const handleSignOut = () => {
    signOut().then(() => {
      router.push(ROUTES.LOGIN);
    });
  };

  return (
    <AuthInitializer>
      <div className="min-h-screen bg-background">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pathname={pathname}
          user={user}
          handleSignOut={handleSignOut}
          isCollapsed={isCollapsed}
          setIsCollapsed={handleToggleCollapse}
        />

        <div
          className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-56"}`}>
          <main className="flex-grow p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthInitializer>
  );
}
