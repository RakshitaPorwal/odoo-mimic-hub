
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { InventoryItem } from "@/services/inventoryService";

type InvoiceItem = {
  id?: string;
  item_id?: number | null;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  tax_amount?: number;
  discount_percent?: number;
  discount_amount?: number;
  total_amount: number;
};

interface InvoiceItemRowProps {
  item: InvoiceItem;
  index: number;
  updateItem: (index: number, item: InvoiceItem) => void;
  removeItem: (index: number) => void;
  handleItemSelect: (index: number, itemId: number | null) => void;
  inventoryItems: InventoryItem[];
  showRemove?: boolean;
}

const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
  item,
  index,
  updateItem,
  removeItem,
  handleItemSelect,
  inventoryItems,
  showRemove = true,
}) => {
  // Calculate line total whenever quantity, price, tax, or discount changes
  const calculateLineTotal = () => {
    const baseAmount = item.quantity * item.unit_price;
    const taxAmount = item.tax_rate ? (baseAmount * (item.tax_rate / 100)) : 0;
    
    let discountAmount = 0;
    if (item.discount_percent) {
      discountAmount = baseAmount * (item.discount_percent / 100);
    } else if (item.discount_amount) {
      discountAmount = item.discount_amount;
    }
    
    return baseAmount + taxAmount - discountAmount;
  };

  const handleChange = (field: keyof InvoiceItem, value: any) => {
    // Parse numeric values
    if (
      field === "quantity" ||
      field === "unit_price" ||
      field === "tax_rate" ||
      field === "discount_percent"
    ) {
      value = parseFloat(value) || 0;
    }

    const updatedItem = { 
      ...item, 
      [field]: value 
    };
    
    // Recalculate total amount
    updatedItem.total_amount = calculateLineTotal();
    
    updateItem(index, updatedItem);
  };

  return (
    <tr className="border-b">
      <td className="px-2 py-2">
        <div className="flex flex-col space-y-2">
          <Select
            value={item.item_id?.toString() || "none"}
            onValueChange={(value) => 
              handleItemSelect(index, value !== "none" ? parseInt(value) : null)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select an item</SelectItem>
              {inventoryItems.map((invItem) => (
                <SelectItem key={invItem.id} value={invItem.id.toString()}>
                  {invItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={item.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
            className="h-9"
          />
        </div>
      </td>
      <td className="px-2 py-2">
        <Input
          type="number"
          value={item.quantity || ""}
          onChange={(e) => handleChange("quantity", e.target.value)}
          className="h-9 text-right"
          min={1}
        />
      </td>
      <td className="px-2 py-2">
        <Input
          type="number"
          value={item.unit_price || ""}
          onChange={(e) => handleChange("unit_price", e.target.value)}
          className="h-9 text-right"
          step="0.01"
          min={0}
        />
      </td>
      <td className="px-2 py-2">
        <Input
          type="number"
          value={item.tax_rate || ""}
          onChange={(e) => handleChange("tax_rate", e.target.value)}
          className="h-9 text-right"
          step="0.1"
          min={0}
          max={100}
        />
      </td>
      <td className="px-2 py-2">
        <Input
          type="number"
          value={item.discount_percent || ""}
          onChange={(e) => handleChange("discount_percent", e.target.value)}
          className="h-9 text-right"
          step="0.1"
          min={0}
          max={100}
        />
      </td>
      <td className="px-2 py-2 text-right">
        {formatCurrency(item.total_amount || 0)}
      </td>
      <td className="px-2 py-2">
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => removeItem(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
};

export default InvoiceItemRow;
