
import { FinancialInsight } from "@/components/insights/AutomatedInsights";
import { DollarSign, TrendingDown, TrendingUp, Calculator, Hash } from "lucide-react";
import React from "react";

export interface FinancialSummary {
  totalAmount: number;
  averageTransaction: number;
  medianTransaction: number;
  highestExpense: {
    description: string;
    amount: number;
  };
  lowestExpense: {
    description: string;
    amount: number;
  };
  transactionCount: number;
  highValueTransactionCount: number;
  topCategories: {
    category: string;
    count: number;
  }[];
}

class InsightsService {
  /**
   * Generate financial summary from raw data
   */
  generateFinancialSummary(data: any): FinancialSummary {
    // In production, this would analyze actual data
    // For now, we'll return placeholder data
    console.log("Generating financial summary from data:", data);
    
    return {
      totalAmount: 12345.67,
      averageTransaction: 123.45,
      medianTransaction: 100.00,
      highestExpense: {
        description: "Office Supplies",
        amount: 5000.00
      },
      lowestExpense: {
        description: "Coffee",
        amount: 5.00
      },
      transactionCount: 42,
      highValueTransactionCount: 8,
      topCategories: [
        { category: "Office Supplies", count: 12 },
        { category: "Utilities", count: 8 },
        { category: "Rent", count: 4 }
      ]
    };
  }
  
  /**
   * Generate insights from financial summary
   */
  generateInsights(summary: FinancialSummary): FinancialInsight[] {
    return [
      {
        title: "Total Amount",
        value: this.formatCurrency(summary.totalAmount),
        icon: React.createElement(DollarSign, { size: 18 }),
        description: "Sum of all transactions"
      },
      {
        title: "Average Transaction",
        value: this.formatCurrency(summary.averageTransaction),
        icon: React.createElement(Calculator, { size: 18 }),
        description: "Mean transaction amount"
      },
      {
        title: "Highest Expense",
        value: this.formatCurrency(summary.highestExpense.amount),
        icon: React.createElement(TrendingDown, { size: 18 }),
        description: summary.highestExpense.description
      },
      {
        title: "Median Transaction",
        value: this.formatCurrency(summary.medianTransaction),
        icon: React.createElement(Calculator, { size: 18 }),
        description: "Middle value of all transactions"
      },
      {
        title: "Transaction Count",
        value: summary.transactionCount,
        icon: React.createElement(Hash, { size: 18 }),
        description: "Total number of transactions"
      },
      {
        title: "Lowest Expense",
        value: this.formatCurrency(summary.lowestExpense.amount),
        icon: React.createElement(TrendingUp, { size: 18 }),
        description: summary.lowestExpense.description
      },
      {
        title: "High Value Transactions",
        value: summary.highValueTransactionCount,
        icon: React.createElement(TrendingUp, { size: 18 }),
        description: "Transactions above average amount"
      },
      {
        title: "Top Category",
        value: summary.topCategories[0]?.category || "N/A",
        icon: React.createElement(Hash, { size: 18 }),
        description: `${summary.topCategories[0]?.count || 0} transactions`
      }
    ];
  }
  
  /**
   * Generate insights directly from data
   */
  generateInsightsFromData(data: any): FinancialInsight[] {
    const summary = this.generateFinancialSummary(data);
    return this.generateInsights(summary);
  }
  
  /**
   * Format currency for display
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}

// Create singleton instance
const insightsService = new InsightsService();
export default insightsService;
