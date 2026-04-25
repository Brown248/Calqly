'use client';

import { useState } from 'react';
import { useFinancialStore } from '@/hooks/useFinancialStore';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import { Download, Upload, ShieldCheck, Database, AlertCircle } from 'lucide-react';

export default function DataPortableManager() {
  const t = useTranslations('DataPortable');
  const { projects, importProjects } = useFinancialStore();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(projects, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `calqly-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          importProjects(json);
          setStatus('success');
          setTimeout(() => setStatus('idle'), 3000);
        } else {
          throw new Error('Invalid format');
        }
      } catch {
        alert(t('import_failed'));
        setStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/10 text-teal-600 rounded-lg">
          <Database size={18} />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t('title')}</h4>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <m.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportData}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
        >
          <Download size={16} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{t('export')}</span>
        </m.button>

        <div className="relative">
          <input 
            type="file" 
            accept=".json" 
            onChange={importData}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label={t('import')}
          />
          <m.div
            whileHover={{ y: -2 }}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group h-full"
          >
            <Upload size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{t('import')}</span>
          </m.div>
        </div>
      </div>

      <AnimatePresence>
        {status !== 'idle' && (
          <m.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
          >
            {status === 'success' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
            <span className="text-[11px] font-black uppercase tracking-widest">
              {status === 'success' ? t('success') : t('failed')}
            </span>
          </m.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-6 border-t border-slate-200/60">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-teal-500" /> {t('privacy')}
          </span>
          <span>{projects.length} {t('saved_count')}</span>
        </div>
      </div>
    </div>
  );
}
