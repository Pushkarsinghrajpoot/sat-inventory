"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  DialogFooter,
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
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useCustomerStore } from "@/store/customer-store";
import { useContractStore } from "@/store/contract-store";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getWarrantyStatus } from "@/lib/date-utils";
import { exportInventoryToCSV, downloadChallan, downloadInvoice } from "@/lib/export-utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { InventoryItem } from "@/lib/types";

const addItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  customerId: z.string().min(1, "Customer is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  warrantyStartDate: z.string().min(1, "Warranty start date is required"),
  warrantyEndDate: z.string().min(1, "Warranty end date is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  challanNumber: z.string().min(1, "Challan number is required"),
  licenseEndDate: z.string().optional(),
  serviceType: z.string().optional(),
  serviceStartDate: z.string().optional(),
  serviceEndDate: z.string().optional(),
});

type AddItemForm = z.infer<typeof addItemSchema>;

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, addItem, updateItem } = useInventoryStore();
  const { customers, getCustomerById } = useCustomerStore();
  const { getContractById } = useContractStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingChallan, setDownloadingChallan] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<AddItemForm>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      quantity: 1,
    },
  });

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
        if (!item.warrantyEndDate) return false;
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

  const handleDownloadChallan = async (item: InventoryItem) => {
    setDownloadingChallan(item.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      downloadChallan(item.challanNumber, item.productName, item.serialNumber);
      toast.success(`Challan ${item.challanNumber} downloaded successfully`);
    } catch (error) {
      toast.error("Failed to download challan");
    } finally {
      setDownloadingChallan(null);
    }
  };

  const handleDownloadInvoice = async (item: InventoryItem) => {
    setDownloadingInvoice(item.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      downloadInvoice(item.invoiceNumber, item.productName, item.serialNumber, item.quantity);
      toast.success(`Invoice ${item.invoiceNumber} downloaded successfully`);
    } catch (error) {
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const handleAddItem = (data: AddItemForm) => {
    const newItem: InventoryItem = {
      id: `INV-${Date.now()}`,
      contractId: "",
      contractNumber: "",
      customerId: data.customerId,
      productName: data.productName,
      serialNumber: data.serialNumber,
      quantity: data.quantity,
      unitPrice: 0,
      totalPrice: 0,
      deliveryDate: data.deliveryDate,
      warrantyStartDate: data.warrantyStartDate,
      warrantyEndDate: data.warrantyEndDate,
      warrantyContractId: null,
      licenseEndDate: data.licenseEndDate || null,
      licenseContractId: null,
      serviceType: data.serviceType || null,
      serviceStartDate: data.serviceStartDate || null,
      serviceEndDate: data.serviceEndDate || null,
      serviceContractId: null,
      category: data.category,
      manufacturer: "",
      model: "",
      invoiceNumber: data.invoiceNumber,
      challanNumber: data.challanNumber,
      poNumber: "",
      status: "delivered",
      notes: "",
    };

    addItem(newItem);
    toast.success(`${data.productName} added to inventory successfully!`);
    reset();
    setAddItemOpen(false);
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
                  onClick={() => {
                    exportInventoryToCSV(filteredItems);
                    toast.success(`Exported ${filteredItems.length} items to CSV`);
                  }}
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
                <Button onClick={() => setAddItemOpen(true)}>
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
                    <th className="text-left p-3 text-sm font-semibold">Contract Number</th>
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
                      <td colSpan={user?.role === "distributor" ? 9 : 8} className="text-center p-8 text-slate-500">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => {
                      const contract = item.contractId ? getContractById(item.contractId) : null;
                      return (
                      <tr key={item.id} className="border-b hover:bg-slate-50">
                        <td className="p-3">
                          {item.contractNumber ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => {
                                      if (contract) {
                                        router.push(`/contracts/${contract.id}`);
                                      }
                                    }}
                                    className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                                    disabled={!contract}
                                  >
                                    {item.contractNumber}
                                    <ExternalLink className="h-3 w-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">View Contract Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="text-sm text-gray-400 italic">No Contract</span>
                          )}
                        </td>
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
                          {item.warrantyEndDate ? format(new Date(item.warrantyEndDate), "MMM dd, yyyy") : "N/A"}
                        </td>
                        <td className="p-3">{item.warrantyEndDate ? getStatusBadge(item.warrantyEndDate) : <span className="text-sm text-gray-500">N/A</span>}</td>
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
                              disabled={downloadingChallan === item.id}
                            >
                              <FileText className={downloadingChallan === item.id ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(item)}
                              disabled={downloadingInvoice === item.id}
                            >
                              <Download className={downloadingInvoice === item.id ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )})
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
                      {selectedItem.warrantyStartDate ? format(new Date(selectedItem.warrantyStartDate), "MMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Warranty End</label>
                    <p className="text-sm text-slate-900 mt-1">
                      {selectedItem.warrantyEndDate ? format(new Date(selectedItem.warrantyEndDate), "MMM dd, yyyy") : "N/A"}
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
                    <div className="mt-1">{selectedItem.warrantyEndDate ? getStatusBadge(selectedItem.warrantyEndDate) : <span className="text-sm text-gray-500">N/A</span>}</div>
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

        <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new item to the inventory
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddItem)}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    {...register("productName")}
                    placeholder="Enter product name"
                    className="mt-1"
                  />
                  {errors.productName && (
                    <p className="text-xs text-red-500 mt-1">{errors.productName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    {...register("serialNumber")}
                    placeholder="SN-XXXX"
                    className="mt-1"
                  />
                  {errors.serialNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.serialNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    {...register("category")}
                    placeholder="e.g., Laptop, Router, etc."
                    className="mt-1"
                  />
                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    placeholder="1"
                    className="mt-1"
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select onValueChange={(value) => setValue("customerId", value)}>
                    <SelectTrigger id="customerId" className="mt-1">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && (
                    <p className="text-xs text-red-500 mt-1">{errors.customerId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="deliveryDate">Delivery Date *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    {...register("deliveryDate")}
                    className="mt-1"
                  />
                  {errors.deliveryDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.deliveryDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="warrantyStartDate">Warranty Start Date *</Label>
                  <Input
                    id="warrantyStartDate"
                    type="date"
                    {...register("warrantyStartDate")}
                    className="mt-1"
                  />
                  {errors.warrantyStartDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.warrantyStartDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="warrantyEndDate">Warranty End Date *</Label>
                  <Input
                    id="warrantyEndDate"
                    type="date"
                    {...register("warrantyEndDate")}
                    className="mt-1"
                  />
                  {errors.warrantyEndDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.warrantyEndDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="licenseEndDate">License End Date (Optional)</Label>
                  <Input
                    id="licenseEndDate"
                    type="date"
                    {...register("licenseEndDate")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    {...register("invoiceNumber")}
                    placeholder="INV-XXXX"
                    className="mt-1"
                  />
                  {errors.invoiceNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.invoiceNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="challanNumber">Challan Number *</Label>
                  <Input
                    id="challanNumber"
                    {...register("challanNumber")}
                    placeholder="CH-XXXX"
                    className="mt-1"
                  />
                  {errors.challanNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.challanNumber.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold text-sm mb-3 mt-2">Service Details (Optional)</h4>
                </div>

                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Input
                    id="serviceType"
                    {...register("serviceType")}
                    placeholder="e.g., AMC, Extended Support"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="serviceStartDate">Service Start Date</Label>
                  <Input
                    id="serviceStartDate"
                    type="date"
                    {...register("serviceStartDate")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="serviceEndDate">Service End Date</Label>
                  <Input
                    id="serviceEndDate"
                    type="date"
                    {...register("serviceEndDate")}
                    className="mt-1"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setAddItemOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
