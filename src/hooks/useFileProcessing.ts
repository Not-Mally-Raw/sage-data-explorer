
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import fileProcessingService, { ProcessedFileData } from "@/services/fileProcessingService";
import geminiService from "@/services/geminiService";

export interface FileProcessingState {
  isProcessing: boolean;
  processedFiles: ProcessedFileData[];
  selectedFile: File | null;
  uploadProgress: number;
  error: string | null;
}

export function useFileProcessing() {
  const [state, setState] = useState<FileProcessingState>({
    isProcessing: false,
    processedFiles: [],
    selectedFile: null,
    uploadProgress: 0,
    error: null,
  });
  
  const { toast } = useToast();

  const resetState = () => {
    setState({
      isProcessing: false,
      processedFiles: [],
      selectedFile: null,
      uploadProgress: 0,
      error: null,
    });
  };

  const processFile = async (file: File) => {
    // Check if Gemini API key is set (needed for OCR)
    if (!geminiService.hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to enable file processing.",
        variant: "destructive",
      });
      return;
    }
    
    // Update state
    setState(prev => ({
      ...prev,
      isProcessing: true,
      selectedFile: file,
      error: null
    }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 300);

      // Process file based on type
      let processedData: ProcessedFileData;
      
      if (file.type === "application/pdf") {
        processedData = await fileProcessingService.processPdf(file);
      } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        processedData = await fileProcessingService.processCsv(file);
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or CSV file.");
      }

      // Clear progress interval
      clearInterval(progressInterval);

      // Update state with processed data
      setState(prev => ({
        ...prev,
        isProcessing: false,
        processedFiles: [...prev.processedFiles, processedData],
        uploadProgress: 100
      }));

      toast({
        title: "File Processed Successfully",
        description: `Processed ${file.name} (${file.type})`,
      });

      // Return the processed data
      return processedData;
    } catch (error) {
      console.error("File processing error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage
      }));

      toast({
        title: "File Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  return {
    ...state,
    processFile,
    resetState,
    updateState: (updates: Partial<FileProcessingState>) => {
      setState(prev => ({ ...prev, ...updates }));
    }
  };
}
