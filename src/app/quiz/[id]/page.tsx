import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShareQuizClient from './ShareQuizClient';
import { getSharedQuiz } from '@/lib/quiz-share-store';
import { decompressQuizData } from '@/lib/quiz-share';
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes';
import { QuizResultData } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function resolveQuizData(id: string, searchParams: { [key: string]: string | string[] | undefined }): Promise<QuizResultData | null> {
  // 1. 服务端内存存储
  const cached = getSharedQuiz(id);
  if (cached) return cached;

  // 2. 预置精选样例
  if (SAMPLE_QUIZZES[id]) {
    return SAMPLE_QUIZZES[id];
  }

  // 3. 紧凑 Base64 URL 参数
  const d = typeof searchParams.d === 'string' ? searchParams.d : undefined;
  if (d) {
    const decompressed = decompressQuizData(d);
    if (decompressed) return decompressed;
  }

  return null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sParams = await searchParams;
  const quiz = await resolveQuizData(id, sParams);

  const videoTitle = quiz?.videoTitle || 'Educational Video Quiz';
  const totalQuestions = quiz?.questions?.length || 5;
  const summary = quiz?.summary
    ? quiz.summary.slice(0, 160)
    : 'Take this interactive active-recall test generated from YouTube video lectures. Test your retention with instant explanations.';

  const pageTitle = `Challenge: Can You Ace This Quiz on "${videoTitle}"? (${totalQuestions} Qs) | VideoToQuiz AI`;
  const pageDesc = `${summary} Score 100% on active recall questions generated automatically by VideoToQuiz AI.`;
  const ogUrl = `https://www.videotoquiz.com/quiz/${id}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: ogUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: ogUrl,
      siteName: 'VideoToQuiz AI',
      type: 'website',
      images: [
        {
          url: 'https://www.videotoquiz.com/og-image.png',
          width: 1200,
          height: 630,
          alt: `VideoToQuiz AI - ${videoTitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: ['https://www.videotoquiz.com/og-image.png'],
    },
  };
}

export default async function SharedQuizPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sParams = await searchParams;
  const initialQuiz = await resolveQuizData(id, sParams);

  return (
    <div className="min-h-screen px-4 pb-20 pt-4">
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 font-mono text-xs">
            Loading challenge...
          </div>
        }
      >
        <ShareQuizClient shareId={id} initialQuiz={initialQuiz} />
      </Suspense>
    </div>
  );
}
