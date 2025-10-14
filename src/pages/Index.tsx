import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { History } from "@/components/History";
import { Reports } from "@/components/Reports";
import { Calculator } from "@/components/Calculator";
import { Calculator as CalculatorIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  PiggyBank,
  LayoutDashboard,
  Plus,
  History as HistoryIcon,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string; // 👈 always a string (ISO)
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Listen to transactions in Firestore
  useEffect(() => {
    if (!user) return;
    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const q = query(transactionsRef, orderBy("date", "desc")); // 👈 order by Firestore Timestamp
    const unsub = onSnapshot(q, (snap) => {
      const list: Transaction[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          ...data,
          date: data.date?.toDate
            ? data.date.toDate().toISOString() // 👈 convert Timestamp → string
            : data.date,
        };
      });
      setTransactions(list);
    });
    return () => unsub();
  }, [user]);
  const toggleTheme = () => {
  const root = document.documentElement;
  if (root.classList.contains("dark")) {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    setIsDark(true);
  }
}, []);



  // Add transaction
  const handleAddTransaction = async (
    newTransaction: Omit<Transaction, "id">
  ) => {
    if (!user) return;
    const transactionsRef = collection(db, "users", user.uid, "transactions");
    await addDoc(transactionsRef, {
      ...newTransaction,
      date: Timestamp.fromDate(new Date()), // 👈 ensure Firestore Timestamp
      createdAt: serverTimestamp(),
    });
    setActiveTab("dashboard");
    toast({
      title: "Transaction Added",
      description: `${
        newTransaction.type === "income" ? "Income" : "Expense"
      } of $${newTransaction.amount} has been recorded.`,
    });
  };
useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, []);
useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);


  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
  <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      
      {/* Logo & Title */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <PiggyBank className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">MoneyTracker</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your finances</p>
        </div>
      </div>

      {/* Balance, Toggle & Sign Out */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-sm text-muted-foreground">
        <span>
          Balance:{" "}
          <span className={`font-semibold ${balance >= 0 ? "text-income" : "text-expense"}`}>
            ₹{balance.toLocaleString()}
          </span>
        </span>

        {/* 🌙☀️ Simple Dark/Light toggle */}
        <button
  onClick={() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  }}
  className="p-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80"
  aria-label="Toggle theme"
>
  {isDark ? "🌙" : "☀️"}
</button>


        <Button variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </div>
  </div>
</header>




      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">

            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="add-transaction"
              className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <HistoryIcon className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <CalculatorIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
              transactions={transactions}
            />
          </TabsContent>

          <TabsContent value="add-transaction">
            <div className="max-w-2xl mx-auto">
              <AddTransactionForm onAddTransaction={handleAddTransaction} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <History transactions={transactions} />
          </TabsContent>

          <TabsContent value="reports">
            <Reports transactions={transactions} />
          </TabsContent>
          <TabsContent value="calculator">
            <div className="max-w-2xl mx-auto">
              <Calculator />
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Index;
