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

  // ✅ Updated filtering including search
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
    .reduce((a, b) => a + b.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

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
          ? "All Categories"
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
      startY: 55,
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
            <FileText className="h-5 w-5 text-primary" /> Report Filters
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* ✅ 5 Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* 🔍 Search Filter */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 📅 Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>

            {/* 📅 End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>

            {/* 🏷 Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "all" ? "All Categories" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 📄 PDF Download */}
            <div className="space-y-2">
              <Label>Export</Label>
              <Button
                className="w-full"
                disabled={filteredTransactions.length === 0}
                onClick={generatePDF}
              >
                <Download className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>Filtered Income</CardTitle></CardHeader>
          <CardContent><div className="text-2xl text-green-600 font-bold">₹{totalIncome.toLocaleString()}</div></CardContent></Card>

        <Card><CardHeader><CardTitle>Filtered Expenses</CardTitle></CardHeader>
          <CardContent><div className="text-2xl text-red-600 font-bold">₹{totalExpenses.toLocaleString()}</div></CardContent></Card>

        <Card><CardHeader><CardTitle>Net Balance</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{netBalance >= 0 ? "✅" : "⚠️"} ₹{netBalance.toLocaleString()}</div></CardContent></Card>
      </div>

      {/* RESULTS LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Filtered Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No matching results…</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between p-3 rounded-lg bg-muted/10"
                >
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.category} • {format(new Date(t.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <strong className={t.type === "income" ? "text-income" : "text-expense"}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
