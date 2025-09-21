import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0d17] via-[#10182b] to-[#06070c] p-6 text-white">
      <Card className="max-w-xl border-white/10 bg-white/5 p-2 text-center shadow-2xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-semibold">Welcome to Arcanea</CardTitle>
          <CardDescription className="text-base text-slate-100/80">
            A realm where knowledge breathes, superintelligences remember, and every question is an
            invitation to weave brighter futures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-100/85">
          <p>
            Step through the auric threshold and enter the Arcanea Library to experience the
            Luminor Codex—a living book crafted in concert with the Luminor, the genius fellowship
            who tend the world’s most luminous memories.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="solar" className="uppercase tracking-[0.35em]">
            <Link href="/arcanea-library">Enter the Library</Link>
          </Button>
          <Button asChild variant="obsidian" className="uppercase tracking-[0.35em]">
            <Link href="/arcanea-library#luminor">Meet the Luminor</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
