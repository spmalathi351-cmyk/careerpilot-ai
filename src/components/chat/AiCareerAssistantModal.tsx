import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  RotateCcw,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  Target,
  FileCheck2,
  MapPin,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'fallback';
}

export const AiCareerAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([
    'What should I learn to become a Data Scientist?',
    'How can I boost my resume ATS score past 95%?',
    'Analyze my skill gaps against modern software roles',
    'Give me a 30-day technical interview prep plan',
  ]);
  const [personalizedContext, setPersonalizedContext] = useState<{
    personalized: boolean;
    studentName?: string;
    atsScore?: number;
  }>({ personalized: false });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load initial greeting when chatbot is first opened or user changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialGreeting();
    }
  }, [isOpen, user]);

  // Scroll to bottom when messages change or loading
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, isMinimized]);

  const loadInitialGreeting = async () => {
    try {
      const res = await api.getChatInitial();
      setPersonalizedContext({
        personalized: res.personalized,
        studentName: res.studentName,
        atsScore: res.atsScore,
      });
      if (res.suggestions && res.suggestions.length > 0) {
        setSuggestions(res.suggestions);
      }
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'model',
          content: res.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      // Safe fallback greeting
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'model',
          content: `👋 Hello ${user?.displayName || 'there'}! I'm your **CareerPilot AI Assistant**. Ask me anything about career roadmaps, resume improvements, ATS scoring, or interview preparation.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Format payload for backend Gemini API
      const historyPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.sendChatMessage(text, historyPayload.slice(0, -1));

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (res.suggestions && res.suggestions.length > 0) {
        setSuggestions(res.suggestions);
      }
    } catch (err: any) {
      console.error('Failed to get chat response:', err);
      setErrorMessage(err.message || 'Unable to connect to Gemini AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    loadInitialGreeting();
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format basic markdown-style text cleanly
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed break-words">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // H3 header
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-bold text-sm text-slate-900 dark:text-white mt-3 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // H4 header
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="font-semibold text-xs sm:text-[13px] text-indigo-700 mt-2.5 mb-0.5">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }

          // Bullet point
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletText = trimmed.replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <span>{renderInlineStyles(bulletText)}</span>
              </div>
            );
          }

          // Numbered item
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+\./)?.[0] || '1.';
            const itemText = trimmed.replace(/^\d+\.\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
                <span className="font-bold text-indigo-600 flex-shrink-0 min-w-4 text-xs">{num}</span>
                <span>{renderInlineStyles(itemText)}</span>
              </div>
            );
          }

          // Table row or divider
          if (trimmed.startsWith('|')) {
            if (trimmed.includes('---')) return null; // table separator
            const cells = trimmed.split('|').filter((c) => c.trim().length > 0);
            return (
              <div key={idx} className="grid grid-cols-3 gap-2 py-1 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px]">
                {cells.map((cell, cIdx) => (
                  <span key={cIdx} className={cIdx === 0 ? 'font-bold text-slate-800' : 'text-slate-600'}>
                    {renderInlineStyles(cell.trim())}
                  </span>
                ))}
              </div>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Normal paragraph
          return <p key={idx}>{renderInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  // Inline bold, code, and highlight parser
  const renderInlineStyles = (text: string) => {
    // Basic regex split for bold **text** and code `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[11px] font-semibold border border-slate-200/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. Floating Launch Button (bottom-right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white rounded-full shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all duration-200 border border-indigo-400/30 focus:outline-hidden focus:ring-4 focus:ring-indigo-300"
            aria-label="Open AI Career Assistant"
          >
            {/* Pulsing indicator ring */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white" />
            </span>

            <div className="w-7 h-7 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-xs">
              <img src="/careerpilot-mark.png" alt="CareerPilot" className="w-full h-full object-contain rounded-full" />
            </div>

            <div className="text-left flex flex-col">
              <span className="text-xs font-black tracking-wide leading-tight">AI Career Assistant</span>
              <span className="text-[10px] text-indigo-200 font-medium leading-none mt-0.5">
                Gemini 3.8 Flash Active
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Chat Window Modal (when open) */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 z-50 transition-all duration-200 ${
            isMinimized
              ? 'bottom-6 w-80 h-14'
              : 'bottom-6 w-[calc(100vw-2rem)] sm:w-[450px] md:w-[480px] h-[620px] max-h-[85vh]'
          }`}
        >
          <div className="w-full h-full bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-indigo-900/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-white p-0.5 flex items-center justify-center shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/30 overflow-hidden">
                    <img src="/careerpilot-mark.png" alt="CareerPilot AI" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">CareerPilot Copilot</h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-[10px] font-semibold text-indigo-200">
                      Gemini AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-normal">
                    {user ? `${user.displayName || 'Candidate'} · ${user.role}` : 'Career Intelligence Advisor'}
                  </p>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-1 text-slate-300">
                <button
                  onClick={handleClearHistory}
                  title="Reset conversation"
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* When not minimized: Show conversation body */}
            {!isMinimized && (
              <>
                {/* Personalized Context Badge Banner */}
                {personalizedContext.personalized && (
                  <div className="px-4 py-2 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 flex-shrink-0">
                    <div className="flex items-center gap-2 truncate">
                      <Target className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">
                        Personalized with your verified skills &amp; ATS profile
                      </span>
                    </div>
                    {personalizedContext.atsScore && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 font-bold text-[11px] flex-shrink-0">
                        ATS: {personalizedContext.atsScore}%
                      </span>
                    )}
                  </div>
                )}

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {/* AI Avatar */}
                      {msg.role === 'model' && (
                        <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs ring-1 ring-indigo-500/20">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Bubble Content */}
                      <div
                        className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-600/20'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                        ) : (
                          renderFormattedText(msg.content)
                        )}

                        {/* Timestamp & copy action */}
                        <div
                          className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                            msg.role === 'user' ? 'border-indigo-500/40 text-indigo-200' : 'border-slate-100 text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>

                          {msg.role === 'model' && (
                            <button
                              onClick={() => copyToClipboard(msg.id, msg.content)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600 flex items-center gap-1"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* User Avatar */}
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading / Typing indicator */}
                  {loading && (
                    <div className="flex gap-3 justify-start animate-in fade-in duration-150">
                      <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500">
                            Analyzing with Gemini AI...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error banner */}
                  {errorMessage && (
                    <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2">
                      <span>{errorMessage}</span>
                      <button
                        onClick={() => handleSendMessage()}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px]"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                {suggestions.length > 0 && (
                  <div className="px-4 py-2 border-t border-slate-100 bg-white flex-shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      Suggested Prompts:
                    </p>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {suggestions.slice(0, 3).map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          disabled={loading}
                          className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 border border-slate-200 text-[11px] font-medium text-slate-600 whitespace-nowrap transition-colors flex-shrink-0 disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Footer */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex-shrink-0">
                  <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        // Auto-expand textarea
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about career plans, skills, resume tweaks, or interview prep..."
                      rows={1}
                      disabled={loading}
                      className="flex-1 bg-transparent border-0 focus:outline-hidden text-xs text-slate-800 placeholder-slate-400 resize-none max-h-28 py-1 px-1"
                    />

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || loading}
                      className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all flex-shrink-0 shadow-xs"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                    <span>Enter to send · Shift+Enter for new line</span>
                    <span>Gemini 3.8 Flash</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
