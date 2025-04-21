import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    console.log('Adding transaction to database:', transaction);
    
    // Prepare the transaction data for Supabase
    const supabaseTransaction = {
      ...transaction,
      date: transaction.date.toISOString(),
      payment_method: transaction.payment_method || 'Cash', // Provide default value if needed
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([supabaseTransaction])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Transaction added successfully:', data);
    return data as Transaction;
  } catch (error) {
    console.error('Error in addTransaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    throw error;
  }
};

export const calculateFinancialReports = async (): Promise<any> => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*');

  if (error) throw error;

  const typedTransactions = transactions as Transaction[];

  const income = typedTransactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = Math.abs(
    typedTransactions
      .filter(t => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const profit = income - expenses;

  const cashFlow = {
    inflow: typedTransactions
      .filter(t => t.type === "Income" && t.payment_method === "Cash")
      .reduce((sum, t) => sum + t.amount, 0),
    outflow: typedTransactions
      .filter(t => t.type === "Expense" && t.payment_method === "Cash")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    netFlow: 0 // Will be calculated below
  };

  const assets = income;
  const liabilities = expenses;
  const netWorth = assets - liabilities;

  const incomeByCategory = typedTransactions
    .filter(t => t.type === "Income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const calculateTax = (amount: number) => {
    if (amount <= 250000) return 0;
    if (amount <= 500000) return (amount - 250000) * 0.05;
    if (amount <= 1000000) return 12500 + (amount - 500000) * 0.2;
    return 112500 + (amount - 1000000) * 0.3;
  };

  const estimatedTax = calculateTax(income);

  return {
    profitAndLoss: {
      income,
      expenses,
      profit,
    },
    cashFlow: {
      inflow: cashFlow.inflow,
      outflow: cashFlow.outflow,
      netFlow: cashFlow.netFlow,
    },
    balanceSheet: {
      assets,
      liabilities,
      netWorth,
    },
    taxReport: {
      incomeByCategory,
      estimatedTax,
    },
  };
};
