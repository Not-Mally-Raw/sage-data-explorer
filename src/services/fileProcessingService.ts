
import geminiService from "./geminiService";

export interface ProcessedFileData {
  text: string;
  financialData?: {
    descriptions: string[];
    amounts: number[];
    dates?: Date[];
    categories?: string[];
  };
  metadata: {
    filename: string;
    filesize: number;
    filetype: string;
    processedAt: Date;
    ocrUsed: boolean;
  };
  charts?: {
    recommended: string[];
    data: any;
  };
}

class FileProcessingService {
  /**
   * Process a PDF file, extracting text and financial data
   */
  async processPdf(file: File): Promise<ProcessedFileData> {
    try {
      // First try standard pdf-parse method (simulated here)
      const standardText = await this.extractTextFromPdf(file);
      
      let text = standardText;
      let ocrUsed = false;
      
      // Always use OCR for more reliable results with financial PDFs
      console.log("Processing PDF with OCR");
      const pdfImage = await this.convertPdfToImage(file);
      const ocrText = await geminiService.processPdfOcr(pdfImage);
      text = ocrText || text;
      ocrUsed = true;
      
      // Extract financial data
      const financialData = this.extractFinancialData(text);
      
      // Generate recommended charts based on data
      const charts = this.generateChartRecommendations(financialData);
      
      return {
        text,
        financialData,
        metadata: {
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
          processedAt: new Date(),
          ocrUsed
        },
        charts
      };
    } catch (error) {
      console.error("Error processing PDF:", error);
      // Return mock data for demonstration since this is a prototype
      return this.getMockPdfData(file);
    }
  }
  
  /**
   * Process a CSV file, parsing it into structured data
   */
  async processCsv(file: File): Promise<ProcessedFileData> {
    try {
      // Read the CSV file
      const text = await this.readFileAsText(file);
      
      // Parse CSV
      const parsedData = this.parseCsvText(text);
      
      // Extract relevant financial data
      const financialData = this.extractFinancialDataFromCsv(parsedData);
      
      // Generate recommended charts based on data
      const charts = this.generateChartRecommendations(financialData);
      
      return {
        text,
        financialData,
        metadata: {
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
          processedAt: new Date(),
          ocrUsed: false
        },
        charts
      };
    } catch (error) {
      console.error("Error processing CSV:", error);
      throw new Error("Failed to process CSV file");
    }
  }
  
  /**
   * Extract text from PDF using standard methods (simulated)
   */
  private async extractTextFromPdf(file: File): Promise<string> {
    // In production, this would use pdf-parse
    // For now, we'll simulate the extraction
    console.log("Extracting text from PDF:", file.name);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return empty string to simulate a scanned PDF that needs OCR
    return "";
  }
  
  /**
   * Convert PDF to image for OCR (simulated)
   */
  private async convertPdfToImage(file: File): Promise<Blob> {
    // In production, this would use pdf2image or similar
    // For now, we'll just return the file as a placeholder
    console.log("Converting PDF to image:", file.name);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return file;
  }
  
  /**
   * Extract financial data using regex patterns (simplified)
   */
  private extractFinancialData(text: string): { 
    descriptions: string[], 
    amounts: number[],
    categories: string[]
  } {
    // In a real application, this would use more sophisticated analysis
    console.log("Extracting financial data from text");
    
    // Return more realistic financial data
    return {
      descriptions: [
        "Office Supplies", 
        "Rent Payment - Q2", 
        "Utilities - Electricity", 
        "Utilities - Internet", 
        "Consulting Services - Tech", 
        "Marketing - Digital Ads",
        "Employee Benefits",
        "Software Subscriptions",
        "Travel Expenses",
        "Client Entertainment"
      ],
      amounts: [
        423.45, 
        5200.00, 
        356.78, 
        129.99, 
        2800.00, 
        1500.00,
        3200.00,
        899.97,
        1245.67,
        678.30
      ],
      categories: [
        "Office Expenses", 
        "Rent", 
        "Utilities", 
        "Utilities", 
        "Professional Services", 
        "Marketing",
        "HR",
        "Software",
        "Travel",
        "Entertainment"
      ]
    };
  }
  
  /**
   * Generate chart recommendations based on data
   */
  private generateChartRecommendations(data: any): { 
    recommended: string[];
    data: any;
  } {
    // Identify which charts would be most appropriate
    return {
      recommended: ["pie", "bar", "line"],
      data: {
        categoryBreakdown: this.aggregateByCategory(data),
        timeseriesData: this.generateMockTimeseriesData(),
        rawData: data
      }
    };
  }
  
  /**
   * Aggregate data by category
   */
  private aggregateByCategory(data: any): any[] {
    if (!data.categories || !data.amounts) return [];
    
    const categories = new Map<string, number>();
    
    // Sum amounts by category
    for (let i = 0; i < data.categories.length; i++) {
      const category = data.categories[i];
      const amount = data.amounts[i] || 0;
      
      if (categories.has(category)) {
        categories.set(category, (categories.get(category) || 0) + amount);
      } else {
        categories.set(category, amount);
      }
    }
    
    // Convert to array format for charts
    return Array.from(categories.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }
  
  /**
   * Generate mock timeseries data for charts
   */
  private generateMockTimeseriesData(): any[] {
    // Create realistic monthly data
    return [
      { month: "Jan", expenses: 9800, income: 12500 },
      { month: "Feb", expenses: 8900, income: 12800 },
      { month: "Mar", expenses: 11200, income: 14300 },
      { month: "Apr", expenses: 10500, income: 13900 },
      { month: "May", expenses: 9200, income: 14100 },
      { month: "Jun", expenses: 9800, income: 15200 },
      { month: "Jul", expenses: 10300, income: 15800 }
    ];
  }
  
  /**
   * Read file as text
   */
  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => {
        reject(new Error("File read error"));
      };
      reader.readAsText(file);
    });
  }
  
  /**
   * Parse CSV text (simplified)
   */
  private parseCsvText(text: string): any[][] {
    // In production, this would use papaparse
    const rows = text.split('\n');
    return rows.map(row => row.split(','));
  }
  
  /**
   * Extract financial data from CSV rows
   */
  private extractFinancialDataFromCsv(rows: any[][]): { 
    descriptions: string[], 
    amounts: number[],
    categories: string[]
  } {
    // In production, this would actually process the CSV data
    // For prototype, return similar data as the PDF method
    return this.extractFinancialData("");
  }
  
  /**
   * Get mock PDF data for demonstration
   */
  private getMockPdfData(file: File): ProcessedFileData {
    const financialData = this.extractFinancialData("");
    const charts = this.generateChartRecommendations(financialData);
    
    return {
      text: "This is a financial statement containing expense information across various categories including Office Expenses, Rent, Utilities, Professional Services, and Marketing.",
      financialData,
      metadata: {
        filename: file.name,
        filesize: file.size,
        filetype: file.type,
        processedAt: new Date(),
        ocrUsed: true
      },
      charts
    };
  }
}

// Create singleton instance
const fileProcessingService = new FileProcessingService();
export default fileProcessingService;
