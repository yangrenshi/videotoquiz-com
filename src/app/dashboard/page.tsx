'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Zap,
  Coins,
  LogOut,
  Calendar,
  Sparkles,
  PlayCircle,
  FileDown,
  Trash2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Mail,
  User as UserIcon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import PricingModal from '@/components/PricingModal';
import {
  getSavedQuizzes,
  deleteSavedQuiz,
  getStudyStats,
  SavedQuizRecord
} from '@/lib/quiz-storage';

type DashboardTab = 'quizzes' | 'billing' | 'settings';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, openLoginModal } = useAuth();
  const { lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<DashboardTab>('quizzes');
  const [quizzes, setQuizzes] = useState<SavedQuizRecord[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    scoredCount: 0,
    averageScorePercent: 0,
    estimatedMinutesSaved: 0
  });
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [exportedToast, setExportedToast] = useState<string | null>(null);

  // 加载本地测验与统计
  const refreshStorage = () => {
    const list = getSavedQuizzes();
    setQuizzes(list);
    setStats(getStudyStats());
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  // 删除单份测验
  const handleDeleteQuiz = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(lang === 'zh' ? '确定要从历史库中删除该测验吗？' : 'Delete this quiz from your library?')) {
      deleteSavedQuiz(id);
      refreshStorage();
    }
  };

  // 导出 Flashcards
  const handleExportFlashcards = (quiz: SavedQuizRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = `# ${quiz.title} - Study Flashcards\n\nSource: ${quiz.videoUrl || 'YouTube Video'}\nGenerated via VideoToQuiz AI\n\n` +
      quiz.data.questions.map((q, idx) => {
        const correctLetter = String.fromCharCode(65 + q.answerIndex);
        const optionsText = q.options.map((opt, optIdx) => `- [${String.fromCharCode(65 + optIdx)}] ${opt}`).join('\n');
        return `### Q${idx + 1}: ${q.question}\n\n` +
          `**Options:**\n${optionsText}\n\n` +
          `**Correct Answer:** [${correctLetter}] ${q.options[q.answerIndex] || ''}\n\n` +
          `**Explanation:** ${q.explanation}\n\n` +
          `---\n`;
      }).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_flashcards.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExportedToast(lang === 'zh' ? '闪卡已导出为 Markdown 格式！' : 'Flashcards exported as Markdown!');
    setTimeout(() => setExportedToast(null), 3000);
  };

  // 格式化时间戳
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* 提示吐司 */}
      {exportedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-zinc-950 px-4 py-2.5 rounded-xl font-medium text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportedToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. Profile Banner Header (用户信息顶栏) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User Avatar'}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-zinc-700/80 shadow-md object-cover"
              />
            ) : (
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-zinc-400">
                <UserIcon className="w-8 h-8" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user ? (user.name || user.email.split('@')[0]) : (lang === 'zh' ? '学习探险家' : 'Guest Learner')}
                </h1>
                {/* 会员徽章 */}
                {user && user.credits > 10 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-zinc-950 shadow-sm">
                    <Sparkles className="w-3 h-3 fill-current" />
                    PRO MEMBER
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    FREE TIER
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {user?.email || 'Sign in to sync quizzes'}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Active since Oct 2026
                </span>
              </div>
            </div>
          </div>

          {/* 快捷操作区 */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{lang === 'zh' ? '生成新测验' : 'New Quiz'}</span>
            </Link>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all"
                title={lang === 'zh' ? '退出登录' : 'Sign out'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all"
              >
                <span>{lang === 'zh' ? '登录同步' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Three Metric Cards (核心指标三卡片) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 卡片 1: 额度与积分 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm relative group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-zinc-400">
              {lang === 'zh' ? '可用积分与额度' : 'Credits & Quota'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {user ? user.credits : 20}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {lang === 'zh' ? '积分剩余' : 'pts available'}
            </span>
          </div>
          {/* 进度条 */}
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, ((user?.credits || 20) / 50) * 100))}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsPricingOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'zh' ? '充值更多点数' : 'Top Up Credits'}</span>
          </button>
        </div>

        {/* 卡片 2: 生成的测验与闪卡 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm relative group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-zinc-400">
              {lang === 'zh' ? '已生成测验套数' : 'Quizzes Archived'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats.totalQuizzes}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {lang === 'zh' ? '套历史题库' : 'decks saved'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {lang === 'zh'
              ? '支持离线复习、重新测试与导出 Anki / Markdown 闪卡。'
              : 'Active recall ready. Export to Anki or review anytime.'}
          </p>
        </div>

        {/* 卡片 3: 学习效率与掌握度 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm relative group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-zinc-400">
              {lang === 'zh' ? '平均掌握度 / 得分率' : 'Average Mastery'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats.averageScorePercent > 0 ? `${stats.averageScorePercent}%` : '--'}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {stats.scoredCount} {lang === 'zh' ? '次完成作答' : 'completed'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>~{stats.estimatedMinutesSaved} mins {lang === 'zh' ? '节省学习时长' : 'study time saved'}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Navigation Tabs (功能标签页切换) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quizzes'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'zh' ? '我的测验库' : 'My Quizzes'}</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-700 text-zinc-300 font-mono">
            {quizzes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'billing'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{lang === 'zh' ? '账单与订阅' : 'Billing & Plan'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === 'zh' ? '偏好与安全' : 'Account & Settings'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. Tab 1: My Quizzes (测验复习与闪卡列表) */}
      {/* ========================================================================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            /* 空状态 Empty State */
            <div className="rounded-2xl border-2 border-dashed border-zinc-800 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'zh' ? '暂无生成的测验' : 'No Quizzes Saved Yet'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
                {lang === 'zh'
                  ? '粘贴任意 YouTube 教学视频或讲座链接，秒级提取知识点并生成主动回忆测验与闪卡。'
                  : 'Paste any YouTube video lecture or tutorial URL to generate interactive quizzes, timestamped hints, and flashcards.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{lang === 'zh' ? '立即去首页生成' : 'Generate First Quiz'}</span>
              </Link>
            </div>
          ) : (
            /* 测验卡片列表 (Card Grid) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* 卡片顶栏：封面图 + 标题 */}
                    <div className="flex gap-4 mb-4">
                      {quiz.thumbnailUrl ? (
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50 flex-shrink-0 relative">
                          <img
                            src={quiz.thumbnailUrl}
                            alt={quiz.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-indigo-950 to-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-indigo-400">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white tracking-tight line-clamp-2 leading-snug mb-1 group-hover:text-amber-300 transition-colors">
                          {quiz.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                          <span>{quiz.questionCount} {lang === 'zh' ? '题' : 'Questions'}</span>
                          <span>•</span>
                          <span>{formatDate(quiz.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 得分状态与掌握度 */}
                    {quiz.score !== undefined && quiz.totalQuestions && (
                      <div className="mb-4 px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-mono text-[11px]">
                          {lang === 'zh' ? '上次测试成绩' : 'Last Score'}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300">
                            {quiz.score} / {quiz.totalQuestions}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono font-bold">
                            {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 底部按钮栏 */}
                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                        title={lang === 'zh' ? '重新作答' : 'Retake Quiz'}
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'zh' ? '做题' : 'Practice'}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleExportFlashcards(quiz, e)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
                        title="Export Anki Markdown"
                      >
                        <FileDown className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{lang === 'zh' ? '导出闪卡' : 'Export'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title={lang === 'zh' ? '删除' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. Tab 2: Billing & Plan (账单与订阅) */}
      {/* ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-current" />
              <span>{lang === 'zh' ? '当前订阅与计划' : 'Current Plan & Status'}</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {lang === 'zh'
                ? '我们支持按量一次性买断额度与包月无限会员，所有订单支持全球信用卡、Apple Pay、Google Pay、PayPal 与支付宝。'
                : 'Choose between pay-as-you-go credit packs or unlimited monthly membership. Support Global Cards, Apple Pay, PayPal & Alipay.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 免费计划卡片 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-zinc-400">FREE STARTER</span>
                    <span className="text-xs text-zinc-500">$0 / Free</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    {lang === 'zh' ? '新用户体验计划' : 'Starter Explorer'}
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2 mb-4 font-mono">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{lang === 'zh' ? '免费赠送 20 积分' : '20 Free Bonus Credits'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{lang === 'zh' ? '支持5道题主动回忆测验' : '5-Question AI Active Recall'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{lang === 'zh' ? '全站免费闪卡导出' : 'Free Markdown & Anki Export'}</span>
                    </li>
                  </ul>
                </div>
                <span className="text-xs font-mono text-zinc-500 py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800/80 text-center">
                  {lang === 'zh' ? '当前默认激活' : 'Active Plan'}
                </span>
              </div>

              {/* Pro 终身卡片 */}
              <div className="rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent p-5 flex flex-col justify-between relative">
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-400 text-zinc-950">
                    POPULAR
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-300">PRO LIFETIME</span>
                    <span className="text-xs text-amber-300 font-mono font-bold">$4.99 one-time</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    {lang === 'zh' ? '高阶学习者买断包' : 'Power Learner Pack'}
                  </h4>
                  <ul className="text-xs text-zinc-300 space-y-2 mb-4 font-mono">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'zh' ? '+100 点永久生成积分' : '+100 Permanent Credits'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'zh' ? '支持 10 道长视频高精试卷' : '10-Question Deep Exams'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'zh' ? '时间戳智能视频跳转解析' : 'Timestamped Explanations'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPricingOpen(true)}
                  className="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95 text-center"
                >
                  {lang === 'zh' ? '一键解锁 Pro 权限 ($4.99)' : 'Upgrade to Pro ($4.99)'}
                </button>
              </div>
            </div>
          </div>

          {/* 订单与发票说明卡片 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'zh' ? '需要官方发票或企业开票？' : 'Need an Invoice or Receipt?'}
              </h4>
              <p className="text-xs text-zinc-400">
                {lang === 'zh'
                  ? '所有支付均由 Waffo Pancake / Creem / PayPal 官方合规履约，发送订单号至客服邮箱即可索取。'
                  : 'Orders are processed securely via Waffo / Creem / PayPal. Contact our billing support with your Order ID.'}
              </p>
            </div>
            <a
              href="mailto:support@videotoquiz.com?subject=VideoToQuiz%20Invoice%20Request"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex-shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Billing</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. Tab 3: Account & Settings (账户与偏好设置) */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'zh' ? '关联账户与安全' : 'Account & Security'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'zh' ? '您的账户通过 Google OAuth 2.0 权威加密授权。' : 'Your identity is authenticated via Google OAuth 2.0.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Primary Email</span>
                <span className="text-zinc-200 font-semibold">{user?.email || 'Not connected'}</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">User Identifier</span>
                <span className="text-zinc-200 font-semibold">{user?.id || 'guest'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">
                  {lang === 'zh' ? '退出当前登录态' : 'Sign out of your session'}
                </h4>
                <p className="text-xs text-zinc-500">
                  {lang === 'zh' ? '随时可以再次通过同一 Google 账号无损登录同步。' : 'You can log back in with your Google account anytime.'}
                </p>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all active:scale-95"
                >
                  {lang === 'zh' ? '确认登出' : 'Sign Out'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 充值弹窗复用 */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => {
          setIsPricingOpen(false);
          refreshStorage();
        }}
      />
    </div>
  );
}
