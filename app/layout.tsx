import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'PrepBuddy — Exam Wellness Tracker',
  description:
    'PrepBuddy helps students preparing for JEE, NEET, CUET, CAT, GATE, UPSC, and board exams track mood, identify stress triggers, reflect safely, and receive a personalised wellness support plan.',
  keywords: [
    'JEE',
    'NEET',
    'CUET',
    'board exams',
    'exam stress',
    'student mental health',
    'wellness tracker',
    'UPSC',
    'stress triggers',
    'mood tracking',
  ],
  openGraph: {
    title: 'PrepBuddy — Exam Wellness Tracker',
    description:
      'Track mood, identify stress triggers, reflect safely, and get a personalised support plan for exam season.',
    type: 'website',
  },
};

import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import StudyTimer from '@/components/StudyTimer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeToggle />
          <ToastProvider>
            <StudyTimer />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
