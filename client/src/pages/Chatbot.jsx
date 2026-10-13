import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bot,
  Dumbbell,
  Send,
  RotateCcw,
  Sparkles,
  UserRound,
  Zap,
  ArrowDown,
  ShieldCheck
} from "lucide-react";

const INITIAL_MESSAGE = {
  sender: "bot",
  text: "Hey! 👋 I'm your personal fitness guide. What’s your goal today?",
  time: Date.now(),
};

const SUGGESTIONS = [
  "Build muscle 💪",
  "Lose fat 🔥",
  "Learn calisthenics 🤸",
  "Create a workout plan",
];

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const sessionId = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Persistent session
  useEffect(() => {
    let storedSessionId = localStorage.getItem("fitness_bot_session");

    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem("fitness_bot_session", storedSessionId);
    }

    sessionId.current = storedSessionId;

    try {
      const storedMessages = localStorage.getItem("fitness_bot_messages");

      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);

        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        } else {
          setMessages([INITIAL_MESSAGE]);
        }
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "fitness_bot_messages",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setShowScrollButton(distanceFromBottom > 150);
  };

  const handleSend = async (message = input) => {
    const text = message.trim();

    if (!text || loading) return;

    if (!sessionId.current) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Chat is initializing. Please try again in a moment.",
          time: Date.now(),
        },
      ]);
      return;
    }

    const userMessage = {
      sender: "user",
      text,
      time: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            sessionId: sessionId.current,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I couldn't generate a response. Please try again.",
          time: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having trouble connecting right now. Please check your connection and try again.",
          time: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // Start a fresh conversation
  const handleReset = () => {
    if (loading) return;

    const newSessionId = crypto.randomUUID();

    localStorage.setItem("fitness_bot_session", newSessionId);
    localStorage.removeItem("fitness_bot_messages");

    sessionId.current = newSessionId;
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setShowScrollButton(false);
    inputRef.current?.focus();
  };

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-[#f3f5f4] px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60 lg:min-h-[780px] lg:flex-row">

        {/* Left sidebar */}
        <aside className="relative hidden w-72 shrink-0 flex-col justify-between overflow-hidden bg-[#111714] p-7 text-white lg:flex">
          <div className="absolute -right-20 top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-gray-950">
                <Dumbbell size={25} strokeWidth={2.5} />
              </div>

              <div>
                <h1 className="text-lg font-extrabold tracking-tight">
                  Fit<span className="text-emerald-400">Bot</span>
                </h1>
                <p className="text-xs text-gray-400">Your fitness companion</p>
              </div>
            </div>

            <div className="mt-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles size={13} />
                AI FITNESS ASSISTANT
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight">
                Small steps.
                <br />
                <span className="text-emerald-400">Stronger you.</span>
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-400">
                Get help with workouts, bodyweight exercises, training plans,
                and building consistent fitness habits.
              </p>
            </div>

            <div className="mt-9 space-y-3">
              {[
                {
                  icon: Dumbbell,
                  title: "Workout guidance",
                  description: "Exercises for your goals",
                },
                {
                  icon: Activity,
                  title: "Fitness knowledge",
                  description: "Learn proper techniques",
                },
                {
                  icon: Zap,
                  title: "Stay consistent",
                  description: "Build better habits",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.04] p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                      <Icon size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-10 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Ready when you are
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Your conversation history is saved in this browser.
            </p>
          </div>
        </aside>

        {/* Chat panel */}
        <section className="flex min-h-[80vh] min-w-0 flex-1 flex-col lg:min-h-0">

          {/* Header */}
          <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Bot size={26} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate font-extrabold text-gray-900">
                  Fitness Assistant
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Here to help you get stronger
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              title="Start a new conversation"
              className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">New chat</span>
            </button>
          </header>

          {/* Chat messages */}
          <div className="relative flex min-h-0 flex-1 flex-col bg-[#fafcfb]">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
            >
              <div className="mx-auto max-w-3xl">
                <div className="mb-7 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 shadow-sm">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    Your personal fitness space
                  </span>
                </div>

                {messages.map((msg, index) => {
                  const isUser = msg.sender === "user";

                  return (
                    <div
                      key={`${msg.time || "message"}-${index}`}
                      className={`mb-5 flex items-end gap-2.5 sm:gap-3 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Bot size={17} />
                        </div>
                      )}

                      <div
                        className={`flex max-w-[85%] flex-col sm:max-w-[78%] ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3.5 text-sm leading-6 shadow-sm ${
                            isUser
                              ? "rounded-br-md bg-emerald-600 text-white"
                              : msg.isError
                              ? "rounded-bl-md border border-red-100 bg-red-50 text-red-700"
                              : "rounded-bl-md border border-gray-100 bg-white text-gray-700"
                          }`}
                        >
                          {msg.text}
                        </div>

                        <span className="mt-1.5 px-1 text-[10px] text-gray-400">
                          {formatTime(msg.time)}
                        </span>
                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-600">
                          <UserRound size={17} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {loading && (
                  <div className="mb-5 flex items-end gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Bot size={17} />
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-5 py-4 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                            style={{
                              animationDelay: `${dot * 150}ms`,
                            }}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-400">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Scroll to bottom */}
            {showScrollButton && (
              <button
                type="button"
                onClick={() =>
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="absolute bottom-4 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:bg-emerald-50 hover:text-emerald-700"
                aria-label="Scroll to latest message"
              >
                <ArrowDown size={18} />
              </button>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && !loading && (
            <div className="border-t border-gray-100 bg-white px-4 pb-2 pt-4 sm:px-6">
              <p className="mb-3 text-xs font-semibold text-gray-500">
                TRY ASKING
              </p>

              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <footer className="border-t border-gray-100 bg-white p-4 sm:px-6 sm:py-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="mx-auto max-w-3xl"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about workouts, fitness goals..."
                  disabled={loading}
                  aria-label="Type your message"
                  className="max-h-32 min-h-[44px] flex-1 resize-y bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  <Send size={18} />
                </button>
              </div>

              <p className="mt-3 text-center text-[10px] leading-4 text-gray-400 sm:text-xs">
                Fitness guidance for informational purposes. Listen to your
                body and consult a qualified professional when needed.
              </p>
            </form>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default Chatbot;
