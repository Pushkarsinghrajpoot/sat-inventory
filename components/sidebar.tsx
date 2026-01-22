"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Package, 
  Shield, 
  Headphones, 
  Bell, 
  History, 
  Settings, 
  ChevronLeft,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "./ui/badge";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard", roles: ["distributor", "reseller"] },
  { name: "Inventory", icon: Package, href: "/inventory", roles: ["distributor", "reseller"] },
  { name: "Warranty & Services", icon: Shield, href: "/warranty", roles: ["distributor", "reseller"] },
  { name: "Support Tickets", icon: Headphones, href: "/tickets", roles: ["distributor", "reseller"] },
  { name: "Notifications", icon: Bell, href: "/notifications", roles: ["distributor", "reseller"] },
  { name: "History & Audit", icon: History, href: "/history", roles: ["distributor", "reseller"] },
  { name: "Settings", icon: Settings, href: "/settings", roles: ["distributor"] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || "reseller")
  );

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-slate-900 text-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg">TechSupply</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={cn(
          "flex items-center gap-3 px-3 py-2",
          collapsed && "justify-center"
        )}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold">
              {user?.companyName?.charAt(0) || "U"}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.companyName}</p>
              <Badge 
                variant={user?.role === "distributor" ? "default" : "secondary"}
                className="text-xs mt-1"
              >
                {user?.role === "distributor" ? "Admin" : "Customer"}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
