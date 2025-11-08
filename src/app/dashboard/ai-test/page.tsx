'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle } from 'lucide-react';

// Simple Gemini logo component with verified symbol
const GeminiLogo = () => (
  <div className="relative">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
      <span className="text-white font-bold text-xs">G</span>
    </div>
    <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
  </div>
);

export default function AITestPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context: {
            userType: 'admin',
            currentPath: '/dashboard/ai-test',
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse('Failed to connect to AI assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GeminiLogo />
            <CardTitle>Gemini AI Assistant Test</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="query" className="text-sm font-medium">
              Ask a question about the AI Proctor platform:
            </label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How do I view candidate information? What reports are available? How do I export exam data?"
              className="min-h-[120px]"
            />
          </div>
          
          <Button onClick={handleAsk} disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                Ask AI Assistant
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          {response && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">AI Assistant Response:</h3>
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}