"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Calendar, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useTicketStore } from "@/store/ticket-store";
import { useCustomerStore } from "@/store/customer-store";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

export default function HistoryPage() {
  const { user } = useAuthStore();
  const { items } = useInventoryStore();
  const { tickets } = useTicketStore();
  const { getCustomerById } = useCustomerStore();

  const filteredItems = useMemo(() => {
    if (user?.role === "reseller") {
      return items.filter(item => item.customerId === user.customerId);
    }
    return items;
  }, [items, user]);

  const filteredTickets = useMemo(() => {
    if (user?.role === "reseller") {
      return tickets.filter(ticket => ticket.customerId === user.customerId);
    }
    return tickets;
  }, [tickets, user]);

  const deliveredAssets = useMemo(() => {
    return [...filteredItems]
      .sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
  }, [filteredItems]);

  const renewalHistory = useMemo(() => {
    const renewals: Array<{
      id: string;
      productName: string;
      serialNumber: string;
      oldDate: string;
      newDate: string;
      renewedBy: string;
      renewalDate: string;
    }> = [];

    return renewals;
  }, []);

  const closedTickets = useMemo(() => {
    return filteredTickets
      .filter(t => t.status === "closed" || t.status === "resolved")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [filteredTickets]);

  const handleDownloadChallan = (challanNumber: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: "Downloading challan...",
        success: `Challan ${challanNumber} downloaded successfully`,
        error: "Failed to download challan",
      }
    );
  };

  const handleExport = (type: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Exporting ${type} data...`,
        success: `${type} data exported successfully`,
        error: "Failed to export data",
      }
    );
  };

  return (
    <DashboardLayout title="History & Audit">
      <div className="space-y-6">
        <Tabs defaultValue="deliveries">
          <TabsList>
            <TabsTrigger value="deliveries">Delivered Assets</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
            <TabsTrigger value="tickets">Ticket History</TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Delivered Assets</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("Deliveries")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveredAssets.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{item.productName}</h4>
                            <p className="text-sm text-slate-600">
                              Serial: {item.serialNumber} • Qty: {item.quantity}
                            </p>
                            {user?.role === "distributor" && (
                              <p className="text-sm text-slate-600">
                                Customer: {getCustomerById(item.customerId)?.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {format(new Date(item.deliveryDate), "MMM dd, yyyy")}
                            </p>
                            <p className="text-xs text-slate-500">Challan: {item.challanNumber}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadChallan(item.challanNumber)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="renewals" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Warranty & Service Renewals</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("Renewals")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renewalHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No renewal history yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {renewalHistory.map((renewal) => (
                      <div key={renewal.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{renewal.productName}</h4>
                          <p className="text-sm text-slate-600">Serial: {renewal.serialNumber}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(renewal.oldDate), "MMM dd, yyyy")}
                            </Badge>
                            <span className="text-xs text-slate-400">→</span>
                            <Badge variant="success" className="text-xs">
                              {format(new Date(renewal.newDate), "MMM dd, yyyy")}
                            </Badge>
                          </div>
                          {user?.role === "distributor" && (
                            <p className="text-xs text-slate-500 mt-1">
                              Renewed by {renewal.renewedBy} on {format(new Date(renewal.renewalDate), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Closed Tickets</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("Ticket History")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {closedTickets.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No closed tickets yet</p>
                    </div>
                  ) : (
                    closedTickets.map((ticket) => {
                      const resolutionTime = differenceInDays(
                        new Date(ticket.updatedAt),
                        new Date(ticket.createdAt)
                      );

                      return (
                        <div key={ticket.id} className="p-4 border rounded-lg hover:bg-slate-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{ticket.subject}</h4>
                                <Badge variant={ticket.status === "resolved" ? "success" : "secondary"}>
                                  {ticket.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                <p><span className="font-medium">Ticket ID:</span> {ticket.id}</p>
                                <p><span className="font-medium">Product:</span> {ticket.productName}</p>
                                <p><span className="font-medium">Created:</span> {format(new Date(ticket.createdAt), "MMM dd, yyyy")}</p>
                                <p><span className="font-medium">Closed:</span> {format(new Date(ticket.updatedAt), "MMM dd, yyyy")}</p>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <Badge variant="outline" className="text-xs">
                                  Resolution time: {resolutionTime} {resolutionTime === 1 ? "day" : "days"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
