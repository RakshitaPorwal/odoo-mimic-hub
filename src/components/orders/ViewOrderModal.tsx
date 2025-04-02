import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from '@/services/orderService';

interface ViewOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order #{order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p>{format(new Date(order.order_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GST Applicable</p>
                <p>{order.gst_applicable ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p>{order.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Email</p>
                <p>{order.customer?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Phone</p>
                <p>{order.customer?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} x {formatCurrency(item.rate)}
                    </p>
                    {item.material_specifications && (
                      <p className="text-sm text-gray-500">
                        Specifications: {item.material_specifications}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.quantity * item.rate)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <p className="font-medium">Total Amount</p>
                <p className="font-medium">{formatCurrency(order.total_amount)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 