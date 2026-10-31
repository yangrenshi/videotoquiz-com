import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | VideoToQuiz AI',
  description: 'Terms of Service and legal policies for VideoToQuiz AI.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/terms',
  },
};

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
          <h2 className="text-base font-semibold text-zinc-100 mb-2">5. Disclaimer and Liability (免责与责任)</h2>
          <p className="text-zinc-400">
            The Service is provided as is and as available. AI-generated questions, answers, and explanations are study aids only. They are not guaranteed to be accurate, complete, or fit for any exam, and they are not professional, medical, legal, or financial advice. To the fullest extent allowed by law, VideoToQuiz AI is not liable for lost scores, lost study time, or indirect damages arising from use of the Service. Our total liability for a paid plan is limited to the amount you paid for that plan in the previous 30 days.
            <br />
            服务按现状提供。AI 生成的题目、答案与解析只供学习参考，不保证准确、完整或适用于任何考试，也不构成专业、医疗、法律或投资建议。在法律允许的范围内，本服务不对因使用内容而产生的分数、时间或其他间接损失承担责任。付费方案下，我们的责任上限为您在此前 30 天内为该方案支付的金额。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">6. Term and Termination (期限与终止)</h2>
          <p className="text-zinc-400">
            These terms apply while you use the Service. If you break the acceptable use rules, we may warn you, limit features, pause the account, or terminate the account. Unused credits on a terminated account are not refunded when the termination follows a rule violation. You may stop using the Service at any time and may cancel a monthly plan from the account panel.
            <br />
            条款在您使用服务期间有效。若您违反使用规则，我们可以警告、限制功能、暂停账号或终止账号。因违规被终止时，未用完的额度不予退还。您可以随时停止使用，也可以在账户里取消按月方案。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">7. Contact Information (联系方式)</h2>
          <p className="text-zinc-400">
            For any legal or service inquiries, please contact our support team at <a href="mailto:yangrenliipu+videotoquiz@gmail.com" className="text-zinc-200 underline">yangrenliipu+videotoquiz@gmail.com</a>.
            <br />
            如有任何法律、商务合作或服务咨询，请直接联系：<a href="mailto:yangrenliipu+videotoquiz@gmail.com" className="text-zinc-200 underline">yangrenliipu+videotoquiz@gmail.com</a>。
          </p>
        </section>
      </div>
    </div>
  );
}
