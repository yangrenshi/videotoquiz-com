'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Zap, 
  Globe, 
  Coins, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  BookOpen,
  LayoutDashboard,
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenPricing?: () => void;
}

export default function Header({ onOpenPricing }: HeaderProps) {
  const { lang, toggleLang, t } = useLanguage();
  const { user, openLoginModal, logout, openPricingModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePricingClick = () => {
    setMobileMenuOpen(false);
    if (onOpenPricing) {
      onOpenPricing();
    } else {
      openPricingModal();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
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

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-400">
          <Link
            href="/topics"
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400/90" />
            <span>{lang === 'zh' ? '公开课题库' : 'Study Topics'}</span>
          </Link>
          <a
            href="/#comparison"
            className="hover:text-zinc-200 transition-colors"
          >
            {t.nav.whyUs}
          </a>
          <a
            href="/#faq"
            className="hover:text-zinc-200 transition-colors"
          >
            {t.nav.faq}
          </a>
          <Link
            href="/about"
            className="hover:text-zinc-200 transition-colors"
          >
            {lang === 'zh' ? '关于' : 'About'}
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-zinc-200 transition-colors flex items-center gap-1"
          >
            <span>{lang === 'zh' ? '个人中心' : 'Dashboard'}</span>
          </Link>
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 语言切换胶囊按钮 */}
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all shadow-sm active:scale-95"
            title="Switch Language / 切换语言"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{lang === 'en' ? '中文' : 'EN'}</span>
          </button>

          {/* 登录态与积分展示 */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* 积分徽章 (点击可充值) */}
              <button
                type="button"
                onClick={handlePricingClick}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold hover:bg-amber-500/25 transition-all shadow-sm active:scale-95"
                title={lang === 'zh' ? '当前积分余额，点击充值' : 'Credit Balance, click to add'}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.credits}</span>
                <span className="text-[10px] text-amber-400/80 hidden xs:inline">{lang === 'zh' ? '积分' : 'pts'}</span>
              </button>

              {/* 用户头像与登出 */}
              <div className="flex items-center gap-1 pl-0.5">
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
                  className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:inline-flex"
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
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all shadow-sm active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{lang === 'zh' ? '登录送20积分' : 'Sign In (+20 Free)'}</span>
              <span className="sm:hidden">{lang === 'zh' ? '登录' : 'Sign In'}</span>
            </button>
          )}

          {/* 定价 / 充值按钮 */}
          <button
            type="button"
            onClick={handlePricingClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'zh' ? '充值' : 'Pricing'}</span>
          </button>

          {/* 移动端汉堡菜单触发按钮 (仅在 md 以下小屏幕呈现) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors md:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 移动端折叠抽屉菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-5 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/topics"
              onClick={closeMobileMenu}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 hover:border-amber-400/50 hover:text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{lang === 'zh' ? '公开课题库 (55+ 门顶级课程)' : 'Study Topics Directory'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300">
                pSEO
              </span>
            </Link>

            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'zh' ? '个人中心 / 我的测验历史' : 'My Dashboard & Quizzes'}</span>
            </Link>

            <Link
              href="/pricing"
              onClick={closeMobileMenu}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{lang === 'zh' ? '会员与充值方案 ($4.99 / $9.99)' : 'Pricing Plans ($4.99 / $9.99)'}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                30d Refund
              </span>
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="/#comparison"
                onClick={closeMobileMenu}
                className="p-2.5 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/40 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
              >
                {t.nav.whyUs}
              </a>
              <a
                href="/#faq"
                onClick={closeMobileMenu}
                className="p-2.5 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/40 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
              >
                {t.nav.faq}
              </a>
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
              <Link href="/about" onClick={closeMobileMenu} className="hover:text-zinc-300">
                {lang === 'zh' ? '关于我们' : 'About Us'}
              </Link>
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="text-rose-400/80 hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '退出登录' : 'Sign Out'}</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
