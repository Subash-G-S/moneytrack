import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onShowAddTransaction: () => void;
  showAddTransaction: boolean;
}

export const Header = ({ onShowAddTransaction, showAddTransaction }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ExpenseTracker</h1>
              <p className="text-sm text-muted-foreground">Manage your finances</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onShowAddTransaction}
              variant={showAddTransaction ? "secondary" : "default"}
            >
              {showAddTransaction ? "View Dashboard" : "Add Transaction"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};