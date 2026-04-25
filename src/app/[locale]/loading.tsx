import { CircleDollarSign } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fcfdfd]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 animate-[bounce_2s_infinite]">
          <CircleDollarSign size={32} className="animate-[spin_3s_linear_infinite]" />
        </div>
        <p className="text-teal-600 font-black tracking-widest uppercase text-sm animate-pulse">
          CalqlyHub
        </p>
      </div>
    </div>
  );
}