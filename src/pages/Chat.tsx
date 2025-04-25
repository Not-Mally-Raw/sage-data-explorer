
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageCircle, ChartBarIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import geminiService from "@/services/geminiService";

type MessageType = {
  id: string;
  content: string;
  role: "user" | "assistant";
  confidence?: number;
  timestamp: Date;
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: MessageType = {
        id: "welcome",
        content: "Hello! I'm your financial assistant. I can help analyze your data, explain visualizations, or answer questions about your finances. What would you like to know?",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    // Prevent form submission
    if (e) e.preventDefault();
    
    // Don't process empty messages
    if (!message.trim()) return;

    // Create user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: message.trim(),
      role: "user",
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setMessage("");
    
    // Set loading state
    setIsLoading(true);

    // Check if API key is set
    if (!geminiService.hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the Settings page to use the chat feature.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Process the query with conversation history
      const conversationHistory = messages
        .filter(msg => msg.id !== "welcome") // Skip welcome message for history
        .map(msg => ({
          content: msg.content,
          role: msg.role
        }));
      
      const response = await geminiService.processQuery(
        userMessage.content,
        { messages: conversationHistory }
      );
      
      // Create bot response
      const botResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        content: response.text || "I'm sorry, I couldn't process your request.",
        role: "assistant", 
        confidence: response.confidence ?? 0.75,
        timestamp: new Date(),
      };
      
      // Add bot response to chat
      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      console.error("Error processing query:", error);
      
      // Add error message to chat
      const errorResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorResponse]);
      
      // Show error toast
      toast({
        title: "Error processing query",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Example questions the user can ask
  const exampleQuestions = [
    "Explain the pie chart",
    "Show me total expenses",
    "Analyze spending trends",
    "What is this document about?"
  ];

  const handleExampleClick = (question: string) => {
    setMessage(question);
  };

  return (
    <AppLayout activePath="/chat">
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-finance-primary">Chat Assistant</h1>
            <p className="text-finance-secondary mt-1">
              Ask questions about your financial data
            </p>
          </div>
        </div>

        <Card className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
                <MessageCircle className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-sm mb-2">Ask me about your financial data</p>
                <p className="text-xs">Try "What is the total amount?" or "Show me top expenses"</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.role === "user" 
                        ? "bg-finance-primary text-white rounded-tr-none" 
                        : "bg-gray-100 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.confidence !== undefined && msg.confidence > 0 && (
                      <p className="text-xs mt-1 opacity-70">
                        Confidence: {msg.confidence.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-100 rounded-tl-none flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Example Questions */}
          <div className="p-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleExampleClick(question)}
                  className="px-2 py-1 bg-gray-100 text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Ask about your financial data..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Chat;
