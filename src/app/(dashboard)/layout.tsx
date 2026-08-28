"use client";

import { useState } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

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
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-64"}`}>
          <main className="flex-grow p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthInitializer>
  );
}
