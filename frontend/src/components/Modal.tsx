import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children, actions }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose} 
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="glass relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/60 p-8 shadow-2xl"
          >
            {title && (
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h3>
                <div className="mt-2 h-1 w-12 rounded-full bg-pastel-purple" />
              </div>
            )}
            <div className="space-y-5">{children}</div>
            {actions && <div className="mt-8 flex justify-end gap-3">{actions}</div>}
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100/50 text-gray-500 hover:bg-white hover:text-gray-800 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
