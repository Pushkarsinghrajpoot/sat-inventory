"use client";

import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ProtectedRoute } from "./protected-route";
import { Toaster } from "sonner";
import { initializeLocalStorage } from "@/lib/dummy-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={title} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </ProtectedRoute>
  );
}
