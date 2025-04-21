export interface Transaction {
  id: number;
  date: Date;
  type: "Income" | "Expense" | "Transfer";
  category: string;
  amount: number;
  description?: string;
  payment_method: "Cash" | "Bank Transfer" | "Credit Card" | "UPI" | "Check";
  reference?: string;
}