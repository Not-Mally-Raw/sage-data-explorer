
// Define types
export interface GeminiResponse {
  text: string;
  confidence?: number;
}

export interface GeminiError {
  message: string;
  code?: number;
}

interface MessageHistory {
  content: string;
  role: "user" | "assistant";
}

interface ProcessQueryOptions {
  messages?: MessageHistory[];
}

class GeminiService {
  // Store API key
  private apiKey: string = "";
  
  /**
   * Set the Gemini API key
   */
  setApiKey(key: string) {
    if (!key || key.trim() === "") {
      throw new Error("Invalid API key provided");
    }
    
    this.apiKey = key.trim();
    sessionStorage.setItem("gemini_api_key", key.trim());
    
    return true;
  }
  
  /**
   * Get the stored API key
   */
  getApiKey(): string | null {
    if (!this.apiKey) {
      const storedKey = sessionStorage.getItem("gemini_api_key");
      if (storedKey) {
        this.apiKey = storedKey;
      }
    }
    return this.apiKey;
  }

  /**
   * Check if the API key is set
   */
  hasApiKey(): boolean {
    return Boolean(this.getApiKey() && this.getApiKey() !== "YOUR_GEMINI_API_KEY");
  }

  /**
   * Process a natural language query using the Gemini API
   */
  async processQuery(query: string, options?: ProcessQueryOptions): Promise<GeminiResponse> {
    try {
      if (!this.hasApiKey()) {
        throw new Error("Gemini API key is not set or is invalid");
      }
      
      if (!query || query.trim() === "") {
        throw new Error("Query cannot be empty");
      }

      console.log("Processing query:", query);
      console.log("Using conversation history:", options?.messages || []);

      // For now, we'll return predefined responses for certain queries
      // This will be replaced with actual Gemini API calls
      const predefinedResponses: Record<string, string> = {
        "hello": "Hello! I'm your financial assistant. How can I help you today?",
        "hi": "Hi there! I'm ready to help with your financial queries.",
        "what is the document about": "This document provides a detailed analysis of financial transactions, including descriptions and amounts.",
        "show me total": "Based on your financial data, your total income is $24,580 and total expenses are $18,230.",
        "total unique item sales": "There are 42 unique items in your sales data.",
        "total products bought": "You have 156 transactions in your data.",
        "show me expenses": "Your top expenses are: Rent ($2,000), Utilities ($456.78), Consulting Services ($3,500), and Office Supplies ($123.45).",
        "who are you": "I'm your AI-powered financial assistant designed to help you understand and analyze your financial data."
      };

      // Check for predefined responses
      const normalizedQuery = query.toLowerCase().trim();
      
      // First check for exact matches
      if (predefinedResponses[normalizedQuery]) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          text: predefinedResponses[normalizedQuery],
          confidence: 0.98
        };
      }
      
      // Then check for partial matches
      for (const [key, response] of Object.entries(predefinedResponses)) {
        if (normalizedQuery.includes(key)) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            text: response,
            confidence: 0.92
          };
        }
      }

      // Analyze conversation context from message history
      let contextualResponse = this.generateContextualResponse(normalizedQuery, options?.messages || []);
      if (contextualResponse) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
          text: contextualResponse,
          confidence: 0.85
        };
      }

      // For other queries, we'll return a helpful fallback response
      console.log("No predefined response found, using fallback");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        text: `I've analyzed your financial data based on your query: "${query}". In a production environment, I would connect to the Gemini API to provide specific insights about your financial data.`,
        confidence: 0.75
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw {
        message: `Error processing query: ${errorMessage}`,
        code: 500
      };
    }
  }

  /**
   * Generate a contextual response based on conversation history
   */
  private generateContextualResponse(query: string, messages: MessageHistory[]): string | null {
    // This is a simple implementation that would be replaced by real LLM context handling
    
    // Check for follow-up questions
    if (query.includes("how much") && messages.length > 0) {
      return "Based on the data we've analyzed, the total amount is $42,810. This includes both income and expenses from all transactions.";
    }
    
    if ((query.includes("why") || query.includes("how") || query.includes("what")) && messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
      if (lastAssistantMessage && lastAssistantMessage.content.includes("expenses")) {
        return "Your expenses have increased by 12% compared to last month. The main contributor is the Consulting Services category, which is up by $1,200.";
      }
    }
    
    // Look for chart/visualization requests
    if (query.includes("chart") || query.includes("graph") || query.includes("visual")) {
      return "I can generate visualizations of your financial data. In a production environment, I would create a chart showing your income vs expenses trend over time.";
    }
    
    // Handle time-based queries
    if (query.includes("month") || query.includes("year") || query.includes("quarter")) {
      return "Your financial data shows a positive trend over the last quarter with a 15% increase in net income.";
    }
    
    return null;
  }

  /**
   * Process OCR on a PDF image using Gemini API
   */
  async processPdfOcr(pdfImage: Blob): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        throw new Error("Gemini API key is not set");
      }

      // In production, this would convert the PDF to image(s) and send to Gemini
      console.log("Would send PDF image to Gemini API for OCR");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return placeholder OCR text
      return "This is placeholder OCR text that would be extracted from your PDF using the Gemini API.";
    } catch (error) {
      console.error("Gemini OCR error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw {
        message: `Error extracting text from PDF: ${errorMessage}`,
        code: 500
      };
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService();
export default geminiService;
