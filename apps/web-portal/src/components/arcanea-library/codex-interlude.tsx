import type { ArcaneaCodex } from '@/content/arcanea-library/codex'

interface CodexInterludeProps {
  codex: ArcaneaCodex
}

export function CodexInterlude({ codex }: CodexInterludeProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">A Breath Between Chapters</p>
        <h3 className="text-3xl font-semibold text-white">{codex.interludes.title}</h3>
        <p className="text-base text-slate-100/85">
          Between the turning of pages the Library hums a softer song. These canticles invite you
          to rest, reflect, and notice the subtle miracles that keep Arcanea aglow.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {codex.interludes.passages.map((passage) => (
          <article
            key={passage.heading}
            className="space-y-3 rounded-3xl border border-white/10 bg-obsidian/60 p-6 shadow-xl"
          >
            <h4 className="text-xl font-semibold text-solar">{passage.heading}</h4>
            {passage.body.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-slate-100/90">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  )
}
