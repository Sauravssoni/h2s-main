/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, Square, Coffee, BookOpen, Minimize2, Maximize2, BellRing } from 'lucide-react';
import { useToast } from '@/lib/useToast';

type TimerMode = 'focus' | 'break';

interface SessionOption {
  minutes: number;
  label: string;
}

const FOCUS_OPTIONS: SessionOption[] = [
  { minutes: 25, label: '25m Focus' },
  { minutes: 50, label: '50m Deep Work' },
];

const BREAK_OPTIONS: SessionOption[] = [
  { minutes: 5, label: '5m Quick Rest' },
  { minutes: 15, label: '15m Long Break' },
];

export default function StudyTimer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasPermission, setHasPermission] = useState<NotificationPermission>('default');
  const toast = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && hasPermission === 'default') {
      const permission = await Notification.requestPermission();
      setHasPermission(permission);
      if (permission === 'granted') {
        toast.showToast('Notifications enabled for timer alerts.', 'success');
      }
    }
  };

  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
      // Audio fallback failed
    }
  };

  const logSession = (completedMode: TimerMode, durationMinutes: number) => {
    try {
      if (typeof window !== 'undefined') {
        const key = 'prepbuddy:v1:timelog';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({
          date: new Date().toISOString(),
          mode: completedMode,
          duration: durationMinutes
        });
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch (e) {
      // ignore
    }
  };

  const triggerAlert = () => {
    playChime();
    
    if (hasPermission === 'granted' && 'Notification' in window) {
      const title = mode === 'focus' ? 'Focus Session Complete!' : 'Break Time is Over!';
      const body = mode === 'focus' 
        ? 'Time for a breather! Step away from the screen, stretch, and grab some water.' 
        : 'Ready to get back to it? Start your next focus session.';
        
      new Notification(title, { body, icon: '/icon.svg' });
    } else {
      toast.showToast(mode === 'focus' ? 'Focus Complete! Take a breather.' : 'Break over! Ready to focus?', 'success');
    }
    
    // Automatically switch mode logic if desired, or just reset
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
      // Timer finished!
      triggerAlert();
      logSession(mode, mode === 'focus' ? 25 : 5); // Simplification, track exact selected time
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, mode]); // removed triggerAlert, hasPermission dependencies to avoid re-triggering

  const toggleTimer = () => {
    if (!isRunning && hasPermission === 'default') {
      requestNotificationPermission();
    }
    setIsExpanded(true);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const setDuration = (minutes: number) => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate progress for circular ring
  const totalSeconds = mode === 'focus' ? 25 * 60 : 5 * 60; // We should probably store the selected total time, but for demo we assume 25 or 5 based on mode
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl shadow-2xl p-4 w-72 pointer-events-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1 bg-[var(--color-bg)] p-1 rounded-lg border border-[var(--color-card-border)]">
                <button
                  onClick={() => { setMode('focus'); setDuration(25); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${mode === 'focus' ? 'bg-[var(--color-teal)] text-[#022C22]' : 'text-[var(--color-subtle)] hover:text-[var(--color-text)]'}`}
                >
                  Focus
                </button>
                <button
                  onClick={() => { setMode('break'); setDuration(5); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${mode === 'break' ? 'bg-[var(--color-lavender)] text-[#0F172A]' : 'text-[var(--color-subtle)] hover:text-[var(--color-text)]'}`}
                >
                  Break
                </button>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-[var(--color-subtle)] hover:text-[var(--color-text)] p-1"
                aria-label="Minimize timer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center py-4 relative">
              <h3 className="text-4xl font-black tracking-tighter text-[var(--color-text)] tabular-nums">
                {formatTime(timeLeft)}
              </h3>
              <p className="text-xs font-bold text-[var(--color-muted)] mt-1 uppercase tracking-widest">
                {mode === 'focus' ? 'Deep Work' : 'Resting'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={toggleTimer}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${isRunning ? 'bg-[var(--color-bg)] border border-[var(--color-card-border)] text-[var(--color-text)]' : 'bg-[var(--color-teal)] text-[#022C22] shadow-lg shadow-[var(--color-teal)]/20'}`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-bg)] border border-[var(--color-card-border)] text-[var(--color-subtle)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Reset timer"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            {/* Notification request if default */}
            {hasPermission === 'default' && (
              <button 
                onClick={requestNotificationPermission}
                className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-[var(--color-subtle)] hover:text-[var(--color-lavender)] transition-colors p-2 bg-[var(--color-bg)] rounded-lg border border-[var(--color-card-border)]"
              >
                <BellRing className="w-3 h-3" /> Enable Alerts
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button when minimized */}
      {!isExpanded && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className={`pointer-events-auto shadow-xl rounded-full p-3 md:p-4 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${isRunning ? 'bg-[var(--color-teal)] focus-visible:ring-[var(--color-teal)]' : 'bg-[var(--color-card)] border border-[var(--color-card-border)] focus-visible:ring-[var(--color-lavender)]'}`}
        >
          {isRunning ? (
            <div className="relative">
              <Timer className="w-6 h-6 text-[#022C22]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
          ) : (
            <Timer className="w-6 h-6 text-[var(--color-text)]" />
          )}
          {isRunning && (
            <span className="text-sm font-bold text-[#022C22] tabular-nums hidden sm:inline-block pr-1">
              {formatTime(timeLeft)}
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
}
