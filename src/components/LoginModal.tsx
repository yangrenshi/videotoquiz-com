'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Coins, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginWithGoogleToken, loginWithDemo } = useAuth();
  const { lang } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [gisRendered, setGisRendered] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '840187226487-3n5h84m19ilf1s7tcgf4vgqe00nrmt4l.apps.googleusercontent.com';

  useEffect(() => {
    if (!isLoginModalOpen) {
      setGisRendered(false);
      return;
    }

    const handleCredentialResponse = async (response: any) => {
      if (response && response.credential) {
        setSubmitting(true);
        try {
          await loginWithGoogleToken(response.credential);
        } finally {
          setSubmitting(false);
        }
      }
    };

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'signin_with',
          logo_alignment: 'left',
          width: 340,
        });
        setGisRendered(true);
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.body.appendChild(script);
    }
  }, [isLoginModalOpen, googleClientId]);

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 179, 8, 0.08)',
        }}
      >
        {/* 背景微光 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* 关闭按钮 */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 头部图标与奖励胶囊 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3.5 shadow-inner">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '新用户首登即送 20 试用积分' : 'New Users Get 20 Free Credits'}</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {lang === 'zh' ? '使用 Google 账号登录' : 'Sign In with Google'}
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-xs leading-relaxed">
            {lang === 'zh'
              ? '登录后自由选择题目数量，每道题目仅消耗 1 积分，畅享深度测验与闪卡导出。'
              : 'Choose any custom question count. 1 Question = 1 Credit. Unlock high-retention tests instantly.'}
          </p>
        </div>

        {/* 核心权益列表 */}
        <div className="my-6 space-y-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'zh'
                ? '立享 20 点积分（可免费自选生成多套测验）'
                : 'Instant 20 Credits (Generate multiple custom quizzes)'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'zh'
                ? '按量透明计费，题量自由指定 (1 题 = 1 积分)'
                : 'Transparent credit rate: 1 Question = 1 Credit'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'zh'
                ? '支持导出可打印 A4 试卷及 Anki 记忆卡'
                : 'Export printable PDF worksheets & Anki flashcards'}
            </span>
          </div>
        </div>

        {/* Google 唯一官方按钮容器 */}
        <div className="flex flex-col items-center justify-center w-full min-h-[50px] relative">
          {submitting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/90 rounded-full gap-2 text-sm text-amber-400 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{lang === 'zh' ? '正在快速授权中...' : 'Authorizing...'}</span>
            </div>
          )}

          {/* Google GIS 原生挂载点：已登录自动显示“用某某身份登录”，未登录自动显示“使用 Google 账号登录” */}
          <div
            ref={googleBtnRef}
            className="flex justify-center w-full overflow-hidden rounded-full shadow-md"
            style={{ minHeight: '44px' }}
          />

          {/* 脚本加载中的微光占位 */}
          {!gisRendered && !submitting && (
            <div className="w-[340px] h-[44px] rounded-full bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-500">
              {lang === 'zh' ? '加载安全登录组件...' : 'Loading Google Sign-in...'}
            </div>
          )}
        </div>

        {/* 底部安全背书 */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {lang === 'zh'
              ? 'OAuth 2.0 官方认证保护 • 仅读取基础头像与邮箱'
              : 'OAuth 2.0 Certified • Only reads basic profile'}
          </span>
        </div>
      </div>
    </div>
  );
}
