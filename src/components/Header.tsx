'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Zap, Globe, Coins, LogOut, User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenPricing?: () => void;
}

export default function Header({ onOpenPricing }: HeaderProps) {
  const { lang, toggleLang, t } = useLanguage();
  const { user, openLoginModal, logout, openPricingModal } = useAuth();

  const handlePricingClick = onOpenPricing || openPricingModal;

  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors shadow-sm">
            <GraduationCap className="w-4 h-4 text-zinc-200" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-zinc-100 tracking-tight">YouTube to Quiz</span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              AI
            </span>
          </div>
        </Link>

        {/* 右侧导航与操作 */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            href="/about"
            className="hidden sm:inline-flex text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {lang === 'zh' ? '关于' : 'About'}
          </Link>
          <Link
            href="/topics"
            className="hidden sm:inline-flex text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {lang === 'zh' ? '公开课题库' : 'Study Topics'}
          </Link>
          <a
            href="/#comparison"
            className="hidden md:inline-flex text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {t.nav.whyUs}
          </a>
          <a
            href="#faq"
            className="hidden md:inline-flex text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {t.nav.faq}
          </a>

          {/* 仪表盘链接 (已登录或游客均可点击查看测验库) */}
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <span>{lang === 'zh' ? '个人中心' : 'Dashboard'}</span>
          </Link>

          {/* 语言切换胶囊按钮 */}
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all shadow-sm active:scale-95"
            title="Switch Language / 切换语言"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{lang === 'en' ? '中文' : 'EN'}</span>
          </button>

          {/* 登录态与积分展示 */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* 积分徽章 (点击可充值) */}
              <button
                type="button"
                onClick={handlePricingClick}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold hover:bg-amber-500/25 transition-all shadow-sm active:scale-95"
                title={lang === 'zh' ? '当前积分余额，点击充值' : 'Credit Balance, click to add'}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.credits}</span>
                <span className="text-[10px] text-amber-400/80">{lang === 'zh' ? '积分' : 'pts'}</span>
              </button>

              {/* 用户头像 (点击跳转个人中心) 与登出 */}
              <div className="flex items-center gap-1.5 pl-1">
                <Link
                  href="/dashboard"
                  className="hover:opacity-85 transition-opacity"
                  title={lang === 'zh' ? '进入个人中心' : 'Open Dashboard'}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-7 h-7 rounded-full border border-amber-500/40 object-cover hover:border-amber-400 transition-colors"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-semibold hover:border-zinc-500">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  title={lang === 'zh' ? '退出登录' : 'Sign Out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all shadow-sm active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'zh' ? '登录送20积分' : 'Sign In (+20 Free)'}</span>
            </button>
          )}

          {/* 定价 / 充值按钮 */}
          <button
            type="button"
            onClick={handlePricingClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xs:inline">{t.nav.pricing}</span>
            <span className="xs:hidden">{lang === 'zh' ? '充值' : 'Pro'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
