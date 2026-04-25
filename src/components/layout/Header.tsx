'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { m, AnimatePresence, LayoutGroup } from 'framer-motion';
import Magnetic from '@/components/animations/Magnetic';
import { 
  Languages, 
  Menu, 
  X, 
  CircleDollarSign,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Header');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_ITEMS = [
    { href: '/', label: t('home') },
    { href: '/calculators', label: t('tools') },
    { href: '/articles', label: t('articles') },
    { href: '/about-us', label: t('about') },
  ];

  const switchLocale = () => {
    const nextLocale = locale === 'th' ? 'en' : 'th';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled ? 'py-4' : 'py-6 md:py-8'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <m.div 
          layout
          className={`flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'px-6 py-3 bg-white/70 backdrop-blur-3xl rounded-[28px] border border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.4)_inset]'
              : 'px-0 py-0 bg-transparent border-transparent'
          }`}
        >
          {/* LOGO AREA */}
          <Magnetic strength={0.15}>
            <Link href="/" className="flex items-center gap-3 group shrink-0 relative">
              <m.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-10 h-10 md:w-11 md:h-11 rounded-[18px] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/20 group-hover:shadow-teal-600/40 transition-all duration-500"
              >
                <CircleDollarSign size={22} className="md:w-6 md:h-6" strokeWidth={2.5} />
              </m.div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-800 leading-none group-hover:text-teal-600 transition-colors duration-300">
                  Calqly<span className="text-teal-600 group-hover:text-emerald-500 transition-colors">Hub</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1 flex items-center gap-1.5">
                  <Sparkles size={8} className="text-teal-400" /> {t('zen_finance')}
                </span>
              </div>
            </Link>
          </Magnetic>

          {/* DESKTOP NAV: The Floating Dock */}
          <nav 
            className="hidden lg:flex items-center bg-slate-900/5 backdrop-blur-md rounded-[20px] p-1.5 gap-1 relative overflow-hidden transition-all duration-500"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <LayoutGroup id="nav-pill">
              {mounted && NAV_ITEMS.map((item, index) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={`px-5 py-2.5 rounded-[14px] text-[13.5px] font-bold transition-all duration-300 relative whitespace-nowrap z-10 ${
                      isActive ? 'text-teal-800' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {/* Active Pill: Liquid Spring */}
                    {isActive && (
                      <m.span 
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-white rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]"
                        transition={{ type: "spring", stiffness: 350, damping: 32 }}
                      />
                    )}
                    
                    {/* Hover Pill: Ghost Shadow */}
                    {hoveredIndex === index && !isActive && (
                      <m.span 
                        layoutId="nav-hover-pill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/60 rounded-[14px] -z-10"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <span className="relative z-20">{item.label}</span>
                  </Link>
                );
              })}
            </LayoutGroup>
          </nav>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <Magnetic strength={0.2}>
              <button 
                onClick={switchLocale}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-[12px] font-black text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300 border border-transparent hover:border-teal-100/50 uppercase tracking-widest"
              >
                <Languages size={15} />
                <span>{locale === 'th' ? 'EN' : 'TH'}</span>
              </button>
            </Magnetic>

            <button 
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-[18px] bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300 shadow-sm"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </m.div>
      </div>

      {/* MOBILE DRAWER: Premium Staggered Reveal */}
      <AnimatePresence>
        {isMobileOpen && (
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden mx-6 mt-4 p-3 bg-white/85 backdrop-blur-3xl rounded-[32px] shadow-2xl border border-white/50 flex flex-col gap-2 overflow-hidden"
          >
            {NAV_ITEMS.map((item, i) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`px-6 py-4.5 rounded-[22px] text-[16px] font-black flex items-center justify-between transition-all duration-200 ${
                      isActive 
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    <m.div animate={{ x: isActive ? 5 : 0 }}>
                      <ChevronRight size={18} className={isActive ? 'text-white' : 'text-slate-300'} />
                    </m.div>
                  </Link>
                </m.div>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

