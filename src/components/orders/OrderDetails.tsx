import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from '@/services/orderService';

interface OrderDetailsProps {
  order: Order;
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

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onClose,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Details</h2>
          <p className="text-gray-500">Order #{order.order_number}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Basic order details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Customer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{order.customer?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{order.customer?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{order.customer?.phone || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} x {formatCurrency(item.rate)}
                  </p>
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
        </CardContent>
      </Card>
    </div>
  );
}; 