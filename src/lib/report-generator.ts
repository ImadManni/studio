import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ProctoringEvent {
  type: 'face_not_visible' | 'multiple_faces' | 'tab_switch' | 'mobile_phone' | 'voice_detected' | 'unknown_person';
  timestamp: string;
  confidence?: number;
  screenshot?: string;
  details?: string;
}

export interface ExamReport {
  id: string;
  examId: string;
  examTitle: string;
  candidateName: string;
  candidateEmail: string;
  startTime: string;
  endTime: string;
  score: number;
  maxScore: number;
  passingScore: number;
  status: 'completed' | 'in_progress' | 'flagged' | 'cheating_suspected' | 'passed' | 'failed';
  suspiciousActivities: ProctoringEvent[];
  videoRecorded: boolean;
  screenshots: string[];
  ipAddress?: string;
  deviceInfo?: {
    browser: string;
    os: string;
    screenResolution: string;
    userAgent: string;
  };
  examDuration: number; // in minutes
  timeSpent: number; // in minutes
  answers: {
    question: string;
    correctAnswer: string;
    candidateAnswer: string;
    isCorrect: boolean;
    points: number;
  }[];
}

const formatDate = (dateString: string | Date, includeTime = true): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  return new Date(dateString).toLocaleString(undefined, options);
};

const getEventTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'face_not_visible': 'Face Not Visible',
    'multiple_faces': 'Multiple Faces Detected',
    'tab_switch': 'Tab Switch Detected',
    'mobile_phone': 'Mobile Phone Detected',
    'voice_detected': 'Voice Detected',
    'unknown_person': 'Unknown Person Detected',
  };
  return labels[type] || type.replace(/_/g, ' ');
};

const addHeader = (doc: jsPDF, title: string, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text(title, margin, yPos);
  
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  return yPos + 5;
};

const addSectionHeader = (doc: jsPDF, title: string, yPos: number): number => {
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  // Use a default font name supported by jsPDF
  doc.setFont('helvetica', 'bold');
  doc.text(title, 15, yPos);
  return yPos + 8;
};

