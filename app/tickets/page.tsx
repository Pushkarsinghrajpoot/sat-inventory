"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Eye } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTicketStore } from "@/store/ticket-store";
import { useCustomerStore } from "@/store/customer-store";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TicketStatus } from "@/lib/types";

export default function TicketsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();
  const { getCustomerById } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    if (user?.role === "reseller") {
      filtered = filtered.filter(ticket => ticket.customerId === user.customerId);
    }

    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    return filtered;
  }, [tickets, user, searchQuery, statusFilter]);

  const ticketsByStatus = useMemo(() => {
    const userTickets = user?.role === "reseller" 
      ? tickets.filter(t => t.customerId === user.customerId)
      : tickets;

    return {
      all: userTickets,
      open: userTickets.filter(t => t.status === "open"),
      in_progress: userTickets.filter(t => t.status === "in_progress"),
      resolved: userTickets.filter(t => t.status === "resolved"),
      closed: userTickets.filter(t => t.status === "closed"),
    };
  }, [tickets, user]);

  const getStatusBadge = (status: TicketStatus) => {
    const variants: Record<TicketStatus, "destructive" | "warning" | "success" | "secondary"> = {
      open: "destructive",
      in_progress: "warning",
      resolved: "success",
      closed: "secondary",
    };
    return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-slate-100 text-slate-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      critical: "bg-red-100 text-red-700",
    };
    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority}
      </Badge>
    );
  };

  const getWarrantyStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge variant="success">Under Warranty</Badge>
      : <Badge variant="danger">Out of Warranty</Badge>;
  };

  return (
    <DashboardLayout title="Support Tickets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ticket ID or serial number..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/tickets/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Raise New Ticket
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v as TicketStatus | "all")}>
          <TabsList>
            <TabsTrigger value="all">
              All ({ticketsByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="open">
              Open ({ticketsByStatus.open.length})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({ticketsByStatus.in_progress.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({ticketsByStatus.resolved.length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Closed ({ticketsByStatus.closed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            <div className="grid gap-4">
              {filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12 text-slate-500">
                    No tickets found
                  </CardContent>
                </Card>
              ) : (
                filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Ticket ID:</span> {ticket.id}
                            </div>
                            <div>
                              <span className="font-medium">Product:</span> {ticket.productName}
                            </div>
                            <div>
                              <span className="font-medium">Serial:</span> {ticket.serialNumber}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {ticket.category}
                            </div>
                            {user?.role === "distributor" && (
                              <div>
                                <span className="font-medium">Customer:</span>{" "}
                                {getCustomerById(ticket.customerId)?.name}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Created:</span>{" "}
                              {format(new Date(ticket.createdAt), "MMM dd, yyyy HH:mm")}
                            </div>
                            {ticket.assignedTo && (
                              <div>
                                <span className="font-medium">Assigned:</span> {ticket.assignedTo}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            {getWarrantyStatusBadge(ticket.warrantyStatus)}
                            <Badge variant={ticket.serviceStatus === "covered" ? "success" : "secondary"}>
                              Service: {ticket.serviceStatus.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tickets/${ticket.id}`);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
