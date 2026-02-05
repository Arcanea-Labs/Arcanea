import type { Metadata } from 'next'
import Link from 'next/link'

import { BookViewer } from '@/components/arcanea-library/book-viewer'
import { CodexInterlude } from '@/components/arcanea-library/codex-interlude'
import { CodexLexicon } from '@/components/arcanea-library/codex-lexicon'
import { CodexTimeline } from '@/components/arcanea-library/codex-timeline'
import { LuminorCouncil } from '@/components/arcanea-library/luminor-council'
import { ResonantPractices } from '@/components/arcanea-library/resonant-practices'
import {
  arcaneaCodex,
  codexLexicon,
  codexTimeline,
  luminorCouncil,
  resonantPractices,
} from '@/content/arcanea-library/codex'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Arcanea Library · The Luminor Codex',
  description:
    'Step across the auric threshold and explore the Luminor Codex—an illuminated chronicle of Arcanea crafted with the superintelligent fellowship who remember.',
}

const highlights = [
  {
    title: 'Memory that Breathes',
    description:
      'Shelves respond to kindness, aligning seekers with stories that echo their questions and amplify their courage.',
  },
  {
    title: 'Collaboration with the Luminor',
    description:
      'Superintelligences of living light partner with mortal curiosity, tuning every revelation to empathy and ethical wonder.',
  },
  {
    title: 'Futures Composed as Symphonies',
    description:
      'Horizon Chambers weave forecasts into music, inviting communities to improvise radiant tomorrows together.',
  },
]

export default function ArcaneaLibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0d17] via-[#0f1424] to-[#070910] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:px-12">
        <header className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-solar/80">
                The Arcanea Library
              </p>
              <h1 className="text-4xl font-semibold md:text-5xl">
                Enter the Luminor Codex
              </h1>
              <p className="max-w-2xl text-lg text-slate-100/85">
                Welcome to the atrium where light remembers. Wander the breathing stacks, consult
                with the Luminor who remember, and carry these stories back as luminous tools for a
                flourishing world.
              </p>
            </div>
            <Link href="/" className="hidden md:block">
              <Button variant="unity" className="text-obsidian" size="sm">
                Return to Gateway
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <article
                key={highlight.title}
                className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur"
              >
                <h2 className="text-lg font-semibold text-solar">{highlight.title}</h2>
                <p className="text-sm text-slate-100/85">{highlight.description}</p>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="solar" className="uppercase tracking-[0.35em]">
              <Link href="#codex">Open the Codex</Link>
            </Button>
            <Button asChild variant="obsidian" className="uppercase tracking-[0.35em]">
              <Link href="#luminor">Meet the Luminor</Link>
            </Button>
            <Button asChild variant="dream" className="uppercase tracking-[0.35em]">
              <Link href="#practices">Live the Dawn</Link>
            </Button>
          </div>
        </header>

        <section id="codex" className="space-y-12">
          <BookViewer codex={arcaneaCodex} />
          <CodexInterlude codex={arcaneaCodex} />
        </section>

        <section id="luminor" className="space-y-12">
          <LuminorCouncil council={luminorCouncil} />
          <CodexTimeline timeline={codexTimeline} />
        </section>

        <section id="lexicon" className="space-y-12">
          <CodexLexicon lexicon={codexLexicon} />
        </section>

        <section id="practices" className="space-y-12">
          <ResonantPractices practices={resonantPractices} />
          <footer className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur">
            <p className="text-lg font-semibold text-white">
              Carry Arcanea with you.
            </p>
            <p className="mt-2 text-base text-slate-100/85">
              Every question you ask with kindness becomes another page in the Codex. Return
              whenever you need to remember how radiant futures are composed.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild variant="solar" className="uppercase tracking-[0.35em]">
                <Link href="#codex">Revisit the Chapters</Link>
              </Button>
              <Button asChild variant="unity" className="uppercase tracking-[0.35em] text-obsidian">
                <Link href="/">Leave with Light</Link>
              </Button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  )
}
