
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import EnhancedFileUploader from "@/components/upload/EnhancedFileUploader";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

const Upload = () => {
  const handleFileProcessed = (data: any) => {
    console.log("File processed:", data);
    // In a real app, you would store this in state or context
    // And possibly update a backend API/Supabase
  };

  return (
    <AppLayout activePath="/upload">
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-finance-primary">Upload Financial Data</h1>
          <p className="text-finance-secondary mt-1">
            Upload your financial documents for analysis
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="history">Upload History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Support for multiple file formats</AlertTitle>
              <AlertDescription>
                You can upload CSV files for transaction data or PDF files for statements and invoices.
                We now support OCR for scanned documents using Gemini API!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EnhancedFileUploader onFileProcessed={handleFileProcessed} />
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Processing</CardTitle>
                    <CardDescription>
                      Information about how we process your files
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">CSV Processing</h3>
                      <p className="text-xs text-muted-foreground">
                        CSV files are parsed to extract transaction data. We recommend including
                        headers for date, description, and amount.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">PDF Processing</h3>
                      <p className="text-xs text-muted-foreground">
                        Text is extracted from PDFs and analyzed to identify financial data.
                        We now use AI-powered OCR for scanned documents.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Automatic Insights</h3>
                      <p className="text-xs text-muted-foreground">
                        Our system automatically generates visualizations and financial summaries
                        based on your data. Ask our AI assistant for specific insights!
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Data Security</h3>
                      <p className="text-xs text-muted-foreground">
                        Your files are processed securely and data is stored encrypted.
                        We do not share your financial information.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>
                  View your previous file uploads and their analysis status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upload history yet</p>
                  <p className="text-sm text-muted-foreground">
                    Your uploaded files will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add ChatBot component */}
      <ChatBot />
    </AppLayout>
  );
};

export default Upload;
