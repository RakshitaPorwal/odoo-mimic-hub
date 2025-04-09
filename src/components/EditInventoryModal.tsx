import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateInventoryItem } from '@/services/inventoryService';
import { InventoryItem } from '@/services/inventoryService';

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    category: '',
    stock: 0,
    value: 0,
    location: '',
    supplier: '',
    unit_of_measure: 'PCS',
    hsn_code: '',
    batch_number: '',
    reorder_level: 10,
    reorder_quantity: 20,
    stock_valuation_method: 'FIFO',
    cgst_rate: 0,
    sgst_rate: 0
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        stock: item.stock,
        value: item.value,
        location: item.location,
        supplier: item.supplier,
        unit_of_measure: item.unit_of_measure,
        hsn_code: item.hsn_code,
        batch_number: item.batch_number,
        reorder_level: item.reorder_level,
        reorder_quantity: item.reorder_quantity,
        stock_valuation_method: item.stock_valuation_method,
        cgst_rate: item.cgst_rate,
        sgst_rate: item.sgst_rate
      });
    }
  }, [item]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<InventoryItem>) => updateInventoryItem(Number(item.id), updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      onClose();
      toast({
        title: 'Success',
        description: 'Inventory item updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update inventory item: ' + error,
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric values
    if (['stock', 'value', 'reorder_level', 'reorder_quantity', 'cgst_rate', 'sgst_rate'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates = {
      ...formData
    };
    updateMutation.mutate(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Unit Value (₹) *</Label>
            <Input
              id="value"
              name="value"
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_of_measure">Unit of Measure</Label>
              <Select 
                value={formData.unit_of_measure}
                onValueChange={(value) => setFormData(prev => ({...prev, unit_of_measure: value}))}
              >
                <SelectTrigger id="unit_of_measure">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PCS">Pieces (PCS)</SelectItem>
                  <SelectItem value="KG">Kilograms (KG)</SelectItem>
                  <SelectItem value="LTR">Liters (LTR)</SelectItem>
                  <SelectItem value="MTR">Meters (MTR)</SelectItem>
                  <SelectItem value="BOX">Box (BOX)</SelectItem>
                  <SelectItem value="UNIT">Unit (UNIT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="batch_number">Batch Number</Label>
              <Input
                id="batch_number"
                name="batch_number"
                value={formData.batch_number}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reorder_level">Reorder Level</Label>
              <Input
                id="reorder_level"
                name="reorder_level"
                type="number"
                min="0"
                value={formData.reorder_level}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
              <Input
                id="reorder_quantity"
                name="reorder_quantity"
                type="number"
                min="0"
                value={formData.reorder_quantity}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_valuation_method">Valuation Method</Label>
              <Select 
                value={formData.stock_valuation_method}
                onValueChange={(value) => setFormData(prev => ({...prev, stock_valuation_method: value}))}
              >
                <SelectTrigger id="stock_valuation_method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIFO">FIFO</SelectItem>
                  <SelectItem value="LIFO">LIFO</SelectItem>
                  <SelectItem value="AVG">Weighted Average</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cgst_rate">CGST Rate (%)</Label>
              <Input
                id="cgst_rate"
                name="cgst_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.cgst_rate}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sgst_rate">SGST Rate (%)</Label>
              <Input
                id="sgst_rate"
                name="sgst_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.sgst_rate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 