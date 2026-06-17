import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4500);
    return id;
  }, [removeToast]);

  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, success, error, info }),
    [toasts, addToast, removeToast, success, error, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  const styles = {
    success: 'border-green-800 bg-green-950/95 text-green-300',
    error: 'border-red-800 bg-red-950/95 text-red-300',
    info: 'border-amber-700 bg-amber-950/60 text-amber-400',
  };

  const icons = { success: '✅', error: '❌', info: '🔔' };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-slide-in rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${styles[toast.type]}`}
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-start gap-2">
              <span aria-hidden="true">{icons[toast.type]}</span>
              <span>{toast.message}</span>
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-zinc-400 hover:text-zinc-100"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }
  return context;
}
