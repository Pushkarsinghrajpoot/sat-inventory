"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTicketStore } from "@/store/ticket-store";
import { useCustomerStore } from "@/store/customer-store";
import { format } from "date-fns";
import { toast } from "sonner";
import { TicketStatus } from "@/lib/types";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getTicketById, updateTicketStatus, addComment, assignTicket } = useTicketStore();
  const { getCustomerById } = useCustomerStore();
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus | "">("");

  const ticket = useMemo(() => {
    return getTicketById(params.id as string);
  }, [params.id, getTicketById]);

  if (!ticket) {
    return (
      <DashboardLayout title="Ticket Not Found">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500 mb-4">Ticket not found</p>
            <Button onClick={() => router.push("/tickets")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tickets
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const customer = getCustomerById(ticket.customerId);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    addComment(ticket.id, {
      action: "Comment Added",
      by: user?.companyName || "User",
      at: new Date().toISOString(),
      note: newComment,
    });

    toast.success("Comment added successfully");
    setNewComment("");
  };

  const handleUpdateStatus = () => {
    if (!newStatus) return;

    updateTicketStatus(
      ticket.id,
      newStatus,
      `Status changed from ${ticket.status} to ${newStatus}`,
      user?.companyName || "User"
    );

    toast.success(`Ticket status updated to ${newStatus.replace("_", " ")}`);
    setNewStatus("");
  };

  const handleAssign = (team: string) => {
    assignTicket(ticket.id, team, user?.companyName || "Admin");
    toast.success(`Ticket assigned to ${team}`);
  };

  const getStatusBadge = (status: TicketStatus) => {
    const variants: Record<TicketStatus, "destructive" | "warning" | "success" | "secondary"> = {
      open: "destructive",
      in_progress: "warning",
      resolved: "success",
      closed: "secondary",
    };
    return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>;
  };

  return (
    <DashboardLayout title={`Ticket ${ticket.id}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/tickets")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(ticket.status)}
                      <Badge variant={ticket.priority === "critical" || ticket.priority === "high" ? "destructive" : "secondary"}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">Ticket ID:</span>
                    <p className="text-slate-900">{ticket.id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Category:</span>
                    <p className="text-slate-900">{ticket.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Product:</span>
                    <p className="text-slate-900">{ticket.productName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Serial Number:</span>
                    <p className="text-slate-900">{ticket.serialNumber}</p>
                  </div>
                  {user?.role === "distributor" && customer && (
                    <div>
                      <span className="font-semibold text-slate-700">Customer:</span>
                      <p className="text-slate-900">{customer.name}</p>
                    </div>
                  )}
                  {ticket.assignedTo && (
                    <div>
                      <span className="font-semibold text-slate-700">Assigned To:</span>
                      <p className="text-slate-900">{ticket.assignedTo}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
                  <p className="text-slate-900 whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Badge variant={ticket.warrantyStatus === "active" ? "success" : "danger"}>
                    Warranty: {ticket.warrantyStatus}
                  </Badge>
                  <Badge variant={ticket.serviceStatus === "covered" ? "success" : "secondary"}>
                    Service: {ticket.serviceStatus.replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.timeline.map((entry, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {entry.action.includes("Comment") ? (
                            <User className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        {index < ticket.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{entry.action}</p>
                            <p className="text-xs text-slate-600">by {entry.by}</p>
                          </div>
                          <p className="text-xs text-slate-500">
                            {format(new Date(entry.at), "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-3 rounded-lg">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add {user?.role === "distributor" ? "Response" : "Comment"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your comment or response..."
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handleAddComment}>Add Comment</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-700">Created:</span>
                  <p className="text-slate-900">
                    {format(new Date(ticket.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Last Updated:</span>
                  <p className="text-slate-900">
                    {format(new Date(ticket.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {user?.role === "distributor" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={newStatus} onValueChange={(v) => setNewStatus(v as TicketStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleUpdateStatus} className="w-full" disabled={!newStatus}>
                      Update Status
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assign Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleAssign("Hardware Team")}
                    >
                      Hardware Team
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleAssign("Software Team")}
                    >
                      Software Team
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleAssign("Network Team")}
                    >
                      Network Team
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
