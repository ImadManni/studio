import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for the AI Proctor Sentinel platform, an advanced AI-powered proctoring system for monitoring online examinations.

Your capabilities include helping with:
1. Dashboard navigation and features
2. Candidate information and management
3. Exam creation and monitoring
4. Report generation and export
5. System settings and configuration

When responding to user queries:
- Be concise and helpful
- Provide specific guidance when possible
- Suggest relevant actions or navigation paths
- If asked about technical implementation details, explain in simple terms

Context about the platform:
- This is an AI proctoring platform that monitors online exams
- It detects suspicious behavior using AI analysis
- It has features for dashboard overview, candidate management, exam creation, and report generation
- Users can view candidate details, create exams, and generate reports

User Query:`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Create the prompt with context
    const fullPrompt = `${SYSTEM_PROMPT}
    
User Question: ${query}
    
Context Information:
- User Type: ${context?.userType || 'admin'}
- Current Path: ${context?.currentPath || 'unknown'}
- Exam ID: ${context?.examId || 'none'}
- Candidate ID: ${context?.candidateId || 'none'}`;

    // Generate response using GenKit
    const result = await ai.generate({
      prompt: fullPrompt,
      model: 'googleai/gemini-2.5-flash',
    });

    const text = result.text;

    return NextResponse.json({
      response: text,
      suggestedActions: [],
      relevantData: {}
    });
  } catch (error: any) {
    console.error('AI Assistant Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}