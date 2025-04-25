
import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// More realistic financial data
const expenseTimeData = [
  { month: "Jan", expenses: 9800, income: 12500 },
  { month: "Feb", expenses: 8900, income: 12800 },
  { month: "Mar", expenses: 11200, income: 14300 },
  { month: "Apr", expenses: 10500, income: 13900 },
  { month: "May", expenses: 9200, income: 14100 },
  { month: "Jun", expenses: 9800, income: 15200 },
  { month: "Jul", expenses: 10300, income: 15800 },
];

const expenseCategoryData = [
  { name: "Rent", value: 5200 },
  { name: "HR", value: 3200 },
  { name: "Professional Services", value: 2800 },
  { name: "Marketing", value: 1500 },
  { name: "Travel", value: 1245.67 },
  { name: "Entertainment", value: 678.3 },
  { name: "Software", value: 899.97 },
  { name: "Office Expenses", value: 423.45 },
  { name: "Utilities", value: 486.77 },
];

// Enhanced color scheme for better visualization
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#84cc16", // Lime
];

interface SampleChartProps {
  type: "line" | "area" | "bar" | "pie";
  height?: number;
  data?: any;
}

const SampleChart: React.FC<SampleChartProps> = ({ 
  type, 
  height = 300,
  data
}) => {
  // Use provided data if available, otherwise use default sample data
  const chartData = {
    timeData: data?.timeseriesData || expenseTimeData,
    categoryData: data?.categoryBreakdown || expenseCategoryData
  };

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
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis 
              tick={{ fill: "#64748b" }} 
              axisLine={{ stroke: "#cbd5e1" }}
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
            <Line
              type="monotone"
              name="Income"
              dataKey="income"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              name="Expenses"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData.timeData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#64748b" }} 
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis 
              tick={{ fill: "#64748b" }} 
              axisLine={{ stroke: "#cbd5e1" }}
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
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
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
              axisLine={{ stroke: "#cbd5e1" }}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis 
              tick={{ fill: "#64748b" }} 
              axisLine={{ stroke: "#cbd5e1" }}
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
              name="Amount" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
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
              nameKey="name"
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
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              formatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Invalid chart type</div>;
  }
};

export default SampleChart;
