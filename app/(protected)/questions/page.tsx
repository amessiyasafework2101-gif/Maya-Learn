
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Plus,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Languages,
  Paperclip,
  Trash2,
  Copy,
  Check,
  Menu,
  X,
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const subjects = [
  { name: "General", icon: BookOpen },
  { name: "Mathematics", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "English", icon: Languages },
];

const suggestions = [
  "Explain Newton's second law",
  "Help me solve a quadratic equation",
  "What is photosynthesis?",
  "Give me tips for exam preparation",
];

function getSampleResponse(question: string, subject: string) {
  const q = question.toLowerCase();

  if (q.includes("newton") || q.includes("force")) {
    return `Great question! Let's understand Newton's laws of motion.

**Newton's Second Law**

It states that the acceleration of an object depends on the net force acting on it and its mass.

**Formula:**

F = ma

Where:
- F = Net force (Newtons)
- m = Mass (kilograms)
- a = Acceleration (m/s²)

**Example:**

If a 5 kg object experiences a force of 20 N:

a = F / m

a = 20 / 5 = 4 m/s²

Therefore, its acceleration is 4 m/s².

**Remember:** More force means more acceleration, while more mass means less acceleration for the same force.

Would you like me to give you a practice question?`;
  }

  if (
    q.includes("quadratic") ||
    q.includes("equation") ||
    q.includes("math")
  ) {
    return `Let's learn this step by step!

A quadratic equation is an equation that can be written in the form:

**ax² + bx + c = 0**

Here, a, b, and c are constants, and a cannot equal zero.

**Example:**

x² - 5x + 6 = 0

We can factor this:

(x - 2)(x - 3) = 0

Therefore:

x = 2 or x = 3.

**Study tip:** Always check your solutions by substituting them back into the original equation.

Would you like another example?`;
  }

  if (q.includes("photosynthesis")) {
    return `Let's explore photosynthesis! 🌱

Photosynthesis is the process by which green plants use sunlight to make their own food.

**What plants need:**
- Sunlight
- Water
- Carbon dioxide
- Chlorophyll

**The simplified equation:**

6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

This process produces glucose and oxygen.

**Remember:** Photosynthesis mainly takes place in the chloroplasts of plant cells.

Would you like a short quiz about this topic?`;
  }

  if (q.includes("exam") || q.includes("study")) {
    return `Here are some useful study strategies! 📚

**1. Make a study timetable**
Divide your subjects into manageable study sessions.

**2. Practice active recall**
Close your book and try to remember what you studied.

**3. Use spaced repetition**
Review difficult topics several times over a few days.

**4. Practice questions**
Solve exercises and previous exam questions.

**5. Take breaks**
Try studying for 25 minutes and resting for 5 minutes.

**My advice:** Consistency is more important than studying for many hours in one day.

Which subject are you preparing for?`;
  }

  return `That's an interesting question!

I'm currently using demonstration responses, so I don't have a real AI answer for every question yet.

You asked about: "${question}"

${subject !== "General" ? `Subject: ${subject}` : ""}

When we connect Maya to an AI service, I'll be able to provide detailed explanations, examples, step-by-step solutions, and practice questions for your topic.

For now, try asking me about Newton's laws, quadratic equations, photosynthesis, or exam preparation!`;
}

