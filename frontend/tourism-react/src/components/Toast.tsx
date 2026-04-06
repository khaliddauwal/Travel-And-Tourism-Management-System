import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast { id: string; message: string; type: "success"|"error"|"warning"|"info"; }
interface ToastContextType { showToast: (message: string, type?: Toast["type"]) => void; }

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const COLORS: Record<Toast["type"], string> = {
  success: "#10b981",
  error:   "#ef4444",
  warning: "#f59e0b",
  info:    "#3b82f6",
};

const ICONS: Record<Toast["type"], string> = {
  success: "[OK]",
  error:   "[ERR]",
  warning: "[WARN]",
  info:    "[INFO]",
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: "80px",
    right: "20px",
    zIndex: 99999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "360px",
    width: "100%",
    pointerEvents: "none",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={containerStyle}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#1e293b",
              color: "#f1f5f9",
              border: `2px solid ${COLORS[t.type]}`,
              borderLeft: `6px solid ${COLORS[t.type]}`,
              borderRadius: "10px",
              padding: "14px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              fontSize: "0.95rem",
              fontWeight: 500,
              pointerEvents: "all",
            }}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0, fontWeight: 700, color: COLORS[t.type] }}>
              {ICONS[t.type]}
            </span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.3rem", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
