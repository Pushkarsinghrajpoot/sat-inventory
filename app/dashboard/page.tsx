"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  AlertTriangle, 
  Ticket, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Eye,
  Calendar
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useTicketStore } from "@/store/ticket-store";
import { useCustomerStore } from "@/store/customer-store";
import { useContractStore } from "@/store/contract-store";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { filterByAccessibleCustomers } from "@/lib/permissions";
import { getWarrantyStatus, isExpiringSoon, isExpired } from "@/lib/date-utils";
import { downloadReport } from "@/lib/export-utils";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items } = useInventoryStore();
  const { tickets } = useTicketStore();
  const { customers } = useCustomerStore();
  const { parentContracts } = useContractStore();
  const { mode } = useResellerContextStore();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");

  const resellerContext = user?.role === "reseller" ? { mode } : undefined;

  const filteredItems = useMemo(() => {
    const accessible = filterByAccessibleCustomers(items, user, resellerContext);
    if (selectedCustomer === "all") {
      return accessible;
    }
    return accessible.filter(item => item.customerId === selectedCustomer);
  }, [items, user, resellerContext, selectedCustomer]);

  const filteredTickets = useMemo(() => {
    const accessible = filterByAccessibleCustomers(tickets, user, resellerContext);
    if (selectedCustomer === "all") {
      return accessible;
    }
    return accessible.filter(ticket => ticket.customerId === selectedCustomer);
  }, [tickets, user, resellerContext, selectedCustomer]);

  const filteredContracts = useMemo(() => {
    const accessible = filterByAccessibleCustomers(parentContracts, user, resellerContext);
    if (selectedCustomer === "all") {
      return accessible;
    }
    return accessible.filter(contract => contract.customerId === selectedCustomer);
  }, [parentContracts, user, resellerContext, selectedCustomer]);

  const stats = useMemo(() => {
    const expiringSoon = filteredItems.filter(item => 
      item.warrantyEndDate && isExpiringSoon(item.warrantyEndDate, 90) && !isExpired(item.warrantyEndDate)
    );
    const openTickets = filteredTickets.filter(t => t.status === "open" || t.status === "in_progress");
    const closedThisMonth = filteredTickets.filter(t => {
      const ticketDate = new Date(t.updatedAt);
      const now = new Date();
      return t.status === "closed" && 
        ticketDate.getMonth() === now.getMonth() &&
        ticketDate.getFullYear() === now.getFullYear();
    });

    const activeContracts = filteredContracts.filter(c => c.status === "active");
    const expiringContracts = filteredContracts.filter(c => c.status === "expiring_soon");

    return {
      totalProducts: filteredItems.length,
      expiringSoon: expiringSoon.length,
      openTickets: openTickets.length,
      closedTickets: closedThisMonth.length,
      activeContracts: activeContracts.length,
      expiringContracts: expiringContracts.length,
      totalContracts: filteredContracts.length,
    };
  }, [filteredItems, filteredTickets]);

  const expiryAlerts = useMemo(() => {
    return {
      days30: filteredItems.filter(item => {
        if (!item.warrantyEndDate) return false;
        const status = getWarrantyStatus(item.warrantyEndDate);
        return status.daysRemaining > 0 && status.daysRemaining <= 30;
      }),
      days60: filteredItems.filter(item => {
        if (!item.warrantyEndDate) return false;
        const status = getWarrantyStatus(item.warrantyEndDate);
        return status.daysRemaining > 30 && status.daysRemaining <= 60;
      }),
      days90: filteredItems.filter(item => {
        if (!item.warrantyEndDate) return false;
        const status = getWarrantyStatus(item.warrantyEndDate);
        return status.daysRemaining > 60 && status.daysRemaining <= 90;
      }),
      expired: filteredItems.filter(item => item.warrantyEndDate && isExpired(item.warrantyEndDate)),
    };
  }, [filteredItems]);

  const recentTickets = useMemo(() => {
    return [...filteredTickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [filteredTickets]);

  const recentActivity = useMemo(() => {
    const activities: Array<{ type: string; message: string; time: string }> = [];
    
    filteredItems.slice(0, 3).forEach(item => {
      activities.push({
        type: "delivery",
        message: `${item.productName} delivered`,
        time: item.deliveryDate,
      });
    });

    filteredTickets.slice(0, 2).forEach(ticket => {
      activities.push({
        type: "ticket",
        message: `Ticket ${ticket.id} ${ticket.status}`,
        time: ticket.updatedAt,
      });
    });

    return activities.sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    ).slice(0, 5);
  }, [filteredItems, filteredTickets]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {user?.role === "distributor" && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Customer:</label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Active devices</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground mt-1">Within 90 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openTickets}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed This Month</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.closedTickets}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+18% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/contracts")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.activeContracts}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.expiringContracts} expiring soon</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Expiry Alerts</CardTitle>
              <CardDescription>Monitor warranty and license expirations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="30days">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="30days">30 Days</TabsTrigger>
                  <TabsTrigger value="60days">60 Days</TabsTrigger>
                  <TabsTrigger value="90days">90 Days</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
                <TabsContent value="30days" className="space-y-3 mt-4">
                  {expiryAlerts.days30.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No items expiring in 30 days</p>
                  ) : (
                    expiryAlerts.days30.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="danger" className="text-xs">
                            {item.warrantyEndDate && getWarrantyStatus(item.warrantyEndDate).daysRemaining} days
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.warrantyEndDate && format(new Date(item.warrantyEndDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="60days" className="space-y-3 mt-4">
                  {expiryAlerts.days60.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No items expiring in 31-60 days</p>
                  ) : (
                    expiryAlerts.days60.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => router.push("/inventory")}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="warning" className="text-xs">
                            {item.warrantyEndDate && getWarrantyStatus(item.warrantyEndDate).daysRemaining} days
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.warrantyEndDate && format(new Date(item.warrantyEndDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="90days" className="space-y-3 mt-4">
                  {expiryAlerts.days90.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No items expiring in 61-90 days</p>
                  ) : (
                    expiryAlerts.days90.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => router.push("/inventory")}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="warning" className="text-xs">
                            {item.warrantyEndDate && getWarrantyStatus(item.warrantyEndDate).daysRemaining} days
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.warrantyEndDate && format(new Date(item.warrantyEndDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="expired" className="space-y-3 mt-4">
                  {expiryAlerts.expired.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No expired items</p>
                  ) : (
                    expiryAlerts.expired.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => router.push("/inventory")}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="danger" className="text-xs">Expired</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.warrantyEndDate && format(new Date(item.warrantyEndDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Latest support requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No tickets yet</p>
                ) : (
                  recentTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">{ticket.id}</p>
                      </div>
                      <Badge 
                        variant={
                          ticket.status === "open" ? "destructive" :
                          ticket.status === "in_progress" ? "warning" :
                          ticket.status === "resolved" ? "success" : "secondary"
                        }
                        className="text-xs"
                      >
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))
                )}
                <Link href="/tickets">
                  <Button variant="outline" className="w-full mt-2">
                    View All Tickets
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/tickets/new">
                  <Button className="w-full justify-start">
                    <Ticket className="mr-2 h-4 w-4" />
                    Raise New Ticket
                  </Button>
                </Link>
                <Link href="/contracts">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Contracts
                  </Button>
                </Link>
                <Link href="/inventory">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    View Inventory
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    downloadReport("Dashboard Report");
                    toast.success("Dashboard report downloaded successfully");
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => router.push(activity.type === "delivery" ? "/inventory" : "/tickets")}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {activity.type === "delivery" ? (
                      <Package className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Ticket className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.time), "MMM dd, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
