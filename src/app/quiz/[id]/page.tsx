import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShareQuizClient from './ShareQuizClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sParams = await searchParams;

  return {
    title: `Active Recall Quiz Challenge - VideoToQuiz AI`,
    description: `Take this interactive active-recall test generated from YouTube video lectures. Test your retention, review instant explanations, and generate your own quizzes.`,
    openGraph: {
      title: `Take this Quiz Challenge | VideoToQuiz AI`,
      description: `Can you score 100%? Test your knowledge with instant feedback and flashcard explanations.`,
      url: `https://www.videotoquiz.com/quiz/${id}`,
      siteName: 'VideoToQuiz AI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Quiz Challenge: Test Your Knowledge with VideoToQuiz AI`,
      description: `Active recall test generated automatically from YouTube educational videos.`,
    },
  };
}

export default async function SharedQuizPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen px-4 pb-20 pt-4">
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 font-mono text-xs">
            Loading challenge...
          </div>
        }
      >
        <ShareQuizClient shareId={id} />
      </Suspense>
    </div>
  );
}
