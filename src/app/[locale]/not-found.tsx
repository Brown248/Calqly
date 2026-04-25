'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { m } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations('NotFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd] px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <div className="relative z-10 text-center max-w-lg">
        <m.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-white shadow-xl border border-teal-50 text-teal-600 mb-8 relative group">
             <m.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             >
                <Compass size={48} strokeWidth={1.5} />
             </m.div>
             <div className="absolute inset-0 rounded-[32px] bg-teal-400 opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <m.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-800/20 hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Home size={14} /> {t('back_home')}
            </m.button>
            <m.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-teal-200 hover:text-teal-600 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Back
            </m.button>
          </div>
        </m.div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
        >
          Error 404 — Page Not Found
        </m.p>
      </div>
    </div>
  );
}
