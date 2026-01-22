"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useTicketStore } from "@/store/ticket-store";
import { getWarrantyStatus } from "@/lib/date-utils";
import { toast } from "sonner";
import { TicketCategory, TicketPriority } from "@/lib/types";

export default function NewTicketPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items } = useInventoryStore();
  const { createTicket } = useTicketStore();
  const [step, setStep] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Hardware Issue");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const userProducts = useMemo(() => {
    if (user?.role === "reseller") {
      return items.filter(item => item.customerId === user.customerId);
    }
    return items;
  }, [items, user]);

  const selectedProduct = useMemo(() => {
    return userProducts.find(item => item.id === selectedProductId);
  }, [userProducts, selectedProductId]);

  const warrantyInfo = useMemo(() => {
    if (!selectedProduct) return null;
    const status = getWarrantyStatus(selectedProduct.warrantyEndDate);
    const serviceStatus = selectedProduct.serviceType ? "covered" : "not_covered";
    return { status, serviceStatus };
  }, [selectedProduct]);

  const handleSubmit = () => {
    if (!selectedProduct || !subject || description.length < 50) {
      toast.error("Please fill all required fields");
      return;
    }

    const newTicket = createTicket({
      customerId: user?.customerId || selectedProduct.customerId,
      serialNumber: selectedProduct.serialNumber,
      productName: selectedProduct.productName,
      category,
      priority,
      subject,
      description,
      status: "open",
      warrantyStatus: warrantyInfo?.status.status === "active" ? "active" : 
                      warrantyInfo?.status.status === "expiring_soon" ? "expiring" : "expired",
      serviceStatus: (warrantyInfo?.serviceStatus || "not_covered") as "covered" | "not_covered",
    });

    toast.success(`Ticket ${newTicket.id} created successfully`);
    router.push(`/tickets/${newTicket.id}`);
  };

  return (
    <DashboardLayout title="Raise New Ticket">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
              1
            </div>
            <span className="font-medium">Select Product</span>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
              2
            </div>
            <span className="font-medium">Ticket Details</span>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
              3
            </div>
            <span className="font-medium">Review & Submit</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Product</CardTitle>
              <CardDescription>Choose the product you need support for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product" className="mt-1">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {userProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.productName} - {product.serialNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && warrantyInfo && (
                <Card className={warrantyInfo.status.status === "active" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {warrantyInfo.status.status === "active" ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-2">Coverage Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Warranty Status:</span>
                            <Badge variant={warrantyInfo.status.status === "active" ? "success" : "danger"}>
                              {warrantyInfo.status.status === "active" 
                                ? `Active (${warrantyInfo.status.daysRemaining} days remaining)`
                                : "Expired"
                              }
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Service Coverage:</span>
                            <Badge variant={warrantyInfo.serviceStatus === "covered" ? "success" : "secondary"}>
                              {warrantyInfo.serviceStatus === "covered" 
                                ? `Covered - ${selectedProduct.serviceType}`
                                : "Not Covered"
                              }
                            </Badge>
                          </div>
                          {warrantyInfo.status.status !== "active" && (
                            <p className="text-red-700 mt-2">
                              ⚠️ This product is out of warranty. Support charges may apply.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedProductId}
                >
                  Next: Ticket Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Ticket Details</CardTitle>
              <CardDescription>Provide details about your issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Issue Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware Issue">Hardware Issue</SelectItem>
                    <SelectItem value="Software Issue">Software Issue</SelectItem>
                    <SelectItem value="Network Issue">Network Issue</SelectItem>
                    <SelectItem value="License Issue">License Issue</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                  <SelectTrigger id="priority" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue (minimum 50 characters)"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {description.length}/50 characters minimum
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!subject || description.length < 50}
                >
                  Next: Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && selectedProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Review & Submit</CardTitle>
              <CardDescription>Please review your ticket details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Product</Label>
                  <p className="font-medium">{selectedProduct.productName}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Serial Number</Label>
                  <p className="font-medium">{selectedProduct.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Category</Label>
                  <p className="font-medium">{category}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Priority</Label>
                  <p className="font-medium capitalize">{priority}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-600">Subject</Label>
                  <p className="font-medium">{subject}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-600">Description</Label>
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{description}</p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit}>
                  Submit Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
