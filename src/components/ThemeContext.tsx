'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeId = 'dark' | 'light' | 'nobel';

type ThemeColors = {
  pageBg: string;
  pageGradientFrom: string;
  pageGradientVia: string;
  pageGlow: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  divider: string;
  cardBg: string;
  cardBorder: string;
  optionBg: string;
  optionBorder: string;
  optionHoverBg: string;
  optionHoverBorder: string;
  optionText: string;
  optionLetterBg: string;
  optionLetterHoverBg: string;
  optionLetterText: string;
  optionLetterHoverText: string;
  optionArrow: string;
  optionArrowHover: string;
  infoPanelBg: string;
  infoPanelBorder: string;
  infoPanelText: string;
  footerText: string;
  footerBorder: string;
  backText: string;
  backHoverText: string;
  warningHeaderBg: string;
  warningBorder: string;
  logo: string;
  partnerLogo?: string;
};

const themes: Record<ThemeId, ThemeColors> = {
  dark: {
    pageBg: 'bg-[#0B1120]',
    pageGradientFrom: 'from-[#0B1120]',
    pageGradientVia: 'via-[#0F1A2E]',
    pageGlow: 'bg-blue-600/[0.07]',
    text: 'text-white',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    divider: 'bg-slate-700',
    cardBg: 'bg-[#141E33]',
    cardBorder: 'border-slate-700/50',
    optionBg: 'bg-slate-800/60',
    optionBorder: 'border-slate-600/30',
    optionHoverBg: 'hover:bg-blue-600/15',
    optionHoverBorder: 'hover:border-blue-500/30',
    optionText: 'text-slate-200',
    optionLetterBg: 'bg-slate-700/60',
    optionLetterHoverBg: 'group-hover/btn:bg-blue-500/25',
    optionLetterText: 'text-slate-400',
    optionLetterHoverText: 'group-hover/btn:text-blue-300',
    optionArrow: 'text-slate-600',
    optionArrowHover: 'group-hover/btn:text-blue-400/70',
    infoPanelBg: 'bg-blue-950/40',
    infoPanelBorder: 'border-blue-800/30',
    infoPanelText: 'text-slate-300',
    footerText: 'text-slate-600',
    footerBorder: 'border-white/5',
    backText: 'text-slate-500',
    backHoverText: 'hover:text-slate-200',
    warningHeaderBg: 'bg-amber-500/10',
    warningBorder: 'border-amber-600/30',
    logo: '/dicr-logo-v5.png',
  },
  light: {
    pageBg: 'bg-slate-50',
    pageGradientFrom: 'from-slate-50',
    pageGradientVia: 'via-white',
    pageGlow: 'bg-blue-400/[0.06]',
    text: 'text-slate-900',
    textSecondary: 'text-slate-500',
    textMuted: 'text-slate-400',
    divider: 'bg-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    optionBg: 'bg-slate-50',
    optionBorder: 'border-slate-200',
    optionHoverBg: 'hover:bg-blue-50',
    optionHoverBorder: 'hover:border-blue-300',
    optionText: 'text-slate-700',
    optionLetterBg: 'bg-slate-100',
    optionLetterHoverBg: 'group-hover/btn:bg-blue-100',
    optionLetterText: 'text-slate-400',
    optionLetterHoverText: 'group-hover/btn:text-blue-600',
    optionArrow: 'text-slate-300',
    optionArrowHover: 'group-hover/btn:text-blue-500',
    infoPanelBg: 'bg-blue-50',
    infoPanelBorder: 'border-blue-100',
    infoPanelText: 'text-slate-600',
    footerText: 'text-slate-400',
    footerBorder: 'border-slate-200',
    backText: 'text-slate-400',
    backHoverText: 'hover:text-slate-700',
    warningHeaderBg: 'bg-amber-50',
    warningBorder: 'border-amber-200',
    logo: '/dicr-logo-light.png',
  },
  nobel: {
    pageBg: 'bg-slate-50',
    pageGradientFrom: 'from-slate-50',
    pageGradientVia: 'via-white',
    pageGlow: 'bg-red-400/[0.04]',
    text: 'text-slate-900',
    textSecondary: 'text-slate-500',
    textMuted: 'text-slate-400',
    divider: 'bg-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    optionBg: 'bg-slate-50',
    optionBorder: 'border-slate-200',
    optionHoverBg: 'hover:bg-red-50',
    optionHoverBorder: 'hover:border-red-300',
    optionText: 'text-slate-700',
    optionLetterBg: 'bg-slate-100',
    optionLetterHoverBg: 'group-hover/btn:bg-red-100',
    optionLetterText: 'text-slate-400',
    optionLetterHoverText: 'group-hover/btn:text-red-600',
    optionArrow: 'text-slate-300',
    optionArrowHover: 'group-hover/btn:text-red-500',
    infoPanelBg: 'bg-red-50',
    infoPanelBorder: 'border-red-100',
    infoPanelText: 'text-slate-600',
    footerText: 'text-slate-400',
    footerBorder: 'border-slate-200',
    backText: 'text-slate-400',
    backHoverText: 'hover:text-slate-700',
    warningHeaderBg: 'bg-amber-50',
    warningBorder: 'border-amber-200',
    logo: '/dicr-logo-light.png',
    partnerLogo: '/NobelBiocare logo_0_4.png',
  },
};

type ThemeContextType = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  t: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'dark',
  setThemeId: () => {},
  t: themes.dark,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('dark');
  const t = themes[themeId];

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { themeId, setThemeId } = useTheme();
  const options: { id: ThemeId; label: string }[] = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'nobel', label: 'Nobel Biocare' },
  ];

  const isDark = themeId === 'dark';

  return (
    <div className={`flex items-center justify-center gap-1 p-1 rounded-lg backdrop-blur-sm w-fit mx-auto transition-colors duration-300 ${
      isDark ? 'bg-white/10 border border-white/10' : 'bg-slate-200/80 border border-slate-300'
    }`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setThemeId(opt.id)}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
            themeId === opt.id
              ? isDark
                ? 'bg-white/20 text-white shadow-sm'
                : 'bg-white text-slate-900 shadow-sm'
              : isDark
                ? 'text-white/50 hover:text-white/80'
                : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
