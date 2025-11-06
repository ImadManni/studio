'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
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
      // Show extra details when available (useful during development)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setErrorDetails(result.details ?? null);
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: result.error,
      });
    }

    setIsLoading(false);
  };

  const downloadAsPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(report, 180);
    doc.setFontSize(11);
    doc.text(lines, 10, 10);
    doc.save(`${candidate.name.replace(/[^a-z0-9]/gi, '_')}_report.pdf`);
  };

  const downloadAsCSV = () => {
    if (!report) return;
    // Very simple CSV: single column 'report'
    const csvContent = `report\n"""${report.replace(/"/g, '""')}"""`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name.replace(/[^a-z0-9]/gi, '_')}_report.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const uploadReport = async (format: 'pdf' | 'csv') => {
    if (!report) return;
    try {
      toast({ title: 'Preparing upload', description: `Converting report to ${format.toUpperCase()}...` });

      let dataUrl: string;
      let filename: string;

      if (format === 'pdf') {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(report, 180);
        doc.setFontSize(11);
        doc.text(lines, 10, 10);
        const blob = doc.output('blob');
        const buffer = await blob.arrayBuffer();
        const b64 = Buffer.from(buffer).toString('base64');
        dataUrl = `data:application/pdf;base64,${b64}`;
        filename = `${candidate.name.replace(/[^a-z0-9]/gi, '_')}_report.pdf`;
      } else {
        const csvContent = `report\n"""${report.replace(/"/g, '""')}"""`;
        const b64 = btoa(unescape(encodeURIComponent(csvContent)));
        dataUrl = `data:text/csv;base64,${b64}`;
        filename = `${candidate.name.replace(/[^a-z0-9]/gi, '_')}_report.csv`;
      }

      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: filename, dataUri: dataUrl }),
      });

      if (res.ok) {
        const json = await res.json();
        toast({ title: 'Upload successful', description: json.path ?? 'Uploaded' });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ variant: 'destructive', title: 'Upload failed', description: err.error || 'Server rejected upload' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Upload error', description: 'Could not upload file.' });
    }
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
                {errorDetails && (
                  <details className="text-xs text-muted-foreground text-left max-w-lg mx-auto mt-2 p-2 bg-muted/10 rounded">
                    <summary className="cursor-pointer">Details</summary>
                    <pre className="whitespace-pre-wrap">{errorDetails}</pre>
                  </details>
                )}
                <Button onClick={handleGenerateReport} variant="destructive">
                  Try Again
                </Button>
            </div>
          )}
          {report && (
            <>
              <ScrollArea className="h-[50vh] pr-6">
                <div className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-4 rounded-md border">
                  {report}
                </div>
              </ScrollArea>
              <div className="flex items-center gap-2 mt-3">
                <Button onClick={downloadAsPDF}>Download PDF</Button>
                <Button onClick={downloadAsCSV}>Download CSV</Button>
                <Button onClick={() => uploadReport('pdf')}>Upload PDF</Button>
                <Button onClick={() => uploadReport('csv')}>Upload CSV</Button>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
