import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'YouTube to Quiz AI | Turn Any Video into an Interactive Quiz in Seconds',
  description: 'Instantly convert any YouTube lecture or tutorial into an interactive quiz, summary, and flashcards with AI. Test your knowledge without signup. 100% free.',
  keywords: [
    'youtube to quiz',
    'video to quiz',
    'youtube video summarizer to quiz',
    'ai quiz generator from video',
    'convert youtube to test',
    'video learning quiz'
  ],
  authors: [{ name: 'VideoToQuiz AI Team' }],
  metadataBase: new URL('https://www.videotoquiz.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'YouTube to Quiz AI - Interactive Knowledge Testing',
    description: 'Paste any YouTube link, get a 5-question test & summary in 10 seconds. Free interactive test with instant scoring.',
    url: 'https://www.videotoquiz.com',
    siteName: 'YouTube to Quiz AI',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'YouTube to Quiz AI Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube to Quiz AI | Interactive Knowledge Testing',
    description: 'Paste any YouTube link, get a 5-question test & summary in 10 seconds. Free interactive test with instant scoring.',
    images: ['/og-preview.png'],
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
    description: 'AI platform that converts public YouTube video lectures into interactive quizzes, summaries, and downloadable study worksheets.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
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
