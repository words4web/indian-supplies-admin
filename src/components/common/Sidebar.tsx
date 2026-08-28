"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  X,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import { SidebarProps } from "@/types/common.types";

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  pathname,
  user,
  handleSignOut,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r border-border p-6 transition-transform duration-300 transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-primary font-bold">
              <span className="font-serif text-lg">Indian Supplies</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-8 flex-1 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col bg-card border-r border-border transition-all duration-300 ${isCollapsed ? "md:w-20" : "md:w-64"}`}>
        <div
          className={`flex h-16 items-center justify-between border-b border-border px-4 text-primary font-bold ${isCollapsed ? "justify-center" : ""}`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <span className="font-serif text-lg tracking-wide">
                Indian Supplies
              </span>
            </div>
          )}
          {isCollapsed && (
            <span className="font-serif text-lg tracking-wide">IS</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-lg">
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <nav className="flex-1 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                    isCollapsed
                      ? "justify-center px-0 w-12 mx-auto"
                      : "gap-3 px-4"
                  } ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  title={isCollapsed ? item.name : undefined}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-4 mt-auto">
            <div
              className={`flex items-center mb-2 rounded-xl bg-secondary/50 border border-border/50 ${isCollapsed ? "justify-center p-2" : "gap-3 px-4 py-3"}`}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className={`flex items-center rounded-xl py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200 ${isCollapsed ? "justify-center px-0 w-12 mx-auto" : "gap-3 px-4 w-full"}`}
              title={isCollapsed ? "Sign out" : undefined}>
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
