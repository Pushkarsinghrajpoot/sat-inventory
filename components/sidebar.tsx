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
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { collapsed, setCollapsed } = useSidebar();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || "reseller")
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 z-40 flex flex-col shadow-xl",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img 
              src="/main-logo.png" 
              alt="SATMZ" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center hidden">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SATMZ</h1>
              <p className="text-xs text-slate-300">Inventory Portal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <img 
            src="/main-logo.png" 
            alt="SATMZ" 
            className="h-8 w-8 object-contain mx-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
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
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-200 hover:bg-slate-700/50 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <Link href="/profile">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors",
            collapsed && "justify-center"
          )}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold">
                {user?.companyName?.charAt(0) || "U"}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{user?.companyName}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={user?.role === "distributor" ? "default" : "secondary"} className="text-xs">
                    {user?.role === "distributor" ? "Admin" : "Customer"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
}
