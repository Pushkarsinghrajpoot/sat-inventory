"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useContractStore } from "@/store/contract-store";
import { useCustomerStore } from "@/store/customer-store";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { getAccessibleCustomers } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { addDays, format } from "date-fns";

export default function NewContractPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addParentContract, parentContracts } = useContractStore();
  const { customers } = useCustomerStore();
  const { mode } = useResellerContextStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerId: "",
    title: "",
    description: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 365), "yyyy-MM-dd"),
    totalValue: "",
    terms: "Standard terms and conditions apply.",
    autoRenew: true,
    renewalReminderDays: "60"
  });

  const resellerContext = user?.role === "reseller" ? { mode } : undefined;
  const accessibleCustomers = getAccessibleCustomers(customers, user, resellerContext);

  const generateContractNumber = () => {
    const prefix = user?.role === "distributor" ? "SATMZ" : user?.companyName.split(" ")[0].toUpperCase() || "CONT";
    const year = new Date().getFullYear();
    const count = parentContracts.length + 1;
    return `${prefix}-${year}-PC-${String(count).padStart(3, "0")}`;
  };

  const handleSubmit = () => {
    if (!user || !formData.customerId) return;

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    if (!selectedCustomer) return;

    const newContract = {
      id: `PC${String(parentContracts.length + 1).padStart(3, "0")}`,
      contractNumber: generateContractNumber(),
      customerId: formData.customerId,
      customerName: selectedCustomer.name,
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "active" as const,
      totalValue: parseFloat(formData.totalValue) || 0,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productIds: [],
      childContractIds: [],
      terms: formData.terms,
      autoRenew: formData.autoRenew,
      renewalReminderDays: parseInt(formData.renewalReminderDays) || 60
    };

    addParentContract(newContract);
    router.push(`/contracts/${newContract.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/contracts")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contracts
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Contract</h1>
        <p className="text-gray-600 mt-1">Create a new parent contract for your customer</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Step 1: Select Customer"}
            {step === 2 && "Step 2: Contract Details"}
            {step === 3 && "Step 3: Review & Create"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Select Customer *</Label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Choose a customer" />
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
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!formData.customerId}>
                  Next: Contract Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Contract Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Enterprise IT Infrastructure Contract"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the contract scope"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="totalValue">Total Contract Value (₹) *</Label>
                <Input
                  id="totalValue"
                  type="number"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                  placeholder="e.g., 5000000"
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="autoRenew">Auto-renew contract</Label>
                </div>
                {formData.autoRenew && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="renewalReminderDays">Reminder:</Label>
                    <Input
                      id="renewalReminderDays"
                      type="number"
                      value={formData.renewalReminderDays}
                      onChange={(e) => setFormData({ ...formData, renewalReminderDays: e.target.value })}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">days before</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!formData.title || !formData.totalValue}>
                  Next: Review
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Contract Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Contract Number</p>
                    <p className="font-semibold text-gray-900">{generateContractNumber()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-900">
                      {customers.find(c => c.id === formData.customerId)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Title</p>
                    <p className="font-semibold text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Value</p>
                    <p className="font-semibold text-gray-900">₹{(parseFloat(formData.totalValue) / 100000).toFixed(2)}L</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Period</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(formData.startDate), "MMM d, yyyy")} - {format(new Date(formData.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Auto-renew</p>
                    <p className="font-semibold text-gray-900">
                      {formData.autoRenew ? `Yes (${formData.renewalReminderDays} days reminder)` : "No"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit}>
                  Create Contract
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
