'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Magnetic from './Magnetic';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmationModalProps) {
  // Styles based on variant
  const getColors = () => {
    switch (variant) {
      case 'warning':
        return {
          glow: 'bg-amber-500/10',
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          icon: <AlertTriangle className="h-8 w-8 text-amber-450 animate-pulse" />,
          btnConfirm:
            'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white border-amber-500/10 shadow-amber-950/40',
        };
      case 'success':
        return {
          glow: 'bg-emerald-500/10',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20',
          icon: <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-pulse" />,
          btnConfirm:
            'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white border-emerald-500/10 shadow-emerald-950/40',
        };
      case 'info':
        return {
          glow: 'bg-blue-500/10',
          iconBg: 'bg-blue-500/10 border-blue-500/20',
          icon: <ShieldAlert className="h-8 w-8 text-blue-400 animate-pulse" />,
          btnConfirm:
            'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white border-blue-500/10 shadow-blue-950/40',
        };
      case 'danger':
      default:
        return {
          glow: 'bg-rose-500/10',
          iconBg: 'bg-rose-500/10 border-rose-500/20',
          icon: <ShieldAlert className="h-8 w-8 text-rose-450 animate-pulse" />,
          btnConfirm:
            'bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white border-rose-500/10 shadow-rose-950/40',
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-[#050811]/85 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-[#0c1324] border border-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden z-10 font-jakarta"
          >
            {/* Radial glow background accent */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 ${colors.glow} blur-[85px] rounded-full pointer-events-none`}
            />

            <div className="text-center space-y-4 relative z-10">
              <div
                className={`h-16 w-16 rounded-full ${colors.iconBg} flex items-center justify-center mx-auto shadow-inner`}
              >
                {colors.icon}
              </div>

              <div className="space-y-2 px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full h-11 bg-slate-950/80 border border-slate-900 hover:border-slate-800 text-slate-350 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {cancelText}
              </button>

              <Magnetic range={15} actionStrength={0.2}>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`w-full h-11 ${colors.btnConfirm} font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg border cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{confirmText}</span>
                  )}
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
