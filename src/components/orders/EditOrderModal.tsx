import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Order, NewOrderItem, updateOrder } from '@/services/orderService';
import { toast } from 'sonner';

interface EditOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}) => {
  const [orderItems, setOrderItems] = useState<NewOrderItem[]>(
    order.order_items?.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      rate: item.rate,
      material_specifications: item.material_specifications,
      gst_amount: item.gst_amount,
    })) || []
  );
  const [gstApplicable, setGstApplicable] = useState(order.gst_applicable);
  const [status, setStatus] = useState<Order['status']>(order.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrderItems(
        order.order_items?.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          rate: item.rate,
          material_specifications: item.material_specifications,
          gst_amount: item.gst_amount,
        })) || []
      );
      setGstApplicable(order.gst_applicable);
      setStatus(order.status);
    }
  }, [isOpen, order]);

  const handleQuantityChange = (index: number, value: string) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      quantity: parseInt(value) || 0,
    };
    setOrderItems(newItems);
  };

  const handleRateChange = (index: number, value: string) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      rate: parseFloat(value) || 0,
    };
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const updatedOrder = await updateOrder(order.id, { 
        gst_applicable: gstApplicable,
        status: status 
      }, orderItems);
      onOrderUpdated(updatedOrder);
      toast.success('Order updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update order');
      console.error('Error updating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Order #{order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: Order['status']) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="gst-applicable"
                checked={gstApplicable}
                onCheckedChange={setGstApplicable}
              />
              <Label htmlFor="gst-applicable">GST Applicable</Label>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Order Items</h3>
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">
                    {order.order_items?.[index]?.product?.name || 'Unknown Product'}
                  </p>
                  <p className="text-sm text-gray-500">{item.material_specifications}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-20"
                    />
                  </div>
                  <div>
                    <Label>Rate</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-6"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 