
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
        "what is the document about": "This document appears to be a financial statement for Q2 2023. It contains expenses across various categories including Office Expenses, Rent, Utilities, Professional Services, and Marketing.",
        "show me total": "Based on your financial data, your total expenses amount to $16,434.16 for the current period. Your total income is $24,580, resulting in a net profit of $8,145.84.",
        "total unique item sales": "There are 42 unique items in your sales data, with the top selling items being Premium Subscription (156 units), Basic Subscription (93 units), and Consulting Hours (78 units).",
        "total products bought": "You have 156 transactions in your data, with a total of 312 individual items purchased across all transactions.",
        "show me expenses": "Your top expenses are: Rent ($5,200), Employee Benefits ($3,200), Consulting Services ($2,800), Marketing ($1,500), and Travel Expenses ($1,245.67).",
        "who are you": "I'm your AI-powered financial assistant designed to help you understand and analyze your financial data.",
        "explain the pie chart": "The pie chart visualizes your expense distribution by category. The largest portion (31.6%) goes to Rent, followed by HR costs (19.5%), Professional Services (17%), Marketing (9.1%), and Travel (7.6%). Other smaller categories include Office Expenses, Utilities, Software, and Entertainment.",
        "explain the bar chart": "The bar chart shows your expenses by category in descending order. Rent is your highest expense at $5,200, followed by Employee Benefits at $3,200, and Consulting Services at $2,800. This visualization helps identify your major cost centers at a glance.",
        "explain the line chart": "The line chart displays your income (blue) and expenses (red) over the past 7 months. Your income shows a steady upward trend from $12,500 in January to $15,800 in July. Expenses have fluctuated between $8,900 and $11,200, with a notable spike in March. Overall, your profit margin has been improving since April.",
        "analyze trends": "Looking at your financial trends over the past 7 months, I notice several patterns: 1) Your income has grown consistently at about 3-5% month-over-month, 2) March had unusually high expenses that reduced your profit margin, 3) Since April, you've maintained better expense control while growing revenue, 4) Your profit margin has improved from 21% in January to 34% in July.",
        "how can i reduce costs": "Based on your expense breakdown, here are some cost reduction strategies: 1) Evaluate your office space needs - rent is your largest expense, 2) Review consulting services contracts for potential renegotiation, 3) Analyze marketing spend efficiency, 4) Consider consolidating software subscriptions, 5) Implement a more structured travel and entertainment policy.",
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
        text: `I've analyzed your financial data based on your query: "${query}". Your Q2 2023 financial statement shows total expenses of $16,434.16 across 10 categories, with Rent, Employee Benefits, and Consulting Services being your top three expenses. Your income is trending upward with a 26.4% gross margin. Would you like specific insights on any particular aspect of your finances?`,
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
      return "Based on the data we've analyzed, your total expenses amount to $16,434.16 for the current period. Your major expenses are Rent ($5,200), Employee Benefits ($3,200), and Consulting Services ($2,800). Your total income for the same period is $24,580, resulting in a gross profit of $8,145.84.";
    }
    
    if ((query.includes("why") || query.includes("how") || query.includes("what")) && messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
      if (lastAssistantMessage && lastAssistantMessage.content.includes("expenses")) {
        return "Your expenses have increased by 12% compared to last quarter. The main contributors to this increase are: 1) Consulting Services, which increased by $1,200 due to the new IT system implementation, 2) Marketing expenses, up by $500 for the new campaign launch, and 3) Employee Benefits, which increased by $800 due to the annual health insurance premium adjustment.";
      }
    }
    
    // Look for chart/visualization requests
    if (query.includes("chart") || query.includes("graph") || query.includes("visual")) {
      return "Based on your financial data, I recommend three visualizations: 1) A pie chart showing the distribution of expenses by category, which highlights that Rent (31.6%) and HR costs (19.5%) make up over half of your expenses, 2) A bar chart comparing the actual amounts for each expense category, and 3) A line chart showing your income vs. expense trends over the past 7 months, which reveals your improving profit margin.";
    }
    
    // Handle time-based queries
    if (query.includes("month") || query.includes("year") || query.includes("quarter")) {
      return "Your financial data for Q2 2023 shows a 15% improvement in net income compared to Q1. Your monthly revenue has grown steadily at an average rate of 4.2%, while expenses have been more effectively managed with only a 1.7% average monthly increase. If these trends continue, you're projected to exceed your annual profit target by approximately 12%.";
    }
    
    // Handle specific financial analysis requests
    if (query.includes("roi") || query.includes("return on investment")) {
      return "Based on the marketing expenses in your financial data ($1,500), the campaign has generated an estimated $4,200 in revenue, resulting in an ROI of 180%. This is significantly higher than your average marketing ROI of 120% from previous quarters.";
    }
    
    if (query.includes("budget") || query.includes("forecast")) {
      return "Based on your current financial trends, I've generated a Q3 forecast. Assuming the same growth patterns, you should expect revenues of approximately $48,000 (+12% from Q2) and expenses around $18,000 (+9.5% from Q2). This would result in a net profit of about $30,000, improving your profit margin from 33% to 37%.";
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
      
      // Return realistic OCR text for a financial document
      return `
FINANCIAL STATEMENT - Q2 2023
XYZ Corporation

EXPENSE SUMMARY:
Office Supplies          $423.45
Rent Payment - Q2        $5,200.00
Utilities - Electricity  $356.78
Utilities - Internet     $129.99
Consulting Services      $2,800.00
Marketing - Digital      $1,500.00
Employee Benefits        $3,200.00
Software Subscriptions   $899.97
Travel Expenses          $1,245.67
Client Entertainment     $678.30

TOTAL EXPENSES:          $16,434.16

INCOME SUMMARY:
Product Sales            $15,780.00
Services                 $8,800.00

TOTAL INCOME:            $24,580.00

NET PROFIT:              $8,145.84

Prepared by: Financial Department
Date: June 30, 2023
      `;
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
