// frontend/src/components/CompareBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl bg-black text-white rounded-full px-5 py-3 shadow-2xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Compare</span>
          <span className="text-neutral-400">({compareItems.length}/4)</span>
        </div>

        <div className="flex items-center gap-2">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 shrink-0"
            >
              <span className="text-xs text-white max-w-[110px] truncate">
                {item.title}
              </span>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={clearCompare}
          className="text-xs text-neutral-400 hover:text-white"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs flex items-center gap-1 hover:bg-neutral-200 transition-colors"
        >
          <span>Compare</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
