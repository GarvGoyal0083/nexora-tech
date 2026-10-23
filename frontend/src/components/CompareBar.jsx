// frontend/src/components/CompareBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-[#0c1322]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-4 animate-slideUp">
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
          <span>({compareItems.length}/4)</span>
        </div>

        <div className="flex items-center gap-2">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="relative group flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-700/80 shrink-0"
            >
              <img
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80'}
                alt={item.title}
                className="w-8 h-8 rounded-lg object-contain bg-slate-950 p-0.5"
              />
              <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                {item.title}
              </span>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="text-slate-400 hover:text-rose-400 p-0.5"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-neon-cyan transition-all"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
