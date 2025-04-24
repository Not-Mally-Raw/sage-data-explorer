
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";

// Sample transaction data
const sampleTransactions = [
  { id: 1, date: "2024-04-05", description: "Grocery Store", category: "Food", amount: -128.45 },
  { id: 2, date: "2024-04-03", description: "Salary Deposit", category: "Income", amount: 2500.00 },
  { id: 3, date: "2024-04-02", description: "Electric Bill", category: "Utilities", amount: -95.20 },
  { id: 4, date: "2024-03-29", description: "Restaurant Dinner", category: "Food", amount: -64.30 },
  { id: 5, date: "2024-03-28", description: "Gas Station", category: "Transport", amount: -45.00 },
  { id: 6, date: "2024-03-25", description: "Online Shopping", category: "Shopping", amount: -128.99 },
  { id: 7, date: "2024-03-20", description: "Phone Bill", category: "Utilities", amount: -59.99 },
  { id: 8, date: "2024-03-15", description: "Interest Payment", category: "Income", amount: 12.33 },
];

const Data = () => {
  return (
    <AppLayout activePath="/data">
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-finance-primary">Financial Data</h1>
            <p className="text-finance-secondary mt-1">
              View and manage your financial transactions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transaction Search</CardTitle>
            <CardDescription>Search across all your financial data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                />
              </div>
              <div className="flex gap-3">
                <Input 
                  type="date" 
                  className="w-full md:w-auto" 
                />
                <Input 
                  type="date" 
                  className="w-full md:w-auto" 
                />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {sampleTransactions.length} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className={
                        transaction.category === "Income" 
                          ? "inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800" 
                          : "inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                      }>
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className={
                      transaction.amount < 0 
                        ? "text-right text-red-600 font-medium" 
                        : "text-right text-green-600 font-medium"
                    }>
                      {transaction.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-center mt-6">
              <Button variant="outline" size="sm" className="mr-2">Previous</Button>
              <Button variant="outline" size="sm" disabled>1</Button>
              <Button variant="outline" size="sm" className="ml-2">Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add ChatBot */}
      <ChatBot />
    </AppLayout>
  );
};

export default Data;
