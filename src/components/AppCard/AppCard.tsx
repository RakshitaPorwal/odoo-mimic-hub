
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AppCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function AppCard({ title, description, icon: Icon, color, onClick }: AppCardProps) {
  return (
    <div 
      className="app-card scale-enter"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          `bg-${color}-100`
        )}>
          <Icon className={cn("h-6 w-6", `text-${color}-600`)} />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>
        <div className="text-xs font-medium text-primary">
          Open App
        </div>
      </div>
    </div>
  );
}
