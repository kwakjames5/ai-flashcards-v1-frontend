"use client";

import { useState } from "react";

type Flashcard = { question: string; answer: string };

export default function Home() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(6);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCards([]);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCards(data.cards);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Request failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>AI Flashcard Generator</h1>
      <form onSubmit={handleGenerate} style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Photosynthesis"
          required
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        />
        <input
          type="number"
          value={count}
          min={1}
          max={20}
          onChange={(e) => setCount(parseInt(e.target.value || "6", 10))}
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        />
        <button disabled={loading} style={{ padding: "0.7rem 1rem", fontSize: "1rem" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      <section style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
        {cards.map((c, i) => (
          <details key={i} style={{ border: "1px solid #eee", borderRadius: 8, padding: "0.75rem" }}>
            <summary style={{ cursor: "pointer" }}>{c.question}</summary>
            <p style={{ marginTop: "0.5rem" }}>{c.answer}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
