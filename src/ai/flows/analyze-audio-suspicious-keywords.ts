'use server';

/**
 * @fileOverview Detects suspicious keywords or multiple voices in audio recordings.
 *
 * - analyzeAudioForSuspiciousKeywords - Analyzes audio for suspicious activity.
 * - AnalyzeAudioInput - The input type for analyzeAudioForSuspiciousKeywords.
 * - AnalyzeAudioOutput - The return type for analyzeAudioForSuspiciousKeywords.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeAudioInput = z.infer<typeof AnalyzeAudioInputSchema>;

const AnalyzeAudioOutputSchema = z.object({
  isSuspicious: z.boolean().describe('Whether suspicious keywords/voices are detected.'),
  suspiciousKeywords: z.array(z.string()).describe('List of suspicious keywords detected.'),
  multipleVoicesDetected: z.boolean().describe('Whether multiple voices are detected.'),
  analysisDetails: z.string().describe('Detailed analysis of the audio, if any.'),
});
export type AnalyzeAudioOutput = z.infer<typeof AnalyzeAudioOutputSchema>;

export async function analyzeAudioForSuspiciousKeywords(
  input: AnalyzeAudioInput
): Promise<AnalyzeAudioOutput> {
  return analyzeAudioFlow(input);
}

const analyzeAudioPrompt = ai.definePrompt({
  name: 'analyzeAudioPrompt',
  input: {schema: AnalyzeAudioInputSchema},
  output: {schema: AnalyzeAudioOutputSchema},
  prompt: `You are an AI proctor analyzing audio for suspicious activity during an exam.

  Analyze the provided audio recording and determine if there are any suspicious keywords or multiple voices present.

  Audio Recording: {{media url=audioDataUri}}

  Output your analysis in JSON format:
  {
    "isSuspicious": true/false, // true if suspicious activity is detected, false otherwise
    "suspiciousKeywords": ["keyword1", "keyword2"], // list of suspicious keywords detected, empty array if none
    "multipleVoicesDetected": true/false, // true if multiple voices are detected, false otherwise
    "analysisDetails": "Detailed explanation of the analysis." // any additional details regarding the analysis
  }`,
});

const analyzeAudioFlow = ai.defineFlow(
  {
    name: 'analyzeAudioFlow',
    inputSchema: AnalyzeAudioInputSchema,
    outputSchema: AnalyzeAudioOutputSchema,
  },
  async input => {
    const {output} = await analyzeAudioPrompt(input);
    return output!;
  }
);
