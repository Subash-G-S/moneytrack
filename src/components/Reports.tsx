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
import { CalendarIcon, Download, FileText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  date: string; // always ISO string now
}

interface ReportsProps {
  transactions: Transaction[];
}

export const Reports = ({ transactions }: ReportsProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [filterType, setFilterType] = useState<
    "all" | "income" | "expense"
  >("all");

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const matchesDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);
    const matchesType =
      filterType === "all" || transaction.type === filterType;
    return matchesDateRange && matchesType;
  });

  // Totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Export as PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Financial Report", 20, 20);

    // Date range
    const dateRange = `${startDate ? format(startDate, "PPP") : "All"} - ${
      endDate ? format(endDate, "PPP") : "All"
    }`;
    doc.setFontSize(12);
    doc.text(`Period: ${dateRange}`, 20, 35);
    doc.text(
      `Filter: ${
        filterType.charAt(0).toUpperCase() + filterType.slice(1)
      }`,
      20,
      45
    );

    // Summary
    doc.setFontSize(14);
    doc.text("Summary", 20, 65);
    doc.setFontSize(12);
    doc.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 20, 80);
    doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 20, 90);
    doc.text(`Net Balance: ₹${netBalance.toLocaleString()}`, 20, 100);

    // Transactions table
    const tableData = filteredTransactions.map((t) => [
      format(new Date(t.date), "MMM dd, yyyy"),
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      t.category,
      t.description,
      `₹${t.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: tableData,
      startY: 120,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    // Save the PDF
    const fileName = `financial-report-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
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
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                value={filterType}
                onValueChange={(
                  value: "all" | "income" | "expense"
                ) => setFilterType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download Button */}
            <div className="space-y-2">
              <Label>Export</Label>
              <Button
                onClick={generatePDF}
                className="w-full"
                disabled={filteredTransactions.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtered Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              ₹{totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtered Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              ₹{totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netBalance >= 0 ? "text-income" : "text-expense"
              }`}
            >
              ₹{netBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtered Results */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle>
            Filtered Transactions ({filteredTransactions.length} results)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found for the selected filters</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.category} •{" "}
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-income"
                        : "text-expense"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
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
