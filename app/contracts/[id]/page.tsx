"use client";

import { use, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useContractStore } from "@/store/contract-store";
import { useInventoryStore } from "@/store/inventory-store";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, DollarSign, FileText, Package, Plus, Edit, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, differenceInDays, addYears } from "date-fns";
import { useAuthStore } from "@/store/auth-store";
import { hasPermission } from "@/lib/permissions";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { toast } from "sonner";
import ErrorBoundary from "@/components/error-boundary";

function ContractDetailPageContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Store hooks
  const { user } = useAuthStore();
  const { mode } = useResellerContextStore();
  const contractStore = useContractStore();
  const inventoryStore = useInventoryStore();
  
  // State for contract data
  const [contract, setContract] = useState<any>(null);
  const [parentContract, setParentContract] = useState<any>(null);
  const [childContract, setChildContract] = useState<any>(null);
  const [isChildContract, setIsChildContract] = useState(false);
  const [childContracts, setChildContracts] = useState<any[]>([]);
  const [contractProducts, setContractProducts] = useState<any[]>([]);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [createChildDialogOpen, setCreateChildDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [newProductForm, setNewProductForm] = useState({
    productName: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    category: "Server",
    quantity: "1",
    unitPrice: "",
    warrantyStartDate: format(new Date(), "yyyy-MM-dd"),
    warrantyEndDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
    location: "",
    status: "active"
  });
  
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    totalValue: "",
    terms: "",
    autoRenew: true,
    renewalReminderDays: "60"
  });

  const [childContractForm, setChildContractForm] = useState({
    title: "",
    description: "",
    type: "AMC",
    coverageType: "full",
    value: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
    responseTime: "24 hours",
    coveredSerialNumbers: [] as string[]
  });

  // Load contract data on mount
  useEffect(() => {
    const loadContractData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get parent contract first
        let foundParentContract = null;
        let foundChildContract = null;
        let foundContract = null;

        try {
          foundParentContract = contractStore.getContractById(id);
          if (foundParentContract) {
            foundContract = foundParentContract;
            setIsChildContract(false);
          }
        } catch (e) {
          console.error('Error fetching parent contract:', e);
        }

        // If not found as parent, try as child
        if (!foundContract) {
          try {
            foundChildContract = contractStore.getChildContractById(id);
            if (foundChildContract) {
              foundContract = foundChildContract;
              setIsChildContract(true);
              
              // Get parent contract for child
              try {
                const parent = contractStore.getContractById(foundChildContract.parentContractId);
                setParentContract(parent);
              } catch (e) {
                console.error('Error fetching parent for child contract:', e);
              }
            }
          } catch (e) {
            console.error('Error fetching child contract:', e);
          }
        }

        if (!foundContract) {
          setError("Contract not found");
          setIsLoading(false);
          return;
        }

        // Validate contract has required properties
        if (!foundContract?.id || !foundContract?.contractNumber || !foundContract?.endDate) {
          setError("Invalid contract data");
          setIsLoading(false);
          return;
        }

        setContract(foundContract);
        setParentContract(foundParentContract);
        setChildContract(foundChildContract);

        // Load child contracts if this is a parent contract
        if (!foundChildContract && foundParentContract) {
          try {
            const children = contractStore.getChildContractsByParentId(foundContract.id);
            setChildContracts(Array.isArray(children) ? children : []);
          } catch (e) {
            console.error('Error fetching child contracts:', e);
            setChildContracts([]);
          }
        } else {
          setChildContracts([]);
        }

        // Load contract products
        const productIds = Array.isArray(foundContract.productIds) ? foundContract.productIds : [];
        const items = inventoryStore.items || [];
        const products = items.filter(item => productIds.includes(item.id));
        setContractProducts(products);

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading contract:', err);
        setError(err instanceof Error ? err.message : "Failed to load contract");
        setIsLoading(false);
      }
    };

    loadContractData();
  }, [id, contractStore, inventoryStore]);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Contract Details">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Loading contract...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error || !contract) {
    return (
      <DashboardLayout title="Contract Details">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error: {error || "Contract not found"}</p>
            <Button onClick={() => router.push("/contracts")} className="mt-4">
              Back to Contracts
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate derived values
  const resellerContext = user?.role === "reseller" ? { mode } : undefined;
  const canEdit = hasPermission(user?.role || "customer", "contracts.edit", resellerContext);
  const daysRemaining = differenceInDays(new Date(contract.endDate), new Date());
  
  // Ensure contract has required properties with defaults
  const safeContract = {
    ...contract,
    productIds: Array.isArray(contract.productIds) ? contract.productIds : [],
    terms: contract.terms || "",
    autoRenew: contract.autoRenew || false,
    renewalReminderDays: contract.renewalReminderDays || 30
  };

  const handleEditContract = () => {
    setEditForm({
      title: safeContract.title,
      description: safeContract.description,
      totalValue: (isChildContract ? childContract?.value : parentContract?.totalValue)?.toString() || "0",
      terms: safeContract.terms,
      autoRenew: safeContract.autoRenew,
      renewalReminderDays: safeContract.renewalReminderDays.toString()
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (isChildContract) {
      contractStore.updateChildContract(contract.id, {
        title: editForm.title,
        description: editForm.description,
        value: parseFloat(editForm.totalValue),
        terms: editForm.terms,
        autoRenew: editForm.autoRenew,
        renewalReminderDays: parseInt(editForm.renewalReminderDays)
      });
    } else {
      contractStore.updateParentContract(contract.id, {
        title: editForm.title,
        description: editForm.description,
        totalValue: parseFloat(editForm.totalValue),
        terms: editForm.terms,
        autoRenew: editForm.autoRenew,
        renewalReminderDays: parseInt(editForm.renewalReminderDays)
      });
    }
    
    // Reload contract data
    const updatedContract = isChildContract 
      ? contractStore.getChildContractById(contract.id)
      : contractStore.getContractById(contract.id);
    setContract(updatedContract);
    
    toast.success("Contract updated successfully");
    setEditDialogOpen(false);
  };

  const handleRenewContract = () => {
    const newEndDate = format(addYears(new Date(contract.endDate), 1), "yyyy-MM-dd");
    if (isChildContract) {
      contractStore.updateChildContract(contract.id, {
        endDate: newEndDate,
        status: "active" as const
      });
    } else {
      contractStore.updateParentContract(contract.id, {
        endDate: newEndDate,
        status: "active" as const
      });
    }
    
    // Reload contract data
    const updatedContract = isChildContract 
      ? contractStore.getChildContractById(contract.id)
      : contractStore.getContractById(contract.id);
    setContract(updatedContract);
    
    toast.success(`Contract renewed until ${format(new Date(newEndDate), "MMM d, yyyy")}`);
    setRenewDialogOpen(false);
  };

  const handleAddProduct = () => {
    setAddProductDialogOpen(true);
  };

  const handleSaveProducts = () => {
    if (selectedProductIds.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    // Update contract productIds
    const updatedProductIds = [...new Set([...safeContract.productIds, ...selectedProductIds])];
    if (isChildContract) {
      contractStore.updateChildContract(contract.id, {
        productIds: updatedProductIds
      });
    } else {
      contractStore.updateParentContract(contract.id, {
        productIds: updatedProductIds
      });
    }

    // Update inventory items with contract info
    selectedProductIds.forEach(productId => {
      inventoryStore.updateItem(productId, {
        contractId: contract.id,
        contractNumber: contract.contractNumber
      });
    });

    // Reload products
    const items = inventoryStore.items || [];
    const products = items.filter(item => updatedProductIds.includes(item.id));
    setContractProducts(products);
    
    // Reload contract
    const updatedContract = isChildContract 
      ? contractStore.getChildContractById(contract.id)
      : contractStore.getContractById(contract.id);
    setContract(updatedContract);

    toast.success(`${selectedProductIds.length} product(s) added to contract`);
    setSelectedProductIds([]);
    setAddProductDialogOpen(false);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCreateProduct = () => {
    if (!newProductForm.productName || !newProductForm.serialNumber || !newProductForm.unitPrice) {
      toast.error("Please fill all required fields");
      return;
    }

    const unitPrice = parseFloat(newProductForm.unitPrice);
    const quantity = parseInt(newProductForm.quantity) || 1;
    
    const newProduct = {
      id: `PROD${Date.now()}`,
      contractId: "",
      contractNumber: "",
      customerId: contract.customerId,
      productName: newProductForm.productName,
      serialNumber: newProductForm.serialNumber,
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: unitPrice * quantity,
      deliveryDate: format(new Date(), "yyyy-MM-dd"),
      warrantyStartDate: newProductForm.warrantyStartDate,
      warrantyEndDate: newProductForm.warrantyEndDate,
      warrantyContractId: null,
      licenseEndDate: null,
      licenseContractId: null,
      serviceType: null,
      serviceStartDate: null,
      serviceEndDate: null,
      serviceContractId: null,
      category: newProductForm.category,
      manufacturer: newProductForm.manufacturer,
      model: newProductForm.model,
      invoiceNumber: "",
      challanNumber: "",
      poNumber: "",
      status: "delivered" as const,
      notes: ""
    };

    inventoryStore.addItem(newProduct);
    
    // Auto-select the newly created product
    setSelectedProductIds(prev => [...prev, newProduct.id]);
    
    // Reset form
    setNewProductForm({
      productName: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      category: "Server",
      quantity: "1",
      unitPrice: "",
      warrantyStartDate: format(new Date(), "yyyy-MM-dd"),
      warrantyEndDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
      location: "",
      status: "active"
    });
    
    toast.success("Product created and selected for contract");
    setCreateProductDialogOpen(false);
  };

  const handleRemoveProduct = (productId: string) => {
    if (!canEdit) return;
    
    // Remove product from contract
    const updatedProductIds = safeContract.productIds.filter((id: string) => id !== productId);
    if (isChildContract) {
      contractStore.updateChildContract(contract.id, { productIds: updatedProductIds });
    } else {
      contractStore.updateParentContract(contract.id, { productIds: updatedProductIds });
    }
    
    // Remove contract info from inventory item
    inventoryStore.updateItem(productId, {
      contractId: "",
      contractNumber: ""
    });
    
    // Reload products
    setContractProducts(prev => prev.filter(p => p.id !== productId));
    
    toast.success("Product removed from contract");
  };

  const handleCreateChildContract = () => {
    if (!childContractForm.title || !childContractForm.value) {
      toast.error("Please fill all required fields");
      return;
    }

    const childContractNumber = `${contract.contractNumber}-CC${String(childContracts.length + 1).padStart(3, "0")}`;
    
    const newChildContract = {
      id: `CC${Date.now()}`,
      parentContractId: contract.id,
      parentContractNumber: contract.contractNumber,
      contractNumber: childContractNumber,
      customerId: contract.customerId,
      title: childContractForm.title,
      description: childContractForm.description,
      type: childContractForm.type as "AMC" | "Support" | "License",
      coverageType: childContractForm.coverageType as "full" | "limited" | "parts_only" | "labor_only",
      value: parseFloat(childContractForm.value),
      startDate: childContractForm.startDate,
      endDate: childContractForm.endDate,
      status: "active" as const,
      responseTime: childContractForm.responseTime,
      coveredSerialNumbers: childContractForm.coveredSerialNumbers,
      productIds: [],
      terms: "",
      autoRenew: false,
      renewalReminderDays: 30,
      createdBy: user?.id || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    contractStore.addChildContract(newChildContract);
    
    // Reload child contracts
    const children = contractStore.getChildContractsByParentId(contract.id);
    setChildContracts(Array.isArray(children) ? children : []);
    
    // Reset form
    setChildContractForm({
      title: "",
      description: "",
      type: "AMC",
      coverageType: "full",
      value: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
      responseTime: "24 hours",
      coveredSerialNumbers: []
    });
    
    toast.success(`Child contract ${childContractNumber} created successfully`);
    setCreateChildDialogOpen(false);
  };

  const availableProducts = (inventoryStore.items || []).filter(
    item => item.customerId === contract.customerId && !safeContract.productIds.includes(item.id)
  );

  return (
    <DashboardLayout title="Contract Details">
      <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/contracts")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contracts
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{contract.contractNumber}</h1>
              <ContractStatusBadge status={contract.status} />
            </div>
            <p className="text-xl text-gray-700">{contract.title}</p>
            <p className="text-gray-600 mt-2">{isChildContract ? `Customer ID: ${contract.customerId}` : parentContract?.customerName || contract.customerId}</p>
          </div>
          {canEdit && (
            <Button variant="outline" onClick={handleEditContract}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Contract
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Valid Period</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(contract.startDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-gray-500">to {format(new Date(contract.endDate), "MMM d, yyyy")}</p>
                  {daysRemaining > 0 && (
                    <p className="text-xs text-blue-600 mt-1">{daysRemaining} days remaining</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(((isChildContract ? childContract?.value : parentContract?.totalValue || contract.totalValue) || 0) / 100000).toFixed(2)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{safeContract.productIds.length}</p>
                  <p className="text-xs text-gray-500">{isChildContract ? 'Child Contract' : `${childContracts.length} child contracts`}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products ({contractProducts.length})</TabsTrigger>
          {!isChildContract && <TabsTrigger value="child-contracts">Child Contracts ({childContracts.length})</TabsTrigger>}
          {isChildContract && <TabsTrigger value="parent-contract">Parent Contract</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900">{contract.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{format(new Date(contract.startDate), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">{format(new Date(contract.endDate), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Auto-renew</p>
                    <p className="font-medium text-gray-900">{contract.autoRenew ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reminder</p>
                    <p className="font-medium text-gray-900">{contract.renewalReminderDays} days</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Terms & Conditions</p>
                  <p className="text-gray-700 text-sm mt-1">{contract.terms || "No terms specified"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {canEdit && (
                  <>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setAddProductDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product to Contract
                    </Button>
                    {!isChildContract && (
                      <Button variant="outline" className="w-full justify-start" onClick={() => setCreateChildDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Child Contract
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start" onClick={handleEditContract}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Contract Details
                    </Button>
                    {contract.status === "active" && (
                      <Button variant="outline" className="w-full justify-start" onClick={() => setRenewDialogOpen(true)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renew Contract
                      </Button>
                    )}
                  </>
                )}
                {!canEdit && (
                  <p className="text-sm text-gray-500 italic">View-only access</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products Under Contract</CardTitle>
            </CardHeader>
            <CardContent>
              {contractProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products linked to this contract</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Serial Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Value</th>
                        {canEdit && <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contractProducts.map((product: any) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{product.productName}</p>
                            <p className="text-xs text-gray-500">{product.manufacturer} - {product.model}</p>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-gray-700">{product.serialNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{product.quantity}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{(product.totalPrice / 100000).toFixed(2)}L</td>
                          {canEdit && (
                            <td className="px-4 py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {!isChildContract && (
          <TabsContent value="child-contracts">
            <div className="space-y-4">
              {childContracts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No child contracts linked to this parent contract</p>
                    {canEdit && (
                      <Button className="mt-4" onClick={() => setCreateChildDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Child Contract
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                childContracts.map((child: any) => {
                  const childDaysRemaining = differenceInDays(new Date(child.endDate), new Date());
                  return (
                    <Card key={child.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-mono text-gray-600">{child.contractNumber}</span>
                              <ContractStatusBadge status={child.status} />
                            </div>
                            <CardTitle className="text-lg">{child.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{child.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Type</p>
                            <p className="font-semibold text-gray-900">{child.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Coverage</p>
                            <p className="font-semibold text-gray-900 capitalize">{child.coverageType.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Response Time</p>
                            <p className="font-semibold text-gray-900">{child.responseTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Value</p>
                            <p className="font-semibold text-gray-900">₹{(child.value / 100000).toFixed(2)}L</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Valid Period</p>
                          <p className="text-sm font-medium text-gray-900">
                            {format(new Date(child.startDate), "MMM d, yyyy")} - {format(new Date(child.endDate), "MMM d, yyyy")}
                            {childDaysRemaining > 0 && <span className="text-gray-500 ml-2">({childDaysRemaining} days remaining)</span>}
                          </p>
                        </div>
                        {child.coveredSerialNumbers && child.coveredSerialNumbers.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Covered Serial Numbers</p>
                            <div className="flex flex-wrap gap-2">
                              {child.coveredSerialNumbers.map((serial: any) => (
                                <span key={serial} className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                  {serial}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        )}

        {isChildContract && parentContract && (
          <TabsContent value="parent-contract" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parent Contract Information</CardTitle>
                <CardDescription>
                  This child contract is linked to parent contract {parentContract.contractNumber || 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Parent Contract Number</p>
                    <p className="font-semibold text-gray-900">{parentContract.contractNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Parent Contract Title</p>
                    <p className="font-semibold text-gray-900">{parentContract.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Parent Contract Value</p>
                    <p className="font-semibold text-gray-900">₹{((parentContract.totalValue || 0) / 100000).toFixed(2)}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Parent Contract Status</p>
                    <div className="mt-1">
                      <ContractStatusBadge status={parentContract.status || 'draft'} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Parent Contract Description</p>
                  <p className="text-gray-700 mt-1">{parentContract.description || 'No description available'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Parent Contract Period</p>
                    <p className="font-medium text-gray-900">
                      {parentContract.startDate ? format(new Date(parentContract.startDate), "MMM d, yyyy") : 'N/A'} - {parentContract.endDate ? format(new Date(parentContract.endDate), "MMM d, yyyy") : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Parent Products</p>
                    <p className="font-medium text-gray-900">{(parentContract.productIds || []).length} products</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/contracts/${parentContract.id}`)}
                    disabled={!parentContract.id}
                  >
                    View Parent Contract Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Contract Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contract Details</DialogTitle>
            <DialogDescription>Update the contract information below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Contract Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-value">Total Value (₹)</Label>
              <Input
                id="edit-value"
                type="number"
                value={editForm.totalValue}
                onChange={(e) => setEditForm({ ...editForm, totalValue: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-terms">Terms & Conditions</Label>
              <Textarea
                id="edit-terms"
                value={editForm.terms}
                onChange={(e) => setEditForm({ ...editForm, terms: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-autorenew"
                  checked={editForm.autoRenew}
                  onChange={(e) => setEditForm({ ...editForm, autoRenew: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-autorenew">Auto-renew</Label>
              </div>
              {editForm.autoRenew && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="edit-reminder">Reminder:</Label>
                  <Input
                    id="edit-reminder"
                    type="number"
                    value={editForm.renewalReminderDays}
                    onChange={(e) => setEditForm({ ...editForm, renewalReminderDays: e.target.value })}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Products to Contract</DialogTitle>
            <DialogDescription>
              Select products from inventory to link to {contract.contractNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Don't see your product? <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/inventory/new")}>Create a new product first</Button>
            </p>
          </div>
          <div className="space-y-4">
            {availableProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No available products for this customer</p>
                <p className="text-sm text-gray-400 mt-2">All products are already linked to contracts</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(availableProducts.map(item => item.id));
                            } else {
                              setSelectedProductIds([]);
                            }
                          }}
                          checked={selectedProductIds.length > 0 && selectedProductIds.length === availableProducts.length}
                          className="w-4 h-4"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Serial Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {availableProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleProductSelection(item.id)}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(item.id)}
                            onChange={() => toggleProductSelection(item.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">{item.manufacturer} - {item.model}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm text-gray-700">{item.serialNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{(item.totalPrice / 100000).toFixed(2)}L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selectedProductIds.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800 font-medium">
                  {selectedProductIds.length} product(s) selected
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedProductIds([]);
              setAddProductDialogOpen(false);
            }}>Cancel</Button>
            <Button onClick={handleSaveProducts} disabled={selectedProductIds.length === 0}>
              Add {selectedProductIds.length > 0 ? `${selectedProductIds.length} ` : ''}Product(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Contract Dialog */}
      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
            <DialogDescription>
              Renew this contract for another year?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">Current End Date: <span className="font-semibold">{format(new Date(contract.endDate), "MMM d, yyyy")}</span></p>
            <p className="text-sm text-gray-600 mt-2">New End Date: <span className="font-semibold text-green-600">{format(addYears(new Date(contract.endDate), 1), "MMM d, yyyy")}</span></p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRenewContract}>Confirm Renewal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Child Contract Dialog */}
      <Dialog open={createChildDialogOpen} onOpenChange={setCreateChildDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Child Contract</DialogTitle>
            <DialogDescription>
              Add AMC, Support, or License contract under {contract.contractNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="child-type">Contract Type *</Label>
              <Select value={childContractForm.type} onValueChange={(value) => setChildContractForm({ ...childContractForm, type: value })}>
                <SelectTrigger id="child-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMC">Annual Maintenance Contract (AMC)</SelectItem>
                  <SelectItem value="Support">Extended Support Services</SelectItem>
                  <SelectItem value="License">Software License Extension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="child-title">Title *</Label>
              <Input
                id="child-title"
                value={childContractForm.title}
                onChange={(e) => setChildContractForm({ ...childContractForm, title: e.target.value })}
                placeholder="e.g., 24x7 Premium Support"
              />
            </div>
            <div>
              <Label htmlFor="child-description">Description</Label>
              <Textarea
                id="child-description"
                value={childContractForm.description}
                onChange={(e) => setChildContractForm({ ...childContractForm, description: e.target.value })}
                placeholder="Brief description of coverage"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="child-coverage">Coverage Type</Label>
                <Select value={childContractForm.coverageType} onValueChange={(value) => setChildContractForm({ ...childContractForm, coverageType: value })}>
                  <SelectTrigger id="child-coverage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Coverage</SelectItem>
                    <SelectItem value="limited">Limited Coverage</SelectItem>
                    <SelectItem value="parts_only">Parts Only</SelectItem>
                    <SelectItem value="labor_only">Labor Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="child-response">Response Time</Label>
                <Select value={childContractForm.responseTime} onValueChange={(value) => setChildContractForm({ ...childContractForm, responseTime: value })}>
                  <SelectTrigger id="child-response">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4 hours">4 hours</SelectItem>
                    <SelectItem value="8 hours">8 hours</SelectItem>
                    <SelectItem value="24 hours">24 hours</SelectItem>
                    <SelectItem value="48 hours">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="child-value">Contract Value (₹) *</Label>
              <Input
                id="child-value"
                type="number"
                value={childContractForm.value}
                onChange={(e) => setChildContractForm({ ...childContractForm, value: e.target.value })}
                placeholder="e.g., 500000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="child-start">Start Date</Label>
                <Input
                  id="child-start"
                  type="date"
                  value={childContractForm.startDate}
                  onChange={(e) => setChildContractForm({ ...childContractForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="child-end">End Date</Label>
                <Input
                  id="child-end"
                  type="date"
                  value={childContractForm.endDate}
                  onChange={(e) => setChildContractForm({ ...childContractForm, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateChildDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateChildContract}>Create Child Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ErrorBoundary>
      <ContractDetailPageContent params={params} />
    </ErrorBoundary>
  );
}