import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 text-center animate-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center animate-float">
            <span className="text-primary-foreground font-bold text-2xl">O</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Welcome to Odoo Hub
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A modern, intuitive interface for managing your business applications, all in one place.
        </p>
        
        <Button 
          size="lg" 
          onClick={() => navigate("/login")}
          className="button-transition group"
        >
          Login to Dashboard
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Index;
