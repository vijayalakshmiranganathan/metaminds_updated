import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'alert' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-[90vw] px-4 py-2.5 rounded-xl bg-[#213145] text-[#eaf1ff] font-label-md text-[13px] shadow-2xl flex items-center gap-2 z-50 transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <span
        className={`material-symbols-outlined text-[18px] ${
          type === 'alert'
            ? 'text-[#ffdad6]'
            : type === 'info'
            ? 'text-[#90cfec]'
            : 'text-[#4edea3]'
        }`}
      >
        {type === 'alert' ? 'warning' : type === 'info' ? 'info' : 'check_circle'}
      </span>
      <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {message}
      </span>
    </div>
  );
};
