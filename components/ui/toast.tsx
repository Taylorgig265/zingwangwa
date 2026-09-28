"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toastIn } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";

interface Toast {
  id: number;
  message: string;
  emoji?: string;
}

const ToastContext = createContext<{ toast: (message: string, emoji?: string) => void }>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

const DURATION = 3200;

/** Slide + spring toasts with an auto-dismiss countdown ring. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const reduced = useReducedMotionSafe();

  const toast = useCallback((message: string, emoji = "🔥") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, emoji }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), DURATION);
  }, []);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.button
              key={t.id}
              layout
              className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-brand-cacao px-4 py-3 text-left text-brand-white shadow-bloom"
              onClick={() => dismiss(t.id)}
              initial={reduced ? { opacity: 0 } : toastIn.initial}
              animate={reduced ? { opacity: 1 } : toastIn.animate}
              exit={toastIn.exit}
            >
              <span className="text-xl" aria-hidden>
                {t.emoji}
              </span>
              <span className="flex-1 text-sm font-semibold">{t.message}</span>
              {/* countdown ring */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 -rotate-90">
                <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
                <motion.circle
                  cx="12" cy="12" r="10" fill="none" stroke="#FFBE00" strokeWidth="3"
                  strokeDasharray={2 * Math.PI * 10}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 10 }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              </svg>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
