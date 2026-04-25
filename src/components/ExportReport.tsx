'use client';
import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Table } from 'lucide-react';
import { exportToCSV } from '@/utils/exportUtils';

interface ExportReportProps<T extends object> {
  elementId?: string; // Kept for backwards compatibility with parent components
  fileName?: string;
  csvData?: T[];
}

export default function ExportReport<T extends object>({ fileName = 'calqly-report', csvData }: ExportReportProps<T>) {
  const t = useTranslations('Common');

  if (!csvData) return null;

  return (
    <div className="flex flex-col gap-3 w-full mt-6">
      <m.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => exportToCSV(csvData, fileName)}
        className="w-full px-5 py-4 rounded-2xl bg-slate-800 text-white font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all shadow-lg shadow-slate-800/10"
      >
        <Table size={16} />
        <span>{t('export_csv') || 'Export CSV (Excel)'}</span>
      </m.button>
    </div>
  );
}
