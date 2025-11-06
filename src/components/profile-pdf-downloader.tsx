'use client';

import React from 'react';
import { Button } from './ui/button';
import { generateExamReport } from '@/lib/report-generator';

export default function ProfilePdfDownloader({ user }: { user: any }) {
  const handleDownloadProfile = async () => {
    // Build a small report object using the user's info
    const sampleReport = {
      id: `PROFILE-${Date.now()}`,
      examId: 'PROFILE-EXPORT',
      examTitle: 'Account Summary',
      candidateName: user?.name ?? 'User',
      candidateEmail: user?.email ?? 'user@example.com',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      score: 0,
      maxScore: 0,
      passingScore: 0,
      status: 'completed',
      suspiciousActivities: [],
      videoRecorded: false,
      screenshots: [],
      examDuration: 0,
      timeSpent: 0,
      answers: [],
    } as any;

    const doc = await generateExamReport(sampleReport);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob as any);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sampleReport.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleDownloadProfile}>Download Profile PDF</Button>;
}
