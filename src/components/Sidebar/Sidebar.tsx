
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Grid, 
  Settings, 
  Users, 
  ShoppingCart, 
  MessageCircle, 
  FileText, 
  Calendar,
  ChevronLeft,
  Coins,
  BadgeDollarSign,
  Package
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Applications", path: "/applications", icon: Grid },
  { name: "Messaging", path: "/messaging", icon: MessageCircle },
  { name: "Contacts", path: "/contacts", icon: Users },
  { name: "Calendar", path: "/calendar", icon: Calendar },
  { name: "Documents", path: "/documents", icon: FileText },
  { name: "Sales", path: "/sales", icon: ShoppingCart },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Accounting", path: "/accounting", icon: BadgeDollarSign },
  { name: "CRM", path: "/crm", icon: Coins },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ open }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out border-r border-border shadow-sm",
      open ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-16"
    )}>
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center justify-between h-16 px-4 border-b border-border",
          !open && "md:justify-center"
        )}>
          {open ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">O</span>
              </div>
              <span className="font-semibold text-lg">Odoo Hub</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">O</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "sidebar-link",
                    isActive ? "active" : "",
                    !open && "md:justify-center md:px-0"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !open && "md:h-6 md:w-6")} />
                  {open && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className={cn(
            "flex items-center",
            !open && "md:justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="font-medium text-sm text-muted-foreground">JP</span>
            </div>
            {open && (
              <div className="ml-3">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
