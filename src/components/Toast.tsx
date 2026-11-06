import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { alertaGlobal, setAlertaGlobal } = useApp();

  useEffect(() => {
    if (alertaGlobal) {
      const timer = setTimeout(() => {
        setAlertaGlobal(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertaGlobal, setAlertaGlobal]);

  if (!alertaGlobal) return null;

  const isWarningOrDanger = alertaGlobal.includes('🚨') || alertaGlobal.includes('⚠️') || alertaGlobal.includes('🚫');

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
        isWarningOrDanger 
          ? 'bg-rose-50/95 dark:bg-rose-950/95 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100' 
          : 'bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isWarningOrDanger ? (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
          )}
        </div>
        <div className="text-sm font-medium flex-1 leading-snug">
          {alertaGlobal}
        </div>
        <button
          onClick={() => setAlertaGlobal(null)}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 cursor-pointer p-0.5"
          title="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
