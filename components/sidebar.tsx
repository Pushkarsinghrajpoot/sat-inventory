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

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-sm"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
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
