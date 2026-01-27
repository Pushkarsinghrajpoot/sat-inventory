"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useCustomerStore } from "@/store/customer-store";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { getAccessibleCustomers } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Package, Save } from "lucide-react";
import { format, addYears } from "date-fns";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useInventoryStore();
  const { customers } = useCustomerStore();
  const { mode } = useResellerContextStore();

  const resellerContext = user?.role === "reseller" ? { mode } : undefined;
  const accessibleCustomers = getAccessibleCustomers(customers, user, resellerContext);

  const [formData, setFormData] = useState({
    customerId: "",
    productName: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    category: "Server",
    quantity: "1",
    unitPrice: "",
    deliveryDate: format(new Date(), "yyyy-MM-dd"),
    warrantyStartDate: format(new Date(), "yyyy-MM-dd"),
    warrantyEndDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
    invoiceNumber: "",
    challanNumber: "",
    poNumber: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerId || !formData.productName || !formData.serialNumber || !formData.unitPrice) {
      toast.error("Please fill all required fields");
      return;
    }

    const unitPrice = parseFloat(formData.unitPrice);
    const quantity = parseInt(formData.quantity) || 1;

    const newProduct = {
      id: `PROD${Date.now()}`,
      contractId: "",
      contractNumber: "",
      customerId: formData.customerId,
      productName: formData.productName,
      serialNumber: formData.serialNumber,
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: unitPrice * quantity,
      deliveryDate: formData.deliveryDate,
      warrantyStartDate: formData.warrantyStartDate,
      warrantyEndDate: formData.warrantyEndDate,
      warrantyContractId: null,
      licenseEndDate: null,
      licenseContractId: null,
      serviceType: null,
      serviceStartDate: null,
      serviceEndDate: null,
      serviceContractId: null,
      category: formData.category,
      manufacturer: formData.manufacturer,
      model: formData.model,
      invoiceNumber: formData.invoiceNumber,
      challanNumber: formData.challanNumber,
      poNumber: formData.poNumber,
      status: "delivered" as const,
      notes: formData.notes,
    };

    addItem(newProduct);
    toast.success(`Product ${formData.productName} created successfully`);
    router.push("/inventory");
  };

  return (
    <DashboardLayout title="Create New Product">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/inventory")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Create a new product in inventory. Once created, you can link it to contracts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Selection */}
              <div>
                <Label htmlFor="customer">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                >
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessibleCustomers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g., Dell PowerEdge R740"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g., SN123456789"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g., Dell"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g., R740"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Printer">Printer</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    min="1"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder="e.g., 500000"
                  required
                />
                {formData.unitPrice && (
                  <p className="text-sm text-gray-600 mt-1">
                    Total Price: ₹{(parseFloat(formData.unitPrice) * parseInt(formData.quantity || "1")).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="warrantyStart">Warranty Start</Label>
                  <Input
                    id="warrantyStart"
                    type="date"
                    value={formData.warrantyStartDate}
                    onChange={(e) => setFormData({ ...formData, warrantyStartDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="warrantyEnd">Warranty End</Label>
                  <Input
                    id="warrantyEnd"
                    type="date"
                    value={formData.warrantyEndDate}
                    onChange={(e) => setFormData({ ...formData, warrantyEndDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Document Numbers */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    placeholder="e.g., INV-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="challanNumber">Challan Number</Label>
                  <Input
                    id="challanNumber"
                    value={formData.challanNumber}
                    onChange={(e) => setFormData({ ...formData, challanNumber: e.target.value })}
                    placeholder="e.g., CH-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="poNumber">PO Number</Label>
                  <Input
                    id="poNumber"
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    placeholder="e.g., PO-2024-001"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this product..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/inventory")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
