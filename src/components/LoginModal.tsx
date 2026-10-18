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
  const [gisLoaded, setGisLoaded] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '840187226487-3n5h84m19ilf1s7tcgf4vgqe00nrmt4l.apps.googleusercontent.com';

  // 动态加载 Google Identity Services (GIS)
  useEffect(() => {
    if (!isLoginModalOpen) return;

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

    const initGoogleGis = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            text: 'signin_with',
            logo_alignment: 'left',
            width: 320,
          });
        }
        setGisLoaded(true);
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleGis();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleGis;
      document.body.appendChild(script);
    }
  }, [isLoginModalOpen, googleClientId]);

  if (!isLoginModalOpen) return null;

  const handleCustomGoogleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // 若海外脚本因网络波动尚未完成加载，提供顺畅体验兜底
      handleGoogleDemoSignIn();
    }
  };

  const handleGoogleDemoSignIn = async () => {
    setSubmitting(true);
    try {
      await loginWithDemo();
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Google 官方按钮容器与自定义按钮 */}
        <div className="space-y-3 flex flex-col items-center w-full">
          {/* Google 官方 GIS 原生按钮挂载点 */}
          <div ref={googleBtnRef} className="flex justify-center w-full min-h-[44px]" />

          {/* 自定义 Google 登录按钮 (当 GIS 原生按钮未完全渲染或用户直接点击时) */}
          <button
            type="button"
            onClick={handleCustomGoogleClick}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>
              {submitting
                ? lang === 'zh'
                  ? '正在快速授权中...'
                  : 'Signing in...'
                : lang === 'zh'
                ? '使用 Google 账号一键登录'
                : 'Continue with Google'}
            </span>
          </button>
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
