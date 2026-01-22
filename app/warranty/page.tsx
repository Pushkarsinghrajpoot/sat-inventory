"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, AlertCircle, CheckCircle, Edit, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useCustomerStore } from "@/store/customer-store";
import { getWarrantyStatus, daysUntilExpiry } from "@/lib/date-utils";
import { format, addYears } from "date-fns";
import { toast } from "sonner";
import { InventoryItem } from "@/lib/types";

export default function WarrantyPage() {
  const { user } = useAuthStore();
  const { items, updateItem } = useInventoryStore();
  const { getCustomerById } = useCustomerStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceStartDate, setServiceStartDate] = useState("");
  const [serviceEndDate, setServiceEndDate] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");

  const filteredItems = useMemo(() => {
    if (user?.role === "reseller") {
      return items.filter(item => item.customerId === user.customerId);
    }
    return items;
  }, [items, user]);

  const stats = useMemo(() => {
    const active = filteredItems.filter(item => {
      const status = getWarrantyStatus(item.warrantyEndDate);
      return status.status === "active";
    });
    const expiring30 = filteredItems.filter(item => {
      const days = daysUntilExpiry(item.warrantyEndDate);
      return days > 0 && days <= 30;
    });
    const expired = filteredItems.filter(item => {
      const status = getWarrantyStatus(item.warrantyEndDate);
      return status.status === "expired";
    });
    const activeService = filteredItems.filter(item => item.serviceType !== null);

    return {
      activeWarranties: active.length,
      expiring30Days: expiring30.length,
      expired: expired.length,
      activeServiceContracts: activeService.length,
    };
  }, [filteredItems]);

  const handleEditWarranty = (item: InventoryItem) => {
    setSelectedItem(item);
    setWarrantyEndDate(item.warrantyEndDate);
    setEditDialogOpen(true);
  };

  const handleSaveWarranty = () => {
    if (selectedItem && warrantyEndDate) {
      updateItem(selectedItem.id, { warrantyEndDate });
      toast.success("Warranty dates updated successfully");
      setEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleEditService = (item: InventoryItem) => {
    setSelectedItem(item);
    setServiceType(item.serviceType || "none");
    setServiceStartDate(item.serviceStartDate || "");
    setServiceEndDate(item.serviceEndDate || "");
    setServiceNotes("");
    setServiceDialogOpen(true);
  };

  const handleSaveService = () => {
    if (selectedItem) {
      updateItem(selectedItem.id, {
        serviceType: serviceType === "none" ? null : serviceType || null,
        serviceStartDate: serviceStartDate || null,
        serviceEndDate: serviceEndDate || null,
      });
      toast.success("Service contract updated successfully");
      setServiceDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleRenewWarranty = (item: InventoryItem) => {
    const newEndDate = format(addYears(new Date(item.warrantyEndDate), 1), "yyyy-MM-dd");
    updateItem(item.id, { warrantyEndDate: newEndDate });
    toast.success(`Warranty renewed until ${format(new Date(newEndDate), "MMM dd, yyyy")}`);
  };

  const getWarrantyBadge = (endDate: string) => {
    const status = getWarrantyStatus(endDate);
    if (status.status === "expired") {
      return <Badge variant="danger">Expired</Badge>;
    }
    if (status.daysRemaining <= 30) {
      return <Badge variant="danger">Expiring Soon</Badge>;
    }
    if (status.daysRemaining <= 90) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  return (
    <DashboardLayout title="Warranty & Services">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeWarranties}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring in 30 Days</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expiring30Days}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired Warranties</CardTitle>
              <AlertCircle className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-600">{stats.expired}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Service Contracts</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeServiceContracts}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Warranty & Service Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-3 text-sm font-semibold">Product/Serial</th>
                    {user?.role === "distributor" && (
                      <th className="text-left p-3 text-sm font-semibold">Customer</th>
                    )}
                    <th className="text-left p-3 text-sm font-semibold">Warranty Start</th>
                    <th className="text-left p-3 text-sm font-semibold">Warranty End</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                    <th className="text-left p-3 text-sm font-semibold">Service Type</th>
                    <th className="text-left p-3 text-sm font-semibold">Service End</th>
                    <th className="text-left p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "distributor" ? 8 : 7} className="text-center p-8 text-slate-500">
                        No warranty items found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-slate-50">
                        <td className="p-3">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-slate-500">{item.serialNumber}</p>
                        </td>
                        {user?.role === "distributor" && (
                          <td className="p-3 text-sm text-slate-600">
                            {getCustomerById(item.customerId)?.name}
                          </td>
                        )}
                        <td className="p-3 text-sm text-slate-600">
                          {format(new Date(item.warrantyStartDate), "MMM dd, yyyy")}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {format(new Date(item.warrantyEndDate), "MMM dd, yyyy")}
                        </td>
                        <td className="p-3">{getWarrantyBadge(item.warrantyEndDate)}</td>
                        <td className="p-3 text-sm text-slate-600">
                          {item.serviceType || <span className="text-slate-400">None</span>}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {item.serviceEndDate 
                            ? format(new Date(item.serviceEndDate), "MMM dd, yyyy")
                            : <span className="text-slate-400">—</span>
                          }
                        </td>
                        <td className="p-3">
                          {user?.role === "distributor" ? (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditWarranty(item)}
                                title="Edit Warranty"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditService(item)}
                                title="Edit Service"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRenewWarranty(item)}
                                title="Renew Warranty"
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              Contact distributor for renewal
                            </p>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Warranty Dates</DialogTitle>
              <DialogDescription>
                Update warranty dates for {selectedItem?.productName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="warranty-end">Warranty End Date</Label>
                <Input
                  id="warranty-end"
                  type="date"
                  value={warrantyEndDate}
                  onChange={(e) => setWarrantyEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWarranty}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service Contract</DialogTitle>
              <DialogDescription>
                Manage service contract for {selectedItem?.productName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="service-type">Service Type</Label>
                <Select value={serviceType || "none"} onValueChange={setServiceType}>
                  <SelectTrigger id="service-type" className="mt-1">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Service</SelectItem>
                    <SelectItem value="AMC">AMC</SelectItem>
                    <SelectItem value="Extended Support">Extended Support</SelectItem>
                    <SelectItem value="Premium Support">Premium Support</SelectItem>
                    <SelectItem value="Standard Support">Standard Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {serviceType && serviceType !== "none" && (
                <>
                  <div>
                    <Label htmlFor="service-start">Service Start Date</Label>
                    <Input
                      id="service-start"
                      type="date"
                      value={serviceStartDate}
                      onChange={(e) => setServiceStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-end">Service End Date</Label>
                    <Input
                      id="service-end"
                      type="date"
                      value={serviceEndDate}
                      onChange={(e) => setServiceEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about this service contract..."
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveService}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
