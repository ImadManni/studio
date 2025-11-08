'use client';

import { candidates } from '@/lib/data';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { CandidateStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Download, CheckCircle } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { useState, useRef, useEffect } from 'react';

const statusColors: Record<CandidateStatus, string> = {
  Clear: 'bg-green-500/20 text-green-400 border-green-500/30',
  Warn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Alert: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Simple Gemini logo component with verified symbol
const GeminiLogo = () => (
  <div className="relative">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
      <span className="text-white font-bold text-xs">G</span>
    </div>
    <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
  </div>
);

export default function DashboardPage() {
  const [showAssistant, setShowAssistant] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by Gemini. How can I help you with dashboard navigation, candidates, exams, or reports?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the AI assistant API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          context: {
            userType: 'admin',
            currentPath: '/dashboard',
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: `Sorry, I encountered an error: ${data.error}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error connecting to the AI service. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Candidates Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm"><Link href="/dashboard/export"><Download className="h-4 w-4 mr-2"/>Export</Link></Button>
              <Button asChild size="sm"><Link href="/dashboard/exams/new"><Plus className="h-4 w-4 mr-2"/>New Exam</Link></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FadeIn>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Suspicion Score</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person portrait" />
                        <AvatarFallback>
                          {candidate.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground">{candidate.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("whitespace-nowrap", statusColors[candidate.status])}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.suspicionScore}%</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/candidate/${candidate.id}`}>
                              View
                              <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          </FadeIn>
        </CardContent>
      </Card>
      
      {/* Chat Icon Button with Gemini Logo */}
      <Button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        size="icon"
      >
        <GeminiLogo />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
      
      {/* AI Assistant Modal */}
      {showAssistant && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAssistant(false)}></div>
          <div className="relative w-full max-w-md h-[500px] bg-background border rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <GeminiLogo />
                <h3 className="font-semibold">Gemini AI Assistant</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAssistant(false)}>
                Close
              </Button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about dashboard, candidates, exams, reports..."
                  className="flex-1 min-h-[40px] px-3 py-2 border rounded-md text-sm"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Powered by Gemini AI
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}