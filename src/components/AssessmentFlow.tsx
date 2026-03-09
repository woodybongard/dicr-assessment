'use client';

import { useState } from 'react';
import { flowData, START_NODE_ID, FlowNode, EndpointNode, QuestionNode } from '@/lib/questions';

type HistoryEntry = {
  nodeId: string;
  selectedOption?: string;
};

export default function AssessmentFlow() {
  const [currentNodeId, setCurrentNodeId] = useState(START_NODE_ID);
  const [history, setHistory] = useState<HistoryEntry[]>([{ nodeId: START_NODE_ID }]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      setIsTransitioning(false);
    }, 200);
  };


  if (currentNode.type === 'endpoint') {
    return <EndpointView node={currentNode} onRestart={handleRestart} responses={responses} isTransitioning={isTransitioning} />;
  }

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {Array.from({ length: history.length }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === history.length - 1
                ? 'w-8 bg-gradient-to-r from-blue-500 to-cyan-400'
                : 'w-2 bg-white/20'
            }`}
          />
        ))}
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-white/5" />
      </div>

      {/* Question card */}
      <div className="relative group">
        {/* Card glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                {history.length}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Question</p>
                <p className="text-white font-medium">Step {history.length}</p>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 leading-tight">
              {currentNode.text}
            </h2>

            <div className="space-y-3">
              {currentNode.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option.label, option.nextId)}
                  className="w-full text-left p-5 rounded-xl
                             bg-white/[0.02] border border-white/10
                             hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.01]
                             active:scale-[0.99]
                             transition-all duration-200 ease-out
                             focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0f1c]
                             group/btn"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 group-hover/btn:bg-gradient-to-br group-hover/btn:from-blue-500 group-hover/btn:to-cyan-500
                                    flex items-center justify-center transition-all duration-200">
                      <span className="text-slate-400 group-hover/btn:text-white font-semibold text-sm transition-colors">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="text-slate-300 group-hover/btn:text-white font-medium transition-colors flex-1">
                      {option.label}
                    </span>
                    <svg className="w-5 h-5 text-slate-600 group-hover/btn:text-white/50 group-hover/btn:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Info link if available */}
            {currentNode.infoLink && (
              <div className="mt-8">
                <div className="relative group/info">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-lg opacity-0 group-hover/info:opacity-100 transition-opacity duration-300" />
                  <a
                    href={currentNode.infoLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-4 p-4 rounded-xl
                               bg-gradient-to-r from-red-500/10 to-rose-500/10
                               border border-red-500/20 hover:border-red-500/40
                               transition-all duration-300 group-hover/info:scale-[1.01]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{currentNode.infoLink.label}</p>
                      {currentNode.infoLink.description && (
                        <p className="text-red-300/80 text-sm mt-0.5">{currentNode.infoLink.description}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-slate-400 group-hover/info:text-red-400 group-hover/info:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Guidelines link if available */}
            {currentNode.guidelineLink && (
              <div className="mt-8">
                <div className="relative group/guide">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-lg opacity-0 group-hover/guide:opacity-100 transition-opacity duration-300" />
                  <a
                    href={currentNode.guidelineLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-4 p-4 rounded-xl
                               bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10
                               border border-white/10 hover:border-violet-500/30
                               transition-all duration-300 group-hover/guide:scale-[1.01]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{currentNode.guidelineLink.label}</p>
                      <p className="text-slate-400 text-sm">Review official standards & guidelines</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-400 group-hover/guide:text-violet-400 group-hover/guide:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {history.length > 1 && (
        <button
          onClick={handleBack}
          className="mt-8 text-slate-500 hover:text-white flex items-center gap-2
                     transition-all duration-200 mx-auto group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go back
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

  console.log('User completed assessment:', responses);

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Success card */}
      <div className="relative group">
        {/* Card glow effect */}
        <div className={`absolute -inset-0.5 rounded-3xl blur-xl opacity-50 transition-opacity ${
          isCoursesEndpoint
            ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30'
            : 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30'
        }`} />

        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Success header */}
          <div className={`px-6 py-12 text-center ${
            isCoursesEndpoint
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10'
              : 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/10'
          }`}>
            {/* Animated icon */}
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
              isCoursesEndpoint
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
                : 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30'
            }`}>
              {isCoursesEndpoint ? (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {node.title}
            </h2>
            <p className="text-slate-400">Assessment Complete</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 text-center">
            <p className="text-slate-400 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              {node.description}
            </p>

            <a
              href={node.action.url}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg
                         transition-all duration-300 hover:scale-105 hover:shadow-2xl group/btn ${
                isCoursesEndpoint
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-emerald-500/30'
              }`}
            >
              {node.action.label}
              <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Summary card */}
      <div className="mt-6 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />

        <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            Your Assessment Summary
          </h3>
          <ul className="space-y-3">
            {Object.entries(responses).map(([questionId, answer], index) => (
              <li key={questionId} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-slate-400 text-sm">{answer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Restart button */}
      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="text-slate-500 hover:text-white text-sm flex items-center gap-2 mx-auto transition-all duration-200 group"
        >
          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start over
        </button>
      </div>
    </div>
  );
}
