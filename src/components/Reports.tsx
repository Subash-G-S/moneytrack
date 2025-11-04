import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Download, FileText, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ReportsProps {
  transactions: Transaction[];
}

export const Reports = ({ transactions }: ReportsProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = ["all", ...new Set(transactions.map((t) => t.category))];

  // ✅ filtering includes search now
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);

    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);

    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;

    return matchesSearch && matchesDateRange && matchesCategory;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Financial Report", 20, 20);

    const dateRange = `${startDate ? format(startDate, "PPP") : "All"} - ${
      endDate ? format(endDate, "PPP") : "All"
    }`;

    doc.setFontSize(12);
    doc.text(`Period: ${dateRange}`, 20, 35);
    doc.text(
      `Category: ${
        filterCategory === "all"
          ? "All"
          : filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)
      }`,
      20,
      45
    );

    autoTable(doc, {
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: filteredTransactions.map((t) => [
        format(new Date(t.date), "MMM dd, yyyy"),
        t.type,
        t.category,
        t.description,
        `₹${t.amount.toLocaleString()}`,
      ]),
      startY: 60,
    });

    doc.save(
      `financial-report-${format(new Date(), "yyyy-MM-dd")}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Report Filters
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* ✅ Added Search as First Filter */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* 🔎 Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto"/>
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>


            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <div className="space-y-2">
              <Label>Export</Label>
              <Button
                className="w-full"
                onClick={generatePDF}
                disabled={filteredTransactions.length === 0}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ✅ Below UI untouched */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Same Summary Cards */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Filtered Income</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-income">₹{totalIncome.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Filtered Expenses</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-expense">₹{totalExpenses.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-income" : "text-expense"}`}>
              ₹{netBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtered Results List (Untouched UI) */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle>Filtered Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
                >
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.category} • {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.type === "income" ? "text-income" : "text-expense"}`}>
                    {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
