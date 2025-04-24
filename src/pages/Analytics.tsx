
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SampleChart from "@/components/dashboard/SampleChart";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, LineChart, FileUp } from "lucide-react";
import { Link } from "react-router-dom";

const Analytics = () => {
  return (
    <AppLayout activePath="/analytics">
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-finance-primary">Analytics</h1>
            <p className="text-finance-secondary mt-1">
              Advanced financial analysis and insights
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart className="mr-2 h-4 w-4" />
              Chart Types
            </Button>
            <Link to="/upload">
              <Button>
                <FileUp className="mr-2 h-4 w-4" />
                Upload Data
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="spending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          </TabsList>

          <TabsContent value="spending">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Spending Over Time</CardTitle>
                  <CardDescription>Month-to-month spending trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <SampleChart type="area" height={350} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Breakdown of expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <SampleChart type="pie" height={350} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Spending Categories</CardTitle>
                  <CardDescription>Where your money goes the most</CardDescription>
                </CardHeader>
                <CardContent>
                  <SampleChart type="bar" height={350} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Analysis</CardTitle>
                <CardDescription>Income sources and trends</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Upload income data to see analysis</p>
                  <Link to="/upload" className="mt-4 inline-block">
                    <Button>
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload Income Data
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
                <CardDescription>Long-term financial patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <SampleChart type="line" height={400} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomalies">
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection</CardTitle>
                <CardDescription>Unusual transactions and patterns</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No anomalies detected in your data</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload more financial data to improve anomaly detection
                  </p>
                  <Link to="/upload" className="mt-4 inline-block">
                    <Button>
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload More Data
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add ChatBot */}
      <ChatBot />
    </AppLayout>
  );
};

export default Analytics;
