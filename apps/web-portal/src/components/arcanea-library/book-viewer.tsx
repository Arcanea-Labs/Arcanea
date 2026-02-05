'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ArcaneaCodex, ArcaneaChapter } from '@/content/arcanea-library/codex'

interface BookViewerProps {
  codex: ArcaneaCodex
}

export function BookViewer({ codex }: BookViewerProps) {
  const [activeChapterId, setActiveChapterId] = useState(
    codex.chapters[0]?.id ?? ''
  )

  const activeChapter = useMemo<ArcaneaChapter | undefined>(
    () => codex.chapters.find((chapter) => chapter.id === activeChapterId),
    [activeChapterId, codex.chapters]
  )

  const activeIndex = useMemo(
    () => codex.chapters.findIndex((chapter) => chapter.id === activeChapterId),
    [activeChapterId, codex.chapters]
  )

  const nextChapter =
    activeIndex >= 0
      ? codex.chapters[(activeIndex + 1) % codex.chapters.length]
      : undefined

  return (
    <section className="space-y-10">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-obsidian/20 backdrop-blur">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-200/80">
            {codex.subtitle}
          </p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            {codex.title}
          </h2>
          <p className="text-lg text-slate-100/90">{codex.dedication}</p>
        </header>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-solar">
              {codex.prologue.title}
            </h3>
            <blockquote className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm italic text-slate-100/80">
              “{codex.prologue.epigraph.quote}”
              <footer className="mt-2 text-right text-xs uppercase tracking-[0.25em] text-white/60">
                {codex.prologue.epigraph.source}
              </footer>
            </blockquote>
            {codex.prologue.body.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-slate-100/90">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-obsidian/60 p-6 shadow-xl">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Guiding Motifs
            </p>
            <ul className="space-y-2 text-sm text-slate-100/90">
              {codex.prologue.motifs.map((motif) => (
                <li
                  key={motif}
                  className="flex items-start gap-3 rounded-xl bg-white/5 p-3 text-sm"
                >
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-solar" />
                  <span className="leading-relaxed">{motif}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px),1fr]">
        <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Table of Luminous Chapters
            </p>
            <p className="mt-2 text-sm text-slate-100/80">
              Select a ribboned tab to turn the Codex toward a new constellation.
            </p>
          </div>
          <nav className="space-y-2">
            {codex.chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => setActiveChapterId(chapter.id)}
                className={cn(
                  'w-full rounded-2xl border border-transparent px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian',
                  activeChapterId === chapter.id
                    ? 'bg-solar/30 text-white shadow-lg shadow-solar/30'
                    : 'bg-white/5 text-slate-100/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="block text-xs uppercase tracking-[0.35em] text-slate-200/80">
                  {chapter.title}
                </span>
                <span className="mt-1 block text-sm font-medium text-white">
                  {chapter.subtitle}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <article className="space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          {activeChapter ? (
            <div className="space-y-8">
              <header className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-200/70">
                  {activeChapter.title}
                </p>
                <h3 className="text-3xl font-semibold text-white">
                  {activeChapter.subtitle}
                </h3>
                <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm italic text-slate-100/80">
                  “{activeChapter.epigraph.quote}”
                  <footer className="mt-2 text-right text-xs uppercase tracking-[0.25em] text-white/60">
                    {activeChapter.epigraph.source}
                  </footer>
                </blockquote>
                <p className="text-base leading-relaxed text-slate-100/90">
                  {activeChapter.summary}
                </p>
              </header>

              <div className="space-y-10">
                {activeChapter.sections.map((section) => (
                  <section key={section.heading} className="space-y-4">
                    <h4 className="text-xl font-semibold text-solar">
                      {section.heading}
                    </h4>
                    <div className="space-y-3">
                      {section.prose.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-base leading-relaxed text-slate-100/90"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {(section.illuminations || section.artifacts) && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {section.illuminations && (
                          <div className="rounded-2xl border border-solar/30 bg-solar/10 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-solar/80">
                              Illuminations
                            </p>
                            <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
                              {section.illuminations.map((insight) => (
                                <li key={insight} className="leading-relaxed">
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.artifacts && (
                          <div className="rounded-2xl border border-verdant/30 bg-verdant/10 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-verdant/80">
                              Artifacts & Instruments
                            </p>
                            <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
                              {section.artifacts.map((artifact) => (
                                <li key={artifact} className="leading-relaxed">
                                  {artifact}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              <footer className="space-y-4 rounded-2xl border border-white/10 bg-obsidian/60 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                    Cadence of Practice
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
                    {activeChapter.cadence.map((practice) => (
                      <li key={practice} className="leading-relaxed">
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                    Resonant Insight
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-slate-100/90">
                    {activeChapter.resonance}
                  </p>
                </div>
                {nextChapter && nextChapter.id !== activeChapter.id && (
                  <div className="pt-2">
                    <Button
                      variant="solar"
                      onClick={() => setActiveChapterId(nextChapter.id)}
                      className="w-full justify-between text-sm font-semibold uppercase tracking-[0.3em]"
                    >
                      Turn the Page
                      <span aria-hidden="true">→</span>
                    </Button>
                  </div>
                )}
              </footer>
            </div>
          ) : (
            <div className="space-y-4 text-slate-100/90">
              <p className="text-lg">
                Choose a chapter from the table to open a new ribbon of light within the Codex.
              </p>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
