
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import ChartCard from "@/components/dashboard/ChartCard";
import SampleChart from "@/components/dashboard/SampleChart";
import ChatBot from "@/components/chat/ChatBot";
import AutomatedInsights from "@/components/insights/AutomatedInsights";
import { Button } from "@/components/ui/button";
import { 
  FileUp, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart,
  LineChart,
  Search 
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-finance-primary">Dashboard</h1>
            <p className="text-finance-secondary mt-1">
              Overview of your financial analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-finance-accent hover:bg-finance-accent/90">
              <Search className="mr-2 h-4 w-4" />
              Analyze Data
            </Button>
            <Link to="/upload">
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </Link>
          </div>
        </div>

        {/* Automated Insights */}
        <div className="mb-8">
          <AutomatedInsights insights={[]} />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Income"
            value="$24,580"
            icon={<DollarSign size={18} />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Total Expenses"
            value="$18,230"
            icon={<DollarSign size={18} />}
            trend={{ value: 5, isPositive: false }}
          />
          <MetricCard
            title="Profit Margin"
            value="26.4%"
            icon={<TrendingUp size={18} />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Anomalies Detected"
            value="3"
            icon={<TrendingDown size={18} />}
            description="3 unusual transactions found"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Income vs Expenses">
            <SampleChart type="bar" />
          </ChartCard>
          <ChartCard title="Financial Trend">
            <SampleChart type="line" />
          </ChartCard>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Spending by Category" className="lg:col-span-1">
            <SampleChart type="pie" />
          </ChartCard>
          <ChartCard title="Cash Flow Analysis" className="lg:col-span-2">
            <SampleChart type="area" />
          </ChartCard>
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow border border-gray-100 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-finance-primary">Ready to analyze more data?</h2>
            <p className="text-finance-secondary">Upload your financial documents to get deeper insights</p>
          </div>
          <Link to="/upload" className="mt-4 md:mt-0">
            <Button className="bg-finance-accent hover:bg-finance-accent/90">
              <FileUp className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </Link>
        </div>
      </div>

      {/* Add the ChatBot component */}
      <ChatBot />
    </AppLayout>
  );
};

export default Index;
