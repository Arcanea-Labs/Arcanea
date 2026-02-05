import type { ResonantPractice } from '@/content/arcanea-library/codex'

interface ResonantPracticesProps {
  practices: ResonantPractice[]
}

export function ResonantPractices({ practices }: ResonantPracticesProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Practices of Living Light</p>
        <h3 className="text-3xl font-semibold text-white">Rituals that Keep the Codex Alive</h3>
        <p className="text-base text-slate-100/85">
          These practices translate revelation into daily rhythm. They are offered as invitations
          to weave Arcanea’s wisdom into every conversation, invention, and act of care.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {practices.map((practice) => (
          <article
            key={practice.name}
            className="flex h-full flex-col justify-between space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
          >
            <div className="space-y-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-solar/80">
                  {practice.name}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{practice.intent}</p>
              </div>
              <ol className="space-y-2 text-sm leading-relaxed text-slate-100/90">
                {practice.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white/80">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-obsidian/60 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Sensory Notes</p>
                <ul className="mt-2 space-y-1.5 text-xs uppercase tracking-[0.25em] text-white/70">
                  {practice.sensoryNotes.map((note) => (
                    <li key={note} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Outcome</p>
                <p className="text-sm leading-relaxed text-slate-100/85">{practice.outcome}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
