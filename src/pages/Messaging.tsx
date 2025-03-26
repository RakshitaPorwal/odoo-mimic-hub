
import React from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  Send,
  Users,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  MessageCircle
} from "lucide-react";

const messagesData = [
  {
    id: 1,
    sender: "John Doe",
    avatar: "JD",
    message: "Hi there! How are you doing today?",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "You",
    avatar: "ME",
    message: "I'm doing great, thanks for asking! How about you?",
    time: "10:32 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "John Doe",
    avatar: "JD",
    message: "I'm good as well. Just wanted to check in about the project status.",
    time: "10:34 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "You",
    avatar: "ME",
    message: "We're on track. I've completed the initial designs and will share them with you shortly.",
    time: "10:36 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "John Doe",
    avatar: "JD",
    message: "Sounds great! Looking forward to seeing them.",
    time: "10:38 AM",
    isMe: false,
  },
];

const contactsList = [
  {
    id: 1,
    name: "John Doe",
    avatar: "JD",
    status: "online",
    lastSeen: "now",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "JS",
    status: "offline",
    lastSeen: "1h ago",
  },
  {
    id: 3,
    name: "Robert Johnson",
    avatar: "RJ",
    status: "online",
    lastSeen: "now",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "ED",
    status: "offline",
    lastSeen: "2h ago",
  },
  {
    id: 5,
    name: "Michael Wilson",
    avatar: "MW",
    status: "online",
    lastSeen: "now",
  },
];

const Messaging = () => {
  const [message, setMessage] = React.useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <Layout>
      <Header 
        title="Messaging" 
        description="Chat and collaborate with your team."
      >
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
        {/* Contacts Sidebar */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="chats" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="chats" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                Contacts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chats" className="m-0">
              <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
                {contactsList.map((contact) => (
                  <div key={contact.id} className="flex items-center p-3 hover:bg-muted cursor-pointer border-b">
                    <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3 relative`}>
                      {contact.avatar}
                      {contact.status === "online" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">{contact.name}</h4>
                        <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">Last message preview...</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="contacts" className="m-0">
              <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
                {contactsList.map((contact) => (
                  <div key={contact.id} className="flex items-center p-3 hover:bg-muted cursor-pointer border-b">
                    <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3 relative`}>
                      {contact.avatar}
                      {contact.status === "online" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{contact.name}</h4>
                        <span className="text-xs text-muted-foreground">{contact.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.status === "online" ? "Online" : `Last seen ${contact.lastSeen}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-3 border rounded-lg overflow-hidden flex flex-col bg-white shadow-sm">
          {/* Chat Header */}
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3 relative">
                JD
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" title="Voice Call">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" title="Video Call">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" title="More Options">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messagesData.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-white border'} rounded-lg p-3 shadow-sm`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-sm ${msg.isMe ? 'text-primary-foreground' : ''}`}>{msg.sender}</h4>
                    <span className={`text-xs ${msg.isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'} ml-2`}>{msg.time}</span>
                  </div>
                  <p className={`text-sm ${msg.isMe ? 'text-primary-foreground' : ''}`}>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="p-3 border-t flex items-end">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 mx-2">
              <Input
                placeholder="Type a message..."
                className="min-h-10"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 mr-1">
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messaging;
