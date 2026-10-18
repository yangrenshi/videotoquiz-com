import { QuizResultData } from './types';

// 服务端轻量内存缓存 (在 Next.js 服务端全生命周期保持单例)
const globalStore = global as unknown as {
  __quizShareStore?: Map<string, { quiz: QuizResultData; createdAt: number }>;
};

if (!globalStore.__quizShareStore) {
  globalStore.__quizShareStore = new Map();
}

const shareCache = globalStore.__quizShareStore;

/**
 * 服务端存储分享的测验数据
 */
export function saveSharedQuiz(shareId: string, quiz: QuizResultData): void {
  if (!shareId || !quiz) return;
  shareCache.set(shareId, {
    quiz,
    createdAt: Date.now(),
  });

  // 控制缓存上限（保持最新 1000 个测验）
  if (shareCache.size > 1000) {
    const oldestKey = shareCache.keys().next().value;
    if (oldestKey) shareCache.delete(oldestKey);
  }
}

/**
 * 服务端获取分享的测验数据
 */
export function getSharedQuiz(shareId: string): QuizResultData | null {
  if (!shareId) return null;
  const item = shareCache.get(shareId);
  return item ? item.quiz : null;
}
