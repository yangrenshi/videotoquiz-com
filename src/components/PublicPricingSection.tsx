import React from 'react';
import Link from 'next/link';

/**
 * 免登录公开定价。
 * 价格写在服务端 HTML 里，访客和支付审核爬虫不用打开弹窗、也不用登录就能看到。
 * 金额与条款页、结账文案保持一致：一次性 $4.99 / 25 次，按月 $9.99 / 200 次。
 */
const PLANS = [
  {
    name: 'Free Study Preview',
    nameZh: '免费试学',
    price: '$0',
    cycle: 'No charge. No card required.',
    cycleZh: '不收费，不需要绑卡。',
    includes: 'Featured sample quizzes, plus the first 2 questions of any custom YouTube video without signing up. Google sign-in adds 20 starter credits.',
    includesZh: '精选样卷可直接做。任意自定义视频免注册可答前 2 题。Google 登录后再送 20 个起步积分。',
  },
  {
    name: 'Starter Credit Pack',
    nameZh: '入门额度包',
    price: '$4.99',
    cycle: 'One-time payment. Credits never expire and do not auto-renew.',
    cycleZh: '一次性付款。额度永不过期，不会自动续费。',
    includes: '25 full video quiz passes, printable PDF worksheets, and Anki / Quizlet flashcard export.',
    includesZh: '25 次完整视频出题额度，可打印 PDF 练习卷，以及 Anki / Quizlet 闪卡导出。',
  },
  {
    name: 'Pro Scholar Membership',
    nameZh: '学者会员',
    price: '$9.99',
    cycle: 'Billed every month until you cancel. Cancel anytime in the account panel. No cancellation fee.',
    cycleZh: '按月计费，直到取消。可在账户里随时取消，不收取取消费。',
    includes: '200 video quizzes each billing cycle, lectures of 3 hours or longer, PDF and textbook chapter upload, and a priority generation queue.',
    includesZh: '每个计费周期 200 次视频出题，支持 3 小时以上长讲座、PDF 与教材章节上传，以及优先生成队列。',
  },
];

export default function PublicPricingSection({
  placement = 'home',
}: {
  placement?: 'home' | 'page';
}) {
  return (
    <section id="pricing" className="w-full max-w-5xl mx-auto px-4 py-10 scroll-mt-24">
      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
        Pricing
      </h2>
      <p className="mt-3 text-sm text-zinc-300 text-center max-w-2xl mx-auto leading-relaxed">
        Free preview is $0. The Starter Credit Pack is $4.99 one-time for 25 video quizzes.
        Pro Scholar Membership is $9.99 per month for 200 quizzes. No login is required to read these prices.
      </p>
      <p className="mt-2 text-sm text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
        免费试学 $0。入门额度包一次性 $4.99，含 25 次视频出题。学者会员按月 $9.99，每个周期 200 次。无需登录即可查看价格、计费周期和包含内容。
      </p>

      <ul className="mt-6 space-y-2 text-sm text-zinc-200 max-w-3xl mx-auto">
        <li>Free Study Preview: $0. No charge. Sample quizzes and the first 2 questions of a custom video.</li>
        <li>Starter Credit Pack: $4.99 one-time. 25 full video quiz passes. Never expires. No auto-renew.</li>
        <li>Pro Scholar Membership: $9.99 per month. 200 quizzes each cycle. Billed monthly until canceled.</li>
        <li>免费试学 $0。入门额度包一次性 $4.99 / 25 次，永不过期。学者会员 $9.99 / 月 / 200 次，可随时取消。</li>
      </ul>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 flex flex-col gap-3">
            <h3 className="text-base font-semibold text-white">
              {plan.name}
              <span className="block text-xs font-normal text-zinc-400 mt-1">{plan.nameZh}</span>
            </h3>
            <p className="text-3xl font-bold text-amber-400">{plan.price}</p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              <span className="block font-semibold text-zinc-200">Billing cycle</span>
              {plan.cycle}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">{plan.cycleZh}</p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              <span className="block font-semibold text-zinc-200">What is included</span>
              {plan.includes}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">{plan.includesZh}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 text-xs text-zinc-400 text-center leading-relaxed">
        Digital delivery only. Quizzes and files are generated in your account after payment.
        30-day money-back guarantee. Questions: yangrenliipu+videotoquiz@gmail.com.
        {placement === 'home' ? (
          <>
            {' '}
            <Link href="/pricing" className="text-amber-400 underline">
              Full pricing page
            </Link>
          </>
        ) : null}
      </p>
    </section>
  );
}
