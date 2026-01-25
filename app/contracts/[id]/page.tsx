"use client";

import { use } from "react";
import { useContractStore } from "@/store/contract-store";
import { useInventoryStore } from "@/store/inventory-store";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, DollarSign, FileText, Package, Plus, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { useAuthStore } from "@/store/auth-store";
import { hasPermission } from "@/lib/permissions";
import { useResellerContextStore } from "@/store/reseller-context-store";

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const { mode } = useResellerContextStore();
  const { getContractById, getChildContractsByParentId } = useContractStore();
  const { items } = useInventoryStore();

  const contract = getContractById(id);
  const childContracts = contract ? getChildContractsByParentId(contract.id) : [];
  const contractProducts = items.filter(item => contract?.productIds.includes(item.id));

  const resellerContext = user?.role === "reseller" ? { mode } : undefined;
  const canEdit = hasPermission(user?.role || "customer", "contracts.edit", resellerContext);

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Contract not found</p>
          <Button onClick={() => router.push("/contracts")} className="mt-4">
            Back to Contracts
          </Button>
        </div>
      </div>
    );
  }

  const daysRemaining = differenceInDays(new Date(contract.endDate), new Date());

  return (
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
            <p className="text-gray-600 mt-2">{contract.customerName}</p>
          </div>
          {canEdit && (
            <Button variant="outline">
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
                  <p className="text-2xl font-bold text-gray-900">₹{(contract.totalValue / 100000).toFixed(2)}L</p>
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
                  <p className="text-2xl font-bold text-gray-900">{contract.productIds.length}</p>
                  <p className="text-xs text-gray-500">{childContracts.length} child contracts</p>
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
          <TabsTrigger value="child-contracts">Child Contracts ({childContracts.length})</TabsTrigger>
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
                  <p className="text-gray-700 text-sm mt-1">{contract.terms}</p>
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
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product to Contract
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Child Contract
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Contract Details
                    </Button>
                    {contract.status === "active" && (
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contractProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{product.productName}</p>
                            <p className="text-xs text-gray-500">{product.manufacturer} - {product.model}</p>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-gray-700">{product.serialNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{product.quantity}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{(product.totalPrice / 100000).toFixed(2)}L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="child-contracts">
          <div className="space-y-4">
            {childContracts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No child contracts linked to this parent contract</p>
                  {canEdit && (
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Child Contract
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              childContracts.map((child) => {
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
                      {child.coveredSerialNumbers.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Covered Serial Numbers</p>
                          <div className="flex flex-wrap gap-2">
                            {child.coveredSerialNumbers.map((serial) => (
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
      </Tabs>
    </div>
  );
}
