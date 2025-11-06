"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { candidates, getCandidateById, getAlertsByCandidateId, getExamById } from '@/lib/data';
import { generateExamReport } from '@/lib/report-generator';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';

export default function StudentExport() {
  const [selected, setSelected] = useState<string | null>(candidates[0]?.id ?? null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!selected) return;
    setIsProcessing(true);
    try {
      const candidate = getCandidateById(selected);
      if (!candidate) throw new Error('Candidate not found');
      const alerts = getAlertsByCandidateId(selected);
      const exam = getExamById(candidate.examId) ?? { id: candidate.examId, title: 'Unknown Exam', date: '', description: '' };

      // Build an ExamReport approximate object
      const report = {
        id: `RPT-${candidate.id}-${Date.now()}`,
        examId: exam.id,
        examTitle: exam.title,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        score: Math.floor(Math.random() * 100),
        maxScore: 100,
        passingScore: 60,
        status: 'completed',
        suspiciousActivities: alerts.map(a => ({ type: a.type as any, timestamp: a.timestamp, confidence: 0.8, details: a.description })),
        videoRecorded: true,
        screenshots: alerts.map(a => a.screenshotDataUri).filter(Boolean) as string[],
        ipAddress: 'N/A',
        deviceInfo: { browser: 'Unknown', os: 'Unknown', screenResolution: 'Unknown', userAgent: 'Unknown' },
        examDuration: 120,
        timeSpent: 90,
        answers: [],
      } as any;

      const doc = await generateExamReport(report);
      const filename = `${candidate.name.replace(/[^a-z0-9]/gi, '_')}_report.pdf`;
      (doc as any).save(filename);
      toast({ title: 'Exported', description: `${filename} downloaded` });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Export failed', description: (err as Error).message || 'Could not generate report' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Select Candidate</label>
        <Select onValueChange={(v) => setSelected(v)} defaultValue={selected ?? undefined}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Choose a candidate" />
          </SelectTrigger>
          <SelectContent>
            {candidates.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleExportPDF} disabled={!selected || isProcessing}>Export Student PDF</Button>
      </div>
    </div>
  );
}
