import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'YouTube to Quiz AI | Free Video to Quiz Generator',
  description: 'Convert YouTube videos into interactive quizzes, tests, and study flashcards instantly with AI. Boost retention and master any lecture for free.',
  keywords: [
    'youtube to quiz',
    'video to quiz generator',
    'youtube video summarizer to quiz',
    'convert youtube video to test',
    'ai quiz generator from video',
    'active recall quiz',
    'video to flashcards'
  ],
  authors: [{ name: 'VideoToQuiz AI Team' }],
  metadataBase: new URL('https://www.videotoquiz.com'),
  alternates: {
    canonical: '/',
  },
  other: {
    'waffo-verify': '624137efca83e9d5f6d0281819f60d31',
  },
  openGraph: {
    title: 'YouTube to Quiz AI | Free Video to Quiz Generator',
    description: 'Convert YouTube videos into interactive quizzes, tests, and study flashcards instantly with AI. Boost retention and master any lecture for free.',
    url: 'https://www.videotoquiz.com',
    siteName: 'YouTube to Quiz AI',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'YouTube to Quiz AI - Video to Quiz Generator Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube to Quiz AI | Free Video to Quiz Generator',
    description: 'Convert YouTube videos into interactive quizzes, tests, and study flashcards instantly with AI. Boost retention and master any lecture for free.',
    images: ['/og-preview.png'],
  },
  verification: {
    google: 'D3doHT8D4EjwaWIbUzan7mNmQr7dmlKjUPMXlXy-O0g',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'YouTube to Quiz AI',
    url: 'https://www.videotoquiz.com',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description: 'AI-powered learning platform that converts any YouTube video lecture or tutorial into interactive quizzes, summaries, and downloadable flashcards in seconds.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1280',
      reviewCount: '1280',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Instant YouTube Video Transcript Parsing',
      'AI-Powered Multiple Choice & Conceptual Quizzes',
      'Timestamped Explanations for Every Answer',
      'Active Recall and Spaced Repetition Workflow',
      'Downloadable Study Notes and Flashcards'
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
              {children}
            </main>
            <Footer />
            <LoginModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
