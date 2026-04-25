'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { m } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ href, label, className = "" }: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations('Common');

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <m.button
      onClick={handleBack}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-3 py-2 text-slate-500 hover:text-teal-600 font-bold text-sm transition-colors group ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
        <ArrowLeft size={16} />
      </div>
      <span>{label || t('back')}</span>
    </m.button>
  );
}
