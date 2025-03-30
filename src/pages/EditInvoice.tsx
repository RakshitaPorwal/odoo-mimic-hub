import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout/Layout";
import { getInvoice, updateInvoice } from "@/services/invoiceService";
import { format } from "date-fns";
import InvoicePrintView from "@/components/Invoice/InvoicePrintView";
import { useReactToPrint } from "react-to-print";

export default function EditInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const printRef = React.useRef<HTMLDivElement>(null);

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; [key: string]: any }) => updateInvoice(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update invoice: " + error,
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    seller_name: "",
    seller_address: "",
    seller_gstin: "",
    seller_state: "",
    seller_state_code: "",
    seller_pan: "",
    seller_phone: "",
    seller_email: "",
    customer_name: "",
    customer_email: "",
    customer_address: "",
    customer_gstin: "",
    customer_state: "",
    customer_state_code: "",
    customer_phone: "",
    invoice_date: "",
    delivery_note: "",
    reference_date: "",
    reference_number: "",
    buyers_order_number: "",
    buyers_order_date: "",
    dispatch_doc_number: "",
    dispatch_doc_date: "",
    dispatched_through: "",
    destination: "",
    mode_of_payment: "",
    terms_of_delivery: "",
    other_references: "",
    notes: "",
    terms_conditions: "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        seller_name: invoice.seller_name,
        seller_address: invoice.seller_address,
        seller_gstin: invoice.seller_gstin,
        seller_state: invoice.seller_state,
        seller_state_code: invoice.seller_state_code,
        seller_pan: invoice.seller_pan,
        seller_phone: invoice.seller_phone,
        seller_email: invoice.seller_email,
        customer_name: invoice.customer_name,
        customer_email: invoice.customer_email || "",
        customer_address: invoice.customer_address || "",
        customer_gstin: invoice.customer_gstin || "",
        customer_state: invoice.customer_state || "",
        customer_state_code: invoice.customer_state_code || "",
        customer_phone: invoice.customer_phone || "",
        invoice_date: invoice.invoice_date,
        delivery_note: invoice.delivery_note || "",
        reference_date: invoice.reference_date || "",
        reference_number: invoice.reference_number || "",
        buyers_order_number: invoice.buyers_order_number || "",
        buyers_order_date: invoice.buyers_order_date || "",
        dispatch_doc_number: invoice.dispatch_doc_number || "",
        dispatch_doc_date: invoice.dispatch_doc_date || "",
        dispatched_through: invoice.dispatched_through || "",
        destination: invoice.destination || "",
        mode_of_payment: invoice.mode_of_payment || "",
        terms_of_delivery: invoice.terms_of_delivery || "",
        other_references: invoice.other_references || "",
        notes: invoice.notes || "",
        terms_conditions: invoice.terms_conditions || "",
      });
    }
  }, [invoice]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateMutation.mutateAsync({
        id,
        ...formData,
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${invoice?.invoice_number}`,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !invoice) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-red-500">Error loading invoice</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              Print
            </Button>
            <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Invoice #{invoice.invoice_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seller Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="seller_name">Name</Label>
                    <Input
                      id="seller_name"
                      name="seller_name"
                      value={formData.seller_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller_address">Address</Label>
                    <Textarea
                      id="seller_address"
                      name="seller_address"
                      value={formData.seller_address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller_gstin">GSTIN</Label>
                      <Input
                        id="seller_gstin"
                        name="seller_gstin"
                        value={formData.seller_gstin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seller_state">State</Label>
                      <Input
                        id="seller_state"
                        name="seller_state"
                        value={formData.seller_state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller_state_code">State Code</Label>
                      <Input
                        id="seller_state_code"
                        name="seller_state_code"
                        value={formData.seller_state_code}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seller_pan">PAN</Label>
                      <Input
                        id="seller_pan"
                        name="seller_pan"
                        value={formData.seller_pan}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller_phone">Phone</Label>
                      <Input
                        id="seller_phone"
                        name="seller_phone"
                        value={formData.seller_phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seller_email">Email</Label>
                      <Input
                        id="seller_email"
                        name="seller_email"
                        type="email"
                        value={formData.seller_email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Buyer Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Name</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_address">Address</Label>
                    <Textarea
                      id="customer_address"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_gstin">GSTIN</Label>
                      <Input
                        id="customer_gstin"
                        name="customer_gstin"
                        value={formData.customer_gstin}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_state">State</Label>
                      <Input
                        id="customer_state"
                        name="customer_state"
                        value={formData.customer_state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_state_code">State Code</Label>
                      <Input
                        id="customer_state_code"
                        name="customer_state_code"
                        value={formData.customer_state_code}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_phone">Phone</Label>
                      <Input
                        id="customer_phone"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Invoice Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice_date">Invoice Date</Label>
                      <Input
                        id="invoice_date"
                        name="invoice_date"
                        type="date"
                        value={formData.invoice_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery_note">Delivery Note</Label>
                      <Input
                        id="delivery_note"
                        name="delivery_note"
                        value={formData.delivery_note}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference_number">Reference Number</Label>
                      <Input
                        id="reference_number"
                        name="reference_number"
                        value={formData.reference_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference_date">Reference Date</Label>
                      <Input
                        id="reference_date"
                        name="reference_date"
                        type="date"
                        value={formData.reference_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyers_order_number">Buyer's Order Number</Label>
                      <Input
                        id="buyers_order_number"
                        name="buyers_order_number"
                        value={formData.buyers_order_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyers_order_date">Buyer's Order Date</Label>
                      <Input
                        id="buyers_order_date"
                        name="buyers_order_date"
                        type="date"
                        value={formData.buyers_order_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dispatch Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dispatch_doc_number">Dispatch Document Number</Label>
                      <Input
                        id="dispatch_doc_number"
                        name="dispatch_doc_number"
                        value={formData.dispatch_doc_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dispatch_doc_date">Dispatch Document Date</Label>
                      <Input
                        id="dispatch_doc_date"
                        name="dispatch_doc_date"
                        type="date"
                        value={formData.dispatch_doc_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dispatched_through">Dispatched Through</Label>
                    <Input
                      id="dispatched_through"
                      name="dispatched_through"
                      value={formData.dispatched_through}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mode_of_payment">Mode of Payment</Label>
                      <Input
                        id="mode_of_payment"
                        name="mode_of_payment"
                        value={formData.mode_of_payment}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terms_of_delivery">Terms of Delivery</Label>
                      <Input
                        id="terms_of_delivery"
                        name="terms_of_delivery"
                        value={formData.terms_of_delivery}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other_references">Other References</Label>
                    <Input
                      id="other_references"
                      name="other_references"
                      value={formData.other_references}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                  <Textarea
                    id="terms_conditions"
                    name="terms_conditions"
                    value={formData.terms_conditions}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Hidden printable invoice view */}
      <div className="hidden">
        <div ref={printRef}>
          <InvoicePrintView invoice={invoice} />
        </div>
      </div>
    </Layout>
  );
} 