"use client";

import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ProtectedRoute } from "./protected-route";
import { Toaster } from "sonner";
import { initializeLocalStorage } from "@/lib/dummy-data";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

function DashboardLayoutInner({ children, title }: DashboardLayoutProps) {
  const { collapsed } = useSidebar();

  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        collapsed ? "ml-20" : "ml-64"
      )}>
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardLayoutInner title={title}>
          {children}
        </DashboardLayoutInner>
        <Toaster position="top-right" richColors />
      </SidebarProvider>
    </ProtectedRoute>
  );
}
