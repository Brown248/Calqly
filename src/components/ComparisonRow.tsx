import React from 'react';

interface ComparisonRowProps {
  label: string;
  v1: React.ReactNode;
  v2: React.ReactNode;
  highlightClass?: string;
}

export default function ComparisonRow({ label, v1, v2, highlightClass }: ComparisonRowProps) {
  return (
    <div className={`grid grid-cols-2 gap-8 py-4 border-b border-slate-100 ${highlightClass || ''}`}>
      <div className="px-4">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-lg font-black text-slate-800">{v1}</div>
      </div>
      <div className="px-4 border-l border-slate-100">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-lg font-black text-slate-800">{v2}</div>
      </div>
    </div>
  );
}
