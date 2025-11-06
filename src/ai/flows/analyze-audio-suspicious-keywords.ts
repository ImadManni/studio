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
  isSuspicious: z.boolean().describe('Whether suspicious keywords or multiple voices are detected.'),
  suspiciousKeywords: z.array(z.string()).describe('List of suspicious keywords detected.'),
  multipleVoicesDetected: z.boolean().describe('Whether multiple distinct voices are detected.'),
  analysisDetails: z.string().describe('Detailed analysis of the audio, providing a summary of findings.'),
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
  prompt: `You are an AI proctor with expertise in audio analysis for online exams. Your task is to analyze an audio recording for any signs of cheating.

  Analyze the provided audio recording and determine if there are any suspicious keywords (e.g., "Hey Siri", "OK Google", "help me", "what's the answer") or if you can distinguish more than one unique voice.

  Your response must be in the specified JSON format with the following logic:
  - If you find any suspicious keywords OR if you detect multiple voices, you MUST set 'isSuspicious' to true. Otherwise, set it to false.
  - Populate 'suspiciousKeywords' with any keywords you've identified. If none, provide an empty array.
  - Set 'multipleVoicesDetected' to true if you are confident more than one person is speaking, otherwise false.
  - Provide a concise summary of your findings in 'analysisDetails', explaining why the audio is or is not suspicious.

  Audio Recording: {{media url=audioDataUri}}
  `,
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
