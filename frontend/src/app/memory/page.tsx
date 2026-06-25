import Navigation from '@/components/Navigation'
import { Brain, Search, Database } from 'lucide-react'

async function getMemories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/memories`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
  } catch (error) {
    return null;
  }
}

export default async function MemoryExplorer() {
  const memories = await getMemories();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 mx-auto glass rounded-2xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full" />
            <Brain className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Memory Explorer</h1>
          <p className="text-white/50 mt-3 text-lg">Semantic search across the agentic memory layer.</p>
        </header>
        
        <div className="mb-12 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input 
            type="text" 
            placeholder="Semantic Search (e.g., 'past supplier delays')"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-xl backdrop-blur-md"
          />
        </div>

        <div className="space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          {memories ? memories.map((mem: any, i: number) => (
            <div key={i} className="glass p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <Database className="w-4 h-4 text-white/60" />
                  </div>
                  <span className="font-heading font-semibold text-white text-lg tracking-wide">{mem.title}</span>
                </div>
                <span className="text-xs font-mono bg-pink-500/10 text-pink-300 px-3 py-1.5 rounded-full border border-pink-500/20">
                  Importance: {mem.importance}
                </span>
              </div>
              <p className="text-white/70 leading-relaxed mb-4 pl-11">
                {mem.description}
              </p>
              <div className="pl-11 border-t border-white/5 pt-4">
                <span className="text-xs text-white/40 uppercase tracking-wider">{mem.metadata}</span>
              </div>
            </div>
          )) : (
            <div className="p-6 border border-red-500/30 rounded-xl bg-red-500/5">
              <p className="text-red-400 text-center">Failed to load memories. Ensure backend is running.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
