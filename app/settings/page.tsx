"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user?.role !== "distributor") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setCompanyName(user.companyName);
      setEmail(user.email);
      setPhone("+91-9876543210");
      setAddress("Mumbai, India");
    }
  }, [user]);

  const handleSaveProfile = () => {
    toast.success("Company profile updated successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  if (user?.role !== "distributor") {
    return null;
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Manage your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Admin User", email: "admin@satmz.com", role: "Administrator" },
                    { name: "Support Team", email: "support@satmz.com", role: "Support Staff" },
                    { name: "Sales Team", email: "sales@satmz.com", role: "Sales" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">{user.role}</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add New User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-600">Receive notifications via email</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Warranty Expiry Reminders</p>
                      <p className="text-sm text-slate-600">30, 60, and 90 day alerts</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Ticket Updates</p>
                      <p className="text-sm text-slate-600">New tickets and status changes</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Daily Summary</p>
                      <p className="text-sm text-slate-600">Daily digest of activities</p>
                    </div>
                    <Button variant="outline" size="sm">Disabled</Button>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Customize your portal experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Default View</p>
                      <p className="text-sm text-slate-600">Set your default dashboard view</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Date Format</p>
                      <p className="text-sm text-slate-600">DD/MM/YYYY</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Time Zone</p>
                      <p className="text-sm text-slate-600">Asia/Kolkata (IST)</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Items Per Page</p>
                      <p className="text-sm text-slate-600">Default pagination size</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>

                <Separator />

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
