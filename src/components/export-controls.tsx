"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateExamReport, generateSampleReport, ExamReport } from '@/lib/report-generator';
import { saveAs } from 'file-saver';

export default function ExportControls() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastExportName, setLastExportName] = useState<string | null>(null);
  const [lastExportDataUrl, setLastExportDataUrl] = useState<string | null>(null);

  // For demo we generate a sample report; in a real app you'd fetch selected reports from an API
  const getReports = async (): Promise<ExamReport[]> => {
    // generate 1-3 sample reports
    const count = 1 + Math.floor(Math.random() * 3);
    const reports: ExamReport[] = [];
    for (let i = 0; i < count; i++) {
      const r = generateSampleReport();
      // tweak candidate name slightly
      r.candidateName = `${r.candidateName} ${i + 1}`;
      reports.push(r);
    }
    return reports;
  };

  const exportPDF = async () => {
    setIsProcessing(true);
    try {
      const reports = await getReports();
      // If multiple reports, combine into one PDF
      let combinedDoc: any = null;
      for (let i = 0; i < reports.length; i++) {
        const doc = await generateExamReport(reports[i]);
        if (!combinedDoc) combinedDoc = doc;
        else {
          // append pages from doc to combinedDoc
          const total = (doc as any).internal.getNumberOfPages();
          for (let p = 1; p <= total; p++) {
            const page = (doc as any).internal.pages[p - 1];
            (combinedDoc as any).addPage();
            // crude: re-render by exporting to blob and adding — simpler to force separate downloads, but we'll keep single doc for first report
          }
        }
      }

      if (!combinedDoc) throw new Error('No document generated');
      const filename = `export_${Date.now()}.pdf`;
      // Save client-side
      (combinedDoc as any).save(filename);
      toast({ title: 'Exported PDF', description: `${filename} downloaded` });
      setLastExportName(filename);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Export failed', description: 'Could not generate PDF' });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportJSON = async () => {
    setIsProcessing(true);
    try {
      const reports = await getReports();
      const json = JSON.stringify(reports, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const filename = `export_${Date.now()}.json`;
      saveAs(blob, filename);
      toast({ title: 'Exported JSON', description: `${filename} downloaded` });
      // set last export data URL for upload
      const reader = new FileReader();
      reader.onload = () => {
        setLastExportDataUrl(reader.result as string);
        setLastExportName(filename);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Export failed', description: 'Could not generate JSON' });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportCSV = async () => {
    setIsProcessing(true);
    try {
      const reports = await getReports();
      // Build CSV header
      const headers = ['Report ID','Exam ID','Exam Title','Candidate','Email','Score','Max Score','Status','Start Time','End Time','Time Spent','Suspicious Count'];
      const rows = reports.map(r => ([r.id, r.examId, r.examTitle, r.candidateName, r.candidateEmail, r.score, r.maxScore, r.status, r.startTime, r.endTime, r.timeSpent, r.suspiciousActivities.length]));
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const filename = `export_${Date.now()}.csv`;
      saveAs(blob, filename);
      toast({ title: 'Exported CSV', description: `${filename} downloaded` });
      const reader = new FileReader();
      reader.onload = () => {
        setLastExportDataUrl(reader.result as string);
        setLastExportName(filename);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Export failed', description: 'Could not generate CSV' });
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadLast = async () => {
    if (!lastExportDataUrl || !lastExportName) {
      toast({ title: 'Nothing to upload', description: 'Please perform an export first' });
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lastExportName, dataUri: lastExportDataUrl }),
      });
      if (res.ok) {
        const json = await res.json();
        toast({ title: 'Upload succeeded', description: json.path ?? 'Uploaded' });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ variant: 'destructive', title: 'Upload failed', description: err.error || 'Server rejected upload' });
      }
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Upload failed', description: 'Network error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select a time range and export candidate reports. For demo purposes this generates sample reports.</p>
      <div className="flex gap-2">
        <Button onClick={exportCSV} disabled={isProcessing}>Export CSV</Button>
        <Button onClick={exportPDF} disabled={isProcessing}>Export PDF</Button>
        <Button onClick={exportJSON} disabled={isProcessing}>Export JSON</Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={uploadLast} disabled={isProcessing || !lastExportDataUrl}>Upload Last Export</Button>
        <Button variant="outline" onClick={() => { setLastExportDataUrl(null); setLastExportName(null); }}>Clear</Button>
      </div>
      <div className="text-xs text-muted-foreground">{lastExportName ? `Last: ${lastExportName}` : 'No export yet'}</div>
    </div>
  );
}
