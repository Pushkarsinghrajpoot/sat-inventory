"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/contexts/sidebar-context";
import { 
  Home, 
  Package, 
  Shield, 
  Headphones, 
  Bell, 
  History, 
  Settings, 
  ChevronLeft,
  Building2,
  User,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "./ui/badge";
import { ResellerContextSwitcher } from "./reseller-context-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard", roles: ["distributor", "reseller", "customer"] },
  { name: "Contracts", icon: FileText, href: "/contracts", roles: ["distributor", "reseller", "customer"] },
  { name: "Inventory", icon: Package, href: "/inventory", roles: ["distributor", "reseller", "customer"] },
  { name: "Warranty & Services", icon: Shield, href: "/warranty", roles: ["distributor", "reseller", "customer"] },
  { name: "Support Tickets", icon: Headphones, href: "/tickets", roles: ["distributor", "reseller", "customer"] },
  { name: "Notifications", icon: Bell, href: "/notifications", roles: ["distributor", "reseller", "customer"] },
  { name: "History & Audit", icon: History, href: "/history", roles: ["distributor", "reseller", "customer"] },
  { name: "Settings", icon: Settings, href: "/settings", roles: ["distributor"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { collapsed, setCollapsed } = useSidebar();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || "reseller")
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40 flex flex-col shadow-lg",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "h-16 flex items-center border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src="/main-logo.png" 
                  alt="SATMZ" 
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Building2 className="h-6 w-6 text-white hidden" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">SATMZ</h1>
                <p className="text-xs text-blue-100">Inventory Portal</p>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ChevronLeft className="h-5 w-5 text-white rotate-180" />
            </div>
          </button>
        )}
      </div>

      {/* Reseller Context Switcher */}
      {!collapsed && <ResellerContextSwitcher />}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <TooltipProvider delayDuration={0}>
          <div className={cn(
            "space-y-2",
            collapsed ? "px-2" : "px-3"
          )}>
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              const menuItem = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
                    collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                  )}
                >
                  <Icon className={cn(
                    "transition-all duration-200",
                    collapsed ? "h-6 w-6" : "h-5 w-5",
                    isActive && "drop-shadow-sm",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white" />
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {menuItem}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return menuItem;
            })}
          </div>
        </TooltipProvider>
      </nav>

      {/* User Profile */}
      <div className={cn(
        "border-t border-slate-200 bg-slate-50",
        collapsed ? "p-2" : "p-4"
      )}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/profile">
                <div className={cn(
                  "flex items-center rounded-xl hover:bg-white cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm",
                  collapsed ? "justify-center p-3" : "gap-3 px-3 py-3"
                )}>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-900">{user?.companyName}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.role === "distributor" && "Administrator"}
                        {user?.role === "reseller" && "Reseller"}
                        {user?.role === "customer" && "Customer"}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <div className="text-sm">
                  <p className="font-medium">{user?.companyName}</p>
                  <p className="text-xs text-slate-400">
                    {user?.role === "distributor" && "Administrator"}
                    {user?.role === "reseller" && "Reseller"}
                    {user?.role === "customer" && "Customer"}
                  </p>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
