
import geminiService from "./geminiService";

export interface ProcessedFileData {
  text: string;
  financialData?: {
    descriptions: string[];
    amounts: number[];
    dates?: Date[];
  };
  metadata: {
    filename: string;
    filesize: number;
    filetype: string;
    processedAt: Date;
    ocrUsed: boolean;
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
      
      // If insufficient text extracted, use OCR via Gemini API
      if (standardText.length < 50) {
        console.log("Standard extraction failed, using OCR");
        const pdfImage = await this.convertPdfToImage(file);
        const ocrText = await geminiService.processPdfOcr(pdfImage);
        text = ocrText;
        ocrUsed = true;
      }
      
      // Extract financial data
      const financialData = this.extractFinancialData(text);
      
      return {
        text,
        financialData,
        metadata: {
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
          processedAt: new Date(),
          ocrUsed
        }
      };
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw new Error("Failed to process PDF file");
    }
  }
  
  /**
   * Process a CSV file, parsing it into structured data
   */
  async processCsv(file: File): Promise<ProcessedFileData> {
    try {
      // Read the CSV file
      const text = await this.readFileAsText(file);
      
      // Parse CSV (would normally use papaparse here)
      const parsedData = this.parseCsvText(text);
      
      // Extract relevant financial data
      const financialData = this.extractFinancialDataFromCsv(parsedData);
      
      return {
        text,
        financialData,
        metadata: {
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
          processedAt: new Date(),
          ocrUsed: false
        }
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
  private extractFinancialData(text: string): { descriptions: string[], amounts: number[] } {
    // In production, this would use more sophisticated regex patterns
    // For now, we'll return placeholder data
    console.log("Extracting financial data from text");
    
    return {
      descriptions: ["Office Supplies", "Rent", "Utilities", "Consulting Services"],
      amounts: [123.45, 2000.00, 456.78, 3500.00]
    };
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
    // For now, we'll return placeholder parsed data
    const rows = text.split('\n');
    return rows.map(row => row.split(','));
  }
  
  /**
   * Extract financial data from CSV rows
   */
  private extractFinancialDataFromCsv(rows: any[][]): { descriptions: string[], amounts: number[] } {
    // In production, this would actually process the CSV data
    // For now, we'll return placeholder data
    return {
      descriptions: rows.slice(1, 5).map(row => row[0] || "Unknown"),
      amounts: rows.slice(1, 5).map(row => parseFloat(row[1]) || 0)
    };
  }
}

// Create singleton instance
const fileProcessingService = new FileProcessingService();
export default fileProcessingService;
