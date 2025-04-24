
import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Key } from "lucide-react";
import ApiKeySetup from "@/components/chat/ApiKeySetup";
import geminiService from "@/services/geminiService";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const { toast } = useToast();

  // Check if API key is set on component mount
  React.useEffect(() => {
    setHasApiKey(geminiService.hasApiKey());
  }, []);

  const handleApiKeySet = () => {
    setHasApiKey(true);
    toast({
      title: "API Key Set Successfully",
      description: "You can now use the AI-powered features of FinancialSage.",
    });
  };

  const handleClearApiKey = () => {
    // Clear API key
    sessionStorage.removeItem("gemini_api_key");
    geminiService.setApiKey("");
    setHasApiKey(false);
    
    toast({
      title: "API Key Removed",
      description: "The Gemini API key has been removed from your session.",
    });
  };

  return (
    <AppLayout activePath="/settings">
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-finance-primary">Settings</h1>
          <p className="text-finance-secondary mt-1">
            Manage your account and application preferences
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" defaultValue="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Your company" />
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>Customize your application experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dashboard</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="summary-view" className="text-base">Summary View</Label>
                      <p className="text-sm text-muted-foreground">Show summary cards on dashboard</p>
                    </div>
                    <Switch id="summary-view" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="advanced-analytics" className="text-base">Advanced Analytics</Label>
                      <p className="text-sm text-muted-foreground">Enable advanced analytics features</p>
                    </div>
                    <Switch id="advanced-analytics" defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Display</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mm-dd-yyyy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with third-party services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No integrations available yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrations with banking services and financial APIs coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apikeys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Gemini API
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Required for AI-powered natural language queries and OCR processing
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasApiKey ? (
                        <>
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Configured
                          </div>
                          <Button variant="outline" size="sm" onClick={handleClearApiKey}>
                            Clear Key
                          </Button>
                          <Button size="sm" onClick={() => setShowApiKeyModal(true)}>
                            Update Key
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setShowApiKeyModal(true)}>
                          Set API Key
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                    <h4 className="font-medium mb-2">Features enabled by Gemini API:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Natural language queries about your financial data</li>
                      <li>OCR processing for scanned financial documents</li>
                      <li>Automated insights generation</li>
                      <li>Financial document classification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Add ChatBot */}
      <ChatBot />
      
      {/* API Key Setup Modal */}
      <ApiKeySetup 
        isOpen={showApiKeyModal}
        setIsOpen={setShowApiKeyModal}
        onApiKeySet={handleApiKeySet}
      />
    </AppLayout>
  );
};

export default Settings;
