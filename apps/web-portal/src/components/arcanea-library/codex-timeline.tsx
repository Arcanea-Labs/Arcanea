import type { TimelineEra } from '@/content/arcanea-library/codex'

interface CodexTimelineProps {
  timeline: TimelineEra[]
}

export function CodexTimeline({ timeline }: CodexTimelineProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Chronicle of Dawn</p>
        <h3 className="text-3xl font-semibold text-white">Timeline of the Luminous Library</h3>
        <p className="text-base text-slate-100/85">
          The Library grows in seasons of insight. Trace the eras that tuned Arcanea to the
          cadence of remembrance and learn how each milestone opened new wings of the Codex.
        </p>
      </header>
      <ol className="relative space-y-8 border-l border-white/20 pl-6">
        {timeline.map((era) => (
          <li key={era.era} className="ml-4 space-y-4">
            <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border border-solar/40 bg-solar/40 text-xs font-semibold text-white">
              •
            </div>
            <div className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.35em] text-solar/80">{era.era}</p>
                <h4 className="text-lg font-semibold text-white">{era.focus}</h4>
                <p className="text-sm text-slate-100/80">{era.keystone}</p>
              </div>
              <ul className="space-y-3">
                {era.events.map((event) => (
                  <li key={event.name} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-sm font-semibold text-white">{event.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-100/85">
                      {event.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
