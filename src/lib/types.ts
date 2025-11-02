export type CandidateStatus = 'Clear' | 'Warn' | 'Alert';

export type Candidate = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: CandidateStatus;
  suspicionScore: number;
  examId: string;
};

export type Alert = {
  id: string;
  timestamp: string;
  description: string;
  type: 'face' | 'eye' | 'object' | 'audio';
  screenshotDataUri?: string;
};
