# AI Assistant Integration

This document explains how the AI assistant is integrated into the AI Proctor platform.

## Overview

The AI assistant is powered by Google's Gemini model through the GenKit framework. It provides intelligent assistance to users and administrators of the AI Proctor platform, helping them navigate the system and understand its features.

## Key Components

### 1. GenKit Configuration (`genkit.ts`)
- Configures the connection to Google AI services
- Sets up the Gemini model (`googleai/gemini-2.5-flash`)
- Uses the API key from environment variables

### 2. AI Flows (`flows/`)

#### `ai-assistant.ts`
Main flow that handles user queries and provides contextual responses. It can help with:
- Dashboard navigation and features
- Candidate information and management
- Exam creation and monitoring
- Report generation and export
- System settings and configuration

#### `analyze-audio-suspicious-keywords.ts`
Analyzes audio recordings for suspicious keywords or multiple voices during exams.

#### `generate-comprehensive-report.ts`
Generates detailed reports about candidate behavior during exams.

### 3. Frontend Components

#### `components/ai-assistant.tsx`
A React component that provides a chat interface for the AI assistant, integrated into the dashboard layout.

#### `components/dashboard-layout.tsx`
The main dashboard layout that includes the AI assistant component.

### 4. API Routes

#### `app/api/ai-assistant/route.ts`
API endpoint for handling AI assistant requests from the frontend.

## How to Use

### For Users/Administrators
1. Click the AI assistant button (chat icon) in the bottom-right corner of the dashboard
2. Type your question about the platform
3. Receive intelligent responses with suggested actions

### For Developers
To extend the AI assistant functionality:
1. Modify the prompt in `src/ai/flows/ai-assistant.ts` to handle new query types
2. Update the UI component in `src/components/ai-assistant.tsx` for new features
3. Add new API endpoints in `src/app/api/` as needed

## Testing

A test page is available at `/dashboard/ai-assistant-test` to experiment with the AI assistant functionality.

## Environment Variables

Ensure the following environment variable is set in `.env.local`:
```
GOOGLE_API_KEY=your_google_api_key_here
```

The default API key provided in the code is for development purposes only.