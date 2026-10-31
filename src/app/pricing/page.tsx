import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PublicPricingSection from '@/components/PublicPricingSection';

export const metadata: Metadata = {
  title: 'Pricing | $4.99 one-time pack · $9.99 monthly | VideoToQuiz',
  description:
    'Public prices with no login: free preview $0, Starter Credit Pack $4.99 one-time for 25 video quizzes, Pro Scholar Membership $9.99 per month for 200 quizzes.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/pricing',
  },
  openGraph: {
    title: 'Pricing | VideoToQuiz AI',
    description: 'Public prices with no login: free preview $0, Starter Credit Pack $4.99 one-time for 25 video quizzes, Pro Scholar Membership $9.99 per month for 200 quizzes.',
    url: 'https://www.videotoquiz.com/pricing',
  },
};

const offers = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'VideoToQuiz public pricing',
  itemListElement: [
    {
      '@type': 'Offer',
      name: 'Free Study Preview',
      price: '0',
      priceCurrency: 'USD',
      description: 'Sample quizzes and the first 2 questions of a custom video. No card.',
    },
    {
      '@type': 'Offer',
      name: 'Starter Credit Pack',
      price: '4.99',
      priceCurrency: 'USD',
      description: 'One-time payment for 25 video quiz passes. Credits never expire.',
    },
    {
      '@type': 'Offer',
      name: 'Pro Scholar Membership',
      price: '9.99',
      priceCurrency: 'USD',
      description: 'Monthly membership with 200 video quizzes per billing cycle. Cancel anytime.',
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offers) }}
      />
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to VideoToQuiz / 返回首页</span>
        </Link>
      </div>
      <PublicPricingSection placement="page" />
    </div>
  );
}
