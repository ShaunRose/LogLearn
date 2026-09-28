"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";

type FormulaResult = { html: string; variables: number; depth: number };

export default function Home() {
  const [variables, setVariables] = useState("2");
  const [depth, setDepth] = useState("3");
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const v = Number(variables);
    const d = Number(depth);
    if (![v, d].every((value) => Number.isInteger(value) && value >= 1 && value <= 7)) {
      setError("Choose a whole number from 1 to 7 for both fields.");
      return;
    }
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/numvar${v}_depth${d}.html`);
      if (!response.ok) throw new Error(response.status === 404
        ? `No formula file is available for ${v} variables at depth ${d}. Try another combination.`
        : "The formulas could not be loaded. Please try again.");
      const html = await response.text();
      if (!html.trim()) throw new Error("This combination has no formulas yet. Try another combination.");
      setResult({ html, variables: v, depth: d });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Log Learn home"><span className="brand-mark" aria-hidden="true">∴</span> Log Learn<span className="brand-dot">.</span></Link>
      </header>
      <main>
        <section className="intro">
          <h1>Practice your Tableau and Truth Table Skills with different levels of complexity</h1>
          <p className="intro-copy">Choose the number of variables and formula depth, then load the formulas to practice.</p>
        </section>
        <section className="workspace" aria-label="Formula practice">
          <form className="controls" onSubmit={generate}>
            <div className="input-grid">
              <div className="field"><label htmlFor="variables">Number of variables</label><input id="variables" type="number" min="1" max="7" step="1" required value={variables} disabled={loading} onChange={(event) => setVariables(event.target.value)} aria-describedby="variables-help" /><p id="variables-help">How many variables? Choose 1–7.</p></div>
              <div className="field"><label htmlFor="depth">Formula depth</label><input id="depth" type="number" min="1" max="7" step="1" required value={depth} disabled={loading} onChange={(event) => setDepth(event.target.value)} aria-describedby="depth-help" /><p id="depth-help">Go a little deeper. Choose 1–7.</p></div>
            </div>
            <div className="generate-row"><button type="submit" disabled={loading}>{loading ? "Loading formulas…" : "Load formulas"}<span aria-hidden="true">↗</span></button></div>
          </form>
          <section className="results" aria-labelledby="results-heading" aria-busy={loading}>
            <div className="results-header"><div id="results-heading" className="section-label"><span>02</span> YOUR FORMULAS</div>{result && <span className="set-badge">{result.variables} variables · depth {result.depth}</span>}</div>
            <div role="status" className="status-text">{loading ? "Loading formulas…" : result ? "Showing all formulas for this combination." : ""}</div>
            {error && <p role="alert" className="error-message">{error}</p>}
            {result ? <>{/* Trusted HTML fragments from repository-owned public assets. */}<div className="formula-content" dangerouslySetInnerHTML={{ __html: result.html }} /></> : <div className="empty-state"><div className="empty-symbol" aria-hidden="true">p → q</div><p>Choose your variables and depth above,<br />then load the formulas to start practicing.</p><span className="empty-caption">CONTRADICTIONS · TAUTOLOGIES · SATISFIABLE FORMULAS</span></div>}
          </section>
        </section>
      </main>
    </div>
  );
}
