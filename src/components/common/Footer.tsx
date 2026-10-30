import React from 'react';
import { Boxes } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Boxes className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-700">Navigo Kargo Teknolojileri A.Ş.</span>
          <span>- Dijital Kargo ve Taşıma Ağı</span>
        </div>
        <div className="flex items-center space-x-6 text-slate-400">
          <span>Sözleşmeli Lojistik Altyapısı</span>
          <span>•</span>
          <span>Vercel / GitHub Ready</span>
          <span>•</span>
          <span>Zebra ZPL / A4 Uyumlu</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

