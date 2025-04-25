import React, { useState, useRef, useEffect } from "react";
import { Send, Minimize2, Maximize2, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ApiKeySetup from "./ApiKeySetup";
import geminiService from "@/services/geminiService";

type MessageType = {
  id: string;
  content: string;
  role: "user" | "assistant";
  confidence?: number;
  timestamp: Date;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
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
        role: "assistant",
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

  const toggleChat = () => {
    if (isMinimized) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button 
          onClick={toggleChat}
          className="bg-finance-accent hover:bg-finance-accent/90 shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        }`}
      >
        <Card className={`w-[350px] sm:w-[400px] shadow-lg border-finance-primary/20 ${
          isMinimized ? "h-16" : "h-[500px]"
        } flex flex-col`}>
          {/* Header */}
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-finance-primary to-finance-accent text-white">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="text-base font-semibold">Financial Assistant</h3>
            </div>
            <div className="flex gap-2">
              {!isMinimized && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setShowApiKeyModal(true)}
                    aria-label="API key settings"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M13 7h-2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                      <path d="M16 7v3a5 5 0 0 0-10 0v-3"></path>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => {
                      setMessages([]);
                      toast({
                        title: "Chat history cleared",
                        description: "All chat messages have been removed.",
                      });
                    }}
                    aria-label="Clear chat history"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={toggleChat}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
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
                        className={`rounded-lg px-4 py-2 max-w-[80%] animate-fade-in ${
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
                    <div className="rounded-lg px-4 py-2 bg-gray-100 rounded-tl-none animate-pulse flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <CardFooter className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Ask a question about your data..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                    aria-label="Chat message"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isLoading || !message.trim()}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      </div>

      {/* API Key Setup Modal */}
      <ApiKeySetup 
        isOpen={showApiKeyModal}
        setIsOpen={setShowApiKeyModal}
        onApiKeySet={() => {
          toast({
            title: "API Key Set Successfully",
            description: "You can now use the AI-powered chat features.",
          });
        }}
      />
    </div>
  );
};

export default ChatBot;
