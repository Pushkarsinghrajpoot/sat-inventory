"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userNotifications = notifications
    .filter(n => n.customerId === user?.customerId || n.customerId === null)
    .slice(0, 5);

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-80 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {userNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No notifications
                </div>
              ) : (
                userNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-3 py-2 hover:bg-slate-50 cursor-pointer border-b last:border-0",
                      !notification.isRead && "bg-blue-50"
                    )}
                    onClick={() => {
                      markAsRead(notification.id);
                      router.push("/notifications");
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {format(new Date(notification.createdAt), "MMM dd, HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <DropdownMenuSeparator />
            <Link href="/notifications">
              <DropdownMenuItem className="justify-center cursor-pointer">
                View All Notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user?.companyName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user?.companyName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            {user?.role === "distributor" && (
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
