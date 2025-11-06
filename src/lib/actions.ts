'use server';

import { analyzeAudioForSuspiciousKeywords as analyzeAudio } from '@/ai/flows/analyze-audio-suspicious-keywords';
import { generateComprehensiveReport as generateReport } from '@/ai/flows/generate-comprehensive-report';
import type { Alert, Candidate } from './types';

export async function analyzeAudioForSuspiciousKeywords(audioDataUri: string) {
  try {
    const result = await analyzeAudio({ audioDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return {
      success: false,
      error: 'Failed to analyze audio. Please try again.',
    };
  }
}

export async function generateComprehensiveReport(
  candidate: Candidate,
  alerts: Alert[],
  behavioralStatistics: Record<string, any>
) {
  try {
    const reportInput = {
      candidateId: candidate.id,
      examId: candidate.examId,
      suspicionScore: candidate.suspicionScore,
      alerts: alerts.map(alert => ({
        timestamp: alert.timestamp,
        description: alert.description,
        screenshotDataUri: alert.screenshotDataUri || 'data:image/png;base64,', // Provide a default empty data URI if none
      })),
      behavioralStatistics,
    };

    const result = await generateReport(reportInput);
    return { success: true, data: result };
  } catch (error) {
    // Log full error server-side for diagnostics
    console.error('Error generating report:', error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? error.stack : undefined;
    return {
      success: false,
      // Return the error message so the client UI can display it during development.
      // In production consider returning a safer, user-friendly message instead.
      error: message || 'Failed to generate report. Please try again.',
      details: process.env.NODE_ENV === 'development' ? stack : undefined,
    } as any;
  }
}
