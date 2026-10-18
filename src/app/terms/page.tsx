import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to VideoToQuiz AI / 返回首页</span>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-zinc-400" />
        <span className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Legal Terms / 法律条款</span>
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Terms of Service (服务条款)</h1>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">1. Agreement to Terms (条款接受)</h2>
          <p className="text-zinc-400">
            By accessing or using VideoToQuiz AI (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
            <br />
            访问或使用 VideoToQuiz AI 即表示您同意受本服务条款约束。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">2. Description of Educational Service (服务说明)</h2>
          <p className="text-zinc-400">
            VideoToQuiz AI is an artificial intelligence-assisted cognitive learning and testing utility designed to generate formative study quizzes and summaries from publicly available educational videos and lecture text.
            <br />
            本服务为 AI 辅助教育与认知测评工具，旨在从公开视频讲座与讲义文本中提炼知识点并生成自测习题。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">3. Purchases, Credits & Subscriptions (购买与订阅政策)</h2>
          <p className="text-zinc-400">
            We offer both one-time credit packages ($4.99 Starter Pass for 25 videos) and recurring monthly subscriptions ($9.99/mo). One-time credit packages never expire. Recurring subscriptions can be canceled at any time from your account management panel without penalty.
            <br />
            支持 $4.99 单次按量加油包（25次额度，永不过期）与 $9.99/月 连续订阅，用户可随时取消后续扣费。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">4. Acceptable Use Policy (合规使用准则)</h2>
          <p className="text-zinc-400">
            You agree not to use the Service to infringe intellectual property, scrape unauthorized personal data, or attempt to bypass YouTube rate limits or automated security protections.
            <br />
            用户不得利用本服务侵犯知识产权或未经许可抓取他人隐私信息。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">5. Contact Information (联系方式)</h2>
          <p className="text-zinc-400">
            For any legal or service inquiries, please contact our support team at <a href="mailto:support@videotoquiz.ai" className="text-zinc-200 underline">support@videotoquiz.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
