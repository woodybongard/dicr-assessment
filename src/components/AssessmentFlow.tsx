'use client';

import { useState } from 'react';
import { flowData, START_NODE_ID, FlowNode, EndpointNode } from '@/lib/questions';

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

  return (
    <div className={`w-full max-w-xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      {/* Question card */}
      <div className="bg-white/[0.04] rounded-xl border border-white/[0.08] overflow-hidden">
        {/* Question */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-medium text-white leading-snug mb-6">
            {currentNode.text}
          </h2>

          <div className="space-y-2.5">
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.label, option.nextId)}
                className="w-full text-left px-4 py-3.5 rounded-lg
                           bg-white/[0.03] border border-white/[0.06]
                           hover:bg-blue-500/10 hover:border-blue-500/20
                           active:scale-[0.995]
                           transition-all duration-150 ease-out
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1 focus:ring-offset-[#0B1120]
                           group/btn"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-white/[0.06] group-hover/btn:bg-blue-500/20
                                   flex items-center justify-center transition-colors duration-150
                                   text-slate-500 group-hover/btn:text-blue-400 text-xs font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-slate-300 group-hover/btn:text-white text-[15px] font-normal transition-colors flex-1">
                    {option.label}
                  </span>
                  <svg className="w-4 h-4 text-slate-700 group-hover/btn:text-blue-400/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info panel — collapsible */}
        {currentNode.infoLink && (
          <div className="border-t border-white/[0.06]">
            <button
              onClick={() => setExpandedInfo(!expandedInfo)}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-left
                         hover:bg-white/[0.02] transition-colors duration-150"
            >
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-400 font-medium flex-1">
                {currentNode.infoLink.label}
              </span>
              <svg
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedInfo ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedInfo && currentNode.infoLink.description && (
              <div className="px-6 pb-5">
                <div className="bg-blue-500/[0.06] border border-blue-500/10 rounded-lg p-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {currentNode.infoLink.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guidelines link */}
        {currentNode.guidelineLink && (
          <div className={`border-t border-white/[0.06] ${!currentNode.infoLink ? '' : ''}`}>
            <a
              href={currentNode.guidelineLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5
                         hover:bg-white/[0.02] transition-colors duration-150"
            >
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm text-slate-400 flex-1">{currentNode.guidelineLink.label}</span>
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="mt-6 text-slate-600 hover:text-slate-300 text-sm flex items-center gap-1.5
                     transition-colors duration-150 mx-auto"
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
  const isCoursesEndpoint = node.action.type === 'ce-courses';

  return (
    <div className={`w-full max-w-xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      {/* Result card */}
      <div className="bg-white/[0.04] rounded-xl border border-white/[0.08] overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-10 text-center ${
          isCoursesEndpoint
            ? 'bg-gradient-to-b from-amber-500/[0.08] to-transparent'
            : 'bg-gradient-to-b from-emerald-500/[0.08] to-transparent'
        }`}>
          <div className={`w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center ${
            isCoursesEndpoint
              ? 'bg-amber-500/15 border border-amber-500/20'
              : 'bg-emerald-500/15 border border-emerald-500/20'
          }`}>
            {isCoursesEndpoint ? (
              <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Assessment Complete</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {node.title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 text-center">
          <p className="text-slate-400 mb-6 text-[15px] max-w-sm mx-auto leading-relaxed">
            {node.description}
          </p>

          <a
            href={node.action.url}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-white font-medium text-sm
                       transition-all duration-200 hover:brightness-110 ${
              isCoursesEndpoint
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {node.action.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Restart */}
      <div className="mt-6 text-center">
        <button
          onClick={onRestart}
          className="text-slate-600 hover:text-slate-300 text-sm flex items-center gap-1.5 mx-auto transition-colors duration-150"
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
