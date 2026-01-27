"use client";

import { useState, useMemo } from "react";
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
import { useInventoryStore } from "@/store/inventory-store";
import { useTicketStore } from "@/store/ticket-store";
import { useContractStore } from "@/store/contract-store";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { filterByAccessibleCustomers } from "@/lib/permissions";
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
  const { items } = useInventoryStore();
  const { tickets } = useTicketStore();
  const { parentContracts, childContracts } = useContractStore();
  const { mode } = useResellerContextStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { items: [], tickets: [], contracts: [] };
    
    const query = searchQuery.toLowerCase();
    const resellerContext = user?.role === "reseller" ? { mode } : undefined;
    
    // Filter contracts based on permissions
    const accessibleParentContracts = filterByAccessibleCustomers(
      parentContracts,
      user,
      resellerContext
    );
    
    const accessibleChildContracts = childContracts.filter(child => {
      const parentContract = parentContracts.find(p => p.id === child.parentContractId);
      return parentContract && accessibleParentContracts.some(ap => ap.id === parentContract.id);
    });
    
    const allContracts = [...accessibleParentContracts, ...accessibleChildContracts];
    
    const matchedItems = items
      .filter((item: any) => 
        item.productName.toLowerCase().includes(query) ||
        item.serialNumber.toLowerCase().includes(query)
      )
      .slice(0, 5);
    
    const matchedTickets = tickets
      .filter((ticket: any) =>
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query)
      )
      .slice(0, 5);
    
    const matchedContracts = allContracts
      .filter((contract: any) => 
        contract.contractNumber.toLowerCase().includes(query) ||
        contract.title.toLowerCase().includes(query)
      )
      .slice(0, 3);
    
    return { items: matchedItems, tickets: matchedTickets, contracts: matchedContracts };
  }, [searchQuery, items, tickets, parentContracts, childContracts, user, mode]);

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
            placeholder="Search products, tickets, contracts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && searchQuery && (searchResults.items.length > 0 || searchResults.tickets.length > 0 || searchResults.contracts.length > 0) && (
            <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-2 z-50">
              {searchResults.items.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Products</p>
                  {searchResults.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => {
                        router.push("/inventory");
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-slate-500">{item.serialNumber}</p>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.tickets.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Tickets</p>
                  {searchResults.tickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => {
                        router.push(`/tickets/${ticket.id}`);
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium">{ticket.subject}</p>
                      <p className="text-xs text-slate-500">{ticket.id}</p>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.contracts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Contracts</p>
                  {searchResults.contracts.map((contract: any) => (
                    <div
                      key={contract.id}
                      className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => {
                        router.push(`/contracts/${contract.id}`);
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium">{contract.title}</p>
                      <p className="text-xs text-slate-500">{contract.contractNumber}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
            {user?.role === "distributor" && (
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
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
