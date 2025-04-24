
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart4, Calculator } from "lucide-react";

export interface FinancialInsight {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface AutomatedInsightsProps {
  insights: FinancialInsight[];
}

const AutomatedInsights: React.FC<AutomatedInsightsProps> = ({ insights = [] }) => {
  if (insights.length === 0) {
    // Show placeholder if no insights available
    const placeholderInsights: FinancialInsight[] = [
      {
        title: "Total Amount",
        value: "$12,345.67",
        icon: <DollarSign size={18} />,
        description: "Sum of all transactions"
      },
      {
        title: "Average Transaction",
        value: "$123.45",
        icon: <Calculator size={18} />,
        description: "Mean transaction amount"
      },
      {
        title: "Highest Expense",
        value: "$5,000.00",
        icon: <TrendingUp size={18} />,
        description: "Office Supplies"
      },
      {
        title: "Number of Transactions",
        value: "42",
        icon: <BarChart4 size={18} />,
        description: "Total count of transactions"
      }
    ];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-semibold">Financial Insights</h2>
          <p className="text-xs text-muted-foreground">Sample data only</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {placeholderInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} isPlaceholder={true} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="text-lg font-semibold">Financial Insights</h2>
        <p className="text-xs text-muted-foreground">Generated automatically</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
};

interface InsightCardProps {
  insight: FinancialInsight;
  isPlaceholder?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, isPlaceholder = false }) => {
  return (
    <Card className={isPlaceholder ? "border-dashed opacity-70 hover:opacity-100 transition-opacity" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {insight.title}
        </CardTitle>
        {insight.icon && (
          <div className="text-muted-foreground">
            {insight.icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{insight.value}</div>
        {insight.description && (
          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
        )}
        {insight.trend && (
          <div
            className={`flex items-center gap-1 mt-3 text-xs ${
              insight.trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{insight.trend.isPositive ? "↑" : "↓"}</span>
            <span>
              {insight.trend.value}%{" "}
              <span className="text-muted-foreground">from last period</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedInsights;
