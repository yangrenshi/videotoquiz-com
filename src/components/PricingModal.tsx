'use client';

import React, { useState } from 'react';
import { X, Check, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'onetime' | 'monthly'>('onetime');

  if (!isOpen) return null;

  // Creem 结账处理 (直提支付宝)
  const handleCreemCheckout = (plan: 'onetime' | 'monthly') => {
    const productId = plan === 'onetime'
      ? (process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_ONETIME || 'prod_vW2vvU50gL24FTRqcppDN')
      : (process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_MONTHLY || 'prod_3LmDXFB6O2n3NoVqLg5eLm');
    
    // 跳转到 Creem 聚合结账页
    const checkoutUrl = `https://checkout.creem.io/${productId}?customer_email=learner@example.com`;
    window.open(checkoutUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* 顶部标题与关闭 */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-current" />
              <span>{t.pricing.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {t.pricing.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 双轨卡片区域 (Open-Design 纯粹微质感) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* 模式 1: 按量付费 $4.99 (最受欢迎推荐) */}
          <div
            onClick={() => setSelectedPlan('onetime')}
            className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col justify-between ${
              selectedPlan === 'onetime'
                ? 'border-amber-400/80 bg-zinc-950 shadow-lg shadow-amber-400/5'
                : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
            }`}
          >
            <div className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-zinc-950">
              {t.pricing.popular}
            </div>

            <div>
              <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
                {t.pricing.plan1Title}
              </div>
              <div className="flex items-baseline gap-1 mb-2 font-mono">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">{t.pricing.plan1Price}</span>
                <span className="text-xs text-zinc-400">{t.pricing.plan1Period}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {t.pricing.plan1Desc}
              </p>

              <ul className="space-y-2.5 text-xs text-zinc-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan1f1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan1f2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan1f3}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan1f4}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleCreemCheckout('onetime')}
              className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{t.pricing.plan1Btn}</span>
            </button>
          </div>

          {/* 模式 2: 按月连续订阅 $9.99/月 */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col justify-between ${
              selectedPlan === 'monthly'
                ? 'border-zinc-400 bg-zinc-950 shadow-lg'
                : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-zinc-300 tracking-wider uppercase mb-1">
                {t.pricing.plan2Title}
              </div>
              <div className="flex items-baseline gap-1 mb-2 font-mono">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">{t.pricing.plan2Price}</span>
                <span className="text-xs text-zinc-400">{t.pricing.plan2Period}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {t.pricing.plan2Desc}
              </p>

              <ul className="space-y-2.5 text-xs text-zinc-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan2f1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan2f2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan2f3}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pricing.plan2f4}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleCreemCheckout('monthly')}
              className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current text-zinc-900" />
              <span>{t.pricing.plan2Btn}</span>
            </button>
          </div>
        </div>

        {/* 支付安全与退款背书声明 */}
        <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.pricing.guarantee}</span>
          </div>
          <div className="text-zinc-500">
            {t.pricing.security}
          </div>
        </div>
      </div>
    </div>
  );
}
