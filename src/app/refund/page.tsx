import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to VideoToQuiz AI / 返回首页</span>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Guarantee Policy / 退款保障</span>
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Refund Policy (30天退款政策)</h1>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">1. 30-Day Money-Back Guarantee (30天无理由退款承诺)</h2>
          <p className="text-zinc-400">
            We want you to be completely satisfied with VideoToQuiz AI. If our tool fails to generate an accurate quiz for your educational lecture, or if you are dissatisfied with our service for any reason within 30 days of purchase, you are entitled to a full refund.
            <br />
            我们承诺：购买后 30 天内，若本站生成的题目未能达到您的学习预期，或因任何原因不满意，均可申请 100% 全额无理由退款。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">2. How to Request a Refund (如何极速申请退款)</h2>
          <p className="text-zinc-400">
            Simply send an email to <a href="mailto:yangrenliipu@gmail.com" className="text-zinc-200 underline">yangrenliipu@gmail.com</a> with your checkout email or invoice ID. Our support team processes all eligible refund requests within 24 business hours back to your original payment method (Waffo / Creem / Card / PayPal).
            <br />
            只需发送邮件至 <a href="mailto:yangrenliipu@gmail.com" className="text-zinc-200 underline">yangrenliipu@gmail.com</a>，附上您的支付邮箱或订单号，客服将在 24 小时内原路全额退回到您的支付账户（包括原卡或原通道）。
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100 mb-2">3. Subscription Cancellation (月度会员随时取消)</h2>
          <p className="text-zinc-400">
            You can cancel recurring Pro Scholar subscriptions anytime with 1-click in your receipt email link. Upon cancellation, your access remains active until the end of the current billing cycle without further charges.
            <br />
            月度订阅用户可随时一键取消次月续费，取消后当月会员权益仍可完整使用至周期结束。
          </p>
        </section>
      </div>
    </div>
  );
}
