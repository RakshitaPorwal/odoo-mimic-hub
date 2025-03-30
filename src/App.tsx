import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Messaging from "./pages/Messaging";
import Contacts from "./pages/Contacts";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Accounting from "./pages/Accounting";
import Crm from "./pages/Crm";
import EmailMarketing from "./pages/EmailMarketing";
import NotFound from "./pages/NotFound";
import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import CreateInvoice from "./pages/CreateInvoice";
import Reports from "./pages/Reports";
import TaskReport from "./pages/TaskReport";
import RevenueReport from "./pages/RevenueReport";
import Login from "./pages/Login";
import EditInvoice from "./pages/EditInvoice";
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Index />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/applications" element={
        <ProtectedRoute>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/messaging" element={
        <ProtectedRoute>
          <Messaging />
        </ProtectedRoute>
      } />
      <Route path="/contacts" element={
        <ProtectedRoute>
          <Contacts />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute>
          <Documents />
        </ProtectedRoute>
      } />
      <Route path="/sales" element={
        <ProtectedRoute>
          <Sales />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      } />
      <Route path="/accounting" element={
        <ProtectedRoute>
          <Accounting />
        </ProtectedRoute>
      } />
      <Route path="/invoices" element={
        <ProtectedRoute>
          <Invoices />
        </ProtectedRoute>
      } />
      <Route path="/invoices/:id" element={
        <ProtectedRoute>
          <InvoiceDetail />
        </ProtectedRoute>
      } />
      <Route path="/create-invoice" element={
        <ProtectedRoute>
          <CreateInvoice />
        </ProtectedRoute>
      } />
      <Route path="/edit-invoice/:id" element={
        <ProtectedRoute>
          <EditInvoice />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/crm" element={
        <ProtectedRoute>
          <Crm />
        </ProtectedRoute>
      } />
      <Route path="/email-marketing" element={
        <ProtectedRoute>
          <EmailMarketing />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/task-report" element={
        <ProtectedRoute>
          <TaskReport />
        </ProtectedRoute>
      } />
      <Route path="/revenue-report" element={
        <ProtectedRoute>
          <RevenueReport />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
