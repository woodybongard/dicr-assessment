'use client';

import { useState } from 'react';
import Image from 'next/image';
import { flowData, START_NODE_ID, FlowNode, EndpointNode, WarningNode } from '@/lib/questions';
import { useTheme } from '@/components/ThemeContext';

type HistoryEntry = {
  nodeId: string;
  selectedOption?: string;
};

export default function AssessmentFlow() {
  const [currentNodeId, setCurrentNodeId] = useState(START_NODE_ID);
  const [history, setHistory] = useState<HistoryEntry[]>([{ nodeId: START_NODE_ID }]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const { t } = useTheme();

  const currentNode: FlowNode = flowData[currentNodeId];

  const handleOptionSelect = (optionLabel: string, nextId: string) => {
    setIsTransitioning(true);
    setResponses(prev => ({
      ...prev,
      [currentNodeId]: optionLabel,
    }));

    setTimeout(() => {
      setHistory(prev => [...prev, { nodeId: currentNodeId, selectedOption: optionLabel }]);
      setCurrentNodeId(nextId);
      setExpandedInfo(false);
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        const newHistory = history.slice(0, -1);
        const previousEntry = newHistory[newHistory.length - 1];
        setHistory(newHistory);
        setCurrentNodeId(previousEntry.nodeId);
        setExpandedInfo(false);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleRestart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNodeId(START_NODE_ID);
      setHistory([{ nodeId: START_NODE_ID }]);
      setResponses({});
      setExpandedInfo(false);
      setIsTransitioning(false);
    }, 200);
  };

  if (currentNode.type === 'endpoint') {
    return <EndpointView node={currentNode} onRestart={handleRestart} responses={responses} isTransitioning={isTransitioning} />;
  }

  if (currentNode.type === 'warning') {
    return (
      <WarningView
        node={currentNode}
        onNext={() => handleOptionSelect('Acknowledged', currentNode.nextId)}
        onBack={handleBack}
        showBack={history.length > 1}
        isTransitioning={isTransitioning}
      />
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      {/* Card */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl shadow-black/20 overflow-hidden transition-colors duration-300`}>
        {/* Question */}
        <div className="p-7 md:p-9">
          <h2 className={`text-xl md:text-2xl font-semibold ${t.text} leading-snug mb-7 transition-colors duration-300`}>
            {currentNode.text}
          </h2>

          <div className="space-y-3">
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.label, option.nextId)}
                className={`w-full text-left px-5 py-4 rounded-xl
                           ${t.optionBg} border ${t.optionBorder}
                           ${t.optionHoverBg} ${t.optionHoverBorder}
                           active:scale-[0.995]
                           transition-all duration-150 ease-out
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40
                           group/btn`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 rounded-lg ${t.optionLetterBg} ${t.optionLetterHoverBg}
                                   flex items-center justify-center transition-colors duration-150
                                   ${t.optionLetterText} ${t.optionLetterHoverText} text-sm font-semibold shrink-0`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={`${t.optionText} group-hover/btn:text-blue-600 text-[15px] transition-colors flex-1`}>
                    {option.label}
                  </span>
                  <svg className={`w-4 h-4 ${t.optionArrow} ${t.optionArrowHover} transition-colors shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info panel — collapsible */}
        {currentNode.infoLink && (
          <div className={`border-t ${t.cardBorder}`}>
            <button
              onClick={() => setExpandedInfo(!expandedInfo)}
              className="w-full flex items-center gap-3 px-7 py-4 text-left
                         hover:opacity-80 transition-all duration-150"
            >
              <svg className="w-4.5 h-4.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-500 font-medium flex-1">
                {currentNode.infoLink.label}
              </span>
              <svg
                className={`w-4 h-4 ${t.textMuted} transition-transform duration-200 ${expandedInfo ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedInfo && currentNode.infoLink.description && (
              <div className="px-7 pb-5">
                <div className={`${t.infoPanelBg} border ${t.infoPanelBorder} rounded-xl p-4 transition-colors duration-300`}>
                  <p className={`${t.infoPanelText} text-sm leading-relaxed`}>
                    {currentNode.infoLink.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guidelines link */}
        {currentNode.guidelineLink && (
          <div className={`border-t ${t.cardBorder}`}>
            <a
              href={currentNode.guidelineLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-7 py-4
                         hover:opacity-80 transition-all duration-150"
            >
              <svg className={`w-4 h-4 ${t.textMuted} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className={`text-sm ${t.textSecondary} flex-1`}>{currentNode.guidelineLink.label}</span>
              <svg className={`w-3.5 h-3.5 ${t.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Back button */}
      {history.length > 1 && (
        <button
          onClick={handleBack}
          className={`mt-6 ${t.backText} ${t.backHoverText} text-sm flex items-center gap-1.5
                     transition-colors duration-150 mx-auto`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}

function EndpointView({
  node,
  onRestart,
  responses,
  isTransitioning
}: {
  node: EndpointNode;
  onRestart: () => void;
  responses: Record<string, string>;
  isTransitioning: boolean;
}) {
  const { t } = useTheme();
  const isPeerReview = node.action.type === 'peer-review';
  const isCoursesEndpoint = node.action.type === 'ce-courses';

  const headerGradient = isPeerReview
    ? 'bg-gradient-to-b from-blue-500/10 to-transparent'
    : isCoursesEndpoint
      ? 'bg-gradient-to-b from-amber-500/10 to-transparent'
      : 'bg-gradient-to-b from-emerald-500/10 to-transparent';

  const iconClasses = isPeerReview
    ? 'bg-blue-500/15 border border-blue-500/25'
    : isCoursesEndpoint
      ? 'bg-amber-500/15 border border-amber-500/25'
      : 'bg-emerald-500/15 border border-emerald-500/25';

  const buttonClasses = isPeerReview
    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'
    : isCoursesEndpoint
      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30';

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      {/* Result card */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl shadow-black/20 overflow-hidden transition-colors duration-300`}>
        {/* Header */}
        <div className={`px-7 py-10 text-center ${headerGradient}`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center ${iconClasses}`}>
            {isPeerReview ? (
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : isCoursesEndpoint ? (
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <p className={`text-xs ${t.textSecondary} uppercase tracking-wider font-medium mb-2`}>
            {isPeerReview ? 'DICR Peer Review Verification Program' : 'Assessment Complete'}
          </p>
          <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>
            {node.title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-7 pb-9 text-center">
          <p className={`${t.textSecondary} mb-7 text-[15px] max-w-sm mx-auto leading-relaxed`}>
            {node.description}
          </p>

          {/* Peer review content */}
          {isPeerReview && (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-blue-500/30">
                    <Image src="/john-zarb.jpg" alt="Dr. John Zarb" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <p className={`text-sm font-medium ${t.text}`}>Dr. John Zarb</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-blue-500/30">
                    <Image src="/brian-freund.jpg" alt="Dr. Brian Freund" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <p className={`text-sm font-medium ${t.text}`}>Dr. Brian Freund</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 mb-6">
                <Image src="/genesis-logo.png" alt="Genesis" width={400} height={120} className="h-20 w-auto" />
                <Image src="/NobelBiocare logo_0_4.png" alt="Nobel Biocare" width={350} height={100} className="h-14 w-auto opacity-70" />
              </div>

              {/* What is the program */}
              <div className={`${t.infoPanelBg} border ${t.infoPanelBorder} rounded-xl p-5 text-left`}>
                <p className={`text-sm font-semibold ${t.text} mb-2`}>What is the DICR Peer Review Verification Program?</p>
                <p className={`${t.infoPanelText} text-sm leading-relaxed mb-3`}>
                  One hour one-on-one sessions with a Genesis Team Oral Maxillofacial Surgeon and Prosthodontist, reviewing dentists&apos; case histories — Medical history, Dental history, Diagnostics, Implant prosthodontic planning, Implant surgical planning, Implant placement, Implant provisionalization, Definitive Implant Restoration, Maintenance, and Complications.
                </p>
                <p className={`text-sm font-semibold ${t.text}`}>It is NOT a Report Card.</p>
              </div>
            </div>
          )}

          {/* Course provider logos — CE courses endpoint only */}
          {isCoursesEndpoint && (
            <div className="mb-8">
              <p className={`text-xs ${t.textMuted} uppercase tracking-wider font-medium mb-4`}>Course Providers</p>
              <div className="grid grid-cols-2 gap-4 mx-auto mb-6">
                <div className={`${t.optionBg} border ${t.optionBorder} rounded-xl p-3 flex items-center justify-center aspect-[4/3]`}>
                  <img src="/genesis-logo.png" alt="Genesis" className="max-h-full max-w-full object-contain" />
                </div>
                <div className={`${t.optionBg} border ${t.optionBorder} rounded-xl p-3 flex items-center justify-center aspect-[4/3]`}>
                  <img src="/tide-logo.png" alt="TIDE" className="max-h-full max-w-full object-contain" />
                </div>
                <div className={`${t.optionBg} border ${t.optionBorder} rounded-xl p-3 flex items-center justify-center aspect-[4/3]`}>
                  <img src="/gdm-logo.png" alt="GDM" className="max-h-full max-w-full object-contain" />
                </div>
                <div className={`${t.optionBg} border ${t.optionBorder} rounded-xl p-3 flex items-center justify-center aspect-[4/3]`}>
                  <img src="/ddi-logo.png" alt="DDI - Digital Dentistry Institute" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <div className={`border-t ${t.cardBorder} pt-5 flex items-center justify-center`}>
                <img src="/NobelBiocare logo_0_4.png" alt="Nobel Biocare" className="h-14 w-auto opacity-70" />
              </div>
            </div>
          )}

          <a
            href={node.action.url}
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-medium
                       transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] ${buttonClasses}`}
          >
            {node.action.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          {/* Browse all courses — non-clickable */}
          {isCoursesEndpoint && (
            <p className={`mt-4 text-sm ${t.textMuted} font-medium`}>
              Browse All Courses
            </p>
          )}
        </div>
      </div>

      {/* Restart */}
      <div className="mt-6 text-center">
        <button
          onClick={onRestart}
          className={`${t.backText} ${t.backHoverText} text-sm flex items-center gap-1.5 mx-auto transition-colors duration-150`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start over
        </button>
      </div>
    </div>
  );
}

function WarningView({
  node,
  onNext,
  onBack,
  showBack,
  isTransitioning,
}: {
  node: WarningNode;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
  isTransitioning: boolean;
}) {
  const { t } = useTheme();

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className={`${t.cardBg} rounded-2xl border ${t.warningBorder} shadow-2xl shadow-black/20 overflow-hidden transition-colors duration-300`}>
        {/* Warning header */}
        <div className={`${t.warningHeaderBg} px-7 py-5 border-b ${t.warningBorder} flex items-center gap-3`}>
          <svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Please Note</span>
        </div>

        {/* Warning content */}
        <div className="p-7 md:p-9">
          <p className={`${t.text} text-base md:text-lg leading-relaxed`}>
            {node.text}
          </p>
        </div>

        {/* Next button */}
        <div className="px-7 pb-7">
          <button
            onClick={onNext}
            className={`w-full px-5 py-4 rounded-xl ${t.optionBg} border ${t.optionBorder}
                       ${t.optionHoverBg} ${t.optionHoverBorder}
                       active:scale-[0.995] transition-all duration-150 ease-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40
                       group/btn`}
          >
            <div className="flex items-center justify-center gap-2.5">
              <span className={`${t.optionText} group-hover/btn:text-blue-600 font-medium transition-colors`}>
                Next
              </span>
              <svg className={`w-4 h-4 ${t.optionArrow} ${t.optionArrowHover} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Back button */}
      {showBack && (
        <button
          onClick={onBack}
          className={`mt-6 ${t.backText} ${t.backHoverText} text-sm flex items-center gap-1.5
                     transition-colors duration-150 mx-auto`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}
