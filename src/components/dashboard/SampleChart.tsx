
import React from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Personal Finance Data
const personalFinanceData = {
  timeData: [
    { month: "Jan", expenses: 2800, income: 4500 },
    { month: "Feb", expenses: 2600, income: 4500 },
    { month: "Mar", expenses: 2900, income: 4500 },
    { month: "Apr", expenses: 2750, income: 4700 },
    { month: "May", expenses: 2850, income: 4700 },
    { month: "Jun", expenses: 3100, income: 4700 },
  ],
  categoryData: [
    { name: "Food & Groceries", value: 950 },
    { name: "Rent", value: 1200 },
    { name: "Utilities", value: 350 },
    { name: "Transportation", value: 200 },
    { name: "Entertainment", value: 150 },
    { name: "Healthcare", value: 300 },
  ]
};

// Business Operations Data
const businessOperationsData = {
  timeData: [
    { month: "Jan", revenue: 85000, costs: 65000, profit: 20000 },
    { month: "Feb", revenue: 92000, costs: 68000, profit: 24000 },
    { month: "Mar", revenue: 98000, costs: 70000, profit: 28000 },
    { month: "Apr", revenue: 105000, costs: 73000, profit: 32000 },
    { month: "May", revenue: 115000, costs: 78000, profit: 37000 },
    { month: "Jun", revenue: 125000, costs: 82000, profit: 43000 },
  ],
  categoryData: [
    { name: "Raw Materials", value: 35000 },
    { name: "Labor", value: 28000 },
    { name: "Marketing", value: 12000 },
    { name: "Operations", value: 15000 },
    { name: "R&D", value: 8000 },
    { name: "Admin", value: 7000 },
  ]
};

// Enhanced color scheme
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
];

interface SampleChartProps {
  type: "line" | "area" | "bar" | "pie";
  height?: number;
  data?: any;
  documentName?: string;
}

const SampleChart: React.FC<SampleChartProps> = ({ 
  type, 
  height = 300,
  documentName = "datafile"
}) => {
  // Select dataset based on document name
  const chartData = documentName.toLowerCase().includes("operation") 
    ? businessOperationsData 
    : personalFinanceData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  switch (type) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData.timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#64748b" }} 
            />
            <YAxis 
              tick={{ fill: "#64748b" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend />
            {documentName.toLowerCase().includes("operation") ? (
              <>
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="costs"
                  name="Costs"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData.categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.categoryData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData.categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "#64748b" }}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis 
              tick={{ fill: "#64748b" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name={documentName.toLowerCase().includes("operation") ? "Amount (Business)" : "Amount (Personal)"}
              radius={[4, 4, 0, 0]}
            >
              {chartData.categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData.timeData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#64748b" }}
            />
            <YAxis 
              tick={{ fill: "#64748b" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend />
            {documentName.toLowerCase().includes("operation") ? (
              <>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  fill="url(#colorProfit)"
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  name="Costs"
                  stroke="#ef4444"
                  fill="url(#colorCosts)"
                />
              </>
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorCosts)"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Invalid chart type</div>;
  }
};

export default SampleChart;

