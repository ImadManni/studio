'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { FileText, Loader, ServerCrash } from 'lucide-react';
import type { Candidate, Alert } from '@/lib/types';
import { generateComprehensiveReport } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface ReportDialogProps {
  candidate: Candidate;
  alerts: Alert[];
}

export function ReportDialog({ candidate, alerts }: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    const mockBehavioralStats = {
      gazeDeviationPercentage: Math.random() * 100,
      talkTimeSeconds: Math.random() * 60,
      headMovementFrequency: Math.random(),
    };

    const result = await generateComprehensiveReport(candidate, alerts, mockBehavioralStats);
    
    if (result.success && result.data) {
      setReport(result.data.report);
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: result.error,
      });
    }

    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setReport(null);
      setError(null);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Comprehensive Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Generated Report for {candidate.name}</DialogTitle>
          <DialogDescription>
            This is an automated integrity report. Please review carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!report && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 h-64">
              <p>Generate a comprehensive report based on the collected proctoring data.</p>
              <Button onClick={handleGenerateReport}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Now
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 h-64">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing data and generating report...</p>
            </div>
          )}
          {error && (
             <div className="flex flex-col items-center justify-center text-center space-y-4 h-64 text-destructive">
                <ServerCrash className="h-12 w-12" />
                <p className="font-semibold">Error Generating Report</p>
                <p className="text-sm">{error}</p>
                <Button onClick={handleGenerateReport} variant="destructive">
                  Try Again
                </Button>
            </div>
          )}
          {report && (
            <ScrollArea className="h-[50vh] pr-6">
              <div className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-4 rounded-md border">
                {report}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
