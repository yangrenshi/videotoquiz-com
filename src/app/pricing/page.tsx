import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, HelpCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react';
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do credits in the $4.99 Starter Pack expire?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Starter Credit Pack credits never expire and do not auto-renew. You keep all 25 video quiz passes until you choose to use them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I export generated quizzes to Anki and printable PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Both Starter Credit Pack and Pro Scholar memberships include 1-click Anki (.csv / deck) export, Quizlet-ready flashcards, and clean printable PDF worksheets.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I test my video for free before purchasing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. VideoToQuiz offers a 100% Free Study Preview for any educational YouTube lecture or pasted transcript. You can solve the first 2 questions without entering payment details.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I cancel the $9.99 Pro Scholar subscription?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can cancel anytime in 1 click directly inside your user dashboard. There are no cancellation fees, contracts, or lock-in periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which payment methods are supported globally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and WeChat Pay through bank-grade encrypted checkout.',
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to VideoToQuiz / 返回首页</span>
        </Link>
      </div>

      <PublicPricingSection placement="page" />

      {/* 原生对比表 (Q-A-D-L 生成式引擎组件：丰富信息增量) */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-zinc-800/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Detailed Feature Comparison
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Choose between flexible pay-as-you-go credits or high-volume monthly study plans.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 text-zinc-200 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Features &amp; Capabilities</th>
                <th className="py-3.5 px-4 font-semibold text-zinc-400">Free Preview ($0)</th>
                <th className="py-3.5 px-4 font-semibold text-amber-400">Starter Pack ($4.99)</th>
                <th className="py-3.5 px-4 font-semibold text-emerald-400">Pro Scholar ($9.99/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Full Video Quizzes</td>
                <td className="py-3 px-4 text-zinc-400">2 Questions / Video</td>
                <td className="py-3 px-4 font-semibold text-amber-300">25 Full Video Passes</td>
                <td className="py-3 px-4 font-semibold text-emerald-300">200 Quizzes / Month</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Credit Expiration</td>
                <td className="py-3 px-4 text-zinc-400">Session only</td>
                <td className="py-3 px-4 font-semibold text-amber-300">Never Expires</td>
                <td className="py-3 px-4 text-zinc-400">Renews Monthly</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Anki &amp; Quizlet Flashcard Export</td>
                <td className="py-3 px-4 text-zinc-500">Sample only</td>
                <td className="py-3 px-4 text-emerald-400">Full 1-Click Export</td>
                <td className="py-3 px-4 text-emerald-400">Full 1-Click Export</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Printable PDF Worksheets</td>
                <td className="py-3 px-4 text-zinc-500">Sample only</td>
                <td className="py-3 px-4 text-emerald-400">Included</td>
                <td className="py-3 px-4 text-emerald-400">Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Targeted Missed-Question Retakes</td>
                <td className="py-3 px-4 text-emerald-400">Included</td>
                <td className="py-3 px-4 text-emerald-400">Included</td>
                <td className="py-3 px-4 text-emerald-400">Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Lecture Duration Supported</td>
                <td className="py-3 px-4 text-zinc-400">Up to 45 mins</td>
                <td className="py-3 px-4 text-zinc-200">Up to 2 hours</td>
                <td className="py-3 px-4 font-semibold text-emerald-300">3+ Hours &amp; Long Bootcamps</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 常见问题 FAQ 模块 (SSR 语义直出，对齐 Schema) */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-zinc-800/80 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions About Pricing
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Clear terms, transparent pricing, and zero hidden commitments.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">Do credits in the $4.99 Starter Pack expire?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No. Starter Credit Pack credits never expire. You can study today or save them for finals next semester without worrying about monthly fees.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">Can I export quizzes to Anki or print them out?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes. Every test created with VideoToQuiz can be exported with 1-click into standard Anki CSV files, Quizlet format, or clean printable exam papers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">Can I test with a video before paying?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes. Free Study Preview allows you to test custom educational YouTube videos or lecture notes for free. You solve the first 2 questions with zero payment details required.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">How do I cancel the $9.99 Pro subscription?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You can cancel your subscription anytime with 1 click directly inside your account dashboard. You will retain access until the end of your billing cycle.
            </p>
          </div>
        </div>

        {/* 底部与全站知识库的内链拓扑 */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 text-center space-y-3">
          <h4 className="text-sm font-bold text-zinc-200">Looking for Free Educational Topic Quizzes?</h4>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto">
            Check out our pre-generated active recall tests across Computer Science, Medicine, and University Curricula.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/topics" className="text-xs font-semibold text-amber-400 hover:underline">
              Browse Topics Directory →
            </Link>
            <span className="text-zinc-600">·</span>
            <Link href="/for/medical-students" className="text-xs font-semibold text-emerald-400 hover:underline">
              Medical Students Quiz Hub →
            </Link>
            <span className="text-zinc-600">·</span>
            <Link href="/" className="text-xs font-semibold text-zinc-300 hover:underline">
              Try YouTube to Quiz Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
