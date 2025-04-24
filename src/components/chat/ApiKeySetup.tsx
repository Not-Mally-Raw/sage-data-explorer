
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Key, Info } from "lucide-react";
import geminiService from "@/services/geminiService";

interface ApiKeySetupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onApiKeySet?: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  isOpen, 
  setIsOpen,
  onApiKeySet
}) => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Gemini API key",
        variant: "destructive",
      });
      return;
    }

    // Save API key in the service
    geminiService.setApiKey(apiKey.trim());
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved for this session.",
    });

    // Call callback if provided
    if (onApiKeySet) {
      onApiKeySet();
    }
    
    // Close the dialog
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Gemini API Setup
            </DialogTitle>
            <DialogDescription>
              Enter your Gemini API key to enable AI-powered features like
              financial analysis and OCR processing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key here"
                className="w-full"
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and is never sent to our servers.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">How to get a Gemini API key:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Navigate to "API keys" in your account</li>
                    <li>Create a new API key and copy it here</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save API Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetup;
