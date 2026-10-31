import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | VideoToQuiz AI',
  description: 'Your personal learning dashboard, quiz history, and credits.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/dashboard',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
