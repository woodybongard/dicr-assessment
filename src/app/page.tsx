import AssessmentFlow from '@/components/AssessmentFlow';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#0F1A2E] to-[#0B1120]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.07] rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-12 pb-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/dicr-logo-v5.png"
                alt="DICR - Dental Implant Community Resource"
                width={700}
                height={250}
                className="h-36 md:h-52 w-auto mx-auto"
                priority
              />
            </div>

            <div className="w-16 h-px bg-slate-700 mx-auto mb-6" />

            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 tracking-tight">
              Self-Assessment Tool
            </h1>

            <p className="text-slate-400 text-base max-w-md mx-auto">
              Determine your pathway for implant dentistry continuing education and registration.
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 pb-16">
          <AssessmentFlow />
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-slate-600 text-xs tracking-wide">
              &copy; {new Date().getFullYear()} DICR &middot; Dental Implant Community Resource
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