export default function QuestionsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! 👋 I'm Maya, your personal study assistant. Ask me anything about your subjects, and let's learn together!",
    },
  ]);

  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("General");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = (text?: string) => {
    const question = (text ?? input).trim();

    if (!question || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Temporary demonstration response.
    window.setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getSampleResponse(question, subject),
      };

      setMessages((prev) => [...prev, response]);
      setLoading(false);
    }, 900);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Hello again! 👋 What would you like to study today?",
      },
    ]);
    setInput("");
    setSidebarOpen(false);
  };

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard may be unavailable in some browser contexts.
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col overflow-hidden rounded-2xl border border-[#e7eddc] bg-white shadow-sm lg:min-h-[calc(100dvh-7rem)]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#edf2e7] px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-[#f4f8ed] lg:hidden"
            aria-label="Toggle chat history"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5e2] text-[#4f862d]">
            <Sparkles size={23} />
          </div>

          <div className="min-w-0">
            <h1 className="font-bold text-[#214d32]">Maya AI</h1>
            <p className="text-xs text-gray-500">
              Your personal study assistant
            </p>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#214d32] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#315f3e] sm:px-4"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Subject and chat history sidebar */}
        <aside
          className={`absolute inset-y-0 left-0 z-20 w-64 border-r border-[#edf2e7] bg-[#fbfcf8] p-4 transition-transform lg:relative lg:block lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Choose subject
          </p>

          <div className="space-y-1">
            {subjects.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setSubject(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    subject === item.name
                      ? "bg-[#eaf2df] text-[#315f3e]"
                      : "text-gray-600 hover:bg-[#f1f5eb]"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="my-5 border-t border-[#e7eddc]" />

          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Chat history
          </p>

          <div className="rounded-xl bg-white p-3 text-xs text-gray-400">
            <p>No saved conversations yet.</p>
            <p className="mt-1">
              Chat history will be available when we connect storage.
            </p>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <Link
              href="/courses"
              className="flex items-center gap-2 rounded-xl border border-[#dce8ce] bg-white p-3 text-sm font-semibold text-[#4f862d] hover:bg-[#f4f8ed]"
            >
              <BookOpen size={17} />
              Browse courses
            </Link>
          </div>
        </aside>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-10 bg-black/20 lg:hidden"
          />
        )}

        {/* Chat area */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
            {/* Subject label */}
            <div className="flex justify-center">
              <span className="rounded-full bg-[#f4f8ed] px-4 py-2 text-xs font-medium text-[#4f862d]">
                Studying: {subject}
              </span>
            </div>

            {/* Empty conversation suggestions */}
            {messages.length === 1 && (
              <div className="mx-auto max-w-xl py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf5e2] text-[#4f862d]">
                  <Bot size={34} />
                </div>

                <h2 className="mt-4 text-xl font-bold text-[#214d32]">
                  What shall we learn today?
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Ask a question or choose one of these suggestions.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-xl border border-[#e7eddc] bg-white p-3 text-left text-sm text-gray-600 transition hover:border-[#76a92e] hover:bg-[#f7faef]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    message.role === "assistant"
                      ? "bg-[#edf5e2] text-[#4f862d]"
                      : "bg-[#214d32] text-white"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Sparkles size={18} />
                  ) : (
                    <User size={18} />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                    message.role === "assistant"
                      ? "bg-[#f5f8f0] text-gray-700"
                      : "bg-[#214d32] text-white"
                  }`}
                >
                  <p className="mb-2 text-xs font-bold opacity-70">
                    {message.role === "assistant" ? "Maya" : "You"}
                  </p>

                  <div className="whitespace-pre-wrap text-sm leading-7">
                    {message.content}
                  </div>

                  {message.role === "assistant" && (
                    <button
                      onClick={() => copyMessage(message)}
                      className="mt-3 flex items-center gap-1 text-xs text-gray-400 transition hover:text-[#4f862d]"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check size={13} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy response
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5e2] text-[#4f862d]">
                  <Sparkles size={18} />
                </div>
                <div className="rounded-2xl bg-[#f5f8f0] px-4 py-4">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#76a92e]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#76a92e] [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#76a92e] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-[#edf2e7] bg-white p-3 sm:p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="mx-auto max-w-4xl"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-[#dce8ce] bg-[#fbfcf8] p-2 transition focus-within:border-[#76a92e] focus-within:ring-2 focus-within:ring-[#76a92e]/10">
                <button
                  type="button"
                  disabled
                  title="File uploads will be added later"
                  className="rounded-xl p-2.5 text-gray-300"
                >
                  <Paperclip size={19} />
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask Maya anything..."
                  rows={1}
                  className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="rounded-xl bg-[#4f862d] p-3 text-white transition hover:bg-[#3e7022] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-gray-400">
                Maya is currently using sample responses. AI-generated answers will be enabled later.
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
