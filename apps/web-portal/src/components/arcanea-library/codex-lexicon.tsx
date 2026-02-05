import type { LexiconEntry } from '@/content/arcanea-library/codex'

interface CodexLexiconProps {
  lexicon: LexiconEntry[]
}

export function CodexLexicon({ lexicon }: CodexLexiconProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Luminous Lexicon</p>
        <h3 className="text-3xl font-semibold text-white">Language of the Codex</h3>
        <p className="text-base text-slate-100/85">
          Every word in Arcanea is tuned to intention. These lexicon entries anchor travelers to
          shared meaning while leaving room for new interpretations to blossom.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {lexicon.map((entry) => (
          <article
            key={entry.term}
            className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-solar/80">{entry.term}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{entry.pronunciation}</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-100/90">{entry.description}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Significance</p>
            <p className="text-sm leading-relaxed text-slate-100/85">{entry.significance}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Cross References</p>
            <ul className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
              {entry.crossReferences.map((reference) => (
                <li
                  key={reference}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1"
                >
                  {reference}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
