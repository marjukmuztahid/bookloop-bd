import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useAppToast = () => useContext(ToastContext);

let toastId = 0;

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-[rgba(48,209,88,0.12)] border-[rgba(48,209,88,0.30)] text-[#1A7A35]',
  error: 'bg-[rgba(255,69,58,0.12)] border-[rgba(255,69,58,0.30)] text-[#C0392B]',
  info: 'bg-[rgba(255,255,255,0.80)] border-[rgba(0,0,0,0.10)] text-[#3A3A3A]',
};

const variantIcons: Record<ToastVariant, ReactNode> = {
  success: <Check size={16} />,
  error: <X size={16} />,
  info: <Info size={16} />,
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`glass-panel-sm flex max-w-[380px] items-center gap-2.5 border px-4 py-3 text-sm font-medium backdrop-blur-[12px] ${variantStyles[toast.variant]}`}
            >
              {variantIcons[toast.variant]}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
