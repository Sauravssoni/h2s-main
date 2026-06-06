'use client';

import React, { useState, useCallback } from 'react';
import { ToastContext, ToastMessage, ToastType } from '@/lib/useToast';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-xl shadow-lg border backdrop-blur-md text-sm font-medium animate-in slide-in-from-bottom-5 fade-in-0
              ${toast.type === 'success' ? 'bg-[#064E3B]/90 border-[#059669] text-[#A7F3D0]' : ''}
              ${toast.type === 'error' ? 'bg-[#7F1D1D]/90 border-[#DC2626] text-[#FECACA]' : ''}
              ${toast.type === 'info' ? 'bg-[#EAE5DF]/90 border-[#D6D1CB] text-[#1C1917]' : ''}
            `}
            role="status"
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
              aria-label="Close message"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
