"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { NAVIGATION_ITEMS, BOTTOM_NAVIGATION_ITEMS } from "@/data/navigation";
import { SidebarProps } from "@/types/common.types";

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  pathname,
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
            <div className="flex items-center gap-2.5 text-primary font-bold">
              <Image
                src="/logo.png"
                alt="Indian Supplies Logo"
                width={32}
                height={32}
                className="size-8 rounded-lg object-contain"
              />
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
              const isActive = pathname === item?.href;
              return (
                <Link
                  key={item?.name}
                  href={item?.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}>
                  <item.icon className="h-5 w-5" />
                  {item?.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-4 space-y-1">
            {BOTTOM_NAVIGATION_ITEMS.map((item) => {
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
          </div>
        </div>
      </div>

      <div
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col bg-card border-r border-border transition-all duration-300 ${isCollapsed ? "md:w-20" : "md:w-56"}`}>
        <div
          className={`flex h-16 items-center justify-between border-b border-border px-4 text-primary font-bold ${isCollapsed ? "justify-center" : ""}`}>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Indian Supplies Logo"
              width={32}
              height={32}
              className="size-8 rounded-lg object-contain shrink-0"
            />
            {!isCollapsed && (
              <span className="font-serif text-lg tracking-wide truncate">
                Indian Supplies
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9 rounded-xl border border-border bg-background shadow-sm hover:bg-secondary hover:text-foreground text-muted-foreground transition-all duration-200">
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

          <div className="border-t border-border pt-4 mt-auto space-y-1">
            {BOTTOM_NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item?.href;
              return (
                <Link
                  key={item?.name}
                  href={item?.href}
                  className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                    isCollapsed
                      ? "justify-center px-0 w-12 mx-auto"
                      : "gap-3 px-4"
                  } ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  title={isCollapsed ? item?.name : undefined}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item?.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
