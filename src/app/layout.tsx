import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import PricingModal from '@/components/PricingModal';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Video to Notes — Turn Any Video into Study Notes',
  description: 'The fastest AI video to notes generator. Convert any video lecture into structured study notes, key takeaways, and flashcards in 10s. Study 10x faster.',
  keywords: [
    'video to notes',
    'video to notes ai',
    'video notes generator',
    'youtube to notes',
    'cornell notes generator',
    'lecture to notes',
    'video to flashcards',
    'video quiz maker',
    'anki flashcard generator'
  ],
  authors: [{ name: 'Video to Notes Team', url: 'https://videotoquiz.com' }],
  metadataBase: new URL('https://videotoquiz.com'),
  alternates: {
    canonical: 'https://videotoquiz.com/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  other: {
    'waffo-verify': '624137efca83e9d5f6d0281819f60d31',
  },
  openGraph: {
    title: 'Video to Notes — Turn Any Video into Study Notes',
    description: 'The fastest AI video to notes generator. Convert any video lecture into structured study notes, key takeaways, and flashcards in 10s. Study 10x faster.',
    url: 'https://videotoquiz.com/',
    siteName: 'Video to Notes',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Video to Notes - AI Study Notes Generator Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to Notes — Turn Any Video into Study Notes',
    description: 'The fastest AI video to notes generator. Convert any video lecture into structured study notes, key takeaways, and flashcards in 10s. Study 10x faster.',
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
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://videotoquiz.com/#organization',
        name: 'Video to Notes',
        url: 'https://videotoquiz.com',
        logo: 'https://videotoquiz.com/icon.png',
        sameAs: [
          'https://github.com/yangrenshi/videotoquiz-com',
          'https://devpost.com/software/videotoquiz-ai',
          'https://www.uneed.best/tool/videotoquiz-ai',
          'https://www.saashub.com/youtube-to-quiz-ai'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://videotoquiz.com/#website',
        url: 'https://videotoquiz.com',
        name: 'Video to Notes',
        publisher: {
          '@id': 'https://videotoquiz.com/#organization'
        },
        inLanguage: 'en-US',
        datePublished: '2026-10-17T00:00:00+00:00',
        dateModified: '2026-11-13T21:00:00+00:00'
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://videotoquiz.com/#webapp',
        name: 'Video to Notes AI',
        url: 'https://videotoquiz.com',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        author: {
          '@type': 'Organization',
          name: 'Video to Notes Team'
        },
        datePublished: '2026-10-17T00:00:00+00:00',
        dateModified: '2026-11-13T21:00:00+00:00',
        description: 'AI-powered learning platform that converts any video lecture or tutorial into structured study notes, executive summaries, Cornell notes, and active recall quizzes in seconds.',
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
          'Instant Video to Notes Summary Outline',
          'Cornell Notes Format with Cues and Key Points',
          'Timestamped Explanations for Every Section',
          'Active Recall Quizzes and Anki Flashcards Export',
          'One-click Markdown and PDF Download'
        ]
      }
    ]
  };

  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-DPHYWVD6P8';

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* Umami 自建流量统计（免 Cookie、高抗拦截、2KB 极轻量） */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={`${process.env.NEXT_PUBLIC_UMAMI_HOST_URL || 'https://my-umami.vercel.app'}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
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
            <PricingModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
