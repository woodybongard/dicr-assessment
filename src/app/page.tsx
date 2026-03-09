import AssessmentFlow from '@/components/AssessmentFlow';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero section */}
        <header className="pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="-mb-6">
              <Image
                src="/dicr-logo-v3.png"
                alt="DICR - Dental Implant Community Resource"
                width={500}
                height={150}
                className="h-64 md:h-96 w-auto mx-auto"
                priority
              />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Free Self-Assessment
              </div>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Self-Assessment Tool
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto">
                Find the right path for your implant dentistry journey
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 py-8">
          <AssessmentFlow />
        </main>

        {/* Footer */}
        <footer className="py-12 mt-8 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} DICR · Dental Implant Community Resource
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
