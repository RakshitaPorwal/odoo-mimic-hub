
import React from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import CreateInvoiceForm from "@/components/Invoice/CreateInvoiceForm";

export default function CreateInvoice() {
  return (
    <Layout>
      <div className="p-6">
        <Header 
          title="Create Invoice" 
          description="Create a new invoice for your customers"
        />
        <div className="mt-6">
          <CreateInvoiceForm />
        </div>
      </div>
    </Layout>
  );
}