const addKeyValuePair = (doc: jsPDF, key: string, value: string | number, x: number, y: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${key}:`, x, y);
  const textWidth = doc.getTextWidth(`${key}: `);
  
  doc.setFont('helvetica', 'normal');
  doc.text(String(value), x + textWidth, y);
  
  return y + 7;
};

export const generateExamReport = async (report: ExamReport): Promise<jsPDF> => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Add main header
  yPos = addHeader(doc, 'Exam Proctoring Report', yPos);

  // Exam and Candidate Info
  yPos = addSectionHeader(doc, 'Exam Information', yPos);
  yPos = addKeyValuePair(doc, 'Title', report.examTitle, margin, yPos);
  yPos = addKeyValuePair(doc, 'Exam ID', report.examId, margin, yPos);
  yPos = addKeyValuePair(doc, 'Status', 
    report.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), 
    margin, yPos
  );
  
  yPos += 5;
  yPos = addSectionHeader(doc, 'Candidate Information', yPos);
  yPos = addKeyValuePair(doc, 'Name', report.candidateName, margin, yPos);
  yPos = addKeyValuePair(doc, 'Email', report.candidateEmail, margin, yPos);
  yPos = addKeyValuePair(doc, 'Start Time', formatDate(report.startTime), margin, yPos);
  yPos = addKeyValuePair(doc, 'End Time', formatDate(report.endTime), margin, yPos);
  yPos = addKeyValuePair(doc, 'Duration', `${report.timeSpent} minutes`, margin, yPos);
  yPos = addKeyValuePair(doc, 'IP Address', report.ipAddress || 'N/A', margin, yPos);

  // Device Information
  if (report.deviceInfo) {
    yPos += 5;
    yPos = addSectionHeader(doc, 'Device Information', yPos);
    yPos = addKeyValuePair(doc, 'Browser', report.deviceInfo.browser, margin, yPos);
    yPos = addKeyValuePair(doc, 'Operating System', report.deviceInfo.os, margin, yPos);
    yPos = addKeyValuePair(doc, 'Screen Resolution', report.deviceInfo.screenResolution, margin, yPos);
  }

  // Score Summary
  yPos += 10;
  yPos = addSectionHeader(doc, 'Exam Summary', yPos);
  
  const passed = report.score >= report.passingScore;
  const summaryData = [
    ['Score', `${report.score} / ${report.maxScore} (${(report.score / report.maxScore * 100).toFixed(1)}%)`],
    ['Passing Score', `${report.passingScore} (${(report.passingScore / report.maxScore * 100).toFixed(1)}%)`],
    ['Result', passed ? 'PASSED' : 'FAILED'],
    ['Time Spent', `${report.timeSpent} / ${report.examDuration} minutes`],
    ['Video Recorded', report.videoRecorded ? 'Yes' : 'No'],
  ];
  
  autoTable(doc as any, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: summaryData,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { 
      fillColor: [59, 130, 246], 
      textColor: 255, 
      fontStyle: 'bold',
      cellPadding: 5
    },
    bodyStyles: { cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Suspicious Activities
  if (report.suspiciousActivities.length > 0) {
    yPos = addSectionHeader(doc, 'Suspicious Activities Detected', yPos);
    
    const activitiesData = report.suspiciousActivities.map(activity => ({
      type: getEventTypeLabel(activity.type),
      timestamp: formatDate(activity.timestamp, true),
      confidence: activity.confidence ? `${Math.round(activity.confidence * 100)}%` : 'N/A',
      details: activity.details || 'No additional details'
    }));

    // Check if we need a new page
    if (yPos + activitiesData.length * 20 > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = 20;
      yPos = addSectionHeader(doc, 'Suspicious Activities (Continued)', yPos);
    }
    
    autoTable(doc as any, {
      startY: yPos,
      head: [['Activity Type', 'Timestamp', 'Confidence', 'Details']],
      body: activitiesData.map(a => [a.type, a.timestamp, a.confidence, a.details]),
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: { 
        fillColor: [220, 38, 38], 
        textColor: 255, 
        fontStyle: 'bold',
        cellPadding: 5
      },
      bodyStyles: { cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 'auto' }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Exam Answers Summary (if available)
  if (report.answers && report.answers.length > 0) {
    if (yPos > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos = addSectionHeader(doc, 'Exam Answers Summary', yPos);
    
    const correctCount = report.answers.filter(a => a.isCorrect).length;
    const incorrectCount = report.answers.length - correctCount;
    const scorePercentage = (report.score / report.maxScore * 100).toFixed(1);
    
    // Add a small summary chart
    doc.setFillColor(220, 237, 200);
    doc.rect(margin, yPos, 20, 20, 'F');
    doc.setFillColor(255, 0, 0, 0.1);
    doc.rect(margin + 25, yPos, 20, 20, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Correct: ${correctCount}`, margin + 45, yPos + 8);
    doc.text(`Incorrect: ${incorrectCount}`, margin + 45, yPos + 16);
    doc.text(`Score: ${scorePercentage}%`, margin + 45, yPos + 24);
    
    yPos += 30;
    
    // Add a table with question results
    const answersData = report.answers.map((answer, index) => [
      `Q${index + 1}`,
      answer.question.length > 50 ? answer.question.substring(0, 47) + '...' : answer.question,
      answer.isCorrect ? '✓' : '✗',
      `${answer.points} pts`
    ]);
    
    autoTable(doc as any, {
      startY: yPos,
      head: [['#', 'Question', 'Result', 'Points']],
      body: answersData,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: { 
        fillColor: [59, 130, 246], 
        textColor: 255, 
        fontStyle: 'bold',
        cellPadding: 5
      },
      bodyStyles: { cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 25 }
      },
      didDrawCell: (data: any) => {
        if (data.column.index === 2) { // Result column
          if (data.cell.raw === '✓') {
            doc.setTextColor(0, 128, 0); // Green for correct
          } else {
            doc.setTextColor(220, 38, 38); // Red for incorrect
          }
        } else {
          doc.setTextColor(0, 0, 0); // Black for other cells
        }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  const footerText = 'Generated by AI Proctoring System';
  const pageCount = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      footerText, 
      margin, 
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Page ${i} of ${pageCount} • ${formatDate(new Date())}`, 
      doc.internal.pageSize.getWidth() - margin, 
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
    doc.text(
      `Report ID: ${report.id}`, 
      doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
};

// Helper function to generate a sample report (for testing)
export const generateSampleReport = (): ExamReport => {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 90 * 60 * 1000); // 90 minutes later
  
  return {
    id: `RPT-${Date.now()}`,
    examId: 'EXAM-123',
    examTitle: 'Advanced JavaScript Certification',
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@example.com',
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    score: 78,
    maxScore: 100,
    passingScore: 70,
    status: 'completed',
    suspiciousActivities: [
      { 
        type: 'face_not_visible', 
        timestamp: new Date(startTime.getTime() + 15 * 60 * 1000).toISOString(),
        confidence: 0.92,
        details: 'Face not visible for 12 seconds'
      },
      { 
        type: 'tab_switch', 
        timestamp: new Date(startTime.getTime() + 42 * 60 * 1000).toISOString(),
        confidence: 0.95,
        details: 'Switched to another tab for 8 seconds'
      },
      { 
        type: 'multiple_faces', 
        timestamp: new Date(startTime.getTime() + 65 * 60 * 1000).toISOString(),
        confidence: 0.87,
        details: 'Multiple faces detected (2)'
      },
    ],
    videoRecorded: true,
    screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
    ipAddress: '192.168.1.100',
    deviceInfo: {
      browser: 'Chrome 98',
      os: 'Windows 10',
      screenResolution: '1920x1080',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
    },
    examDuration: 120, // 2 hours
    timeSpent: 87, // 1 hour 27 minutes
    answers: Array.from({ length: 20 }, (_, i) => ({
      question: `What is the output of the following code? ${'const x = ' + (i + 1) + '; console.log(x * 2);'}`,
      correctAnswer: String((i + 1) * 2),
      candidateAnswer: String(Math.random() > 0.3 ? (i + 1) * 2 : (i + 1) * 3), // 70% chance of correct answer
      isCorrect: Math.random() > 0.3,
      points: 1
    }))
  };
};
