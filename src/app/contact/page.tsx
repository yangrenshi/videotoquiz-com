import React from 'react';
import type { Metadata } from 'next';
import { Mail, Clock, ShieldCheck, MapPin, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | YouTube to Quiz AI Customer Support',
  description: 'Get in touch with the YouTube to Quiz AI support team. Inquiries for customer support, billing assistance, and academic licensing.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-12">
      {/* 头部标题 */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
          <Mail className="w-3.5 h-3.5" />
          <span>CUSTOMER SUPPORT & INQUIRIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          How Can We Help You?
        </h1>
        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
          Whether you need assistance with quiz generation, credit billing, or institutional licensing, our dedicated team is here to support your learning journey.
        </p>
      </div>

      {/* 联系卡片矩阵 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 客服支持 */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white mb-1">Official Support Desk</h2>
            <p className="text-xs text-zinc-400 mb-3">For general inquiries, feature requests, and account sync:</p>
            <a
              href="mailto:yangrenliipu+videotoquiz@gmail.com"
              className="text-sm font-mono font-bold text-amber-300 hover:underline"
            >
              yangrenliipu+videotoquiz@gmail.com
            </a>
          </div>
          <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Average response turnaround: Under 24 business hours</span>
          </div>
        </div>

        {/* 账单与发票 */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white mb-1">Billing & Invoicing</h2>
            <p className="text-xs text-zinc-400 mb-3">For VAT receipts, institutional purchases, or refund requests:</p>
            <a
              href="mailto:yangrenliipu+videotoquiz@gmail.com?subject=Billing%20Inquiry"
              className="text-sm font-mono font-bold text-indigo-300 hover:underline"
            >
              yangrenliipu+videotoquiz@gmail.com
            </a>
          </div>
          <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Payments encrypted via Waffo Pancake &amp; PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
