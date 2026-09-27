import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_PROMPTS = [
  'What services does your studio build?',
  'How much does a production MVP cost?',
  'Tell me about your client projects (Edison, ARiqA, Wintek)',
  'How fast is your sprint turnaround?',
];

function renderFormattedContent(text: string) {
  const clean = text.replace(/\\n/g, '\n');
  const paragraphs = clean.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {paragraphs.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        const isListItem =
          line.startsWith('•') ||
          line.startsWith('-') ||
          /^\d+\./.test(line.trim());

        return (
          <div key={idx} className={isListItem ? 'pl-1.5' : ''}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-butter">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <em key={pIdx} className="italic text-white/90">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I am the **My Planet Services AI Concierge**, powered by Vercel AI Gateway.\n\nAsk me anything about our engineering squad, sprint pricing, tech stack, or live client case studies!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom('auto');
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // When messages arrive or stream in, auto-scroll if near bottom
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    if (isNearBottom || isLoading) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = `assistant-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    setMessages([...newMessages, initialAssistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                accumulated += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulated }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore partial JSON parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  'Our studio squad is standing by! You can book a direct 20-minute discovery call with our founder Vivek, or reach out at vivek@myplanetservices.com.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Hi! I am the **My Planet Services AI Concierge**, powered by Vercel AI Gateway.\n\nAsk me anything about our engineering squad, sprint pricing, tech stack, or live client case studies!',
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50 select-none">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chatbot"
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-ink text-ink-foreground rounded-full shadow-2xl border border-white/15 hover:border-butter/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {/* Pulsing ring indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-butter opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-butter" />
            </span>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-tight">
              <Sparkles className="w-4 h-4 text-butter" />
              <span>AI Concierge</span>
            </div>
          </button>
        )}
      </div>

      {/* Slide-out Chat Window */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 z-50 w-auto sm:w-[410px] h-[580px] max-h-[90vh] bg-ink text-ink-foreground rounded-[28px] border border-white/15 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-ink-soft/90 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-butter text-butter-foreground flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">
                    Studio AI Concierge
                  </h3>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-white/10 text-butter font-semibold">
                    GPT-5.6 Sol
                  </span>
                </div>
                <p className="text-[10.5px] text-ink-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Vercel AI Gateway • Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 p-4 overflow-y-auto overscroll-contain custom-chat-scrollbar space-y-4 text-xs leading-relaxed"
          >
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-butter text-butter-foreground flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                      isUser
                        ? 'bg-butter text-butter-foreground rounded-tr-xs font-medium shadow-xs'
                        : 'bg-white/5 text-white/95 border border-white/10 rounded-tl-xs shadow-soft'
                    }`}
                  >
                    <div className="break-words">
                      {isUser ? m.content : renderFormattedContent(m.content)}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-ink-muted text-xs">
                <div className="w-6 h-6 rounded-lg bg-butter text-butter-foreground flex items-center justify-center shrink-0 text-[10px]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-2xl border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-butter animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-butter animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-butter animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Starters (shown when only initial welcome message exists) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 shrink-0">
              <div className="text-[10px] uppercase font-mono text-ink-muted mb-1.5 font-semibold tracking-wider">
                Suggested questions:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-[10.5px] text-left px-2.5 py-1 rounded-full bg-white/5 hover:bg-butter hover:text-butter-foreground border border-white/10 transition-all text-white/85 cursor-pointer leading-tight"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Shortcuts */}
          <div className="px-4 py-2 border-t border-white/10 bg-ink-soft/40 flex items-center justify-between text-[11px] text-ink-muted shrink-0">
            <Link
              to="/pricing"
              onClick={() => setIsOpen(false)}
              className="hover:text-butter transition-colors flex items-center gap-1"
            >
              <span>Pricing</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-white/20">•</span>
            <Link
              to="/work"
              onClick={() => setIsOpen(false)}
              className="hover:text-butter transition-colors flex items-center gap-1"
            >
              <span>Work</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-white/20">•</span>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="hover:text-butter transition-colors flex items-center gap-1"
            >
              <span>Book Call</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-ink-soft border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about our studio or projects..."
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-hidden focus:border-butter/60 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
