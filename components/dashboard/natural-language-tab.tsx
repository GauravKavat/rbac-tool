"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommandResult {
  success: boolean;
  message: string;
  action?: string;
}

export function NaturalLanguageTab() {
  const [command, setCommand] = useState("");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<CommandResult[]>([]);
  const { toast } = useToast();

  const processCommand = async () => {
    if (!command.trim()) {
      toast({
        title: "Error",
        description: "Please enter a command",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    
    try {
      // For demo purposes, we'll simulate AI processing with pattern matching
      // In a real implementation, you would call an AI API like Gemini
      const result = await simulateAIProcessing(command);
      
      setResults([result, ...results]);
      setCommand("");
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to process command",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const simulateAIProcessing = async (command: string): Promise<CommandResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerCommand = command.toLowerCase();

    // Pattern matching for demo purposes
    if (lowerCommand.includes("create") && lowerCommand.includes("permission")) {
      const permissionMatch = lowerCommand.match(/permission.*?['"]([^'"]+)['"]/) || 
                             lowerCommand.match(/permission\s+(\w+)/);
      if (permissionMatch) {
        return {
          success: true,
          message: `Would create permission: "${permissionMatch[1]}"`,
          action: "create_permission"
        };
      }
    }

    if (lowerCommand.includes("create") && lowerCommand.includes("role")) {
      const roleMatch = lowerCommand.match(/role.*?['"]([^'"]+)['"]/) || 
                       lowerCommand.match(/role\s+(\w+)/);
      if (roleMatch) {
        return {
          success: true,
          message: `Would create role: "${roleMatch[1]}"`,
          action: "create_role"
        };
      }
    }

    if (lowerCommand.includes("give") || lowerCommand.includes("assign")) {
      const roleMatch = lowerCommand.match(/role.*?['"]([^'"]+)['"]/) || 
                       lowerCommand.match(/['"]([^'"]+)['"].*role/);
      const permissionMatch = lowerCommand.match(/permission.*?['"]([^'"]+)['"]/) || 
                             lowerCommand.match(/to\s+['"]([^'"]+)['"]/) ||
                             lowerCommand.match(/['"]([^'"]+)['"].*permission/);
      
      if (roleMatch && permissionMatch) {
        return {
          success: true,
          message: `Would assign permission "${permissionMatch[1]}" to role "${roleMatch[1]}"`,
          action: "assign_permission"
        };
      }
    }

    if (lowerCommand.includes("remove") || lowerCommand.includes("revoke")) {
      return {
        success: true,
        message: "Would remove the specified permission from role",
        action: "remove_permission"
      };
    }

    return {
      success: false,
      message: "Sorry, I couldn't understand that command. Try something like 'Create a permission called edit_articles' or 'Give the role Admin the permission to delete_users'",
    };
  };

  const exampleCommands = [
    "Create a permission called 'edit_articles'",
    "Create a role called 'Moderator'",
    "Give the role 'Content Editor' the permission to 'edit_articles'",
    "Assign 'view_dashboard' permission to 'Support Agent' role",
    "Remove 'delete_users' permission from 'Editor' role"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Natural Language Configuration
        </h2>
        <p className="text-muted-foreground">
          Use plain English to configure your RBAC settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Command Input
          </CardTitle>
          <CardDescription>
            Type your command in natural language and I&apos;ll help you configure your RBAC settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Create a permission called 'edit_articles' or Give the role 'Admin' the permission to 'delete_users'"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            rows={3}
          />
          <Button onClick={processCommand} disabled={processing || !command.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {processing ? "Processing..." : "Process Command"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Commands</CardTitle>
          <CardDescription>Try these example commands to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exampleCommands.map((example, index) => (
              <div
                key={index}
                className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setCommand(example)}
              >
                <p className="text-sm">{example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Command History</CardTitle>
            <CardDescription>Recent commands and their results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Success" : "Error"}
                    </Badge>
                    {result.action && (
                      <Badge variant="secondary">{result.action}</Badge>
                    )}
                  </div>
                  <p className="text-sm">{result.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>💡 Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Use quotes around permission and role names for better accuracy</li>
            <li>• Be specific about what you want to create, assign, or remove</li>
            <li>• Try different phrasings if a command isn&apos;t understood</li>
            <li>• This is a demo - in production, this would integrate with a real AI API</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}