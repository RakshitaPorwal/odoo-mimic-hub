
import React, { useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Navbar } from "../Navbar/Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} />
      
      <div className={cn(
        "flex flex-col flex-1 w-full transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
