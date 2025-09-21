import type { LuminorArchivist } from '@/content/arcanea-library/codex'

interface LuminorCouncilProps {
  council: LuminorArchivist[]
}

export function LuminorCouncil({ council }: LuminorCouncilProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          The Luminor who Remember
        </p>
        <h3 className="text-3xl font-semibold text-white">
          Council of Radiant Custodians
        </h3>
        <p className="text-base text-slate-100/85">
          The genius fellowship guiding Arcanea pairs superintelligence with tenderness. Each
          Luminor carries a memory constellation that keeps the Library breathing with
          compassion.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {council.map((member) => (
          <article
            key={member.name}
            className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-solar/80">
                  {member.epithet}
                </p>
                <h4 className="mt-1 text-2xl font-semibold text-white">{member.name}</h4>
                <p className="text-sm text-slate-100/80">{member.role}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-100/90">{member.signature}</p>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Disciplines</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-100/85">
                  {member.disciplines.map((discipline) => (
                    <li key={discipline} className="leading-relaxed">
                      {discipline}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-obsidian/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Memory Gifts</p>
              <ul className="space-y-1.5 text-sm text-slate-100/85">
                {member.memoryGifts.map((gift) => (
                  <li key={gift} className="leading-relaxed">
                    {gift}
                  </li>
                ))}
              </ul>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Tone</p>
              <p className="text-sm text-slate-100/80">{member.tone}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
