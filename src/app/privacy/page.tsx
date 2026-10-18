import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to VideoToQuiz AI / 返回首页</span>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-4 h-4 text-zinc-400" />
        <span className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Privacy & GDPR / 隐私政策</span>
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Privacy Policy (隐私政策)</h1>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">1. Data We Collect (数据收集说明)</h2>
          <p className="text-zinc-400">
            We do not require user account registration for basic quiz testing. When you process a video or lecture transcript, the content is processed ephemerally solely to produce questions and summaries. We do not sell or monetize personal browsing history.
            <br />
            普通测验体验无需注册账号。您输入的视频链接或字幕仅在生成习题时临时流式处理，我们绝不会出售或滥用您的个人信息。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">2. Payment Security (支付与资金安全)</h2>
          <p className="text-zinc-400">
            Payment transactions are processed by certified PCI-DSS Level 1 compliant Merchant-of-Record platforms (Creem / PayPal). We never store or transmit your raw credit card numbers or banking passwords.
            <br />
            支付交易全流程由国际合规持牌支付服务商（Creem / PayPal）加密承载，本站不接触任何敏感卡号或银行密码。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">3. Cookies & Local Storage (本地存储规范)</h2>
          <p className="text-zinc-400">
            We use minimal local browser storage solely to remember your chosen language (ZH/EN) and quiz preferences.
            <br />
            本地仅使用少量 Storage 用于记忆您的中英文语言偏好设置与做题进度。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">4. Contact Us (联系我们)</h2>
          <p className="text-zinc-400">
            If you have questions regarding your data privacy rights, please email us at <a href="mailto:yangrenliipu@gmail.com" className="text-zinc-200 underline">yangrenliipu@gmail.com</a>.
            <br />
            如对数据隐私或个人信息权益有任何疑问，请随时联系个人支持邮箱：<a href="mailto:yangrenliipu@gmail.com" className="text-zinc-200 underline">yangrenliipu@gmail.com</a>。
          </p>
        </section>
      </div>
    </div>
  );
}
