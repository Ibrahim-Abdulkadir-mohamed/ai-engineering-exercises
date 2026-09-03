"use client";

import { useState, useRef, useEffect } from "react";
import { detectIntent } from "@/lib/detectIntent";

type Message = {
  role: "user" | "assistant";
  content: string;
  data?: any;
  type?: "text" | "movies" | "joke" | "error";
  operation?: "find" | "count" | "aggregate";
};

const HIDDEN_KEYS = ["__v", "createdAt", "updatedAt"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    const currentInput = input;
    setInput("");

    try {
      const intent = detectIntent(currentInput);

      if (intent === "joke") {
        const res = await fetch("/api/jokes/random");
        const json = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: json.data.text, type: "joke" }]);
      } else if (intent === "movie_search") {
        const title = currentInput.replace(/search movie|find movie/gi, "").trim();
        const res = await fetch(`/api/movies/search?title=${encodeURIComponent(title)}`);
        const json = await res.json();
        setMessages((prev) => [
          ...prev,
          json.success
            ? { role: "assistant", content: `${json.data.title} (${json.data.year})`, type: "movies", data: [json.data] }
            : { role: "assistant", content: json.error, type: "error" },
        ]);
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: currentInput }),
        });
        const json = await res.json();
        setMessages((prev) => [
          ...prev,
          json.success
            ? {
                role: "assistant",
                content:
                  json.count === 0
                    ? "Ma jiraan natiijo la helay. Isku day su'aal kale, tusaale: \"movies rated above 7\"."
                    : `Waxaan helay ${json.count} natiijo`,
                type: "movies",
                data: json.data,
                operation: json.meta?.operation,
              }
            : { role: "assistant", content: json.error, type: "error" },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try again.", type: "error" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col bg-[#1a1816] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <header className="px-6 pt-6 pb-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-[#F2EFE9]">Marquee</h1>
          <p className="text-sm text-white/50 mt-1">Ask about movies, ratings, or ask for a joke.</p>
        </header>

        <div className="chat-scroll flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-center">
              <p className="text-white/30 text-sm max-w-xs">
                Try "sci-fi movies with rating above 8.5" or "tell me a joke"
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#E8A33D] text-[#1A1816] rounded-br-md"
                    : msg.type === "error"
                    ? "bg-red-950/60 text-red-300 rounded-bl-md"
                    : "bg-white/[0.06] text-[#F2EFE9] rounded-bl-md"
                }`}
              >
                {msg.content}

                {msg.type === "movies" && msg.data && msg.data.length > 0 && (
                  <div className="mt-3 -mx-1 overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm min-w-max">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50">
                          {Object.keys(msg.data[0])
                            .filter((k) => !HIDDEN_KEYS.includes(k) && k !== "poster")
                            .map((key) => (
                              <th key={key} className="text-left font-medium px-3 py-2 whitespace-nowrap">
                                {key === "_id" ? (msg.operation === "aggregate" ? "Genre" : "ID") : key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.map((row: any, idx: number) => (
                          <tr key={idx} className="border-b border-white/5 last:border-0">
                            {Object.keys(row)
                              .filter((k) => !HIDDEN_KEYS.includes(k) && k !== "poster")
                              .map((key) => (
                                <td
                                  key={key}
                                  className={`px-3 py-2 text-white/80 ${
                                    key === "description" ? "max-w-[240px] whitespace-normal" : "whitespace-nowrap"
                                  }`}
                                >
                                  {key === "title" && row.poster ? (
                                    <div className="flex items-center gap-2">
                                      {row.poster !== "N/A" && (
                                        <img
                                          src={row.poster}
                                          alt=""
                                          className="w-8 h-11 object-cover rounded shrink-0"
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).style.display = "none";
                                          }}
                                        />
                                      )}
                                      <span>{String(row[key])}</span>
                                    </div>
                                  ) : (
                                    String(row[key])
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] w-64 bg-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-md space-y-2">
                <div className="h-3 w-3/4 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-2 py-2 focus-within:border-[#E8A33D]/50 transition-colors">
            <input
              className="flex-1 bg-transparent px-3 py-1.5 text-[15px] text-[#F2EFE9] placeholder:text-white/30 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 shrink-0 rounded-full bg-[#E8A33D] disabled:bg-white/10 disabled:opacity-60 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h11M8 3l5 5-5 5" stroke={loading || !input.trim() ? "#ffffff80" : "#1A1816"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}