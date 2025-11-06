import type { Candidate, Alert, Exam } from './types';

export const candidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
    status: 'Alert',
    suspicionScore: 88,
    examId: 'exam-101'
  },
  {
    id: 'c2',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
    status: 'Warn',
    suspicionScore: 42,
    examId: 'exam-101'
  },
  {
    id: 'c3',
    name: 'Chen Wei',
    email: 'chen.w@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
    status: 'Clear',
    suspicionScore: 12,
    examId: 'exam-102'
  },
  {
    id: 'c4',
    name: 'Fatima Al-Fassi',
    email: 'fatima.af@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
    status: 'Clear',
    suspicionScore: 5,
    examId: 'exam-103'
  },
  {
    id: 'c5',
    name: 'David Smith',
    email: 'david.s@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar5/100/100',
    status: 'Warn',
    suspicionScore: 55,
    examId: 'exam-104'
  },
   {
    id: 'c6',
    name: 'Yuki Tanaka',
    email: 'yuki.t@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar6/100/100',
    status: 'Alert',
    suspicionScore: 95,
    examId: 'exam-105'
  },
];

export const alerts: { [key: string]: Alert[] } = {
  c1: [
    { id: 'a1', timestamp: '00:05:12', description: 'Multiple faces detected in frame.', type: 'face', screenshotDataUri: 'https://picsum.photos/seed/alert1/400/225' },
    { id: 'a2', timestamp: '00:15:34', description: 'Suspicious keyword "help me" detected.', type: 'audio' },
    { id: 'a3', timestamp: '00:28:45', description: 'Mobile phone detected.', type: 'object', screenshotDataUri: 'https://picsum.photos/seed/alert2/400/225' },
  ],
  c2: [
    { id: 'a4', timestamp: '00:10:02', description: 'Candidate frequently looking away from screen.', type: 'eye' },
  ],
  c5: [
      { id: 'a5', timestamp: '00:22:18', description: 'Candidate disappeared from frame.', type: 'face', screenshotDataUri: 'https://picsum.photos/seed/alert3/400/225' },
  ],
  c6: [
    { id: 'a6', timestamp: '00:02:50', description: 'Prohibited textbook detected.', type: 'object', screenshotDataUri: 'https://picsum.photos/seed/alert4/400/225' },
    { id: 'a7', timestamp: '00:31:05', description: 'Unidentified voice detected.', type: 'audio' },
    { id: 'a8', timestamp: '00:45:11', description: 'Candidate gaze is off-screen for an extended period.', type: 'eye' },
  ]
};

export const exams: Exam[] = [
  { id: 'exam-101', title: 'Physics 101 - Midterm', date: '2025-12-10', description: 'Chapters 1-6. Closed book.' },
  { id: 'exam-102', title: 'Calculus II - Final', date: '2025-12-18', description: 'Comprehensive.' },
  { id: 'exam-103', title: 'Computer Networks - Quiz', date: '2025-11-30' },
  { id: 'exam-104', title: 'English Literature', date: '2025-12-05' },
  { id: 'exam-105', title: 'Data Structures - Practical', date: '2025-12-12' },
];

export const getExamById = (id: string): Exam | undefined => exams.find(e => e.id === id);
export const getCandidatesForExam = (id: string): Candidate[] => candidates.filter(c => c.examId === id);

export const getCandidateById = (id: string): Candidate | undefined => {
  return candidates.find(c => c.id === id);
};

export const getAlertsByCandidateId = (id: string): Alert[] => {
  return alerts[id] || [];
};
