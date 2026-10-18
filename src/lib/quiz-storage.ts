'use client';

import { QuizResultData } from './types';

export interface SavedQuizRecord {
  id: string;
  title: string;
  videoUrl?: string;
  videoId?: string;
  thumbnailUrl?: string;
  questionCount: number;
  score?: number;
  totalQuestions?: number;
  createdAt: number;
  data: QuizResultData;
}

const STORAGE_KEY = 'v2q_saved_quizzes_v1';

export function getSavedQuizzes(): SavedQuizRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved quizzes:', e);
    return [];
  }
}

export function saveQuiz(quiz: QuizResultData, videoUrl?: string): SavedQuizRecord {
  if (typeof window === 'undefined') {
    return {
      id: quiz.videoId ? `quiz_${quiz.videoId}` : 'quiz_' + Date.now(),
      title: quiz.videoTitle || 'Untitled Quiz',
      questionCount: quiz.questions?.length || 0,
      createdAt: Date.now(),
      data: quiz
    };
  }

  const existing = getSavedQuizzes();
  const id = quiz.videoId ? `quiz_${quiz.videoId}` : `quiz_${Date.now()}`;

  // 尝试提取 YouTube Video ID
  let videoId: string | undefined = quiz.videoId;
  let thumbnailUrl: string | undefined = undefined;
  if (!videoId && videoUrl) {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  if (videoId) {
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  const title = quiz.videoTitle || (quiz as any).title || 'YouTube Educational Quiz';

  const newRecord: SavedQuizRecord = {
    id,
    title,
    videoUrl,
    videoId,
    thumbnailUrl,
    questionCount: quiz.questions?.length || 0,
    createdAt: Date.now(),
    data: quiz
  };

  // 避免重复，过滤掉同 ID 的旧记录
  const filtered = existing.filter(q => q.id !== id);
  const updated = [newRecord, ...filtered].slice(0, 50); // 最多缓存 50 份
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage full, trimming older quizzes:', e);
  }
  return newRecord;
}

export function updateQuizScore(quizId: string, score: number, total: number) {
  if (typeof window === 'undefined') return;
  const existing = getSavedQuizzes();
  const target = existing.find(q => q.id === quizId);
  if (target) {
    target.score = score;
    target.totalQuestions = total;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export function deleteSavedQuiz(quizId: string) {
  if (typeof window === 'undefined') return;
  const existing = getSavedQuizzes();
  const updated = existing.filter(q => q.id !== quizId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getStudyStats() {
  const quizzes = getSavedQuizzes();
  const total = quizzes.length;
  const scoredQuizzes = quizzes.filter(q => q.score !== undefined && q.totalQuestions);
  const avgScore = scoredQuizzes.length > 0
    ? Math.round((scoredQuizzes.reduce((acc, cur) => acc + (cur.score! / cur.totalQuestions!), 0) / scoredQuizzes.length) * 100)
    : 0;
  
  return {
    totalQuizzes: total,
    scoredCount: scoredQuizzes.length,
    averageScorePercent: avgScore,
    estimatedMinutesSaved: total * 15 // 每个测验平均节省 15 分钟看视频时间
  };
}
