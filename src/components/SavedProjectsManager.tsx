'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFinancialStore, SavedProject } from '@/hooks/useFinancialStore';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, GitCompare, X, History } from 'lucide-react';
import DataPortableManager from '@/components/DataPortableManager';

interface SavedProjectsManagerProps {
  type: SavedProject['type'];
  onLoad: (project: SavedProject) => void;
  currentInput: Record<string, unknown>;
  currentResult: Record<string, unknown>;
  compareComponent?: (p1: SavedProject, p2: SavedProject) => React.ReactNode;
}

export default function SavedProjectsManager({ 
  type, 
  onLoad, 
  currentInput, 
  currentResult,
  compareComponent
}: SavedProjectsManagerProps) {
  const t = useTranslations('Common');
  const { projects, saveProject, removeProject } = useFinancialStore();
  const [isOpen, setIsOpen] = useState(false);
  const [compareWith, setCompareWith] = useState<SavedProject | null>(null);

  const filteredProjects = projects.filter(p => p.type === type);

  const [mountedTime, setMountedTime] = useState<number>(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMountedTime(Date.now()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentProjectPlaceholder: SavedProject = useMemo(() => ({
    id: 'current',
    name: 'Current',
    type,
    timestamp: mountedTime,
    input: currentInput,
    result: currentResult
  }), [type, currentInput, currentResult, mountedTime]);

  const handleSave = () => {
    const name = prompt(t('compare_select')) || `Plan ${filteredProjects.length + 1}`;
    saveProject({
      type,
      name,
      input: currentInput,
      result: currentResult
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
        >
          <Bookmark size={16} /> {t('save_for_compare')}
        </button>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          <History size={16} /> {t('saved_projects')} ({filteredProjects.length})
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <m.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <m.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <History className="text-teal-600" /> {t('saved_projects')}
                </h3>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-10">
                    <History size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold">{t('no_saved_projects')}</p>
                  </div>
                ) : (
                  filteredProjects.map((p) => (
                    <div key={p.id} className="group p-6 bg-slate-50 hover:bg-white border border-slate-100 hover:border-teal-200 rounded-[24px] transition-all flex items-center justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => { onLoad(p); setIsOpen(false); }}>
                        <div className="text-[11px] text-slate-400 font-black uppercase mb-1">{new Date(p.timestamp).toLocaleDateString()}</div>
                        <div className="text-lg font-black text-slate-800 group-hover:text-teal-600 transition-colors">{p.name}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {compareComponent && (
                          <button 
                            onClick={() => setCompareWith(p)}
                            className="p-3 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors flex items-center gap-2 font-black text-[11px] uppercase"
                          >
                            <GitCompare size={16} /> {t('compare_title')}
                          </button>
                        )}
                        <button 
                          onClick={() => removeProject(p.id)}
                          className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <DataPortableManager />
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compareWith && compareComponent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
            <m.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCompareWith(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <m.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-[#fcfdfd] rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <GitCompare className="text-teal-600" /> {t('compare_now')}
                  </h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase mt-1">Current vs {compareWith.name}</p>
                </div>
                <button onClick={() => setCompareWith(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {compareComponent(currentProjectPlaceholder, compareWith)}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
