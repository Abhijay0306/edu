"use client";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type Message = { role: 'user' | 'ai'; content: string };

const QUICK_QUESTIONS = [
  'What are my best university options based on my profile?',
  'How do I apply for a German student visa?',
  'What scholarships are available for international students?',
  'Compare studying in Germany vs UK for engineering',
  'What IELTS score do I need for my target universities?',
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello${user?.name ? ` **${user.name.split(' ')[0]}**` : ''}! 👋 I'm **Golearn AI**, your personal study abroad advisor.\n\nI can see your profile and recommended universities. Ask me anything about admissions, scholarships, visas, or costs — I'll give you personalised advice.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, userId: user?.id }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || data.error || 'No response received.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Error connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="font-['Poppins'] text-3xl font-bold text-[#1F2937]">AI Advisor</h1>
        <p className="text-[#6B7280] mt-1 text-sm">Powered by Golearn AI · Personalised to your profile and recommendations</p>
      </div>

      {/* Chat Window */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: '65vh' }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B5CFF] to-[#9D4EDD] flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                  G
                </div>
              )}
              <div className={`max-w-[82%] ${
                msg.role === 'user'
                  ? 'px-4 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#9D4EDD] text-white rounded-2xl rounded-br-sm text-sm leading-relaxed'
                  : 'px-4 py-3 bg-[#F7F8FC] border border-[#E6E8F0] rounded-2xl rounded-bl-sm text-sm text-[#1F2937] leading-relaxed ai-markdown'
              }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-base font-bold text-[#1F2937] mt-3 mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold text-[#1F2937] mt-3 mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold text-[#7B5CFF] mt-2 mb-1">{children}</h3>,
                      strong: ({ children }) => <strong className="font-semibold text-[#1F2937]">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      a: ({ href, children }) => <a href={href} className="text-[#7B5CFF] underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      table: ({ children }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse border border-[#E6E8F0]">{children}</table></div>,
                      th: ({ children }) => <th className="px-2 py-1 bg-[#F5F3FF] text-left font-semibold border border-[#E6E8F0]">{children}</th>,
                      td: ({ children }) => <td className="px-2 py-1 border border-[#E6E8F0]">{children}</td>,
                      code: ({ children }) => <code className="bg-[#F5F3FF] px-1 rounded text-xs font-mono">{children}</code>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-[#7B5CFF] pl-3 italic text-[#6B7280] my-2">{children}</blockquote>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B5CFF] to-[#9D4EDD] flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">G</div>
              <div className="bg-[#F7F8FC] border border-[#E6E8F0] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center h-10">
                {[0, 1, 2].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#E6E8F0] p-4 bg-white">
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Ask about visas, scholarships, admissions..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-5 shrink-0">
              ↑
            </button>
          </form>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map(q => (
          <button key={q} onClick={() => sendMessage(q)} disabled={loading}
            className="text-xs px-3 py-2 rounded-lg border border-[#E6E8F0] bg-white text-[#6B7280] hover:border-[#7B5CFF] hover:text-[#7B5CFF] transition-all duration-200 disabled:opacity-50 text-left">
            💬 {q}
          </button>
        ))}
      </div>
    </div>
  );
}
