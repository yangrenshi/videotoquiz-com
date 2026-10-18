'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* 左侧品牌与版权 */}
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-200">YouTube to Quiz AI</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {t.footer.brandDesc}
          </p>
          <p className="text-[11px] text-zinc-600">
            © 2026 YouTube to Quiz AI. All rights reserved.
          </p>
        </div>

        {/* 右侧合规法律链接与客服邮箱 */}
        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <Link href="/about" className="hover:text-amber-400 transition-colors">
              {lang === 'zh' ? '关于我们' : 'About Us'}
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              {lang === 'zh' ? '联系我们' : 'Contact'}
            </Link>
            <Link href="/topics" className="hover:text-amber-400 transition-colors">
              {lang === 'zh' ? '公开课题库' : 'Study Topics'}
            </Link>
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">
              {t.footer.terms}
            </Link>
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/refund" className="hover:text-zinc-200 transition-colors">
              {t.footer.refund}
            </Link>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 text-[11px] mt-1">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Support: support@videotoquiz.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
