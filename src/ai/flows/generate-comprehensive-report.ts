'use server';

/**
 * @fileOverview Generates a comprehensive report of a candidate's behavior during an exam.
 *
 * - generateComprehensiveReport - A function that generates the report.
 * - ComprehensiveReportInput - The input type for the generateComprehensiveReport function.
 * - ComprehensiveReportOutput - The return type for the generateComprehensiveReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComprehensiveReportInputSchema = z.object({
  candidateId: z.string().describe('The unique identifier of the candidate.'),
  examId: z.string().describe('The unique identifier of the exam.'),
  suspicionScore: z.number().describe('A numerical score indicating the overall suspicion level.'),
  alerts: z.array(
    z.object({
      timestamp: z.string().describe('The timestamp of the alert.'),
      screenshotDataUri: z
        .string()
        .describe(
          'A screenshot as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
        ),
      description: z.string().describe('A description of the alert.'),
    })
  ).describe('A list of alerts raised during the exam.'),
  behavioralStatistics: z.record(z.any()).describe('A record of behavioral statistics as key-value pairs.'),
});
export type ComprehensiveReportInput = z.infer<typeof ComprehensiveReportInputSchema>;

const ComprehensiveReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive report as a string.'),
});
export type ComprehensiveReportOutput = z.infer<typeof ComprehensiveReportOutputSchema>;

export async function generateComprehensiveReport(input: ComprehensiveReportInput): Promise<ComprehensiveReportOutput> {
  return generateComprehensiveReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'comprehensiveReportPrompt',
  input: {schema: ComprehensiveReportInputSchema},
  output: {schema: ComprehensiveReportOutputSchema},
  prompt: `You are an AI assistant that generates comprehensive reports about a candidate's behavior during an online exam.

  You are provided with the following information:

  Candidate ID: {{{candidateId}}}
  Exam ID: {{{examId}}}
  Suspicion Score: {{{suspicionScore}}}
  Alerts:
  {{#each alerts}}
  - Timestamp: {{{timestamp}}}, Description: {{{description}}}
  {{/each}}
  Behavioral Statistics: {{{json behavioralStatistics}}}

  Based on this information, generate a detailed report summarizing the candidate's behavior during the exam, highlighting any suspicious activities and providing an overall assessment.
  `,
});

const generateComprehensiveReportFlow = ai.defineFlow(
  {
    name: 'generateComprehensiveReportFlow',
    inputSchema: ComprehensiveReportInputSchema,
    outputSchema: ComprehensiveReportOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) throw new Error('No output from AI prompt');
      return output!;
    } catch (err) {
      // Annotate error with flow name for easier debugging upstream
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`generateComprehensiveReportFlow failed: ${message}`);
    }
  }
);
