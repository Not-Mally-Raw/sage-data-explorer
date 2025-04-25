
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await geminiService.processQuery(
        userMessage.content,
        { messages: messages }
      );
      
      const botResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        content: response.text,
        confidence: response.confidence,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      console.error("Error processing query:", error);
      toast({
        title: "Error processing query",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                    <p className="text-sm">{msg.content}</p>
                    {msg.confidence !== undefined && (
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

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Ask a question about your data..."
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
