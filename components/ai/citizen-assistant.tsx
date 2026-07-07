'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { MessageSquare, X, Send, Bot, RefreshCw, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';

let messageIdCounter = 0;
const generateMsgId = (prefix: string) => {
  messageIdCounter++;
  return `${prefix}_${messageIdCounter}`;
};

export function CitizenAssistant() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your CivicAI Digital Citizen Companion. I can help you search government schemes, explain document requirements (like passports or driving permits), or prepare a civic issue complaint. How can I help you today?",
      timestamp: "10:00 AM"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || message).trim();
    if (!text) return;

    if (!textToSend) {
      setMessage('');
    }

    const userMsg: ChatMessage = {
      id: generateMsgId('user'),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Prepare history format for API
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          context: `Respond in the selected language: ${language}. Current time is: ${new Date().toLocaleDateString()}`
        })
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: generateMsgId('assistant'),
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: generateMsgId('err'),
          role: 'assistant',
          content: "Sorry, I am having trouble connecting to my cognitive services. Please verify your internet connection or configure GEMINI_API_KEY.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Conversation history cleared. How can I help you now?",
        timestamp: "10:00 AM"
      }
    ]);
  };

  const suggestions = [
    "What do I need for a fresh passport?",
    "How does the solar subsidy work?",
    "Am I eligible for scholarships?",
    "How do I report a pothole?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <Card className="w-[90vw] sm:w-[400px] h-[550px] shadow-2xl border-zinc-800 bg-zinc-950/95 glass flex flex-col transition-all duration-300">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 p-4 shrink-0 bg-zinc-900/60 rounded-t-xl">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center">
                  {t('assistant')}
                  <Sparkles className="h-3 w-3 ml-1.5 text-indigo-400 animate-pulse" />
                </CardTitle>
                <span className="text-[10px] text-emerald-400 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" /> Online
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-zinc-400 hover:text-zinc-200 h-8 w-8 cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 h-8 w-8 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none shadow shadow-primary/10'
                      : 'bg-zinc-900/90 text-zinc-200 rounded-tl-none border border-zinc-800/80'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`block text-[8px] text-right mt-1.5 ${
                      msg.role === 'user' ? 'text-primary-foreground/70' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/90 text-zinc-400 rounded-2xl rounded-tl-none border border-zinc-800/80 p-3 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </CardContent>

          {/* Suggestions footer (if messages are few) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 shrink-0 border-t border-zinc-900/40">
              <span className="text-[10px] text-zinc-500 block mb-1.5 font-medium">Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-800/50 cursor-pointer transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <CardFooter className="p-3 border-t border-zinc-800 bg-zinc-950 shrink-0 rounded-b-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder={t('assistantPlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-zinc-900/80 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50 text-xs h-9"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0 cursor-pointer" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        /* Floating Button Trigger */
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-105 active:scale-95 duration-200 bg-primary text-primary-foreground hover:shadow-primary/30 border border-primary/20 cursor-pointer flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
