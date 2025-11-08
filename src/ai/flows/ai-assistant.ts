'use server';

/**
 * @fileOverview AI Assistant for the AI Proctor platform.
 *
 * - aiAssistant - Main function to handle user queries.
 * - AIAssistantInput - The input type for aiAssistant.
 * - AIAssistantOutput - The return type for aiAssistant.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIAssistantInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
  context: z.object({
    userId: z.string().optional().describe('The ID of the current user.'),
    userType: z.enum(['admin', 'proctor', 'instructor']).optional().describe('The type of the current user.'),
    currentPath: z.string().optional().describe('The current page path.'),
    examId: z.string().optional().describe('The current exam ID if applicable.'),
    candidateId: z.string().optional().describe('The current candidate ID if applicable.'),
  }).describe('Context information about the user and current session.'),
});

export type AIAssistantInput = z.infer<typeof AIAssistantInputSchema>;

const AIAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
  suggestedActions: z.array(z.object({
    action: z.string().describe('The suggested action name.'),
    description: z.string().describe('Description of what the action does.'),
    path: z.string().describe('The path to navigate to for this action.'),
  })).describe('Suggested actions the user can take.'),
  relevantData: z.record(z.any()).describe('Any relevant data extracted or generated from the query.'),
});

export type AIAssistantOutput = z.infer<typeof AIAssistantOutputSchema>;

export async function aiAssistant(input: AIAssistantInput): Promise<AIAssistantOutput> {
  return aiAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistantPrompt',
  input: { schema: AIAssistantInputSchema },
  output: { schema: AIAssistantOutputSchema },
  prompt: `You are an AI assistant for the AI Proctor platform, an advanced AI-powered proctoring system for monitoring online examinations.

  Context Information:
  - User ID: {{{context.userId}}}
  - User Type: {{{context.userType}}}
  - Current Path: {{{context.currentPath}}}
  - Exam ID: {{{context.examId}}}
  - Candidate ID: {{{context.candidateId}}}
  
  User Query: {{{query}}}
  
  Based on the context and query, provide a helpful response. You should:
  1. Answer the user's question directly and clearly
  2. If relevant, suggest actions the user can take
  3. Extract or reference any relevant data
  
  Here are some specific areas you can help with:
  
  DASHBOARD:
  - Overview statistics (total candidates, active exams, alerts, reports)
  - Recent activity and notifications
  - Quick actions to view exams, reports, or create new exams
  - System status and health
  
  CANDIDATES:
  - How to view candidate details and search for candidates
  - Candidate profile information (name, email, exam status)
  - Monitoring candidates during exams
  - Flagging suspicious behavior
  - Candidate history and past exams
  
  EXAMS:
  - Creating and managing exams
  - Viewing exam details and settings
  - Monitoring active exams
  - Exam scheduling and invitations
  
  REPORTS:
  - How to generate and view reports
  - Types of reports available (behavioral, audio analysis, comprehensive)
  - Exporting reports in different formats (PDF, CSV)
  - Report filtering and customization
  
  SETTINGS:
  - Account settings and preferences
  - Notification settings
  - Integration settings
  - Security settings
  
  Your response should be helpful, concise, and guide the user to the appropriate sections of the platform when needed.
  
  Format your response in the specified JSON structure.
  `,
});

const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('No output from AI prompt');
      return output!;
    } catch (err) {
      // Annotate error with flow name for easier debugging upstream
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`aiAssistantFlow failed: ${message}`);
    }
  }
);