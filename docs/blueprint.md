# **App Name**: AI Proctor Sentinel

## Core Features:

- Presence and Identity Detection: Detects the candidate's face via webcam and alerts if the face disappears or if multiple faces are detected.
- Eye-Tracking Analysis: Monitors the candidate's gaze direction and flags suspicious behavior if they frequently look away from the screen using computer vision techniques.
- Sound and Voice Detection: Records ambient sound (if permitted) and identifies suspicious keywords or multiple voices using an AI-powered tool to analyze audio patterns.
- Prohibited Object Detection: Uses a detection model (YOLO or SSD) to identify forbidden objects such as phones, books, or secondary screens and triggers alerts. An AI vision tool will identify these objects and ensure adherence to exam regulations.
- Automated IA Report Generation: Generates a comprehensive report including a suspicion score, a list of alerts with timestamps and screenshots, and behavioral statistics at the conclusion of exam.
- Instructor/Admin Interface: Provides a dashboard for instructors and admins to monitor multiple students, view live alerts, and consult individual student reports.
- REST API for AI Inference: Create REST API endpoints for integrating AI inference results from models like Claude, and connect it to the Angular frontend to give live analysis. AI processing code will reside in the API.

## Style Guidelines:

- Primary color: Electric Blue (#7DF9FF) to reflect a modern, cybernetic feel.
- Background color: Dark Navy (#1A237A) provides a professional and high-tech backdrop.
- Accent color: Neon Green (#39FF14) to highlight key interactive elements and alerts.
- Body and headline font: 'Space Grotesk', a sans-serif font for a computerized, techy feel. Note: currently only Google Fonts are supported.
- Use modern, high-contrast icons from Angular Lucide to represent functionalities.
- Employ a dynamic, animated layout using Framer Motion and GSAP for a modern UI.
- Implement subtle, cyber-themed 3D animations using a cyber professional compatible background to enhance user engagement.