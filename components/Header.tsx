import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewType } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const MilledGroove = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute inset-0" style={{
      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)`,
      maskImage: 'linear-gradient(to right, transparent, black, transparent)'
    }} />
  </div>
);

const TactileButton = ({
  onClick,
  children,
  active = false,
  className = ""
}: {
  onClick?: () => void,
  children: React.ReactNode,
  active?: boolean,
  className?: string
}) => (
  <motion.button
    whileHover={{ y: -1 }}
    whileTap={{ y: 1 }}
    onClick={onClick}
    className={`
      relative group flex items-center justify-center
      px-4 py-2 rounded-sm transition-all duration-200
      ${active 
        ? 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}
      ${className}
    `}
  >
    <div className="absolute inset-0 border border-zinc-200 dark:border-zinc-800 opacity-50 group-hover:opacity-100 transition-opacity" />
    <div className="absolute -left-px top-1/4 bottom-1/4 w-px bg-zinc-400/20 group-hover:bg-amber-500/50 transition-colors" />
    <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
      {children}
    </span>
  </motion.button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-50 dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-900 overflow-hidden">
      {/* Machined Texture Overlay */}
      <MilledGroove />
      
      {/* The Monolith Strata */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Unit: Milled from a single block */}
          <div className="flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative flex items-center"
            >
              <a
                href="https://apk.jessejesse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center w-12 h-12 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <img src="/android.svg" alt="logo" className="w-6 h-6 z-10 invert dark:invert-0 brightness-50 dark:brightness-100" />
              </a>
              {/* Geometric Detail */}
              <div className="absolute -right-2 -top-2 w-4 h-4 border-t border-r border-zinc-400/30" />
            </motion.div>

            <div className="hidden md:flex flex-col">
              <button
                onClick={() => onViewChange('home')}
                className="group flex flex-col items-start"
              >
                <span className="text-xs font-mono text-amber-500/80 tracking-widest leading-none mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  SYSTEM.READY
                </span>
                <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-baseline gap-1">
                  APK
                  <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
                  <span className="text-zinc-500 dark:text-zinc-500 font-light italic">BUILDER</span>
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Strata */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 mr-4 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <TactileButton
                active={currentView === 'home'}
                onClick={() => onViewChange('home')}
              >
                TERMINAL
              </TactileButton>
              <TactileButton
                active={currentView === 'docs'}
                onClick={() => onViewChange('docs')}
              >
                ARCHIVE
              </TactileButton>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/sudo-self/apk-builder-actions"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="z-10"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                <div className="absolute inset-0 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full scale-0 group-hover:scale-100 transition-transform" />
              </a>
              
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
              
              <div className="relative p-1 bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-sm">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finishing Detail: Status Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-zinc-900 dark:bg-white" />
        <div className="h-full w-2/3 bg-zinc-200 dark:bg-zinc-900" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .machined-mask {
          mask-image: radial-gradient(circle at center, black, transparent);
        }
      `}} />
    </nav>
  );
};
