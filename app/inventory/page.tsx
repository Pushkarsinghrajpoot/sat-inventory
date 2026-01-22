"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Plus,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useCustomerStore } from "@/store/customer-store";
import { getWarrantyStatus } from "@/lib/date-utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { InventoryItem } from "@/lib/types";

export default function InventoryPage() {
  const { user } = useAuthStore();
  const { items } = useInventoryStore();
  const { customers, getCustomerById } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (user?.role === "reseller") {
      filtered = filtered.filter(item => item.customerId === user.customerId);
    } else if (customerFilter !== "all") {
      filtered = filtered.filter(item => item.customerId === customerFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => {
        const warrantyStatus = getWarrantyStatus(item.warrantyEndDate);
        if (statusFilter === "active") return warrantyStatus.status === "active";
        if (statusFilter === "expiring") return warrantyStatus.status === "expiring_soon";
        if (statusFilter === "expired") return warrantyStatus.status === "expired";
        return true;
      });
    }

    return filtered;
  }, [items, user, searchQuery, categoryFilter, statusFilter, customerFilter]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCustomerFilter("all");
    setCurrentPage(1);
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleDownloadChallan = (item: InventoryItem) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: "Downloading challan...",
        success: `Challan ${item.challanNumber} downloaded successfully`,
        error: "Failed to download challan",
      }
    );
  };

  const handleDownloadInvoice = (item: InventoryItem) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: "Downloading invoice...",
        success: `Invoice ${item.invoiceNumber} downloaded successfully`,
        error: "Failed to download invoice",
      }
    );
  };

  const getStatusBadge = (warrantyEndDate: string) => {
    const status = getWarrantyStatus(warrantyEndDate);
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
    <DashboardLayout title="Inventory Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Export feature coming soon!")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search product or serial..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              {user?.role === "distributor" && (
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
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
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Inventory Items ({filteredItems.length})
              </CardTitle>
              {user?.role === "distributor" && (
                <Button onClick={() => toast.info("Add inventory feature coming soon!")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-3 text-sm font-semibold">Product Name</th>
                    <th className="text-left p-3 text-sm font-semibold">Serial Number</th>
                    {user?.role === "distributor" && (
                      <th className="text-left p-3 text-sm font-semibold">Customer</th>
                    )}
                    <th className="text-left p-3 text-sm font-semibold">Category</th>
                    <th className="text-left p-3 text-sm font-semibold">Quantity</th>
                    <th className="text-left p-3 text-sm font-semibold">Warranty Expiry</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                    <th className="text-left p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "distributor" ? 8 : 7} className="text-center p-8 text-slate-500">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-slate-50">
                        <td className="p-3 text-sm font-medium">{item.productName}</td>
                        <td className="p-3 text-sm text-slate-600">{item.serialNumber}</td>
                        {user?.role === "distributor" && (
                          <td className="p-3 text-sm text-slate-600">
                            {getCustomerById(item.customerId)?.name}
                          </td>
                        )}
                        <td className="p-3 text-sm text-slate-600">{item.category}</td>
                        <td className="p-3 text-sm text-slate-600">{item.quantity}</td>
                        <td className="p-3 text-sm text-slate-600">
                          {format(new Date(item.warrantyEndDate), "MMM dd, yyyy")}
                        </td>
                        <td className="p-3">{getStatusBadge(item.warrantyEndDate)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadChallan(item)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(item)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Items per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inventory Item Details</DialogTitle>
              <DialogDescription>
                Complete information about this inventory item
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Product Name</label>
                    <p className="text-sm text-slate-900 mt-1">{selectedItem.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Serial Number</label>
                    <p className="text-sm text-slate-900 mt-1">{selectedItem.serialNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <p className="text-sm text-slate-900 mt-1">{selectedItem.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Quantity</label>
                    <p className="text-sm text-slate-900 mt-1">{selectedItem.quantity}</p>
                  </div>
                  {user?.role === "distributor" && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Customer</label>
                      <p className="text-sm text-slate-900 mt-1">
                        {getCustomerById(selectedItem.customerId)?.name}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Delivery Date</label>
                    <p className="text-sm text-slate-900 mt-1">
                      {format(new Date(selectedItem.deliveryDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Warranty Start</label>
                    <p className="text-sm text-slate-900 mt-1">
                      {format(new Date(selectedItem.warrantyStartDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Warranty End</label>
                    <p className="text-sm text-slate-900 mt-1">
                      {format(new Date(selectedItem.warrantyEndDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {selectedItem.licenseEndDate && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">License End</label>
                      <p className="text-sm text-slate-900 mt-1">
                        {format(new Date(selectedItem.licenseEndDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  )}
                  {selectedItem.serviceType && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Service Type</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedItem.serviceType}</p>
                    </div>
                  )}
                  {selectedItem.serviceEndDate && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Service End</label>
                      <p className="text-sm text-slate-900 mt-1">
                        {format(new Date(selectedItem.serviceEndDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Invoice Number</label>
                    <p className="text-sm text-slate-900 mt-1">{selectedItem.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Challan Number</label>
                    <p className="text-sm text-slate-900 mt-1">{selectedItem.challanNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedItem.warrantyEndDate)}</div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadChallan(selectedItem)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Challan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadInvoice(selectedItem)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
