import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No transactions yet</p>
        <p className="text-sm mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`p-2 rounded-full ${
              transaction.type === 'income' 
                ? 'bg-income/10 text-income' 
                : 'bg-expense/10 text-expense'
            }`}>
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="h-4 w-4" />
              ) : (
                <ArrowDownCircle className="h-4 w-4" />
              )}
            </div>

            {/* Transaction Details */}
            <div>
              <p className="font-medium text-foreground">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(transaction.date))} ago</span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className={`font-semibold ${
            transaction.type === 'income' 
              ? 'text-income' 
              : 'text-expense'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
