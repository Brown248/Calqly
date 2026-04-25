'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { buildSharedUrl } from '@/utils/shareState';

interface ShareButtonProps {
  data: Record<string, unknown>;
}

export default function ShareButton({ data }: ShareButtonProps) {
  const t = useTranslations('Common');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    try {
      const shareUrl = buildSharedUrl(data);

      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to share', e);
    }
  };

  return (
    <m.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleShare}
      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white hover:border-slate-300 transition-all shadow-sm"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <m.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={14} className="text-emerald-500" />
            <span className="text-emerald-600">{t('link_copied')}</span>
          </m.div>
        ) : (
          <m.div
            key="share"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Share2 size={14} />
            <span>{t('share_result')}</span>
          </m.div>
        )}
      </AnimatePresence>
    </m.button>
  );
}

