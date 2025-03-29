
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/create-invoice" element={<CreateInvoice />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/crm" element={<Crm />} />
              <Route path="/email-marketing" element={<EmailMarketing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/task-report" element={<TaskReport />} />
              <Route path="/revenue-report" element={<RevenueReport />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
