"use client";

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

type ProposalPublicViewProps = {
  proposal: {
    slug: string;
    title: string;
    client_name: string;
    amount_cents: number;
    currency: string;
    status: string;
    content_json: {
      summary: string;
      sections: Array<{ heading: string; body: string; bullets: string[] }>;
      investment: string;
      closing: string;
    };
    signed_at: string | null;
    paid_at: string | null;
  };
};

type Point = { x: number; y: number };

export function ProposalPublicView({ proposal }: ProposalPublicViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [signed, setSigned] = useState(Boolean(proposal.signed_at));
  const [paid, setPaid] = useState(Boolean(proposal.paid_at));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const signatureLabel = useMemo(() => (signed ? 'Signed' : 'Draw your signature'), [signed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.lineWidth = 2.5;
    context.lineCap = 'round';
    context.strokeStyle = '#0e1116';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current;
    const bounds = canvas?.getBoundingClientRect();
    return {
      x: event.clientX - (bounds?.left ?? 0),
      y: event.clientY - (bounds?.top ?? 0)
    };
  }

  function drawLine(start: Point, end: Point) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  async function handleSign() {
    if (!signatureName.trim()) {
      setMessage('Please type your full name before signing.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setBusy(true);
    setMessage(null);

    const signatureDataUrl = canvas.toDataURL('image/png');
    const response = await fetch(`/api/proposals/${proposal.slug}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signatureName, signatureDataUrl })
    });

    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setMessage(payload.error ?? 'Could not save the signature.');
      return;
    }

    setSigned(true);
    setMessage('Signature saved. You can now complete payment.');
  }

  async function handlePay() {
    setBusy(true);
    setMessage(null);

    const response = await fetch(`/api/proposals/${proposal.slug}/checkout`, { method: 'POST' });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setMessage(payload.error ?? 'Could not start checkout.');
      return;
    }

    window.location.href = payload.url;
  }

  const completed = paid;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-ink/10 bg-white/90 p-8 shadow-halo">
        <p className="text-sm uppercase tracking-[0.3em] text-moss">Client proposal</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">{proposal.title}</h1>
        <p className="mt-4 text-base leading-7 text-ink/70">{proposal.content_json.summary}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {proposal.content_json.sections.map((section) => (
          <article key={section.heading} className="rounded-[1.5rem] border border-ink/10 bg-paper/70 p-6">
            <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/75">{section.body}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink/70">
              {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-ink/10 bg-white/90 p-8">
        <h2 className="text-2xl font-semibold text-ink">{signatureLabel}</h2>
        <p className="mt-2 text-sm text-ink/70">Type your name and draw your signature to authorize the agreement.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <input
              value={signatureName}
              onChange={(event) => setSignatureName(event.target.value)}
              placeholder="Your full name"
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
            />
            <div className="rounded-[1.5rem] border border-ink/10 bg-white p-3">
              <canvas
                ref={canvasRef}
                width={620}
                height={220}
                className="h-[220px] w-full rounded-2xl bg-white touch-none"
                onPointerDown={(event) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  canvas.setPointerCapture(event.pointerId);
                  setDrawing(true);
                  const point = getPoint(event);
                  drawLine(point, point);
                }}
                onPointerMove={(event) => {
                  if (!drawing) return;
                  const canvas = canvasRef.current;
                  const context = canvas?.getContext('2d');
                  if (!canvas || !context) return;
                  const point = getPoint(event);
                  drawLine(point, point);
                }}
                onPointerUp={() => setDrawing(false)}
                onPointerLeave={() => setDrawing(false)}
              />
            </div>
            <button type="button" onClick={clearCanvas} className="text-sm font-medium text-moss">
              Clear signature
            </button>
          </div>

          <aside className="rounded-[1.5rem] bg-paper/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-moss">Investment</p>
            <p className="mt-2 text-2xl font-semibold text-ink">${(proposal.amount_cents / 100).toFixed(2)} {proposal.currency.toUpperCase()}</p>
            <p className="mt-3 text-sm leading-6 text-ink/70">The payment button unlocks after signature is saved.</p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={busy || signed || completed}
                onClick={handleSign}
                className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper disabled:opacity-50"
              >
                {signed ? 'Signature saved' : 'Save signature'}
              </button>
              <button
                type="button"
                disabled={!signed || busy || completed}
                onClick={handlePay}
                className="w-full rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium text-ink disabled:opacity-50"
              >
                {completed ? 'Payment complete' : 'Pay now'}
              </button>
            </div>
          </aside>
        </div>

        {message ? <p className="mt-4 text-sm text-ink/70">{message}</p> : null}
      </section>

      {completed ? (
        <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] border border-moss/20 bg-moss/10 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-moss">Success</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Signed and paid</h2>
          <p className="mt-2 text-sm text-ink/70">Your proposal is complete. A confirmation has been recorded.</p>
        </motion.section>
      ) : null}
    </div>
  );
}
