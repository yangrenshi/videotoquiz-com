export interface QuizQuestion {
  id: number;
  question: string;
  options: string[]; // 4 个选项
  answerIndex: number; // 正确索引 0~3
  explanation: string; // 详尽考点解析
}

export interface StudyNoteSection {
  heading: string;
  timestamp?: string;
  bullets: string[];
}

export interface CornellNotesData {
  cues: string[];
  notes: string[];
  summary: string;
}

export interface QuizResultData {
  videoId: string;
  videoTitle: string;
  summary: string;
  takeaways: string[];
  sections?: StudyNoteSection[];
  cornellNotes?: CornellNotesData;
  questions: QuizQuestion[];
  totalQuestions: number;
}

export interface UserAnswerRecord {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface QuizScoreSummary {
  total: number;
  correct: number;
  percentage: number;
  timeSpentSeconds: number;
  masteryLevel: string;
  badgeTitle: string;
}

export type InputMode = 'url' | 'transcript' | 'file';

export interface TranscriptResultData {
  videoId: string;
  title: string;
  transcript: string;
  wordCount: number;
  estimatedReadingTimeMinutes: number;
}
