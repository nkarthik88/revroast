 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type RoastResult = {
  score: string;
  good: string[];
  confusing: string[];
  improvements: string[];
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const searchParams = useSearchParams();
  const isPro = searchParams.get("pro") === "true";
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const handleRoast = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data: RoastResult = await res.json();
      setResult(data);
    } catch {
      setError("We couldn't reach the roast engine. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result) {
      setRevealed(false);
      return;
    }

    setRevealed(false);
    const handle = window.setTimeout(() => {
      setRevealed(true);
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);

    return () => window.clearTimeout(handle);
  }, [result]);

  const scoreDisplay = useMemo(() => result?.score ?? "", [result]);

  return (
    <main className="min-h-screen bg-[#060606] text-white flex flex-col">
      <section className="px-6 py-12 mx-auto max-w-5xl" ref={heroRef}>
        <p className="text-sm uppercase tracking-[0.4em] text-neutral-400">
          RevRoast · SaaS copy lab
        </p>
        <div className="mt-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Your landing page isn’t converting. RevRoast tells you exactly why — in 30 seconds.
          </h1>
          <p className="text-lg text-neutral-300 max-w-3xl whitespace-pre-line">
            What you get in 30 seconds:
            {"\n"}• A clear conversion score
            {"\n"}• What’s working (and why)
            {"\n"}• What’s confusing visitors
            {"\n"}• Exact improvements to increase signups
            {"\n"}
            {"\n"}Built for founders fixing their landing page before launch — not marketers running experiments.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(event) => handleRoast(event)}
          >
            <input
              className="flex-1 rounded-xl border border-neutral-800 bg-[#0f0f0f] px-4 py-3 text-base focus:border-white focus:outline-none"
              placeholder="https://your-saas.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />
            <button
              className="flex items-center justify-center rounded-xl border border-white bg-white/10 px-6 py-3 text-sm uppercase tracking-wide transition hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
              )}
              {loading ? "Roasting..." : "Roast my SaaS"}
            </button>
            <a
              href="https://checkout.dodopayments.com/buy/pdt_0NXyRvWvgwMRCl9SPAcey?quantity=1"
              target="_blank"
              rel="noreferrer"
              className="mt-4 block"
            >
              <button
                type="button"
                className="w-full rounded-xl border border-white/60 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-white sm:w-auto"
              >
                Upgrade to RevRoast Pro →
              </button>
            </a>
          </form>
          <div className="space-y-1 text-xs text-neutral-400">
            <p>
              Used by indie founders, SaaS builders, and early-stage teams to
              fix conversion leaks before they launch.
            </p>
            <p className="text-neutral-500">
              No signup. No tracking. Just brutally honest feedback.
            </p>
          </div>
          <p className="text-xs text-neutral-500">
            No sign-up • Free • Built for indie founders
          </p>
        </div>
      </section>

      <section className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#060606] px-6 py-12">
        {!result && !loading && !error && (
          <div className="rounded-2xl border border-neutral-800 bg-white/5 p-6 text-neutral-400">
            Paste a URL and hit “Roast my SaaS” to see the AI review.
          </div>
        )}
        {loading && (
          <div className="rounded-2xl border border-neutral-800 bg-white/5 p-6 text-neutral-400 animate-pulse">
            Analyzing your landing page...
          </div>
        )}
        {loading && (
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-32 rounded-2xl border border-neutral-800 bg-white/5"
              />
            ))}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-600 bg-red-500/10 p-6 text-red-200">
            {error}
            <button
              className="ml-4 rounded-full border border-red-500 px-4 py-1 text-xs uppercase tracking-wider text-red-100 transition hover:bg-red-500/20"
              onClick={() => handleRoast()}
            >
              Retry
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-6" ref={resultsRef}>
            {isPro && (
              <div className="space-y-4">
                <section className="rounded-2xl border border-neutral-800 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    Founder summary (30-second read)
                  </p>
                  <p className="mt-4 text-sm text-neutral-100">
                    The headline is brave but vague; clarify who you help and why
                    it matters before the scroll ends. Keep the hero simple, call
                    out the results founders care about, and make sure the CTA
                    repeats that promise. Drop any fluff that feels like marketing
                    theater and focus on the action you want them to take next.
                  </p>
                </section>

                <section className="rounded-2xl border border-neutral-800 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    Fix these in this order
                  </p>
                  <ol className="mt-4 space-y-2 text-sm text-neutral-100">
                    <li>1. Headline clarity</li>
                    <li>2. Primary CTA copy</li>
                    <li>3. Social proof placement</li>
                  </ol>
                </section>

                <section className="rounded-2xl border border-neutral-800 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    Suggested headline improvements
                  </p>
                  <p className="mt-4 text-sm text-neutral-100">
                    Option 1: “Explain clearly who wins and how — then show the
                    proof.” Option 2: “Turn your promise into a measurable outcome
                    and lean into confidence.” Both rewords anchor the headline in
                    outcomes, not features.
                  </p>
                </section>
              </div>
            )}
            <div
              className={`grid gap-6 md:grid-cols-4 transition-all duration-500 ${
                revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="rounded-2xl border border-neutral-800 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
                  Score
                </p>
                <p className="text-4xl font-semibold text-white mt-2">{scoreDisplay || "—"}</p>
              </div>
              <SectionCard
                title="What’s Good"
                items={result.good}
                animate={revealed}
              />
              <SectionCard
                title="What’s Confusing"
                items={result.confusing}
                animate={revealed}
              />
              <SectionCard
                title="Clear Improvements"
                items={
                  isPro
                    ? result.improvements
                    : result.improvements.slice(0, 2)
                }
                animate={revealed}
              />
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-white/5 to-white/0 p-6 text-white">
              <p className="text-lg font-semibold">
                Want this for your own product? Fix the top 3 issues before you launch.
              </p>
              <button
                className="mt-3 inline-flex items-center rounded-full border border-white/40 px-5 py-2 text-sm uppercase tracking-[0.2em] transition hover:border-white hover:bg-white/10"
                onClick={() => {
                  heroRef.current?.scrollIntoView({ behavior: "smooth" });
                  setUrl("");
                }}
              >
                Roast another page →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const SectionCard = ({
  title,
  items,
  animate,
}: {
  title: string;
  items: string[];
  animate: boolean;
}) => (
  <div className="rounded-2xl border border-neutral-800 bg-white/5 p-6">
    <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{title}</p>
    {items.length ? (
      <ul className="mt-4 space-y-2 text-neutral-200">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className={`list-disc pl-4 transition-all duration-500 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-4 text-sm text-neutral-500">No items detected.</p>
    )}
  </div>
);
