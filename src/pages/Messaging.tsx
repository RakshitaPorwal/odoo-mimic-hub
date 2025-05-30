
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, RefreshCw, Plus, AlertCircle, MessageSquare, Users, Headphones } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Messaging = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<"qr" | "web">("qr");

  // Check if there's a saved connection status in localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem("whatsappConnected");
    if (savedStatus === "true") {
      setIsConnected(true);
      setCurrentView("web");
    }
  }, []);

  const handleLogin = () => {
    // In a real app, this would handle the WhatsApp authentication
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      setIsConnected(true);
      setCurrentView("web");
      setIsLoading(false);
      // Save connection status to localStorage
      localStorage.setItem("whatsappConnected", "true");
      toast({
        title: "Connected Successfully",
        description: "Your WhatsApp Business account is now connected",
      });
    }, 2000);
  };

  const handleLogout = () => {
    setIsConnected(false);
    setCurrentView("qr");
    // Remove connection status from localStorage
    localStorage.removeItem("whatsappConnected");
    toast({
      title: "Disconnected",
      description: "Your WhatsApp Business account has been disconnected",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "WhatsApp connection has been refreshed",
      });
    }, 1000);
  };

  // Function to handle sending a new message
  const handleNewMessage = () => {
    toast({
      title: "New Message",
      description: "Starting a new conversation in WhatsApp Business",
    });
  };

  // Function to handle new broadcast
  const handleNewBroadcast = () => {
    toast({
      title: "New Broadcast",
      description: "Creating a new broadcast message to multiple contacts",
    });
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
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={handleNewMessage}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleNewBroadcast}>
                    <Users className="h-4 w-4 mr-2" />
                    Broadcast
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleRefresh}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 h-full">
                {/* Left sidebar - Contacts/Chats list */}
                <div className="border-r md:col-span-1 bg-white">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="w-full border rounded-md pl-3 pr-8 py-2 text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto h-[calc(100%-52px)]">
                    {/* Sample chats */}
                    {[
                      { name: "John Smith", message: "Hello, I'd like to inquire about...", time: "10:30 AM", unread: 2 },
                      { name: "Jane Doe", message: "Thank you for the information", time: "Yesterday", unread: 0 },
                      { name: "Acme Inc.", message: "We'll schedule a meeting for next week", time: "Yesterday", unread: 0 },
                      { name: "Technical Support", message: "Have you tried restarting the device?", time: "Wednesday", unread: 0 },
                      { name: "Marketing Team", message: "The new campaign materials are ready", time: "10/12/2023", unread: 0 }
                    ].map((chat, index) => (
                      <div key={index} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${chat.unread > 0 ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                              {chat.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium">{chat.name}</div>
                              <div className="text-sm text-gray-500 truncate w-36">{chat.message}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 flex flex-col items-end">
                            <span>{chat.time}</span>
                            {chat.unread > 0 && (
                              <span className="bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center mt-1">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right side - Chat area */}
                <div className="md:col-span-3 flex flex-col bg-gray-100 h-full">
                  <div className="p-3 border-b bg-white flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                        J
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">John Smith</div>
                        <div className="text-xs text-gray-500">Online</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Headphones className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Sample conversation */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-[70%] shadow-sm">
                        <p className="text-sm">Hello, I'm interested in your services. Can you provide more information?</p>
                        <span className="text-xs text-gray-500 block text-right mt-1">10:28 AM</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-green-100 rounded-lg p-3 max-w-[70%] shadow-sm">
                        <p className="text-sm">Hi John, thank you for your interest! I'd be happy to provide more details. What specific information are you looking for?</p>
                        <span className="text-xs text-gray-500 block text-right mt-1">10:30 AM</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-[70%] shadow-sm">
                        <p className="text-sm">I'm mainly interested in your pricing and turnaround time for projects.</p>
                        <span className="text-xs text-gray-500 block text-right mt-1">10:32 AM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border-t bg-white">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 border rounded-md px-3 py-2 text-sm"
                      />
                      <Button size="sm">
                        Send
                      </Button>
                    </div>
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
