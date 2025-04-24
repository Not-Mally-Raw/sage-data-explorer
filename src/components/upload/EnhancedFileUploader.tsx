
import React, { useState } from "react";
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { Button } from "@/components/ui/button";
import { FileUp, AlertCircle, Loader2, CheckCircle, FileText, FileSpreadsheet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import geminiService from "@/services/geminiService";
import ApiKeySetup from "@/components/chat/ApiKeySetup";

interface EnhancedFileUploaderProps {
  onFileProcessed?: (data: any) => void;
}

const EnhancedFileUploader: React.FC<EnhancedFileUploaderProps> = ({ onFileProcessed }) => {
  const { 
    isProcessing, 
    selectedFile, 
    uploadProgress, 
    error,
    processFile,
    resetState
  } = useFileProcessing();
  
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    // Check file type
    const isValidType = 
      file.type === "application/pdf" ||
      file.type === "text/csv" ||
      file.name.endsWith(".csv");
      
    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or CSV file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if API key is set for OCR capabilities
    if (!geminiService.hasApiKey() && file.type === "application/pdf") {
      setShowApiKeyModal(true);
      return;
    }
    
    // Process the file
    const processedData = await processFile(file);
    
    // Notify parent component if provided
    if (processedData && onFileProcessed) {
      onFileProcessed(processedData);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleApiKeySet = () => {
    if (selectedFile) {
      // Re-attempt processing with the newly set API key
      processFile(selectedFile);
    }
  };

  return (
    <>
      <div className="w-full">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
            dragActive 
              ? "border-finance-primary bg-finance-primary/10" 
              : "border-gray-300 hover:border-finance-primary/50 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            // Processing state
            <div className="w-full max-w-md flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-finance-primary animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-finance-primary">Processing file...</h3>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 100 
                    ? "Uploading and analyzing your file" 
                    : "Finalizing processing"}
                </p>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          ) : error ? (
            // Error state
            <div className="w-full max-w-md flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-red-500">Processing Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button onClick={resetState}>Try Again</Button>
            </div>
          ) : uploadProgress === 100 ? (
            // Success state
            <div className="w-full max-w-md flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-green-500">File Processed Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  Your file has been processed and is ready for analysis
                </p>
              </div>
              <Button onClick={resetState}>Upload Another File</Button>
            </div>
          ) : (
            // Default upload state
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-finance-primary/10 flex items-center justify-center">
                <FileUp className="h-8 w-8 text-finance-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Upload your financial documents</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop files here or click to browse
                </p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <Button className="space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Select PDF</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload PDF"
                  />
                </Button>
                <Button className="space-x-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Select CSV</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload CSV"
                  />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-4 max-w-md text-center">
                <p>We support PDF and CSV files. For PDFs, we can extract data using OCR if needed.</p>
                <p className="mt-1">Maximum file size: 10MB</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Features description */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-base font-medium mb-1">PDF Processing</h3>
            <p className="text-sm text-muted-foreground">
              Extract financial data from PDFs using OCR and text analysis. Works with scanned documents!
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-base font-medium mb-1">CSV Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Import and analyze structured data from CSV files for detailed financial insights.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-base font-medium mb-1">Automatic Visualization</h3>
            <p className="text-sm text-muted-foreground">
              Our system automatically generates the most relevant charts for your data.
            </p>
          </div>
        </div>
      </div>
      
      {/* API Key Setup Modal */}
      <ApiKeySetup 
        isOpen={showApiKeyModal}
        setIsOpen={setShowApiKeyModal}
        onApiKeySet={handleApiKeySet}
      />
    </>
  );
};

export default EnhancedFileUploader;
