'use client';

import AssessmentFlow from '@/components/AssessmentFlow';
import { ThemeProvider, ThemeToggle, useTheme } from '@/components/ThemeContext';
import Image from 'next/image';

function HomeContent() {
  const { t } = useTheme();

  return (
    <div className={`min-h-screen ${t.pageBg} ${t.text} transition-colors duration-300`}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-b ${t.pageGradientFrom} ${t.pageGradientVia} ${t.pageGradientFrom}`} />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ${t.pageGlow} rounded-full blur-[120px]`} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Theme toggle */}
        <div className="pt-4 px-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="pt-6 pb-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              {t.partnerLogo ? (
                <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
                  <Image
                    src={t.logo}
                    alt="DICR - Dental Implant Community Resource"
                    width={700}
                    height={250}
                    className="h-28 md:h-40 w-auto"
                    priority
                  />
                  <div className={`w-px h-16 md:h-24 ${t.divider} hidden sm:block`} />
                  <Image
                    src={t.partnerLogo}
                    alt="Partner"
                    width={300}
                    height={100}
                    className="h-10 md:h-14 w-auto"
                  />
                </div>
              ) : (
                <Image
                  src={t.logo}
                  alt="DICR - Dental Implant Community Resource"
                  width={700}
                  height={250}
                  className="h-36 md:h-52 w-auto mx-auto"
                  priority
                />
              )}
              <p className={`-mt-4 text-base md:text-lg tracking-[0.15em] uppercase ${t.text} font-semibold`}>
                Dental Implant Community Resource
              </p>
            </div>

            <div className={`w-16 h-px ${t.divider} mx-auto mb-6`} />

            <h1 className={`text-2xl md:text-3xl font-semibold ${t.text} mb-2 tracking-tight`}>
              Self-Assessment Tool
            </h1>

            <p className={`${t.textSecondary} text-base max-w-md mx-auto`}>
              Determine your pathway for implant dentistry continuing education and registration.
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 pb-16">
          <AssessmentFlow />
        </main>

        {/* Footer */}
        <footer className={`py-8 border-t ${t.footerBorder}`}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className={`${t.footerText} text-xs tracking-wide`}>
              &copy; {new Date().getFullYear()} DICR &middot; Dental Implant Community Resource
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
