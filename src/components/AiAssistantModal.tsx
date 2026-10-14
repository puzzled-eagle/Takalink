import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, HelpCircle } from 'lucide-react';
import { useTakaStore } from '../services/store';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: string;
}

const QUICK_PROMPTS = [
  'What is the going rate for PET bottles in Eldoret?',
  'How do I ensure baled cardboard is not rejected by recyclers?',
  'How does the small-quantity bulk aggregation pool work?',
  'What permits are required by NEMA for transporting recyclable waste in Kenya?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentRole, currentUser } = useTakaStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Habari! I am your TakaLink Circular Economy Advisor for Eldoret, Kenya. You are active as a ${currentRole} (${currentUser.businessName || currentUser.fullName}). How can I assist with material classification, pricing guidance, NEMA rules, or marketplace logistics today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          userRole: currentRole,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'TakaLink is ready to assist your recycling workflow.',
          source: data.source,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach the assistant server right now. TakaLink marketplace listings and offers remain fully functional offline.',
          source: 'offline_notice',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full h-[85vh] shadow-2xl border border-[#17324D]/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#176B4D] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading">
                TakaLink AI Advisor
              </h3>
              <p className="text-[11px] text-white/70">
                Eldoret Circular Economy & Recycling Guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F7F8F4]/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 text-xs ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#176B4D] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl shadow-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#17324D] text-white rounded-tr-xs'
                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs'
                }`}
              >
                {m.text}
                {m.source && (
                  <span className="block text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                    {m.source === 'gemini-3.8-flash' ? '✨ Gemini AI' : 'Rule-based benchmark'}
                  </span>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#17324D] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 pl-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#176B4D]" />
              <span>Consulting Eldoret circular economy database...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-gray-100 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] hover:bg-[#176B4D]/10 hover:text-[#176B4D] rounded-full border border-gray-200 transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about waste pricing, sorting tips, NEMA regulations..."
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-[#176B4D] text-white hover:bg-[#176B4D]/90 disabled:opacity-50 transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
