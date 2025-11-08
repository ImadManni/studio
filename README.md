# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Authentication (OAuth + JWT)

This project integrates NextAuth (Auth.js) with Google OAuth and JWT sessions.

### Environment Variables

Create a `.env.local` in the project root with:

```
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_SECRET=replace-with-strong-random-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_EMAIL=hydragaming595@gmail.com
GOOGLE_API_KEY=your_google_api_key_here
```

If you run on a different port, update `NEXTAUTH_URL` accordingly. For PowerShell, start on a custom port without changing the script:

```
npm run dev -- -p 9003
```

- Only the Google account in `ADMIN_EMAIL` can access `/dashboard` and sign in successfully. Others will be denied.

## Animations & 3D

- Framer Motion for UI transitions: see `src/components/motion.tsx` (`FadeIn`, `SlideUp`, `Stagger`).
- GSAP is installed and available for advanced timelines if needed.
- Lightweight background 3D scene via React Three Fiber: `src/components/three/BackgroundScene.tsx`. Imported on the homepage with `next/dynamic` and `ssr: false`.

### Routes

- `/signin` and `/signup` provide OAuth buttons (Google)
- `/api/auth/[...nextauth]` handles the auth callbacks
- `/dashboard` and nested routes are protected by middleware
- `/api/protected` returns data only for authenticated users

## Google GenAI / GenKit (AI report generation)

This project uses GenKit with the Google GenAI plugin to generate AI reports. To enable calls to Google's AI APIs, set the `GOOGLE_API_KEY` in your environment.

1. Create a `.env.local` in the project root (copy from `.env.local.example`) and add your key:

```
GOOGLE_API_KEY=your_google_api_key_here
NEXTAUTH_SECRET=replace-with-strong-random-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

2. Alternatively, set it in PowerShell for the current session before running the dev server:

```powershell
$env:GOOGLE_API_KEY = 'your_google_api_key_here'
npm run dev
```

Notes:
- Do NOT commit real keys to source control. Use `.env.local` (which is gitignored by Next.js) or your hosting provider's secret store (Vercel, Netlify, etc.) for production.
- If GenKit or the Google plugin expects a different environment variable name, update `src/ai/genkit.ts` accordingly.

## AI Assistant (Gemini Integration)

This project now includes an AI assistant powered by Google's Gemini AI, integrated directly into the dashboard interface.

### Features

- **Gemini AI Assistant**: Interactive chat interface for platform guidance
- **Dashboard Integration**: Accessible via the Gemini logo icon in the bottom-right corner of the dashboard
- **Context-Aware Responses**: Provides help with dashboard navigation, candidate management, exam creation, and report generation
- **Verified Symbol**: Custom Gemini logo with verification badge for authenticity

### How to Use

1. Navigate to the `/dashboard` route after signing in
2. Click the Gemini logo icon (with verification badge) in the bottom-right corner
3. Ask questions about the platform, such as:
   - "How do I view candidate information?"
   - "How do I create a new exam?"
   - "How do I export reports?"
   - "What does the suspicion score mean?"

### API Endpoints

- `/api/ai-assistant` - Main endpoint for AI assistant queries
- `/dashboard/ai-test` - Test page for verifying AI assistant functionality

### Files

- `src/components/ai-assistant.tsx` - Main AI assistant component
- `src/app/api/ai-assistant/route.ts` - API route for handling AI queries
- `src/app/dashboard/page.tsx` - Dashboard with integrated chat widget
- `src/ai/flows/ai-assistant.ts` - AI flow for processing queries
- `src/app/dashboard/ai-test/page.tsx` - Test page for AI functionality