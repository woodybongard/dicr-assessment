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
      {/* Card */}
      <div className="bg-[#141E33] rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Question */}
        <div className="p-7 md:p-9">
          <h2 className="text-xl md:text-2xl font-semibold text-white leading-snug mb-7">
            {currentNode.text}
          </h2>

          <div className="space-y-3">
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.label, option.nextId)}
                className="w-full text-left px-5 py-4 rounded-xl
                           bg-slate-800/60 border border-slate-600/30
                           hover:bg-blue-600/15 hover:border-blue-500/30
                           active:scale-[0.995]
                           transition-all duration-150 ease-out
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40
                           group/btn"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-8 h-8 rounded-lg bg-slate-700/60 group-hover/btn:bg-blue-500/25
                                   flex items-center justify-center transition-colors duration-150
                                   text-slate-400 group-hover/btn:text-blue-300 text-sm font-semibold shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-slate-200 group-hover/btn:text-white text-[15px] transition-colors flex-1">
                    {option.label}
                  </span>
                  <svg className="w-4 h-4 text-slate-600 group-hover/btn:text-blue-400/70 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info panel — collapsible */}
        {currentNode.infoLink && (
          <div className="border-t border-slate-700/40">
            <button
              onClick={() => setExpandedInfo(!expandedInfo)}
              className="w-full flex items-center gap-3 px-7 py-4 text-left
                         hover:bg-slate-800/30 transition-colors duration-150"
            >
              <svg className="w-4.5 h-4.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="px-7 pb-5">
                <div className="bg-blue-950/40 border border-blue-800/30 rounded-xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {currentNode.infoLink.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guidelines link */}
        {currentNode.guidelineLink && (
          <div className="border-t border-slate-700/40">
            <a
              href={currentNode.guidelineLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-7 py-4
                         hover:bg-slate-800/30 transition-colors duration-150"
            >
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="mt-6 text-slate-500 hover:text-slate-200 text-sm flex items-center gap-1.5
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
      <div className="bg-[#141E33] rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className={`px-7 py-10 text-center ${
          isCoursesEndpoint
            ? 'bg-gradient-to-b from-amber-500/10 to-transparent'
            : 'bg-gradient-to-b from-emerald-500/10 to-transparent'
        }`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center ${
            isCoursesEndpoint
              ? 'bg-amber-500/15 border border-amber-500/25'
              : 'bg-emerald-500/15 border border-emerald-500/25'
          }`}>
            {isCoursesEndpoint ? (
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

          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Assessment Complete</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {node.title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-7 pb-9 text-center">
          <p className="text-slate-400 mb-7 text-[15px] max-w-sm mx-auto leading-relaxed">
            {node.description}
          </p>

          <a
            href={node.action.url}
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-medium
                       transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
              isCoursesEndpoint
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
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
          className="text-slate-500 hover:text-slate-200 text-sm flex items-center gap-1.5 mx-auto transition-colors duration-150"
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
