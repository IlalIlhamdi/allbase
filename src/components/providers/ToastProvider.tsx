"use client";

import React, { createContext, useContext, useState, useCallback, useId } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idPrefix = useId();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3200) => {
      const id = `${idPrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [idPrefix, removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, "success"), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, "error", 4500), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div className={styles.toastContainer} aria-live="polite" aria-label="Notifikasi Sistem">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toastItem} ${styles[t.type]}`}
            role="status"
          >
            <div className={styles.iconWrapper}>
              {t.type === "success" && <CheckCircle2 size={18} className={styles.iconSuccess} />}
              {t.type === "error" && <AlertCircle size={18} className={styles.iconError} />}
              {t.type === "info" && <Info size={18} className={styles.iconInfo} />}
            </div>
            <span className={styles.message}>{t.message}</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => removeToast(t.id)}
              aria-label="Tutup notifikasi"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
