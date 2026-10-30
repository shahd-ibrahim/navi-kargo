import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCargo } from '../../context/CargoContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCargo();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      <span className="text-sm font-medium">{toastMessage}</span>
    </div>
  );
};

export default Toast;

