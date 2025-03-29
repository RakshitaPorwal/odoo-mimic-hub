
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, RefreshCw, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Messaging = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<"qr" | "web">("qr");

  const handleLogin = () => {
    // In a real app, this would handle the WhatsApp authentication
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      setIsConnected(true);
      setCurrentView("web");
      setIsLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    setIsConnected(false);
    setCurrentView("qr");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <Header 
        title="Messaging" 
        description="Connect with WhatsApp Business to chat with your customers."
      >
        {isConnected ? (
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Disconnect WhatsApp
          </Button>
        ) : (
          <Button size="sm" disabled={isLoading} onClick={handleLogin}>
            {isLoading ? "Connecting..." : "Connect WhatsApp"}
          </Button>
        )}
      </Header>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="whatsapp">WhatsApp Business</TabsTrigger>
          <TabsTrigger value="help">Help & Info</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="mt-4">
          {currentView === "qr" ? (
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Connect WhatsApp Business</CardTitle>
                  <CardDescription>
                    Scan the QR code using your WhatsApp Business app to connect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6">
                    <div className="border p-3 rounded-md bg-white">
                      <QrCode className="h-48 w-48" />
                    </div>
                    <div className="text-sm text-muted-foreground text-center max-w-md">
                      1. Open WhatsApp Business on your phone
                      <br />
                      2. Tap Menu or Settings and select WhatsApp Web
                      <br />
                      3. Point your phone to this screen to capture the code
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleRefresh} 
                      disabled={isLoading}
                      className="mt-2"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    After connecting, all your WhatsApp Business messages will appear here without needing to use your phone.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">WhatsApp Business Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Send and receive messages</li>
                    <li>Share images, documents, and videos</li>
                    <li>Make voice and video calls</li>
                    <li>Create group chats</li>
                    <li>Manage business catalog</li>
                    <li>Send broadcast messages</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
              <div className="bg-background p-2 border-b flex justify-between items-center">
                <span className="text-sm font-medium">WhatsApp Business Web</span>
                <Button size="sm" variant="ghost" onClick={handleRefresh}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
              
              {/* WhatsApp Web iframe - in a real app, this would be the WhatsApp Web interface */}
              <div className="w-full h-full bg-white p-4 flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                  <h3 className="text-xl font-bold mb-4">WhatsApp Business Connected</h3>
                  <p className="text-muted-foreground mb-6">
                    Your WhatsApp Business account is now connected. In a real application, the WhatsApp Web interface would be embedded here.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      New Chat
                    </Button>
                    <Button variant="outline" className="w-full">
                      New Broadcast
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="help" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Business Integration Help</CardTitle>
              <CardDescription>
                Learn how to get the most out of the WhatsApp Business integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                <p className="text-muted-foreground">
                  Using WhatsApp Business with Lovable App allows you to manage all your
                  customer conversations in one place. Follow these steps to get started:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Connect your WhatsApp Business account using the QR code</li>
                  <li>Once connected, all your chats will appear in the main interface</li>
                  <li>You can send and receive messages, media, and make calls directly from Lovable App</li>
                  <li>Your connection will stay active until you log out or disconnect</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Troubleshooting</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>If the QR code expires, click "Refresh QR Code" to generate a new one</li>
                  <li>Make sure your phone has an active internet connection</li>
                  <li>If messages aren't syncing, try refreshing the page</li>
                  <li>For persistent issues, disconnect and reconnect your WhatsApp account</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Respond to customer inquiries promptly</li>
                  <li>Use quick replies for common questions</li>
                  <li>Organize contacts with labels</li>
                  <li>Create message templates for consistent communication</li>
                  <li>Review conversation analytics to improve response times</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Messaging;
