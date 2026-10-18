export interface QuizQuestion {
  id: number;
  question: string;
  options: string[]; // 4 个选项
  answerIndex: number; // 正确索引 0~3
  explanation: string; // 详尽考点解析
}

export interface QuizResultData {
  videoId: string;
  videoTitle: string;
  summary: string;
  takeaways: string[];
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

export type InputMode = 'url' | 'transcript';

export interface TranscriptResultData {
  videoId: string;
  title: string;
  transcript: string;
  wordCount: number;
  estimatedReadingTimeMinutes: number;
}
