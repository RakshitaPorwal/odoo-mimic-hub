
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000); // Auto-redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

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
          onClick={() => navigate("/dashboard")}
          className="button-transition group"
        >
          Enter Dashboard
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground">
        <p>Redirecting to dashboard in a few seconds...</p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -right-40 -top-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Index;
